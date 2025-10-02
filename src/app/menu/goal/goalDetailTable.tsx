'use client'
import { useState } from "react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { date } from "yup";

export default function GoalDetailTable({goalId, goalDetailList}:{goalId:string, goalDetailList: GoalDetailType[]}){
    const [detailList, setDetailList] = useState(goalDetailList)

    const { control, watch, register, setValue} = useForm({
        defaultValues:{
            detailList: goalDetailList
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'detailList'
    })

    const watchedDetail = watch('detailList')

    let addGoalDetailContent = () => {
        fetch('/api/goal/detail?goalId='+goalId,{method:'POST'})
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            if(r.errMsg){
                alert(r.errMsg)
                return
            }

        })
    }
    return(
        <div>
            <span className="text-lg font-bold">진행상황</span>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-5">
                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '45%'}}> 45%</div>
            </div>
            <div className="flex justify-end">
                <button type="button" className="likeLinkBtn dark:text-blue-500" onClick={addGoalDetailContent}>추가</button>
            </div>
            <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 w-[5%]">Num</th>
                        <th scope="col" className="px-6 py-3 w-[70%]"> 내용</th>            
                        <th scope="col" className="px-6 py-3 w-[15%]">완료날짜</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
            <tbody>
                {
                    fields.map((data,i)=>(
                        
                        <tr key={data.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {i+1}
                            </th>
                            <td className="px-6 py-4">
                                <input className="underlineInput peer pt-0 pb-0" name={`detailList.${i}.detailContent`} defaultValue={data.detailContent}/>
                            </td>
                            <td className="px-6 py-4">
                                <Controller 
                                    control={control}
                                    name={`detailList.${i}.completeAt`}
                                    render={({field})=>(
                                        <DatePicker className="underlineInput pt-0 pb-0" selected={field.value ? new Date(field.value): null}
                                            onChange={(date: Date|null)=>field.onChange(date)}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    )}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button type="button" className="likeLinkBtn dark:text-blue-500">삭제</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
    )
}
