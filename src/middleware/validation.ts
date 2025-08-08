import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/config/constants';

export interface RequestHandler {
  (request: NextRequest, params?: any): Promise<NextResponse>;
}

export function withValidation(handler: RequestHandler) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      // Add request ID for tracking
      const requestId = Math.random().toString(36).substring(2, 15);
      console.log(`[${requestId}] ${request.method} ${request.url}`);

      // Validate content type for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          return NextResponse.json(
            { error: 'Content-Type must be application/json' },
            { status: HTTP_STATUS.BAD_REQUEST }
          );
        }
      }

      const response = await handler(request, params);
      
      console.log(`[${requestId}] Response: ${response.status}`);
      return response;
    } catch (error) {
      console.error('Request validation error:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_REQUEST },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
  };
}

export function withErrorHandling(handler: RequestHandler) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await handler(request, params);
    } catch (error: any) {
      console.error('Unhandled error:', error);

      // Database connection errors
      if (error?.code === 'P1001') {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
      }

      // Prisma unique constraint errors
      if (error?.code === 'P2002') {
        return NextResponse.json(
          { error: 'Record already exists' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Prisma record not found errors
      if (error?.code === 'P2025') {
        return NextResponse.json(
          { error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      // JSON parse errors
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'Invalid JSON format' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  };
}

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return function (handler: RequestHandler) {
    return async (request: NextRequest, params?: any): Promise<NextResponse> => {
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old entries
      for (const [ip, data] of requestCounts.entries()) {
        if (data.resetTime < windowStart) {
          requestCounts.delete(ip);
        }
      }

      const currentData = requestCounts.get(clientIp);
      
      if (!currentData || currentData.resetTime < windowStart) {
        requestCounts.set(clientIp, { count: 1, resetTime: now + windowMs });
      } else {
        currentData.count++;
        if (currentData.count > maxRequests) {
          return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
          );
        }
      }

      return handler(request, params);
    };
  };
}

// Combine all middleware
export function withMiddleware(handler: RequestHandler) {
  return withErrorHandling(
    withValidation(
      withRateLimit(100, 60000)(handler)
    )
  );
}