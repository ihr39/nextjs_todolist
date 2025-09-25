import { DefaultSession } from 'next-auth';

type DateType = (string|number|Date)

type Diary = {date:string, content: string}

interface UserInfo {
  userid: string,
  username: string,
  email: string,
  birth: string,
  profile: string,
  provider: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      userid: string; // <-- Add the userid property here
      username: string; // <-- Add the userid property here
    } & DefaultSession['user'];
  }
}



