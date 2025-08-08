import { NextRequest } from 'next/server';
import { AuthController } from '@/controllers/authController';
import { withMiddleware } from '@/middleware/validation';

export const POST = withMiddleware(async (request: NextRequest) => {
  return AuthController.register(request);
});