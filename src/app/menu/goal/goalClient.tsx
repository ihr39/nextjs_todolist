'use client'

import { useState } from "react"
import { InsertButton } from "../../../../util/button/buttonUtil"
import GoalDetail from "./goalDetail"
import ModalGoal from "./modalGoal"

export default function GoalClient(){
    const [detailOpen, setDetailOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    let onClose = () => setShowModal(false)

    return(
        <div className="p-10"  id="accordion-collapse" data-accordion="collapse">
            <div className=" flex mb-10">
                <h1 className="text-2xl">GOAL</h1>
            </div>
            <InsertButton props={()=>setShowModal(true)}/>
            <div id="accordion-collapse-heading-1" className="grid grid-cols-1">
                <button type="button" className="flex bg-blue-500 p-5 rounded-sm outline-1 outline-gray-300 bg-white hover:bg-gray-100" 
                    data-accordion-target="#accordion-collapse-body-1"
                    aria-expanded="true" aria-controls="accordion-collapse-body-1"
                    onClick={()=>setDetailOpen(!detailOpen)}
                >
                    <div className="text-left">
                        <p className="font-bold">🏆올해 책 10권 읽기</p>
                        <p className="text-sm text-gray-400">2021.06.34 ~ 2025.01.25</p>
                    </div>
                </button>
                <GoalDetail detailOpen={detailOpen}/>
            </div>
            <ModalGoal showModal={showModal} onClose={onClose}/>
        </div>
    )
}