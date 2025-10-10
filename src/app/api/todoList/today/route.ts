import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { connectDB } from "../../../../../util/database";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest){
    let session = await getServerSession(authOptions)
    let params = req.nextUrl.searchParams
    let date = params.get('date')
        
    let db = (await connectDB).db('todoList')
    if(session == null) return NextResponse.json({errMsg: '로그인 먼저 하세요'},{status:400})
    try{
        let todayResult = await db.collection('todo').findOne({userid: session.user.userid, date: date})
        if(!todayResult){
            let result = await db.collection('todo').insertOne({date: date, userid: session.user.userid, createAt: new Date()})
            if(result.acknowledged) return NextResponse.json({returnMsg: '성공', result: result},{status:200})
            else NextResponse.json({errMsg: '추가실패'},{status:500})
        } return NextResponse.json({returnMsg: '성공'},{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/조회 실패'},{status:500})
    }
}