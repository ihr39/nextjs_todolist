import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "../../../../util/database"
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest){
    let json = await req.json()
    let db = (await connectDB).db('todoList')
    if(json.userid == '' || json.password == '' || json.username == '') return NextResponse.json({errMsg:'빈 값이 있습니다.'},{status: 400})
    let hash = await bcrypt.hash(json.password,15)
    let insertData = {
        userid: json.userid,
        password: hash,
        username: json.username,
        email: json.email,
        birth: json.year + json.month + json.date,
        profile: '',
        provider: '',
        auth: false,
    }
    try{
        let result = await db.collection('user').insertOne(insertData)
        if(result.acknowledged) return NextResponse.redirect('/user/login')
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버에러/ 가입실패'},{status: 500})
    }
}