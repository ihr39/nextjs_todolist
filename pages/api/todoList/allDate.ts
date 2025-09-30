import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { connectDB } from "../../../util/database";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AllDate(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'GET'){
        let session = await getServerSession(req, res, authOptions)
        let db = (await connectDB).db('todoList')
        try{
            if(session){   
                let result = await db.collection('todo').find({'userid': session.user.userid}, {projection:{'date':1, _id:0}}).sort({date: -1}).toArray()
                if(result) return res.status(200).json(result)
                else return res.status(200).json({returnMsg:'값이 없음'})
            } else return res.status(400).json({errMsg:'로그인 요구'})
        }catch(e){
            console.log(e)
            return res.status(500).json({errMsg:'조회 실패'})
        }
    }
}