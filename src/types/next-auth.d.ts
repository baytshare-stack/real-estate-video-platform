import { NextAuthOptions, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'AGENT' | 'AGENCY' | 'ADMIN';
    } & DefaultSession['user'];
  }
}
