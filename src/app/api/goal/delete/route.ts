
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function DELETE(req:NextRequest){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return NextResponse.json({errnMsg:'로그인 하세요.'},{status:400})
    let params = req.nextUrl.searchParams
    let _id = params.get('id')
    if( _id == null ) return NextResponse.json({errnMsg:'삭제할 데이터가 없습니다.'},{status:400})

    try{
        let result = await db.collection('goal').deleteOne({_id: new ObjectId(_id)})
        if(result.deletedCount>0) return NextResponse.json({returnMsg:'성공'},{status:200})
        else NextResponse.json({errnMsg:'삭제실패.'},{status:500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errnMsg:'서버에러/삭제실패.'},{status:500})
    }
}