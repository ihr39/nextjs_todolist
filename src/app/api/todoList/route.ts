import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../util/database";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest){
    let session = await getServerSession(authOptions)
        
    let db = (await connectDB).db('todoList')
    if(session == null) return NextResponse.json({errMsg: '로그인 먼저 하세요'},{status:400})
    try{
        let result = await db.collection('todo').find({userid: session.user.userid}).toArray()
        return NextResponse.json({returnMsg: '성공', result: result},{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/조회 실패'},{status:500})
    }
}