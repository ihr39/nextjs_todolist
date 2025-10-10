import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "../../../../../util/database";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

let db = (await connectDB).db('todoList')

export async function GET(req: NextRequest){
    let params = req.nextUrl.searchParams
    let session = await getServerSession(authOptions)
    if(session == null ) return NextResponse.json({errMsg: '로그인 먼저 하세요'},{status:400})
    try{
        let result = await db.collection('todo_detail').find({userid: session.user.userid, date: params.get('date')}).toArray()
        return NextResponse.json({returnMsg: '성공', result: result},{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/조회실패'},{status:500})
    }
}

export async function POST(req: NextRequest){
    let params = req.nextUrl.searchParams
    let session = await getServerSession(authOptions)
    if(session == null ) return NextResponse.json({errMsg: '로그인 먼저 하세요'},{status:400})
    try{
        let result = await db.collection('todo_detail').insertOne({userid: session.user.userid, content:'', complete: false, date: params.get('date')})
        if(result.acknowledged) return NextResponse.json({returnMsg: '성공'},{status:200})
        else NextResponse.json({errMsg: '추가실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/추가실패'},{status:500})
    }
}

export async function PUT(req: NextRequest){
    let session = await getServerSession(authOptions)
    if(session == null ) return NextResponse.json({errMsg: '로그인 먼저 하세요'},{status:400})
    let editData:{content?: string, complete?: boolean} = {}
    try{
        let json = await req.json()
        console.log(json)
        if(typeof json.content != 'undefined') editData.content = json.content
        if(typeof json.complete != 'undefined') editData.complete = json.complete
        let result = await db.collection('todo_detail').updateOne({_id: new ObjectId(json.id),date: json.date},{'$set': editData})
        if(result.modifiedCount>0) return NextResponse.json({returnMsg: '성공'},{status:200})
        else return NextResponse.json({errMsg: '수정실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/수정실패'},{status:500})
    }
}

export async function DELETE(req: NextRequest){
    let params = req.nextUrl.searchParams
    let id = params.get('id')
    if(id == null) return NextResponse.json({errMsg: '삭제할 데이터가 없습니다.'},{status:400})
    let session = await getServerSession(authOptions)
    if(session == null ) return NextResponse.json({errMsg: '로그인 먼저 하세요.'},{status:400})
    try{
        let result = await db.collection('todo_detail').deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount>0) return NextResponse.json({returnMsg: '성공'},{status:200})
        else return NextResponse.json({errMsg: '삭제실패'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg: '서버에러/삭제실패'},{status:500})
    }
}