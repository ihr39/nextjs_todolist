import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { today } from "../../../../util/commonFunc";
import { connectDB } from "../../../../util/database";
import DiaryClient from "./diaryClient";
import { getServerSession } from 'next-auth'

export default async function Diary(){
    let session = await getServerSession(authOptions)
    let db = (await connectDB).db('todoList')
    let result
    if(!session) null;
    else{
        result = await db.collection('diary').findOne({userid: session.user.userid})
    }

    return(
        <div className="p-10">
            <div className=" flex mb-10">
                <h1 className="text-2xl">DIARY</h1>
            </div>
            
            <DiaryClient contents={result && result ? result.contents : ''} />
        </div>
    )
}