import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../util/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method=='POST'){
        let result 
        let db = (await connectDB).db('todoList')
        let session = await getServerSession(req, res, authOptions)
        if(!session) return res.status(400).json({errMsg:'로그인하슈'})
        try{
            req.body = JSON.parse(req.body)
            //--아무 것도 없을 경우 추가
            let data = await db.collection('diary').findOne({userid: session.user.userid})
            if(!data){
                let insertRes = await db.collection('diary').insertOne({userid: session.user.userid, contents: [{date: req.body.date, content: req.body.content}]})
                if(insertRes.acknowledged) return res.status(200).json({resultMsg:'성공'})
                else res.status(500).json({errMsg:'일기 작성 실패'})
            } else{
                //-- 작성한 일기가 있다는 뜻이니 추가만 하면 됨...
                if(req.body.update){//--해당 날짜를 수정해야함
                    result = await db.collection('diary').updateOne(
                        {userid: session.user.userid},
                        {'$set': {'contents.$[i].content': req.body.content}},
                        {'arrayFilters': [{"i.date": req.body.date}]}
                    )
                }else{
                    result = await db.collection('diary').updateOne(
                        {userid: session.user.userid},
                        {'$push':{
                            contents: {date: req.body.date, content: req.body.content}
                        }}
                    )
                }
                if(result.modifiedCount>0) return res.status(200).json({resultMsg:'성공'})
                else res.status(500).json({errMsg:'일기 추가/수정 실패'})
            }
        }catch(e){
            console.log(e)
            return res.status(500).json({errMsg:'서버 에러'})
        }
    }
}