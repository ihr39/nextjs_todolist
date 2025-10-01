import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../../util/database";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest){
    let result 
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({errMsg:'로그인하슈'},{status:400})
    try{
        let json = await req.json()
        //--아무 것도 없을 경우 추가
        let data = await db.collection('diary').findOne({userid: session.user.userid})
        if(!data){
            let insertRes = await db.collection('diary').insertOne({userid: session.user.userid, contents: [{date: json.date, content: json.content}]})
            if(insertRes.acknowledged) return NextResponse.json({resultMsg:'성공'},{status:200})
            else NextResponse.json({errMsg:'일기 작성 실패'},{status:500})
        } else{
            //-- 작성한 일기가 있다는 뜻이니 추가만 하면 됨...
            if(json.update){//--해당 날짜를 수정해야함
                result = await db.collection('diary').updateOne(
                    {userid: session.user.userid},
                    {'$set': {'contents.$[i].content': json.content}},
                    {'arrayFilters': [{"i.date": json.date}]}
                )
            }else{
                result = await db.collection('diary').updateOne(
                    {userid: session.user.userid},
                    {'$push':{
                        contents: {date: json.date, content: json.content}
                    }}
                )
            }
            if(result.modifiedCount>0) return NextResponse.json({resultMsg:'성공'},{status:200})
            else NextResponse.json({errMsg:'일기 추가/수정 실패'},{status:500})
        }
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:'서버 에러'},{status:500})
    }
}