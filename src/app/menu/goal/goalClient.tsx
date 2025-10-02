'use client'

import { useState } from "react"
import { InsertButton } from "../../../../util/button/buttonUtil"
import ModalGoal from "./modalGoal"
import dayjs from 'dayjs'
import GoalContent from "./goalContent"

export default function GoalClient({props}:{props:ModalGoalType[]}){
    const [goalList, setGoalList] = useState(props)
    const [detailOpen, setDetailOpen] = useState<string|null>(null)
    const [showModal, setShowModal] = useState(false)
    let onClose = () => setShowModal(false)
    const handlerDetail = (_id: string) => {
        if(_id == detailOpen) setDetailOpen(null)
        else setDetailOpen(_id)
    }

    //--함수로 만들어서 보내는게 편하다
    let addGoalList = (data:ModalGoalType) =>{
        let copyList = [...goalList]
        copyList.push(data)
        setGoalList(copyList)
    }

    let changedGoal = (data?:ModalGoalType) =>{
        if(data == null || typeof data === 'undefined') return
        setGoalList(list=>
            list.map((a,i)=> a._id == data._id? data : a)
        )
    }

    function goalDelete(_id: string){
        fetch('/api/goal/delete?id='+_id,{method:'DELETE'})
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            alert('삭제완료')
            let deleteList =goalList.filter((goal)=> goal._id != _id)
            setGoalList(deleteList)
        })
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
                            onClick={()=>handlerDetail(typeof a._id === 'undefined'? '':a._id)}
                        >
                            <div className="text-left flex-grow">
                                <p className="font-bold">🏆{a.goal}</p>
                                <p className="text-sm text-gray-400">
                                    {dayjs(a.startDate).format('YYYY-MM-DD')} ~ {dayjs(a.endDate).format('YYYY-MM-DD')}
                                </p>
                            </div>
                        </button>
                        <div className="absolute right-13 flex-shrink-0 ml-4"
                            onClick={()=>goalDelete(typeof a._id === 'undefined'? '' : a._id)}
                        >
                            <span className="text-xs text-red-500 hover:text-red-700 hover:text-sm font-semibold">삭제</span>
                        </div>
                        <GoalContent detailOpen={a._id===detailOpen} data={a} changedGoal={changedGoal}/>
                    </div>
                ))
            }
            <ModalGoal showModal={showModal} onClose={onClose} addGoalList={addGoalList}/>
        </div>
    )
}