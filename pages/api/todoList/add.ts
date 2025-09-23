import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../util/database";
import { authOptions } from "../auth/[...nextauth]";
import {getServerSession} from "next-auth"
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'POST'){
        let db = (await connectDB).db('todoList')
        let session = await getServerSession(req, res, authOptions)
        req.body = JSON.parse(req.body)
        if(session){
            if(typeof session.user != 'undefined'){
                let result = await db.collection('todo').updateOne(
                    {_id: new ObjectId(req.body.id)},
                    {$set:{"todos": req.body.todos}}
                )
                if(result.modifiedCount<=0) return res.status(500).json({errMsg: '수정실패'})
                else return res.status(200).json({returnMsg: '수정성공'})
            }else return res.status(500).json({errMsg: '없는 값을 읽으려고 함'})
        }else return res.status(400).json({errMsg: '로그인 먼저 하세요'})
    }
}