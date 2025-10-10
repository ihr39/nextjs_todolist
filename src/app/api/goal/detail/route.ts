import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

let db = (await connectDB).db('todoList')

export async function POST(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요.'},{status:400})
    let params = req.nextUrl.searchParams
    let goalId = params.get('goalId')
    if(goalId == null) return NextResponse.json({errMsg:'존재하지 않는 게시글입니다.'},{status:400})
    let addValue: GoalDetailType = {
        goalId: new ObjectId(goalId),
        userid: session.user.userid,
        detailContent: '',
        completeAt: null,
        createAt: new Date()
    }
    try{
        let result = await db.collection('goal_detail').insertOne(addValue)
        addValue._id = result.insertedId
        if(result.acknowledged) return NextResponse.json({returnMsg:'성공', result: addValue},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}

export async function PUT(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요.'},{status:400})
    try{
        let jsonData = await req.json() //--이부분도 try문 안에 넣는게 좋을 듯
        let editData = {
            goalId: new ObjectId(jsonData.goalId),
            detailContent: jsonData.detailContent,
            completeAt: jsonData.completeAt,
        }
        let result = await db.collection('goal_detail').updateOne({_id: new ObjectId(jsonData._id)},{'$set': editData})
        if(result.modifiedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}

export async function DELETE(req: NextRequest){
    let params = req.nextUrl.searchParams
    let id = params.get('id')
    if(id == null) return NextResponse.json({errMsg:'삭제할 데이터가 없습니다.'},{status:400})
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요.'},{status:400})
    try{
        let result = await db.collection('goal_detail').deleteOne({'_id': new ObjectId(id)})
        if(result.deletedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'삭제실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}