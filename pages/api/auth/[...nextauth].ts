import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { Account, AuthOptions, User } from "next-auth";
import { connectDB } from "../../../util/database";
import Google from "next-auth/providers/google"
import Kakao from "next-auth/providers/kakao"
import Naver from "next-auth/providers/naver"
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.NEXTAUTH_Google_ID ? process.env.NEXTAUTH_Google_ID : "", 
      clientSecret: process.env.NEXTAUTH_Google_Secret ? process.env.NEXTAUTH_Google_Secret : ""
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID ? process.env.AUTH_KAKAO_ID : "", 
      clientSecret: process.env.AUTH_KAKAO_SECRET ? process.env.AUTH_KAKAO_SECRET : ""
    }),
    Naver({
      clientId: process.env.AUTH_Naver_ID ? process.env.AUTH_Naver_ID : "", 
      clientSecret: process.env.AUTH_Naver_SECRET ? process.env.AUTH_Naver_SECRET : ""
    }),

    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드 
      name: "credentials",
      credentials: {
          userid: { label: "userid", type: "text" },
          password: { label: "password", type: "password" },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고 
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: credentials?.userid,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 //30일
  },
  callbacks: {
    async signIn({user,account}){
      let exsitUser
      let db = (await connectDB).db('todoList')
      if(account?.provider != 'credentials'){
        try{
          exsitUser = await db.collection('user').findOne({userid: user.id})
          if(!exsitUser) {
            let result = await db.collection('user').insertOne({
                            userid: user.id,
                            username: user.name,
                            email: user.email,
                            profile: user.image,
                            provider: account?.provider,
                            birth: ''
                        })
            if(!result.acknowledged) return false
          }
        }catch(e){
          console.log(e)
          return false
        }
      }
      return true
    },
    //4. jwt 만들 때 실행되는 코드 
    //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user, account }) => { //--db 저장명이랑 맞춰야지ㅡㅡ 몰랐어~
      if (user && account) {
        token.user = {};
        token.user.userid = account.provider != 'credentials' ? user.id : user.userid
        token.user.email = account.provider != 'credentials' ? user.email : user.email
        token.user.username = account.provider != 'credentials' ? user.name : user.username
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;  
      return session;
    },
  },
  pages: {
    signIn: "/user/login",
  },
  secret : process.env.NEXTAUTH_SECRET,
  //adapter: MongoDBAdapter(connectDB) 
} satisfies AuthOptions;
export default NextAuth(authOptions); 