import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../../util/database";
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'POST'){
        req.body = JSON.parse(req.body)
        let session = await getServerSession(req, res, authOptions)
        let db = (await connectDB).db('todoList')
        if(!session) return res.status(400).json({errMsg:'로그인하세요'})
        try{
            let userInfo = await db.collection('user').findOne({userid:session.user.userid})
            if(!userInfo) return res.status(400).json({errMsg:'존재하지 않는 회원입니다.'})
            else if(userInfo.provider ?? '' != '') return res.status(400).json({errMsg: userInfo.provider+'로 가입한 회원입니다.'})
            else{
                let result = await bcrypt.compare(req.body.currntPassword, userInfo.password)
                if(!result) return res.status(200).json({resultMsg:'0'})
                else{
                    let changedPassword = await bcrypt.hash(req.body.changedPassword,15)
                    let result = await db.collection('user').updateOne({userid: session.user.userid},{'$set':{password: changedPassword}})
                    
                    if(result.modifiedCount>0) return res.status(200).json({resultMsg:'1'})
                    else res.status(500).json({errMsg:'수정 실패'})
                }
            }
        }catch(e){
            console.log(e)
            return res.status(500).json({errMsg:'서버 에러 문의 바람'})
        }
    }
}