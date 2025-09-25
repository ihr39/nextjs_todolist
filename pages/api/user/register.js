import { connectDB } from "../../../util/database"
import bcrypt from 'bcrypt'

export default async function handler(req, res){
    if(req.method == 'POST'){
        let db = (await connectDB).db('todoList')
        if(req.body.userid == '' || req.body.password == '' || req.body.username == '') return res.status(400).send('값이 없는 곳이 있어')
        let hash = await bcrypt.hash(req.body.password,15)
        let insertData = {
            userid: req.body.userid,
            password: hash,
            username: req.body.username,
            email: req.body.email,
            birth: req.body.year + req.body.month + req.body.date,
            profile: '',
            provider: ''
        }
        try{
            let result = await db.collection('user').insertOne(insertData)
            if(result.acknowledged)res.status(200).redirect('/login')
        }catch(e){
            console.log(e)
            return res.status(500).send('서버이상/ 가입실패')
        }
    }
}