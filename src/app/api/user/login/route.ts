import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest){
    let json = await req.json()
    let db = (await connectDB).db('todoList') //--ts에서 mongo쓰려면 라이브러리 하나 더 다운 받아야함 (좀 귀찮네)
    //if(req.body != null) req.body = JSON.parse(req.body) //--자동으로 body 파싱 가능
    let userInfo = await db.collection('user').findOne({userid: json.userid})
    if(userInfo){
        let result: boolean = await bcrypt.compare(json.password, userInfo.password)
        if(result) return NextResponse.json(userInfo,{status:200})
        else return NextResponse.json({result: '로그인 실패'},{status:400})
    }else return NextResponse.json({result: '존재하지않는 회원'},{status:400})
}