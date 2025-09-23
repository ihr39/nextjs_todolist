import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      userid: string; // <-- Add the userid property here
    } & DefaultSession['user'];
  }
}

