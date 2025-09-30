import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { getServerSession } from 'next-auth'
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인하세요'},{status:400})
    let json = await req.json()
    try{
        let result = await db.collection('email_auth').findOne({email: json.email, authNum: json.authNum})
        if(result == null) return NextResponse.json({errMsg:'인증번호가 유효하지 않거나 만료되었습니다.'},{status:400})
        
        await db.collection('email_auth').deleteOne({email: json.email, authNum: json.authNum})
        let updateResult = await db.collection('user').updateOne(
            {userid: session.user.userid},
            {'$set':{email: json.email, email_auth: true}}
        )
        if(updateResult.modifiedCount > 0) return NextResponse.json({returnMsg:'인증 완료'},{status: 200})
        else return NextResponse.json({errMsg:'인증 업데이트 실패.'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러.'},{status:500})
    }
}