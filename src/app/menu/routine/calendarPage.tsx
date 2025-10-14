'use client'

import { useState } from "react";
import { Plus } from 'lucide-react'; 
import 'react-calendar/dist/Calendar.css'
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
import ModalRoutine from "./modalRoutine";
import { onlyDateCompare, transDate } from "../../../../util/commonFunc";
const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false
});

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function CalendarPage({data}:{data:RoutineType[]}){
    const [routineList, setRoutineList] = useState(data)
    const [date, onChange] = useState<Value>(new Date());
    const [modalOpen,setModalOpen] = useState(false)
    const [clickedRoutine, setClickedRoutine] = useState<RoutineType>()
    let selectedDay = date != null ? ((date instanceof Date) ? date.getDay() : null) : null //--선택한 날짜 요일
    let selectedDate = date instanceof Date ? dayjs(date).format('YYYY-MM-DD') : '' //--선택날짜
    const modalClose = () => setModalOpen(false)

    let toggleRoutine = (id: string) => {
        let copyList = [...routineList]
        let changedList = copyList.map((a,i)=> {
            if(a._id == id) return {...a, completeHistory: {[selectedDate]: !a.completeHistory[selectedDate]}}
            else return a
        })
        setRoutineList(changedList)
    }

    let editRoutine = (data: RoutineType) => {
        if(!(selectedDate == new Date().toISOString().split('T')[0])) return
        fetch('/api/routine',{
            method:'PUT',
            body: JSON.stringify({...data, completeHistory: {...data.completeHistory , [selectedDate]: !data.completeHistory[selectedDate]}})
        })
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            toggleRoutine(data._id)
        })
    }

    let addRoutineList = async (data:RoutineType) => {
        let copyList = [...routineList]
        copyList.push(data)
        setRoutineList(copyList)
    }

    let editRoutineList = (data:RoutineType) => {
        setRoutineList(routineList => routineList.map((item,index)=>{
            if(item._id == data._id) return data
            else return item
        }))
    }

    let handeModal = (data?: RoutineType) => {
        setClickedRoutine(data)
        setModalOpen(true)
    }

    let deleteRoutineList = (id: string) => {
        setRoutineList(routine => routine.filter((data)=>data._id !=id))
    }

    return(
        <div>
            <div className="flex justify-center p-6 bg-gray-50"> 
                <Calendar calendarType="gregory" defaultValue={date} onChange={onChange} 
                    formatDay ={(locale, date) => dayjs(date).format('DD')}
                    tileContent={({date, view})=>{
                        if(view !== 'month') return null
                        if(routineList.filter(item=>item.createAt && onlyDateCompare(item.createAt)>onlyDateCompare(date)).length>0) return null
                        let checkedRoutine = routineList.filter(item => item.completeHistory[transDate(date)]).length
                        let totalRoutine = routineList.filter(item=> item.routine_date[date.getDay()]).length
                        if(totalRoutine <= 0) return null
                        let completeRate = (checkedRoutine/totalRoutine)
                        return <div className={`circleMaker ${completeRate == 1 ? 'complete': (completeRate > 0)? 'progress': ''}`}></div>
                    }}
                />
            </div>
            <div className="mx-auto py-4 pl-6 border-b border-gray-200 mb-5">
                <div className="flex items-center ">
                    <span className="text-xl font-bold text-gray-600">
                        오늘의 루틴
                    </span>
                    <button type="button" className="ml-5 p-2 rounded-lg 
                    text-indigo-500 hover:shadow-sm
                    hover:bg-indigo-200
                    transition duration-150 bg-indigo-100" onClick={()=>handeModal()}>
                        <Plus size={20} strokeWidth={2.5}/>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {
                    routineList.length == 0 ? <p>하루 루틴을 생성하세요!</p>
                    :
                    routineList.map((item,index)=>(
                        selectedDay !== null && item.routine_date[selectedDay] && 
                        (data[0].createAt !==null && date instanceof Date && onlyDateCompare(data[0].createAt)<=onlyDateCompare(date)) &&
                        (
                            <div key={item._id} className="mb-3 flex justify-between rounded-md p-10 bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                                onClick={()=>handeModal(item)}
                            >
                                <p className={`flex-1 text-lg font-semibold ${item.completeHistory[selectedDate]? 'line-through text-gray-500':'text-gray-800'}`}>
                                    {item.routine}
                                </p>
                                <input type="checkbox" checked={item.completeHistory[selectedDate] || false} 
                                    onChange={()=>editRoutine(item)} 
                                    onClick={(e)=>e.stopPropagation()}
                                    disabled={!(selectedDate == new Date().toISOString().split('T')[0])}
                                    className="w-6 h-6 flex items-center justify-center rounded-full ml-4 flex-shrink-0"
                                />
                            </div>
                        )
                    ))
                }
            </div>
            <ModalRoutine modalOpen={modalOpen} modalClose={modalClose} editRoutineList={editRoutineList}
                addRoutineList={addRoutineList} clickedRoutine={clickedRoutine} deleteRoutineList={deleteRoutineList}
            />
        </div>
    )
}