import { getServerSession } from "next-auth";
import { connectDB } from "../../../../util/database";
import CalendarPage from "./calendarPage";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Routine(){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return <div>로그인하세요</div>
    let array = await db.collection<RoutineType>('routine').find({userid:session.user.userid}).toArray()
    let result = array.map((data,index)=>{
        return {...data, _id: data._id.toString()}
    })
    return(
        <div className="p-10"  id="accordion-collapse" data-accordion="collapse">
            <div className="flex mb-5">
                <h1 className="text-2xl">루틴관리</h1>
            </div>
            <div>
                <CalendarPage data={result}/>
            </div>
        </div>
    )
}