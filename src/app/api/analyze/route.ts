import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema, MAX_IMAGE_BASE64_LENGTH } from '@/lib/schemas';
import { analyzeImage } from '@/lib/vision-ai';
import { checkRateLimit } from '@/lib/rate-limit';
import { durationMs, logEvent, maskIp } from '@/lib/observability';

export const maxDuration = 60;

const MAX_REQUEST_BYTES = 2_500_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

interface ErrorBody {
  error: string;
  code: string;
  details?: string[];
  retryAfterSeconds?: number;
}

function jsonError(status: number, body: ErrorBody): NextResponse<ErrorBody> {
  return NextResponse.json(body, { status });
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const ip = getClientIp(request);
  const maskedIp = maskIp(ip);
  const contentLengthHeader = request.headers.get('content-length');

  logEvent({
    name: 'analyze.request.received',
    data: {
      ip: maskedIp,
      contentLength: contentLengthHeader ? Number(contentLengthHeader) : null,
    },
  });

  const rateLimit = checkRateLimit(ip, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS);
  if (!rateLimit.allowed) {
    logEvent({
      name: 'analyze.request.rate_limited',
      level: 'warn',
      data: {
        ip: maskedIp,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
    });

    const response = jsonError(429, {
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT',
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });

    response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
    return response;
  }

  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isNaN(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      logEvent({
        name: 'analyze.request.rejected_payload_too_large',
        level: 'warn',
        data: { ip: maskedIp, contentLength },
      });

      return jsonError(413, {
        error: 'Request body is too large.',
        code: 'PAYLOAD_TOO_LARGE',
      });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logEvent({
      name: 'analyze.request.invalid_json',
      level: 'warn',
      data: { ip: maskedIp },
    });

    return jsonError(400, {
      error: 'Invalid JSON body.',
      code: 'INVALID_JSON',
    });
  }

  const validation = analyzeRequestSchema.safeParse(body);
  if (!validation.success) {
    logEvent({
      name: 'analyze.request.validation_failed',
      level: 'warn',
      data: {
        ip: maskedIp,
        issueCount: validation.error.issues.length,
      },
    });

    return jsonError(400, {
      error: 'Invalid request payload.',
      code: 'VALIDATION_ERROR',
      details: validation.error.issues.map((issue) => issue.message),
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    logEvent({
      name: 'analyze.request.config_error',
      level: 'error',
      data: { ip: maskedIp },
    });

    return jsonError(500, {
      error: 'Server is not configured with GEMINI_API_KEY.',
      code: 'CONFIG_ERROR',
    });
  }

  const { image, meatType, cut } = validation.data;

  if (image.length > MAX_IMAGE_BASE64_LENGTH) {
    logEvent({
      name: 'analyze.request.image_too_large',
      level: 'warn',
      data: { ip: maskedIp, imageLength: image.length },
    });

    return jsonError(413, {
      error: 'Image payload is too large.',
      code: 'IMAGE_TOO_LARGE',
    });
  }

  try {
    const result = await analyzeImage(image, meatType, cut);

    logEvent({
      name: 'analyze.request.succeeded',
      data: {
        ip: maskedIp,
        meatType,
        cut,
        recommendation: result.buyRecommendation,
        durationMs: durationMs(startedAt),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze API error:', error);

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      logEvent({
        name: 'analyze.request.failed',
        level: 'error',
        data: {
          ip: maskedIp,
          meatType,
          cut,
          durationMs: durationMs(startedAt),
          message: error.message,
        },
      });

      if (message.includes('api key') || message.includes('auth')) {
        return jsonError(401, {
          error: 'API authentication failed.',
          code: 'AUTH_ERROR',
        });
      }

      if (message.includes('rate limit') || message.includes('429')) {
        return jsonError(429, {
          error: 'Upstream rate limit reached. Please retry later.',
          code: 'UPSTREAM_RATE_LIMIT',
        });
      }

      if (message.includes('timeout')) {
        return jsonError(504, {
          error: 'Analysis timed out. Please retry.',
          code: 'TIMEOUT',
        });
      }

      if (message.includes('json')) {
        return jsonError(502, {
          error: 'AI response format was invalid.',
          code: 'INVALID_AI_RESPONSE',
        });
      }

      return jsonError(500, {
        error: error.message || 'Analysis failed due to server error.',
        code: 'ANALYSIS_ERROR',
      });
    }

    logEvent({
      name: 'analyze.request.failed_unknown',
      level: 'error',
      data: {
        ip: maskedIp,
        meatType,
        cut,
        durationMs: durationMs(startedAt),
      },
    });

    return jsonError(500, {
      error: 'Unknown server error.',
      code: 'UNKNOWN_ERROR',
    });
  }
}
