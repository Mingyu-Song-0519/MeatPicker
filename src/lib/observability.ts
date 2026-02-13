export type ObservabilityLevel = 'info' | 'warn' | 'error';

export interface ObservabilityEvent {
  name: string;
  level?: ObservabilityLevel;
  data?: Record<string, unknown>;
}

function shouldLog(): boolean {
  return process.env.NODE_ENV !== 'test';
}

export function logEvent({ name, level = 'info', data = {} }: ObservabilityEvent): void {
  if (!shouldLog()) return;

  const payload = {
    ts: new Date().toISOString(),
    level,
    event: name,
    data,
  };

  const text = JSON.stringify(payload);

  if (level === 'error') {
    console.error(text);
    return;
  }

  if (level === 'warn') {
    console.warn(text);
    return;
  }

  console.log(text);
}

export function durationMs(start: number): number {
  return Date.now() - start;
}

export function maskIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.x.x`;
    }
  }
  return `${ip.slice(0, 6)}***`;
}
