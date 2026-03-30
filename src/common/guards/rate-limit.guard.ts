import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.config = config;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientId = this.getClientId(request);
    const now = Date.now();

    // Clean up expired entries
    this.cleanupExpiredEntries(now);

    // Get or create client record
    const clientRecord = this.requests.get(clientId) || {
      count: 0,
      resetTime: now + this.config.windowMs,
    };

    // Check if window has expired
    if (now >= clientRecord.resetTime) {
      clientRecord.count = 0;
      clientRecord.resetTime = now + this.config.windowMs;
    }

    // Increment request count
    clientRecord.count++;
    this.requests.set(clientId, clientRecord);

    // Check if limit exceeded
    if (clientRecord.count > this.config.maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getClientId(request: Request): string {
    // Use IP address as client identifier
    return (
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private cleanupExpiredEntries(now: number): void {
    for (const [clientId, record] of this.requests.entries()) {
      if (now >= record.resetTime) {
        this.requests.delete(clientId);
      }
    }
  }
}
