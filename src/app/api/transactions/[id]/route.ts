import { NextRequest } from 'next/server';
import { TransactionController } from '@/controllers/transactionController';
import { withMiddleware } from '@/middleware/validation';

export const GET = withMiddleware(async (request: NextRequest, { params }: { params: { id: string } }) => {
  return TransactionController.getById(request, { params });
});

export const PUT = withMiddleware(async (request: NextRequest, { params }: { params: { id: string } }) => {
  return TransactionController.update(request, { params });
});

export const PATCH = withMiddleware(async (request: NextRequest, { params }: { params: { id: string } }) => {
  return TransactionController.update(request, { params });
});