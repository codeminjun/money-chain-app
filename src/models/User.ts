export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  name?: string;
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
}

export interface AuthSession {
  userId: number;
  email: string;
  name?: string | null;
  isAuthenticated: boolean;
}