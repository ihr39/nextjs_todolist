
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../../util/database";
import MyPageClient from "./mypageClient";
import { UserInfo } from "../../../../types/globalType";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function MyPage(){
    let session = await getServerSession(authOptions)
    let db = (await connectDB).db('todoList')
    let userInfo = await db.collection<UserInfo>('user').findOne({userid: session ? session.user.userid : ''},{projection:{_id:0, password:0}}) 
    
    if(!session) return <div>로그인하쇼</div>
    if(!userInfo) return <div>회원가입한 회원이 아닙니다</div>
    return(
        <div className="p-15 justify-items-center">
            <div className="w-[50%] bg-gray-100 p-10">
                <div className="text-[2rem] font-bold">내정보</div>
                <MyPageClient userInfo={userInfo}/>
            </div>
        </div>
    )
}