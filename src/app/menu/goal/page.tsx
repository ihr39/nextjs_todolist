import { getServerSession } from "next-auth";
import GoalClient from "./goalClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../util/database";

export default async function Goal(){
    let db = (await connectDB).db('todoList')
    let session = await getServerSession(authOptions)
    if(session == null) return null
    let result = await db.collection('goal').find({userid: session.user.userid}).toArray()
    let goalList:GoalOnlyIdType[] = result.map((a,i)=>(
        {
            _id: a._id.toString(),
            goal: a.goal,
            content: a.content,
            startDate: a.startDate,
            endDate: a.endDate
        }
    ))
    return(
        <div className="p-10"  id="accordion-collapse" data-accordion="collapse">
            <div className=" flex mb-10">
                <h1 className="text-2xl">GOAL</h1>
            </div>
            {goalList != null ? <GoalClient props={goalList}/>: ''}
        </div>
    )
}