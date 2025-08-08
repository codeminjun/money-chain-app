import { NextRequest, NextResponse } from 'next/server';
import { DatabaseConfig } from '@/config/database';
import { API_CONFIG } from '@/config/constants';

export async function GET(request: NextRequest) {
  try {
    const dbHealthy = await DatabaseConfig.healthCheck();
    
    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: API_CONFIG.VERSION,
      database: dbHealthy ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    };

    return NextResponse.json(health, {
      status: dbHealthy ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}