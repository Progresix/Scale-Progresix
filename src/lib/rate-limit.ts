/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting for API endpoints
 * Note: In production, use Redis or a similar persistent store
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  retryAfter?: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean up expired records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Create a rate limiter with custom configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator } = config;

  return {
    check(identifier: string): RateLimitResult {
      const key = keyGenerator ? keyGenerator(identifier) : identifier;
      const now = Date.now();
      const record = rateLimitStore.get(key);

      // No record or window expired - create new record
      if (!record || now > record.resetAt) {
        rateLimitStore.set(key, {
          count: 1,
          resetAt: now + windowMs,
        });
        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetIn: windowMs,
        };
      }

      // Check if limit exceeded
      if (record.count >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetIn: record.resetAt - now,
          retryAfter: Math.ceil((record.resetAt - now) / 1000),
        };
      }

      // Increment count
      record.count++;
      rateLimitStore.set(key, record);
      
      return {
        allowed: true,
        remaining: maxRequests - record.count,
        resetIn: record.resetAt - now,
      };
    },

    reset(identifier: string): void {
      const key = keyGenerator ? keyGenerator(identifier) : identifier;
      rateLimitStore.delete(key);
    },

    getRemaining(identifier: string): number {
      const key = keyGenerator ? keyGenerator(identifier) : identifier;
      const record = rateLimitStore.get(key);
      
      if (!record || Date.now() > record.resetAt) {
        return maxRequests;
      }
      
      return Math.max(0, maxRequests - record.count);
    },
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */

// For email resending: 3 requests per hour per email
export const emailRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyGenerator: (email) => `email:${email.toLowerCase()}`,
});

// For transaction creation: 10 requests per hour per IP
export const transactionRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  keyGenerator: (ip) => `transaction:${ip}`,
});

// For API general use: 100 requests per minute per IP
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyGenerator: (ip) => `api:${ip}`,
});

// For authentication: 5 attempts per 15 minutes per IP
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyGenerator: (ip) => `auth:${ip}`,
});

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Check for forwarded headers first (for reverse proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for local development
  return "127.0.0.1";
}

/**
 * Create a rate limit response
 */
export function rateLimitResponse(result: RateLimitResult, message?: string): Response {
  return new Response(
    JSON.stringify({
      error: message || "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      rateLimited: true,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfter || 60),
      },
    }
  );
}
