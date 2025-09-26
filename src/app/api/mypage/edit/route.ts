
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../util/database";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from 'next-auth'
import fs from 'fs/promises'
import path from "path";

//--nextjs의 최신기능을 모두 활용 가능
//--초기 로딩속도를 극적으로 개선
//--default를 안쓰는 이유는 POST,GET요청을 다른 파일인것처럼 취급하기 위해서임=>default 붙이면 이걸 한 파일로 취급해 사용자가 분리 해야함
export async function POST(req: NextRequest){ //--서버 컴포넌트를 활용해 애플리케이션 빌드
    let session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({errMsg: '로그인하세요'},{status: 400})
    let db = (await connectDB).db('todoList')
    const formData = await req.formData()
    const profile = formData.get('pofile') as File
    let editParam:{username: any, birth: any, profile?: string} = {
                    username: formData.get('username'), 
                    birth: formData.get('birth'),
                }
    try{
        if(profile){
            const arrayBuffer = await profile.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const folderPath = path.join(process.cwd(), 'public', 'uploads') 
            let filename = `${Date.now()}_${profile.name}`
            let filePath = path.join(folderPath,filename)
            
            await fs.mkdir(folderPath,{recursive: true})

            await fs.writeFile(filePath,buffer)
            editParam.profile = `/uploads/${filename}`
        }
        
        let result = await db.collection('user').updateOne({
            userid: session.user.userid},
            {'$set': editParam
        })
        if(result.modifiedCount>0) return NextResponse.json({returnMsg:'성공'},{status: 200})
        else return NextResponse.json({errMsg:'수정 실패'},{status: 500})
    }catch(e){
        console.log(e)
        return NextResponse.json({errMsg:e},{status: 500})
    }     
}