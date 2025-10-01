'use client'
import dayjs from 'dayjs'
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from 'react';

export default function GoalDetail({detailOpen, data}:{detailOpen: boolean, data: GoalOnlyIdType}){
    const [idEditing, setIsEditing] = useState(true)

    const initialValues = { //-- 초기화 시킬 값
        startDate: data.startDate,
        endDate: data.endDate,
        goal: data.goal,
        content: data.content
    };

    const schema = yup.object({
        startDate: yup.date().required('시작일을 입력하세요'),
        endDate: yup.date().required('종료일을 입력하세요'),
        goal: yup.string().required('목표를 입력하세요'),
        content: yup.string().required('목표 설명을 입력하세요'),
    })

    const {register, control, handleSubmit} = useForm<ModalGoalType>({defaultValues: initialValues, resolver: yupResolver(schema)})
    const onSubmit:SubmitHandler<ModalGoalType> = (data) =>{
        console.log(data)
        fetch('/api/goal/edit',{
            method:'POST',
            body: JSON.stringify(data)
        })
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            setIsEditing(true)
        })
    }

    return(
        <div id={"accordion-collapse-body-"+data._id} className={detailOpen ? '':'hidden'} aria-labelledby={"accordion-collapse-heading-"+data._id}>
            <div className="py-4 px-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-end">
                        <button type="button" className="light-btn p-2 rounded-sm" onClick={()=>setIsEditing(false)}>수정</button>
                        <button type="submit" className="light-btn p-2 rounded-sm">저장</button>
                    </div>
                    <div>
                        <div className="flex justify-center mb-5">
                            <input className='text-xl font-bold text-center nodisabledInput w-[auto]' {...register("goal")} disabled={idEditing}/>
                        </div>
                        <div className="mb-5">
                            <span className="text-lg font-bold">기간:</span>
                            <div className='flex mt-2'>
                                <div className=''>
                                    <label>시작일: </label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({field})=>(
                                            <DatePicker selected={field.value} dateFormat="yyyy-MM-dd" disabled={idEditing} className='text-sm nodisabledInput'
                                                onChange={(date: Date | null) => field.onChange(date)}
                                            />
                                        )}
                                    /> 
                                </div>
                                <div className=''>
                                    <label>종료일: </label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({field})=>(
                                            <DatePicker selected={field.value} dateFormat="yyyy-MM-dd" disabled={idEditing} className='text-sm nodisabledInput'
                                                onChange={(date: Date | null) => field.onChange(date)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <span className="text-lg font-bold">목표설명:</span>
                            <div><input type="text" {...register("content")} className='text-sm nodisabledInput w-full mt-2' disabled={idEditing} /></div>
                        </div>
                    </div>
                </form>
                <div>
                    <span className="text-lg font-bold">진행상황</span>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-5">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '45%'}}> 45%</div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="likeLinkBtn dark:text-blue-500">추가</button>
                    </div>
                    <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-[5%]">Num</th>
                                <th scope="col" className="px-6 py-3 w-[75%]"> 내용</th>      
                                <th scope="col" className="px-6 py-3 w-[10%]">완료</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function TableRow(){
    return(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                1
            </th>
            <td className="px-6 py-4">
                <input name="content" className="underlineInput peer pt-0 pb-0"/>
            </td>
            <td className="px-6 py-4">
                <input type="checkbox" name="complete"/>
            </td>
            <td className="px-6 py-4 text-right">
                <button type="button" className="likeLinkBtn dark:text-blue-500 ">삭제</button>
            </td>
        </tr>
    )
}