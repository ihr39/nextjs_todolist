import { DefaultSession } from 'next-auth';

type DateType = (string|number|Date)

type Diary = {date:string, content: string}

declare module 'next-auth' {
  interface Session {
    user: {
      userid: string; // <-- Add the userid property here
      username: string; // <-- Add the userid property here
    } & DefaultSession['user'];
  }
}



