import { NextRequest } from 'next/server';
import { TransactionController } from '@/controllers/transactionController';
import { withMiddleware } from '@/middleware/validation';

export const GET = withMiddleware(async (request: NextRequest) => {
  return TransactionController.getAll(request);
});

export const POST = withMiddleware(async (request: NextRequest) => {
  return TransactionController.create(request);
});

export const DELETE = withMiddleware(async (request: NextRequest) => {
  return TransactionController.delete(request);
});
