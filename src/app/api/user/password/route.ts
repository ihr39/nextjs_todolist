import { NextApiRequest } from "next";
import { getServerSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { authOptions } from "../../auth/[...nextauth]/route";

//--속도가 더 빠른듯?
export async function POST(req: NextRequest){
    const json = await req.json()
    let session = await getServerSession(authOptions)
    let db = (await connectDB).db('todoList')
    if(!session) return NextResponse.json({errMsg:'로그인하세요'},{status:400})
    else if(json.currntPassword == json.currntPassword) return NextResponse.json({errMsg:'현재 비밀번호와 바꿀 비밀번호가 같습니다.'},{status:400})
    try{
        let userInfo = await db.collection('user').findOne({userid:session.user.userid})
        if(!userInfo) return NextResponse.json({errMsg:'존재하지 않는 회원입니다.'},{status:400})
        else if(userInfo.provider ?? '' != '') return NextResponse.json({errMsg: userInfo.provider+'로 가입한 회원입니다.'},{status:400})
        else{
            let result = await bcrypt.compare(json.currntPassword, userInfo.password)
            if(!result) return NextResponse.json({resultMsg:'0'},{status: 200})
            else{
                let changedPassword = await bcrypt.hash(json.changedPassword,15)
                let result = await db.collection('user').updateOne({userid: session.user.userid},{'$set':{password: changedPassword}})
                    
                if(result.modifiedCount>0) return NextResponse.json({resultMsg:'1'},{status: 200})
                else NextResponse.json({errMsg:'수정 실패'},{status: 500})
            }
        }
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버 에러 문의 바람'},{status: 500})
    }
}