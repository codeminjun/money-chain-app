

import { TRANSACTION_TYPES } from '@/config/constants';

export interface Transaction {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  type: keyof typeof TRANSACTION_TYPES;
  amount: number;
  category: string;
  description?: string | null;
}

export interface TransactionCreateInput {
  type: keyof typeof TRANSACTION_TYPES;
  amount: number | string;
  category: string;
  description?: string;
  createdAt?: string | Date;
}

export interface TransactionUpdateInput {
  type?: keyof typeof TRANSACTION_TYPES;
  amount?: number | string;
  category?: string;
  description?: string;
}

export interface TransactionSummary {
  income: number;
  expense: number;
  netIncome: number;
  transactionCount: number;
}

export interface TransactionBreakdown {
  expenseByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}