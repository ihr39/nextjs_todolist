import { NextResponse } from "next/server";
import { connectDB } from "../../../util/database";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";

//--Response는 내가 아는 그 Response/ NextResponse는 middleware에서 사용 쿠키조작 redirect가능
export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method == 'POST'){
        let db = (await connectDB).db('todoList') //--ts에서 mongo쓰려면 라이브러리 하나 더 다운 받아야함 (좀 귀찮네)
        //bcrypt.compare(req.body.password)
        if(req.body != null) req.body = JSON.parse(req.body)
        let result = await db.collection('user').findOne({userid: req.body.userid})
        if(result){
            bcrypt.compare(req.body.password, result.password)
        }else return res.status(400).send('존재하지않는 회원')
    }
}