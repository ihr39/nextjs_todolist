import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

let db = (await connectDB).db('todoList')
let today = new Date().toISOString().split('T')[0]
export async function POST(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인먼저하세요'},{status:400})
    let json = await req.json()
    let addValue = {
        userid: session.user.userid, 
        routine: json.routine, 
        routine_date: json.routine_date, 
        createAt: new Date(), 
        completeHistory: {[`${today}`]: false}
    }
    try{
        let result = await db.collection('routine').insertOne(addValue)
        if(result.acknowledged) return NextResponse.json({returnMsg:'성공', addValue: {...addValue, _id: result.insertedId}},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}

export async function PUT(req: NextRequest){
    let json = await req.json()
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인먼저하세요'},{status:400})
    let editData = {
        routine: json.routine, 
        routine_date: json.routine_date, 
        completeHistory: json.completeHistory
    }
    try{
        let result = await db.collection('routine').updateOne({_id: new ObjectId(json._id)},{'$set':editData})
        if(result.modifiedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}

export async function DELETE(req: NextRequest){
    let id = req.nextUrl.searchParams.get('id')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인먼저하세요'},{status:400})
    if(id==null) return NextResponse.json({errMsg:'삭제할 데이터가 없습니다.'},{status:400})
    try{
        let result = await db.collection('routine').deleteOne({'_id':new ObjectId(id)})
        if(result.deletedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'삭제실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/삭제실패'},{status:500})
    }
}