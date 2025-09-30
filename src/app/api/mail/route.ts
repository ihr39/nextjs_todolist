
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "./mailFun";
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../../util/database";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인하세요'},{status:400})
    let json = await req.json()
    let email: string = json.email
    let authNum = String(Math.floor(Math.random() * 1000000)).padStart(6,'0')
    
    return NextResponse.json({returnMsg:'OK'})
    // try{
    //     //--db방식
    //     let result = await db.collection('email_auth').insertOne({email: email, authNum: authNum, createdAt: new Date()})
    //     if(result.acknowledged){
    //         return sendEmail({from: email, subject:'메일 인증', message:`인증번호: ${authNum}`})
    //             .then(()=>{

    //                 return new Response(JSON.stringify({returnMsg: '전송완료'}),{status:200})
    //             })
    //             .catch((err)=>{
    //                 console.log(err)
    //                 return new Response(JSON.stringify({errMsg: '전송실패'}),{status:500})
    //             })
    //     }else return NextResponse.json({errMsg:'db에러'},{status:500})
    // }catch(e){
    //     console.log(e)
    //     return NextResponse.json({errMsg:'서버에러'},{status:500})
    // }
}