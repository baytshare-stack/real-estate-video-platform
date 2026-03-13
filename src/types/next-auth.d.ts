import { NextAuthOptions, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'VIEWER' | 'AGENT' | 'COMPANY' | 'ADMIN';
    } & DefaultSession['user'];
  }
}
