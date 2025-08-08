import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/database';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, TRANSACTION_TYPES } from '@/config/constants';
import { TransactionCreateInput, TransactionUpdateInput, PaginationParams } from '@/models/Transaction';
import { validateTransactionData, validatePaginationParams } from '@/models/validators';

export class TransactionController {
  static async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const type = searchParams.get('type') as keyof typeof TRANSACTION_TYPES | null;
      const category = searchParams.get('category');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      // Validate pagination params
      const paginationValidation = validatePaginationParams({ page, limit });
      if (!paginationValidation.success) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.VALIDATION_ERROR, details: paginationValidation.error },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const skip = (page - 1) * limit;
      
      // Build where clause
      const whereClause: any = {};
      if (type && Object.values(TRANSACTION_TYPES).includes(type)) {
        whereClause.type = type;
      }
      if (category) {
        whereClause.category = { contains: category, mode: 'insensitive' };
      }
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = new Date(startDate);
        if (endDate) whereClause.createdAt.lte = new Date(endDate);
      }

      const [transactions, totalCount] = await Promise.all([
        db.transaction.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.transaction.count({ where: whereClause }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        data: transactions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async getById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = parseInt(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_REQUEST },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const transaction = await db.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json({ data: transaction });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async create(request: NextRequest): Promise<NextResponse> {
    try {
      const data: TransactionCreateInput = await request.json();
      
      // Validate input data
      const validation = validateTransactionData(data);
      if (!validation.success) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.VALIDATION_ERROR, details: validation.error },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const { type, amount, category, description, createdAt } = validation.data;

      const transaction = await db.transaction.create({
        data: {
          type,
          amount: parseFloat(amount.toString()),
          category,
          description,
          createdAt: createdAt ? new Date(createdAt) : new Date(),
        },
      });

      return NextResponse.json(
        { 
          data: transaction, 
          message: SUCCESS_MESSAGES.TRANSACTION_CREATED 
        },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error) {
      console.error('Error creating transaction:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async update(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const id = parseInt(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_REQUEST },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const data: TransactionUpdateInput = await request.json();
      
      // Check if transaction exists
      const existingTransaction = await db.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      // Validate input data (partial validation for updates)
      const validation = validateTransactionData(data, true);
      if (!validation.success) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.VALIDATION_ERROR, details: validation.error },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const updateData: any = {};
      if (data.type) updateData.type = data.type;
      if (data.amount !== undefined) updateData.amount = parseFloat(data.amount.toString());
      if (data.category) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;

      const transaction = await db.transaction.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        data: transaction,
        message: SUCCESS_MESSAGES.TRANSACTION_UPDATED,
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async delete(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_REQUEST },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const transactionId = parseInt(id);

      // Check if transaction exists
      const existingTransaction = await db.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!existingTransaction) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      await db.transaction.delete({
        where: { id: transactionId },
      });

      return NextResponse.json({
        message: SUCCESS_MESSAGES.TRANSACTION_DELETED,
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async getSummary(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || 'month'; // month, year, all
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      let dateFilter: any = {};
      
      if (startDate && endDate) {
        dateFilter = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      } else if (period === 'month') {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        dateFilter = { gte: startOfMonth, lte: endOfMonth };
      } else if (period === 'year') {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        dateFilter = { gte: startOfYear, lte: endOfYear };
      }

      const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

      const transactions = await db.transaction.findMany({
        where: whereClause,
      });

      const income = transactions
        .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
        .reduce((acc, t) => acc + t.amount, 0);

      const expense = transactions
        .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((acc, t) => acc + t.amount, 0);

      const netIncome = income - expense;

      const expenseByCategory = transactions
        .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += t.amount;
          return acc;
        }, {} as Record<string, number>);

      const incomeByCategory = transactions
        .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += t.amount;
          return acc;
        }, {} as Record<string, number>);

      return NextResponse.json({
        data: {
          summary: {
            income,
            expense,
            netIncome,
            transactionCount: transactions.length,
          },
          breakdown: {
            expenseByCategory,
            incomeByCategory,
          },
          period: {
            type: period,
            startDate: dateFilter.gte?.toISOString(),
            endDate: dateFilter.lte?.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }
}