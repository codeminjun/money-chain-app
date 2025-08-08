import { NextRequest, NextResponse } from 'next/server';
import { TRANSACTION_CATEGORIES } from '@/config/constants';
import { withMiddleware } from '@/middleware/validation';

export const GET = withMiddleware(async (request: NextRequest) => {
  try {
    return NextResponse.json({
      data: {
        categories: TRANSACTION_CATEGORIES,
        allCategories: [
          ...TRANSACTION_CATEGORIES.INCOME,
          ...TRANSACTION_CATEGORIES.EXPENSE
        ]
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
});