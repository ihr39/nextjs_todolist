import { DefaultSession, DefaultUser } from 'next-auth';

type DateType = (string|number|Date)

type Diary = {date:string, content: string}

interface UserInfo {
  userid: string,
  username: string,
  email: string,
  birth: string,
  profile: string,
  provider: string,
  auth: boolean
}

type FormInput = {
    username: string,
    email: string,
    year: string,
    month: string,
    date: string,
    profile: File[],
    profileUrl: string
}

declare module 'next-auth' { //--session이 존재하는한 user는 반드시 존재해야한다
  interface Session {
    user: {
      userid: string; 
      username: string; 
      email: string;
    } & DefaultSession['user']; //-- defaultSession에 user속성을 합성
  }
}

declare module 'next-auth/jwt'{
  interface JWT extends DefaultUser{
    user?:{
      userid: string,
      email: string,
      username: string,
    }
  }
}

declare module 'next-auth'{ //--authorize가 넘기는 user값
  interface User extends DefaultUser{
    id: string,
    email: string,
    name:string
  }
}