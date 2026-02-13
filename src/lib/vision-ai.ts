import type { AnalysisResult, MeatType } from '@/types/meat';
import { analysisRawResultSchema } from '@/lib/schemas';
import { buildAnalysisPrompt } from '@/lib/prompts';
import { MEAT_CUTS, CUT_CRITERIA } from '@/lib/constants';
import { postProcessAnalysisResult } from '@/lib/post-process';
import { durationMs, logEvent } from '@/lib/observability';

const MODEL_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 600;
const MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? 3072);
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
  finishReason?: string;
}

interface GeminiGenerateResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
}

interface GeminiTextResult {
  text: string;
  finishReason?: string;
}

const REQUIRED_JSON_SCHEMA = {
  type: 'object',
  properties: {
    overallGrade: { type: 'string', enum: ['good', 'normal', 'bad'] },
    overallScore: { type: 'number' },
    details: {
      type: 'object',
      properties: {
        color: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            description: { type: 'string' },
          },
          required: ['score', 'description'],
        },
        marbling: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            description: { type: 'string' },
          },
          required: ['score', 'description'],
        },
        surface: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            description: { type: 'string' },
          },
          required: ['score', 'description'],
        },
        shape: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            description: { type: 'string' },
          },
          required: ['score', 'description'],
        },
      },
      required: ['color', 'marbling', 'surface', 'shape'],
    },
    warnings: { type: 'array', items: { type: 'string' } },
    goodTraits: { type: 'array', items: { type: 'string' } },
    limitations: { type: 'array', items: { type: 'string' } },
    cutReference: {
      type: 'object',
      properties: {
        goodDescription: { type: 'string' },
        badDescription: { type: 'string' },
      },
      required: ['goodDescription', 'badDescription'],
    },
    analyzedAt: { type: 'string' },
  },
  required: [
    'overallGrade',
    'overallScore',
    'details',
    'warnings',
    'goodTraits',
    'limitations',
    'cutReference',
    'analyzedAt',
  ],
} as const;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Model request timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes('timeout') ||
    message.includes('rate limit') ||
    message.includes('429') ||
    message.includes('500') ||
    message.includes('503') ||
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('truncated')
  );
}

function parseBase64Image(imageData: string): {
  mediaType: SupportedMediaType;
  data: string;
} {
  const match = imageData.match(/^data:(image\/(jpeg|png|webp|gif));base64,(.+)$/);

  if (match) {
    return {
      mediaType: match[1] as SupportedMediaType,
      data: match[3],
    };
  }

  return {
    mediaType: 'image/jpeg',
    data: imageData,
  };
}

function tryParseJsonCandidate(text: string): unknown | null {
  const candidates = new Set<string>();
  const trimmed = text.trim();
  if (trimmed) {
    candidates.add(trimmed);
  }

  const blockMatches = [...trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)];
  for (const match of blockMatches) {
    if (match[1]) {
      candidates.add(match[1].trim());
    }
  }

  const firstObj = trimmed.indexOf('{');
  const lastObj = trimmed.lastIndexOf('}');
  if (firstObj >= 0 && lastObj > firstObj) {
    candidates.add(trimmed.slice(firstObj, lastObj + 1).trim());
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try once with trailing comma cleanup.
      const noTrailingCommas = candidate.replace(/,\s*([}\]])/g, '$1');
      try {
        return JSON.parse(noTrailingCommas);
      } catch {
        // Continue next candidate.
      }
    }
  }

  return null;
}

function extractJsonText(content: string): unknown {
  const parsed = tryParseJsonCandidate(content);
  if (parsed !== null) {
    return parsed;
  }

  const snippet = content.replace(/\s+/g, ' ').slice(0, 280);
  throw new Error(`AI response is not valid JSON. snippet="${snippet}"`);
}

function extractTextFromGeminiResponse(response: GeminiGenerateResponse): GeminiTextResult {
  const firstCandidate = response.candidates?.[0];
  const text = firstCandidate?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('\n')
    .trim();

  if (text) {
    return {
      text,
      finishReason: firstCandidate?.finishReason,
    };
  }

  const reason =
    response.promptFeedback?.blockReason ??
    firstCandidate?.finishReason ??
    response.error?.message ??
    'unknown';

  throw new Error(`Gemini returned no text content. reason=${reason}`);
}

async function requestGemini(
  systemPrompt: string,
  userPrompt: string,
  mediaType: SupportedMediaType,
  data: string
): Promise<GeminiTextResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const url = `${GEMINI_API_BASE}/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [
          { text: userPrompt },
          {
            inline_data: {
              mime_type: mediaType,
              data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: REQUIRED_JSON_SCHEMA,
    },
  };

  const response = await withTimeout(
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    }),
    MODEL_TIMEOUT_MS
  );

  const rawText = await response.text();

  let parsed: GeminiGenerateResponse;
  try {
    parsed = JSON.parse(rawText) as GeminiGenerateResponse;
  } catch {
    throw new Error(`Gemini response is not valid JSON (status=${response.status}).`);
  }

  if (!response.ok) {
    const message = parsed.error?.message ?? `Gemini API error ${response.status}`;
    throw new Error(`${message} (status=${response.status})`);
  }

  const textResult = extractTextFromGeminiResponse(parsed);
  if (textResult.finishReason?.toUpperCase() === 'MAX_TOKENS') {
    throw new Error('Gemini output was truncated by max tokens.');
  }

  return textResult;
}

async function requestGeminiWithRetry(
  systemPrompt: string,
  userPrompt: string,
  mediaType: SupportedMediaType,
  data: string
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const attemptStart = Date.now();

    try {
      const result = await requestGemini(systemPrompt, userPrompt, mediaType, data);

      logEvent({
        name: 'ai.gemini.generate_content.succeeded',
        data: {
          attempt: attempt + 1,
          durationMs: durationMs(attemptStart),
          model: GEMINI_MODEL,
          finishReason: result.finishReason ?? 'unknown',
        },
      });

      return result.text;
    } catch (error) {
      lastError = error;

      logEvent({
        name: 'ai.gemini.generate_content.failed_attempt',
        level: 'warn',
        data: {
          attempt: attempt + 1,
          durationMs: durationMs(attemptStart),
          model: GEMINI_MODEL,
          message: error instanceof Error ? error.message : 'unknown',
          retryable: isRetryableError(error),
        },
      });

      const canRetry = isRetryableError(error) && attempt < MAX_RETRIES;
      if (!canRetry) break;
      await delay(RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Gemini request failed with unknown error.');
}

async function repairInvalidJson(rawOutput: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const url = `${GEMINI_API_BASE}/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const repairPrompt = [
    'Convert the following invalid/truncated output into valid JSON only.',
    'Keep the same meaning. If a field is missing, fill with conservative defaults.',
    'Return only JSON that matches the required schema.',
    '',
    rawOutput,
  ].join('\n');

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: repairPrompt }],
      },
    ],
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: REQUIRED_JSON_SCHEMA,
    },
  };

  const response = await withTimeout(
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    }),
    MODEL_TIMEOUT_MS
  );

  const rawText = await response.text();
  let parsed: GeminiGenerateResponse;
  try {
    parsed = JSON.parse(rawText) as GeminiGenerateResponse;
  } catch {
    throw new Error('JSON repair response is not valid JSON.');
  }

  if (!response.ok) {
    const message = parsed.error?.message ?? `Gemini repair API error ${response.status}`;
    throw new Error(`${message} (status=${response.status})`);
  }

  const repairedText = extractTextFromGeminiResponse(parsed).text;
  return extractJsonText(repairedText);
}

export async function analyzeImage(
  imageBase64: string,
  meatType: MeatType,
  cut: string
): Promise<AnalysisResult> {
  const start = Date.now();

  const cutInfo = MEAT_CUTS[meatType][cut];
  const cutCriteria = CUT_CRITERIA[meatType][cut];

  if (!cutInfo || !cutCriteria) {
    throw new Error(`Invalid cut: ${meatType} - ${cut}`);
  }

  logEvent({
    name: 'ai.analysis.started',
    data: {
      provider: 'gemini',
      model: GEMINI_MODEL,
      meatType,
      cut,
      imageLength: imageBase64.length,
    },
  });

  const { systemPrompt, userPrompt } = buildAnalysisPrompt(
    meatType,
    cut,
    cutInfo,
    cutCriteria
  );

  const { mediaType, data } = parseBase64Image(imageBase64);

  const responseText = await requestGeminiWithRetry(
    systemPrompt,
    userPrompt,
    mediaType,
    data
  );

  let parsed: unknown;
  try {
    parsed = extractJsonText(responseText);
  } catch (parseError) {
    logEvent({
      name: 'ai.analysis.raw_json_parse_failed',
      level: 'warn',
      data: {
        provider: 'gemini',
        model: GEMINI_MODEL,
        meatType,
        cut,
        message: parseError instanceof Error ? parseError.message : 'unknown',
      },
    });

    parsed = await repairInvalidJson(responseText);
  }

  const rawResult = analysisRawResultSchema.safeParse(parsed);

  if (!rawResult.success) {
    logEvent({
      name: 'ai.analysis.raw_validation_failed',
      level: 'error',
      data: {
        provider: 'gemini',
        model: GEMINI_MODEL,
        meatType,
        cut,
        issueCount: rawResult.error.issues.length,
      },
    });

    console.error('Raw AI response validation failed:', rawResult.error.issues);
    throw new Error('AI response does not match expected raw format.');
  }

  const finalResult = postProcessAnalysisResult(rawResult.data, {
    meatType,
    cut,
  });

  logEvent({
    name: 'ai.analysis.succeeded',
    data: {
      provider: 'gemini',
      model: GEMINI_MODEL,
      meatType,
      cut,
      recommendation: finalResult.buyRecommendation,
      durationMs: durationMs(start),
    },
  });

  return finalResult;
}
