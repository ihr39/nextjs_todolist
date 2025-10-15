import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

let db = (await connectDB).db('todoList')
export async function GET(req:NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저하세요'},{status:400})
    try{
        let result = await db.collection('book').find({userid: session.user.userid}).toArray()
        return NextResponse.json({returnMsg:'성공', result: result},{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/조회실패'},{status:500})
    }
}

export async function POST(req: NextRequest){
    let json = await req.json()
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저하세요'},{status:400})
    let addValue = {
        userid: session.user.userid,
        startDate: json.startDate,
        endDate: json.endDate,
        title: json.title,
        oneReview: json.oneReview,
        content: json.content,
        score: json.score == null ? 0 : json.score,
        createAt: new Date() 
    }
    try{
        let result = await db.collection('book').insertOne(addValue)
        if(result.acknowledged) return NextResponse.json({returnMsg:'성공',id: result.insertedId},{status:200})
        else return NextResponse.json({errMsg:'저장실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/저장실패'},{status:500})
    }
}

export async function PUT(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저하세요'},{status:400})
    let json = await req.json()
    let editValue = {
        startDate: json.startDate,
        endDate: json.endDate,
        title: json.title,
        oneReview: json.oneReview,
        content: json.content,
        score: json.score == null ? 0 : json.score,
    }
    try{
        let result = await db.collection('book').updateOne({_id: new ObjectId(json._id), userid: session.user.userid},{'$set':editValue})
        if(result.modifiedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'서버에러/수정실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/수정실패'},{status:500})
    }
}

export async function DELETE(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errMsg:'로그인 먼저 하세요'},{status:400})
    let params = req.nextUrl.searchParams
    let id = params.get('id')
    if(id == null) return NextResponse.json({errMsg:'삭제할 데이터가 없습니다.'},{status:400})
    try{
        let result = await db.collection('book').deleteOne({_id: new ObjectId(id), userid: session.user.userid})
        if(result.deletedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else return NextResponse.json({errMsg:'삭제실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/ 삭제실패'},{status:500})
    }
}