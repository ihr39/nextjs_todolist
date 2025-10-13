'use client'
import { useState } from "react";
import { CloseBtn, ModalBtnGroup } from "../../../../util/button/buttonUtil";
import { SubmitHandler, useForm } from "react-hook-form"

const weekly = ['일','월','화','수','목','금','토']
export default function ModalRoutine({modalOpen, modalClose, addRoutineList}
    :{modalOpen:boolean, modalClose:()=>void, addRoutineList:(data:RoutineType)=>void}){

    const [selectedDate, setSeletedDate] = useState(weekly.map((_,i)=> i === (new Date().getDay())))
    const { register, handleSubmit, watch, formState: { errors },}
    = useForm<RoutineType>({
        defaultValues:{
            routine: ""
        }
    })
    const toggleDate = (index:number)=>{
        let copyList = [...selectedDate]
        copyList[index] = !copyList[index]
        setSeletedDate(copyList)
    }

    const seletedAll = () => {
        setSeletedDate(weekly.map((_,i)=>true))
    }

    const seletedWeekDays = () => {
        setSeletedDate(weekly.map((_,i)=>{
            if(i==0 || i == 6) return false
            else return true
            }
        ))
    }
    const onSubmit: SubmitHandler<RoutineType> = (data) => {
        data.routine_date = selectedDate
        fetch('/api/routine',{
            method:'POST',
            body: JSON.stringify(data)
        })
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            data._id = r.addId
            modalClose()
            addRoutineList(data)
        })
    }
    if(!modalOpen) return null
    return(
        <div>
            <div className="fixed inset-0 flex justify-center items-center ">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="w-xl relative">
                    <div className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between">
                            <span className="text-xl font-bold text-gray-600">루틴 추가하기</span>
                            <CloseBtn func={modalClose}/>
                        </div>
                        <div className="mt-5">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">루틴이름</label>
                                    <input className="form-input" {...register("routine", {required: true})} placeholder="물2L 마시기"/>
                                    {errors.routine && <span className="errmsg">루틴을 입력하세요</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">반복 요일 설정</label>
                                    <div className="flex justify-between items-center mb-3">
                                        {weekly.map((a,i)=>(
                                            <button key={i} type="button" className={`
                                                circleBtn transition 
                                                ${selectedDate[i]? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'} 
                                                ${i===0 && 'text-red-500'}
                                                ${i===6 && 'text-sky-600'}
                                            `}
                                                onClick={()=>toggleDate(i)}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                    <div>
                                        <button type="button" className="squareBtn" onClick={seletedAll}>매일</button>
                                        <button type="button" className="squareBtn ml-2" onClick={seletedWeekDays}>주중(월~금)</button>
                                    </div>
                                </div>
                                
                                <ModalBtnGroup text={"저장"} closeFun={modalClose}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}