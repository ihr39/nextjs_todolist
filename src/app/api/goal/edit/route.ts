import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "../../../../../util/database";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인하세요'},{status:400})
    let json = await req.json()
    let editData = {
        goal: json.goal,
        content: json.content,
        startDate: json.startDate,
        endDate: json.endDate
    }
    try{
        let result = await db.collection('goal').updateOne({userid: session.user.userid},{'$set': editData})
        if(result.modifiedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({returnMsg:'수정실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러 수정 실패'},{status:500})
    }
}