export type Role = 'USER' | 'ADMIN';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string,
  nickname: string,
  email?: string,
  role: UserRole
};
