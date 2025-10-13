'use client'

import { useState } from "react";
import { Plus } from 'lucide-react'; 
import 'react-calendar/dist/Calendar.css'
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
import ModalRoutine from "./modalRoutine";
const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false
});

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function CalendarPage({data}:{data:RoutineType[]}){
    const [routineList, setRoutineList] = useState(data)
    const [value, onChange] = useState<Value>(new Date());
    const [modalOpen,setModalOpen] = useState(false)
    let today = value != null ? ((value instanceof Date) ? value.getDay() : null) : null
    let day = value instanceof Date ? dayjs(value).format('YYYY-MM-DD') : ''
    const modalClose = () => setModalOpen(false)

    let toggleRoutine = (id: string) => {
        let copyList = [...routineList]
        let changedList = copyList.map((a,i)=> {
            if(a._id == id) return {...a, [`item.completeHistory.${day}`]: !`item.completeHistory.${day}`}
            else return a
        })
        setRoutineList(changedList)
    }

    let editRoutine = (data: RoutineType) => {
        fetch('/api/routine',{
            method:'PUT',
            body: JSON.stringify({...data, [`item.completeHistory.${day}`]: !`item.completeHistory.${day}`})
        })
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            toggleRoutine(data._id)
        })
    }

    let addRoutineList = (data:RoutineType) => {
        let copyList = [...routineList]
        copyList.push(data)
        setRoutineList(copyList)
    }

    return(
        <div>
            <div className="flex justify-center p-6 bg-gray-50"> 
                <Calendar calendarType="gregory" defaultValue={value} onChange={onChange} formatDay ={(locale, date) => dayjs(date).format('DD')}/>
            </div>
            <div className="mx-auto py-4 pl-6 border-b border-gray-200 mb-5">
                <div className="flex items-center ">
                    <span className="text-xl font-bold text-gray-600">
                        오늘의 루틴
                    </span>
                    <button type="button" className="ml-5 p-2 rounded-lg 
                    text-indigo-500 hover:shadow-sm
                    hover:bg-indigo-200
                    transition duration-150 bg-indigo-100" onClick={()=>setModalOpen(true)}>
                        <Plus size={20} strokeWidth={2.5}/>
                    </button>
                </div>
            </div>
            {
                routineList.length == 0 ? <p>하루 루틴을 생성하세요!</p>
                :
                routineList.map((item,index)=>(
                    today !== null && item.routine_date[today] &&
                    (
                        <div key={item._id} className="mb-3 flex justify-between rounded-md p-10 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                            onClick={()=>editRoutine(item)}
                        >
                            <p className={`flex-1 text-lg font-semibold ${`item.completeHistory.${day}`? 'line-through text-gray-500':'text-gray-800'}`}>{item.routine}</p>
                            <input type="checkbox" checked={item.completeHistory[day] || false} onChange={(e)=>e.preventDefault()} className="w-6 h-6 flex items-center justify-center rounded-full ml-4 flex-shrink-0"/>
                        </div>
                    )
                ))
            }
            <ModalRoutine modalOpen={modalOpen} modalClose={modalClose} addRoutineList={addRoutineList}/>
        </div>
    )
}