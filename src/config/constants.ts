export const API_CONFIG = {
  VERSION: '1.0.0',
  PREFIX: '/api',
  TIMEOUT: 30000,
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Gift',
    'Other Income'
  ],
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other Expense'
  ]
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid request data',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  DATABASE_ERROR: 'Database operation failed',
  VALIDATION_ERROR: 'Data validation failed',
} as const;

export const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  USER_AUTHENTICATED: 'User authenticated successfully',
} as const;