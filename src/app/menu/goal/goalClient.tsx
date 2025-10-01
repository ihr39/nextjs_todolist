'use client'

import { useState } from "react"
import { InsertButton } from "../../../../util/button/buttonUtil"
import GoalDetail from "./goalDetail"
import ModalGoal from "./modalGoal"
import dayjs from 'dayjs'

export default function GoalClient({props}:{props:GoalOnlyIdType[]}){
    const [goalList, setGoalList] = useState(props)
    const [detailOpen, setDetailOpen] = useState<string|null>(null)
    const [showModal, setShowModal] = useState(false)
    let onClose = () => setShowModal(false)
    const handlerDetail = (_id: string) => {
        if(_id == detailOpen) setDetailOpen(null)
        else setDetailOpen(_id)
    }

    //--함수로 만들어서 보내는게 편하다
    let addGoalList = (data:GoalOnlyIdType) =>{
        let copyList = [...goalList]
        copyList.push(data)
        setGoalList(copyList)
    }

    
    return(
        <div className="">
            <InsertButton props={()=>setShowModal(true)}/>
            {
                goalList.map((a,i)=>(
                    <div id={"accordion-collapse-heading-"+a._id} className="grid grid-cols-1" key={a._id}>
                        <button type="button" className="flex bg-blue-500 p-5 rounded-sm outline-1 outline-gray-300 bg-white hover:bg-gray-100" 
                            data-accordion-target={"#accordion-collapse-body-"+a._id}
                            aria-expanded={detailOpen === a._id} aria-controls={"accordion-collapse-body-"+a._id}
                            onClick={()=>handlerDetail(a._id)}
                        >
                            <div className="text-left">
                                <p className="font-bold">🏆{a.goal}</p>
                                <p className="text-sm text-gray-400">
                                    {dayjs(a.startDate).format('YYYY-MM-DD')} ~ {dayjs(a.endDate).format('YYYY-MM-DD')}
                                </p>
                            </div>
                        </button>
                        <GoalDetail detailOpen={a._id===detailOpen} data={a}/>
                    </div>
                ))
            }
            <ModalGoal showModal={showModal} onClose={onClose} addGoalList={addGoalList}/>
        </div>
    )
}
