import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '@/config/constants';
import { TransactionCreateInput, TransactionUpdateInput, PaginationParams } from './Transaction';

interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateTransactionData(
  data: TransactionCreateInput | TransactionUpdateInput, 
  isUpdate = false
): ValidationResult<TransactionCreateInput | TransactionUpdateInput> {
  try {
    // Required field validation for create
    if (!isUpdate) {
      const createData = data as TransactionCreateInput;
      
      if (!createData.type) {
        return { success: false, error: 'Transaction type is required' };
      }
      
      if (createData.amount === undefined || createData.amount === null) {
        return { success: false, error: 'Amount is required' };
      }
      
      if (!createData.category || createData.category.trim() === '') {
        return { success: false, error: 'Category is required' };
      }
    }

    // Type validation
    if (data.type && !Object.values(TRANSACTION_TYPES).includes(data.type)) {
      return { 
        success: false, 
        error: `Invalid transaction type. Must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}` 
      };
    }

    // Amount validation
    if (data.amount !== undefined) {
      const numAmount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
      
      if (isNaN(numAmount)) {
        return { success: false, error: 'Amount must be a valid number' };
      }
      
      if (numAmount <= 0) {
        return { success: false, error: 'Amount must be greater than 0' };
      }
      
      if (numAmount > 999999999) {
        return { success: false, error: 'Amount exceeds maximum limit' };
      }
    }

    // Category validation
    if (data.category !== undefined) {
      if (typeof data.category !== 'string') {
        return { success: false, error: 'Category must be a string' };
      }
      
      if (data.category.trim().length === 0) {
        return { success: false, error: 'Category cannot be empty' };
      }
      
      if (data.category.length > 50) {
        return { success: false, error: 'Category must be 50 characters or less' };
      }
    }

    // Description validation
    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        return { success: false, error: 'Description must be a string' };
      }
      
      if (data.description.length > 200) {
        return { success: false, error: 'Description must be 200 characters or less' };
      }
    }

    // CreatedAt validation (for create operations)
    if (!isUpdate && 'createdAt' in data && data.createdAt) {
      const date = new Date(data.createdAt);
      if (isNaN(date.getTime())) {
        return { success: false, error: 'Invalid date format for createdAt' };
      }
      
      const now = new Date();
      const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      
      if (date > oneYearFromNow) {
        return { success: false, error: 'Transaction date cannot be more than 1 year in the future' };
      }
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Validation failed due to invalid data format' };
  }
}

export function validatePaginationParams(params: PaginationParams): ValidationResult<PaginationParams> {
  const { page, limit } = params;

  if (!Number.isInteger(page) || page < 1) {
    return { success: false, error: 'Page must be a positive integer' };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return { success: false, error: 'Limit must be a positive integer between 1 and 100' };
  }

  return { success: true, data: params };
}

export function validateDateRange(startDate: string, endDate: string): ValidationResult<{ startDate: Date; endDate: Date }> {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { success: false, error: 'Invalid start date format' };
  }

  if (isNaN(end.getTime())) {
    return { success: false, error: 'Invalid end date format' };
  }

  if (start > end) {
    return { success: false, error: 'Start date must be before end date' };
  }

  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    return { success: false, error: 'Date range cannot exceed 365 days' };
  }

  return { success: true, data: { startDate: start, endDate: end } };
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateId(id: string): ValidationResult<number> {
  const numId = parseInt(id);
  
  if (isNaN(numId) || numId < 1) {
    return { success: false, error: 'Invalid ID format' };
  }
  
  return { success: true, data: numId };
}