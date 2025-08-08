import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

class DatabaseConfig {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = globalThis.prisma || new PrismaClient({
        log: ['query', 'error', 'warn'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL || "file:./dev.db"
          }
        }
      });

      if (process.env.NODE_ENV !== 'production') {
        globalThis.prisma = DatabaseConfig.instance;
      }
    }

    return DatabaseConfig.instance;
  }

  static async disconnect(): Promise<void> {
    if (DatabaseConfig.instance) {
      await DatabaseConfig.instance.$disconnect();
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      await DatabaseConfig.getInstance().$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export const db = DatabaseConfig.getInstance();
export { DatabaseConfig };