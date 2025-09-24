import Image from "next/image";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from 'next-auth'
import { connectDB } from "../../../../util/database";

export default async function MyPage(){
    let session = await getServerSession(authOptions)
    let db = (await connectDB).db('todoList')
    let userInfo = await db.collection('user').findOne({userid: session ? session.user.userid : ''})
    
    if(!session) return <div>로그인하쇼</div>
    if(!userInfo) return <div>회원가입한 회원이 아닙니다</div>
    return(
        <div className="p-15 justify-items-center">
            <div className="w-[50%] bg-gray-100 p-10">
                <div className="text-[2rem] font-bold">내정보</div>
                뭐가 필요하지 프로필 사진 있는 곳 잇으면 좋을듯? 그리고 비밀번호 변경, 이메일 인증, 뭐 일단 이렇게?..
                <div className="flex p-5 items-center">
                    <label htmlFor={"profile"} className="cursor-pointer mr-5">
                        <Image width={70} height={70} src={'/blank_profile.png'} alt="프로필사진"/>
                        <input id="profile" type="file" className="hidden" accept="image/jpg, image/png, image/jpeg"/>
                    </label>
                    <span className="text-[1rem]"><strong>{session.user.username}</strong>님</span>
                </div>
                <div>
                    <button type="button" className="default-btn">비밀번호변경</button>
                </div>
                <div className="">
                    <input className="form-input w-[80%] mr-5" defaultValue={session && session.user.email?session.user.email:''}/>
                    <button type="button" className="default-btn">인증</button>
                </div>
            </div>
        </div>
    )
}