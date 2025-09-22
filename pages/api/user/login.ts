import { NextResponse } from "next/server";
import { connectDB } from "../../../util/database";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";

//--Response는 내가 아는 그 Response/ NextResponse는 middleware에서 사용 쿠키조작 redirect가능
export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'POST'){
        let db = (await connectDB).db('todoList') //--ts에서 mongo쓰려면 라이브러리 하나 더 다운 받아야함 (좀 귀찮네)
        //if(req.body != null) req.body = JSON.parse(req.body) //--자동으로 body 파싱 가능
        let userInfo = await db.collection('user').findOne({userid: req.body.userid})
        if(userInfo){
            let result: boolean = await bcrypt.compare(req.body.password, userInfo.password)
            if(result) return res.status(200).json(userInfo)
            else return res.status(400).json({result: '로그인 실패'})
        }else return res.status(400).json({result: '존재하지않는 회원'})
    }
}