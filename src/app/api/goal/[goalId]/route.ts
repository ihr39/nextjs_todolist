import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, context: GoalContext){
    let db = (await connectDB).db('todoList')
    let params = await context.params
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인하세요.'},{status:400})
    try{
        let result = await db.collection('goal_detail').find({goalId:new ObjectId(params.goalId)}).toArray()
        return NextResponse.json({returnMsg:'성공', dataList: result},{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/조회실패.'},{status:500})
    }
    
}