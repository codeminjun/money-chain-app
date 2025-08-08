# MoneyChain API Documentation

## Overview
MoneyChain API provides a comprehensive set of endpoints for managing personal finance transactions with professional-grade architecture.

## Base URL
```
/api
```

## Response Format
All API responses follow a consistent structure:

```json
{
  "data": { /* response data */ },
  "message": "Success message",
  "error": "Error message if applicable"
}
```

## Error Handling
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Get User Profile
```http
GET /api/auth/profile?userId=1
```

## Transaction Endpoints

### Get All Transactions
```http
GET /api/transactions
```

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 50, max: 100) - Number of items per page
- `type` (string) - Filter by transaction type: "INCOME" or "EXPENSE"
- `category` (string) - Filter by category name
- `startDate` (string, ISO date) - Filter transactions from this date
- `endDate` (string, ISO date) - Filter transactions until this date

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "type": "EXPENSE",
      "amount": 50000,
      "category": "Food & Dining",
      "description": "Restaurant dinner",
      "userId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalCount": 125,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Create Transaction
```http
POST /api/transactions
```

**Request Body:**
```json
{
  "type": "EXPENSE",
  "amount": 50000,
  "category": "Food & Dining",
  "description": "Restaurant dinner",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Get Single Transaction
```http
GET /api/transactions/[id]
```

### Update Transaction
```http
PUT /api/transactions/[id]
PATCH /api/transactions/[id]
```

**Request Body:** (All fields optional for PATCH)
```json
{
  "type": "INCOME",
  "amount": 75000,
  "category": "Freelance",
  "description": "Updated description"
}
```

### Delete Transaction
```http
DELETE /api/transactions?id=1
```

## Summary Endpoints

### Get Financial Summary
```http
GET /api/summary
```

**Query Parameters:**
- `period` (string) - Summary period: "month", "year", or "all" (default: "month")
- `startDate` (string, ISO date) - Custom date range start
- `endDate` (string, ISO date) - Custom date range end

**Response:**
```json
{
  "data": {
    "summary": {
      "income": 500000,
      "expense": 300000,
      "netIncome": 200000,
      "transactionCount": 25
    },
    "breakdown": {
      "expenseByCategory": {
        "Food & Dining": 120000,
        "Transportation": 80000,
        "Shopping": 100000
      },
      "incomeByCategory": {
        "Salary": 400000,
        "Freelance": 100000
      }
    },
    "period": {
      "type": "month",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    }
  }
}
```

## Utility Endpoints

### Get Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "data": {
    "categories": {
      "INCOME": ["Salary", "Freelance", "Investment", "Business", "Gift", "Other Income"],
      "EXPENSE": ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other Expense"]
    },
    "allCategories": ["Salary", "Freelance", "..."]
  }
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "uptime": 3600.5
}
```

## Data Validation Rules

### Transaction
- `type`: Required, must be "INCOME" or "EXPENSE"
- `amount`: Required, must be positive number, max 999,999,999
- `category`: Required, string, max 50 characters
- `description`: Optional, string, max 200 characters
- `createdAt`: Optional, valid date, cannot be more than 1 year in future

### User
- `email`: Required, valid email format
- `name`: Optional, string

### Pagination
- `page`: Must be positive integer
- `limit`: Must be positive integer, max 100

## Rate Limiting
- 100 requests per minute per IP address
- Exceeding limit returns 429 status code

## Architecture Features
- ✅ Clean separation of concerns (Controllers, Models, Middleware)
- ✅ Comprehensive input validation
- ✅ Consistent error handling
- ✅ Rate limiting protection
- ✅ Database connection management
- ✅ Pagination support
- ✅ Advanced filtering and querying
- ✅ Health monitoring
- ✅ Professional logging

## Development Notes
- All endpoints use TypeScript for type safety
- Prisma ORM for database operations
- Middleware-based request processing
- Comprehensive error handling and logging
- Future-ready for authentication tokens (JWT)