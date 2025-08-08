import { NextRequest } from 'next/server';
import { AuthController } from '@/controllers/authController';
import { withMiddleware } from '@/middleware/validation';

export const GET = withMiddleware(async (request: NextRequest) => {
  return AuthController.getProfile(request);
});