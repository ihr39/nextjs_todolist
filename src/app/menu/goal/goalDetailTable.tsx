'use client'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray } from "react-hook-form";
interface FormValues {
    detailList: GoalDetailType[];
}
export default function GoalDetailTable({goalId, detailOpen}:{goalId:string, detailOpen:boolean}){
    const [isLoading, setIsLoading] = useState(true)
    const { control, watch, setValue, getValues} = useForm<FormValues>({})

    const { fields, append, remove, replace } = useFieldArray<FormValues>({
        control,
        name: 'detailList'
    })

    useEffect(()=>{
        if(!detailOpen) return
        if(goalId == null){
            setIsLoading(false)
            replace([])
            return
        }
        let callDetailList = async () =>{
            try{
                const res = await fetch('/api/goal/'+goalId)
                const data = await res.json()
                replace(data.dataList)
            }catch(e){
                console.error('로딩실패',e)
            }finally{
                setIsLoading(false)
            }
        }

        callDetailList()
    },[goalId, replace, detailOpen])

    let addGoalDetailContent = useCallback(()=>{
        fetch('/api/goal/detail?goalId='+goalId,{method:'POST'})
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            append(r.result)
        })
    },[goalId])

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    let editDetailContent = (e: ChangeEvent<HTMLInputElement>,index: number) => {
        const value = e.target.value
        setValue(`detailList.${index}.detailContent`,value,{shouldDirty:true})

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        const newTimerId = setTimeout(()=>{
            //setValue를하고 watch를 하는게 좋다
            const editData = watch(`detailList.${index}`)
            fetch('/api/goal/detail',{method:'PUT', body:JSON.stringify(editData)})
            .then((r)=>r.json())
            .then((r)=>{
                if(r.errMsg){
                    alert(r.errMsg)
                    return
                }
            })
        },500)

        timerRef.current = newTimerId //-- 타이머 아이디
    }

    let editCompleteAt = (date: (Date|null), index: number) => {
        setValue(`detailList.${index}.completeAt`,date,{shouldDirty:true})

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        const newTimerId = setTimeout(()=>{
            const editData = watch(`detailList.${index}`)
            fetch('/api/goal/detail',{method:'PUT', body:JSON.stringify(editData)})
            .then((r)=>r.json())
            .then((r)=>{
                if(r.errMsg){
                    alert(r.errMsg)
                    return
                }
            })
        },500)

        timerRef.current = newTimerId //-- 타이머 아이디
    }
    
    
    useCallback(()=>{
        editDetailContent
        editCompleteAt
    },[])


    if(isLoading){
        return(
            <div 
                    className="
                        w-7 h-7 border-4 border-t-4 border-gray-200 
                        border-t-blue-500 rounded-full 
                        animate-spin 
                        mb-3
                    "
                    role="status"
                >
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
    let percent = Math.round((getValues('detailList').filter((data)=>data.completeAt).length/fields.length)*100)
    return(
        <div>
            <span className="text-lg font-bold">진행상황</span>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-5">
                <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: `${percent}%`}}>
                    {percent == 0 ? '' : percent+'%'}
                </div>
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
                    fields.map((data,i)=>{
                        const currentDetail = watch(`detailList.${i}`)
                        return(
                            <tr key={data.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {i+1}
                                </th>
                                <td className="px-6 py-4">
                                    <input type="hidden" name={`detailList.${i}._id`}  defaultValue={data._id}/>
                                    <input className="underlineInput peer pt-0 pb-0" name={`detailList.${i}.detailContent`} defaultValue={data.detailContent}
                                        onChange={(e)=>{
                                            editDetailContent(e,i)
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <Controller 
                                        control={control}
                                        name={`detailList.${i}.completeAt`}
                                        render={({field})=>(
                                            <DatePicker className="underlineInput pt-0 pb-0 text-center" selected={field.value ? new Date(field.value): null}
                                                onChange={(date: Date|null)=>{
                                                    field.onChange(date)
                                                    editCompleteAt(date, i)
                                                }}
                                                dateFormat="yyyy-MM-dd"
                                            />
                                        )}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button type="button" className="likeLinkBtn dark:text-blue-500" onClick={()=>{
                                        fetch('/api/goal/detail?id='+currentDetail._id,{method:'DELETE'})
                                        .then((r)=>r.json())
                                        .then((r)=>{
                                            if(r.errMsg){
                                                alert(r.errMsg)
                                                return
                                            }
                                            remove(i)
                                        })
                                    }}>삭제</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </div>
    )
}
