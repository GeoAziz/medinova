import { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL as string);

// Configure different rate limiters
const rateLimiters = {
  default: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_default',
    points: 100, // Number of points
    duration: 60, // Per 60 seconds
  }),
  
  auth: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_auth',
    points: 20,
    duration: 60,
  }),
  
  billing: new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_billing',
    points: 30,
    duration: 60,
  }),
};

export interface RateLimitConfig {
  points: number;
  duration: number;
  limiterType?: keyof typeof rateLimiters;
}

export function rateLimiter(config: RateLimitConfig = { points: 100, duration: 60 }) {
  return async function(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    const limiter = rateLimiters[config.limiterType || 'default'];
    
    try {
      // Get client identifier (IP or API key)
      let clientId = req.headers['x-api-key'] || req.socket.remoteAddress;
      if (Array.isArray(clientId)) {
        clientId = clientId[0];
      }
      if (!clientId) {
        clientId = 'unknown';
      }
      
      // Consume points
      const rateLimiterRes = await limiter.consume(clientId);
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', config.points);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
      
      next();
    } catch (error: any) {
      // Rate limit exceeded
      if (error && typeof error.msBeforeNext === 'number') {
        res.setHeader('Retry-After', Math.ceil(error.msBeforeNext / 1000));
        res.status(429).json({
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Rate limit exceeded',
            retryAfter: Math.ceil(error.msBeforeNext / 1000),
          },
        });
      } else {
        // Unknown error
        res.status(500).json({
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          },
        });
      }
    }
  };
}

// Example usage in an API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authLimiter = rateLimiter({ points: 20, duration: 60, limiterType: 'auth' });
  
  return authLimiter(req, res, () => {
    // Your API logic here
    res.status(200).json({ message: 'Success' });
  });
}
