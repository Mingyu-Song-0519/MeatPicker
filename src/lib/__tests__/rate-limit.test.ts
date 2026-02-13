import { checkRateLimit } from '../rate-limit';

describe('checkRateLimit', () => {
  it('blocks after limit is exceeded within window', () => {
    const key = `test-key-${Date.now()}-block`;
    const limit = 3;
    const windowMs = 1000;

    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);

    const blocked = checkRateLimit(key, limit, windowMs);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('resets after window elapses', async () => {
    const key = `test-key-${Date.now()}-reset`;
    const limit = 1;
    const windowMs = 20;

    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(checkRateLimit(key, limit, windowMs).allowed).toBe(true);
  });
});
