import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요'},{status:400})
    let json = await req.json()
    let inserData = {
        userid: session.user.userid,
        goal: json.goal,
        content: json.content,
        startDate: json.startDate,
        endDate: json.endDate
    }
    try{
        let result = await db.collection('goal').insertOne(inserData)
        if(result.acknowledged) return NextResponse.json({returnMsg:result.insertedId.toString()},{status:200})
        else return NextResponse.json({errMsg:'목표 저장 실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버 에러 목표 저장 실패'},{status:500})
    }
}