'use client'
import { useRef, useState } from "react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';

export default function ModalGoal({showModal, onClose}:{showModal:boolean, onClose: ()=>void}){
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    if(!showModal) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="bg-white p-4 rounded-lg w-xl relative">
                <div className="">
                    <div className="flex">
                        <div className="flex w-[50%] justify-start">
                            <label className="text-sm/6 font-bold text-gray-900">시작일자</label>
                        </div>
                        <div className="flex w-[50%] justify-start">
                            <label className="text-sm/6 font-bold text-gray-900">종료일자</label>
                        </div>
                    </div>
                    <div className="flex mb-5">
                        <div className="flex w-[50%] justify-start">
                            <DatePicker className="form-input" name="startDate"
                                selected={selectedDate} dateFormat="yyyy-MM-dd"
                                onChange={(date: Date | null) => setSelectedDate(date)}
                            />
                        </div>
                        <div className="flex w-[50%] justify-start">
                            <DatePicker className="form-input" name="endDate"
                                selected={selectedDate} dateFormat="yyyy-MM-dd"
                                onChange={(date: Date | null) => setSelectedDate(date)}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="text-sm font-bold text-gray-900">🏆목표</label>
                        <input name="mainGoal" className="underlineInput peer pt-0 pb-0"/>
                    </div>
                    <div className="">
                        <label className="text-sm font-bold text-gray-900">목표설명</label>
                        <input name="goalContent" className="underlineInput peer pt-0 pb-0"/>
                    </div>
                    <div className="mt-10 flex justify-end">
                        <button type="button" className="default-btn dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            저장
                        </button>
                        <button type="button" id="close" onClick={onClose}
                            className="light-btn dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        > 닫기 </button>
                    </div>
                </div>
            </div>
        </div>
    )
}