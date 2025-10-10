'use client'
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from 'react';
import Loading from "@/app/loading";
import GoalDetailTable from "./goalDetailTable";

export default function GoalContent({detailOpen, data, changedGoal}:{detailOpen: boolean, data: ModalGoalType, changedGoal: (data?:ModalGoalType)=>void}){
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

    const {register, control, formState, handleSubmit} = useForm<ModalGoalType>({defaultValues: initialValues, resolver: yupResolver(schema)})
    const { isSubmitting } = formState;
    const onSubmit:SubmitHandler<ModalGoalType> = (formData) =>{
        formData._id = data._id
        fetch('/api/goal/edit',{
            method:'POST',
            body: JSON.stringify(formData)
        })
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            changedGoal(formData)
            setIsEditing(true)
        })
    }

    return(
        <div id={"accordion-collapse-body-"+data._id} className={detailOpen ? '':'hidden'} aria-labelledby={"accordion-collapse-heading-"+data._id}>
            <div className="py-4 px-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 relative">
                {isSubmitting&&<Loading/>}
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
                <GoalDetailTable key={data._id} goalId={typeof data._id === 'undefined'? '' : data._id} detailOpen={detailOpen}/>
            </div>
        </div>
    )
}