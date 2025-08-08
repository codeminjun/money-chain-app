import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/database';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import { UserCreateInput } from '@/models/User';

export class AuthController {
  static async register(request: NextRequest): Promise<NextResponse> {
    try {
      const data: UserCreateInput = await request.json();
      
      // Basic validation
      if (!data.email || !data.email.includes('@')) {
        return NextResponse.json(
          { error: 'Valid email is required' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Create user
      const user = await db.user.create({
        data: {
          email: data.email,
          name: data.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      return NextResponse.json(
        { 
          data: user, 
          message: 'User registered successfully' 
        },
        { status: HTTP_STATUS.CREATED }
      );
    } catch (error) {
      console.error('Error registering user:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async login(request: NextRequest): Promise<NextResponse> {
    try {
      const { email } = await request.json();
      
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Valid email is required' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      // Find user by email
      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      // In a real app, you would verify password here
      // For this demo, we'll just return the user data

      return NextResponse.json({
        data: {
          user,
          session: {
            userId: user.id,
            email: user.email,
            name: user.name,
            isAuthenticated: true,
          }
        },
        message: SUCCESS_MESSAGES.USER_AUTHENTICATED,
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }

  static async getProfile(request: NextRequest): Promise<NextResponse> {
    try {
      // In a real app, you would extract user ID from JWT token
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }

      const user = await db.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              transactions: true,
            }
          }
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      return NextResponse.json({ data: user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.DATABASE_ERROR },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }
}