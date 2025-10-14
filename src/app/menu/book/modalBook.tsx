'use client'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { CloseBtn, ModalBtnGroup } from "../../../../util/button/buttonUtil"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";

export default function ModalBook({modalOpen, modalClose}:{modalOpen:boolean, modalClose:()=>void}){
    const schema = yup.object({
        startDate: yup.date().required('시작일을 선택하세요.'),
        endDate: yup.date().required('완독일을 선택하세요.'),
        title: yup.string().required('책 제목을 입력해주세요'),
        oneReview: yup.string().max(22).required('한줄평을 입력하세요.'),
        content: yup.string().required('감상을 입력해주세요.')
    })
    const {register, watch, handleSubmit, formState:{errors}, reset, control} = useForm<BookType>({
        resolver: yupResolver(schema)
    })
    
    let onSubmit:SubmitHandler<BookType> = (data) => {
        console.log(data)
        fetch('/api/book',{
            method:'POST',
            body: JSON.stringify(data)
        })
        .then((r)=>r.json())
        .then((r)=>{
            console.log(r)
        })
    }

    if(!modalOpen) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center ">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="w-[50%] relative">
                <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between mb-5">
                        <span className="flex text-xl font-bold text-gray-600">독서기록 작성</span>
                        <CloseBtn func={modalClose}/>
                    </div>
                    <div>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label className="text-sm font-bold text-gray-900">책 제목</label>
                                    <input className="underlineInput peer pt-0 pb-0" {...register('title',{required: true})}/>
                                    {errors.title && <span className="errmsg">{errors.title.message}</span>}
                                </div>
                                <div className="mt-5 flex justify-center">
                                    <div className="flex mr-5">
                                        <label className="text-sm font-bold text-gray-900 mr-5">시작일</label>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={
                                                ({field})=>(
                                                    <DatePicker selected={field.value} 
                                                        className="text-center underlineInput peer pt-0 pb-0" 
                                                        dateFormat="yyyy-MM-dd" 
                                                        onChange={(date:Date|null)=>field.onChange(date)}
                                                    />
                                                )
                                            }
                                        />
                                        {errors.startDate && <span className="errmsg">{errors.startDate.message}</span>}
                                    </div>
                                    <div className="flex">
                                        <label className="text-sm font-bold text-gray-900 mr-5">완독일</label>
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={
                                                ({field})=>(
                                                    <DatePicker selected={field.value} 
                                                        className="text-center underlineInput peer pt-0 pb-0" 
                                                        dateFormat="yyyy-MM-dd" 
                                                        onChange={(date:Date|null)=>field.onChange(date)}
                                                    />
                                                )
                                            }
                                        />
                                        {errors.endDate && <span className="errmsg">{errors.endDate.message}</span>}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label className="text-sm font-bold text-gray-900">한줄 평</label>
                                    <input className="underlineInput peer pt-0 pb-0" maxLength={22} {...register('oneReview',{required: true})}/>
                                    {errors.oneReview && <span className="errmsg">{errors.oneReview.message}</span>}
                                </div>
                                <div className="mt-5">
                                    <label className="text-sm font-bold text-gray-900">감상문</label>
                                    <textarea rows={10} {...register('content',{required: true})} className="w-full block border-2 border-gray-400 rounded-md focus:border-blue-600 focus:outline-none" style={{resize:'none'}}/>
                                    {errors.content && <span className="errmsg">{errors.content.message}</span>}
                                </div>
                                <ModalBtnGroup text="저장" closeFun={modalClose}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}