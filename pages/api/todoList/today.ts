import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'GET'){
        let result;
        let session = await getServerSession(req, res, authOptions)
        
        let db = (await connectDB).db('todoList')
        if(session == null) return
        else{
            try{
                result = await db.collection('todo').findOne({userid: typeof session.user != 'undefined' ? session.user.userid: '' , date: req.query.today})
                if(result) return res.status(200).json(result)
                else{
                    let insertParam = {
                        userid: typeof session.user != 'undefined' ? session.user.userid: '', 
                        date: req.query.today, 
                        todos: [{content:"", complete:false}], 
                    }
                    let data = await db.collection('todo').insertOne(insertParam)
                    if(data.acknowledged){
                        let newResult = await db.collection('todo').findOne({userid: typeof session.user != 'undefined' ? session.user.userid: '', date: req.query.today})
                        if(result) return res.status(400).json({errMsg: '저장된 값 찾을 수 없음/ 저장실패'})
                        else return res.status(200).json(newResult)
                    }else return res.status(400).json({errMsg: '저장실패'})
                }
            }catch(e){
                console.log(e)
                res.status(500).json({errMsg: '서버에러'})
            }
        }
    }
}