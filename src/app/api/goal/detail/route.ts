import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요.'},{status:400})
    let params = req.nextUrl.searchParams
    let goalId = params.get('goalId')
    if(goalId == null) return NextResponse.json({errMsg:'존재하지 않는 게시글입니다.'},{status:400})
    let addValue = {
        goalId: new ObjectId(goalId),
        userid: session.user.userid,
        detailContent: '',
        completeAt: null,
        createAt: new Date()
    }
    try{
        let result = await db.collection('goal_detail').insertOne(addValue)
        if(result.acknowledged) return NextResponse.json({returnMsg:'성공', goalId: result.insertedId.toString()},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}