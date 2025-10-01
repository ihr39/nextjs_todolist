import { DefaultSession } from "next-auth";
import NextAuth from "next-auth"
//--이걸 전부 한 파일에 처 넣어야 제대로 적용 되네 

declare module "next-auth"{
  interface Session{
    user: {
      userid: string; 
      username: string; 
      email: string;
    }
    expires: ISODateString
  }
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
    name:string,
    image: string
  }
}