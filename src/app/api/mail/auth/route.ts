import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { getServerSession } from 'next-auth'
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인하세요'},{status:400})
    let json = await req.json()
    try{
        let result = await db.collection('email_auth').findOne({email: json.email, auth: 'N'})
        if(result == null) return NextResponse.json({errMsg:'인증번호를 받아주세요.'},{status:400})
        if(result.authNum == json.authNum){
            let result = await db.collection('email_auth').updateOne({email: json.email, auth: 'N'},{'$set':{auth:'Y'}})
            if(result.modifiedCount>0) return NextResponse.json({returnMsg:'인증 완료'},{status: 200})
            else return NextResponse.json({errMsg:'인증 업데이트 실패.'},{status:500})
        } else return NextResponse.json({errMsg:'인증번호가 다릅니다.'},{status:400})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러.'},{status:500})
    }
}