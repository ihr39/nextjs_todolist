'use client'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { CloseBtn, ModalBtnGroup } from "../../../../util/button/buttonUtil"
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { Star } from "lucide-react";

let defaultData = {
    startDate: null,
    endDate: null,
    title: '',
    oneReview: '',
    content: '',
    score: 0
}

export default function ModalBook({modalOpen, modalClose, addBookList, editBookData, editBookList}
    :{modalOpen:boolean, modalClose:()=>void, addBookList:(data: BookType)=>void, editBookData: BookType|undefined, editBookList:(data: BookType)=>void
    }){
    
    const [score, setScore] = useState(0)
    const schema = yup.object({
        startDate: yup.date().required('시작일을 선택하세요.').nullable(),
        endDate: yup.date().required('완독일을 선택하세요.').nullable(),
        title: yup.string().required('책 제목을 입력해주세요'),
        oneReview: yup.string().max(22,'22자까지 입력가능합니다.').required('한줄평을 입력하세요.'),
        content: yup.string().required('감상을 작성해주세요.'),
        score: yup.number().notRequired().default(0)
    })
    const {register, watch, handleSubmit, formState:{errors}, reset, control, setFocus} = useForm<BookType>({
        resolver: yupResolver(schema)
    })

    useEffect(()=>{
        if(!modalOpen) return
        setFocus('title')
        if(typeof editBookData === 'undefined'){
            reset(defaultData)
            setScore(0)
        }
        else {
            reset(editBookData)
            editBookData.score && setScore(editBookData.score)
        }
    },[modalOpen])
    
    let onSubmit:SubmitHandler<BookType> = (data) => {
        let method = 'POST'
        if(editBookData){
            method='PUT'
            data._id = editBookData._id
        }
        data.score = score
        fetch('/api/book',{
            method: method,
            body: JSON.stringify(data)
        })
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            if(editBookData) editBookList(data)
            else{
                data._id = r.id
                addBookList(data)
            }
            modalClose()
        })
    }

    let handleClose = () => {
        reset(defaultData)
        modalClose()
    }

    if(!modalOpen) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center ">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="w-[50%] relative">
                <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between mb-5">
                        <span className="flex text-xl font-bold text-gray-600">독서기록 작성</span>
                        <CloseBtn func={handleClose}/>
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
                                <div className="mt-5 flex justify-between">
                                    <div className="w-[70%]">
                                        <label className="text-sm font-bold text-gray-900">한줄 평</label>
                                        <input className="underlineInput peer pt-0 pb-0" {...register('oneReview',{required: true, max: 22})}/>
                                        {errors.oneReview && <span className="errmsg">{errors.oneReview.message}</span>}
                                    </div>
                                    <div className="flex items-end ">
                                        {
                                            [...Array(5)].map((_,index)=>(
                                                <Star key={index} color={index+1 <= score? '#F59E0B':'gray'} strokeWidth={1} 
                                                    fill={index+1 <= score? '#F59E0B':'gray'}
                                                    onClick={()=>{
                                                        setScore(index+1)

                                                    }}
                                                />
                                            ))
                                        }
                                        <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {score}
                                        </span>
                                        <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">/</span>
                                        <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</span>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label className="text-sm font-bold text-gray-900">
                                        감상문
                                        {errors.content && <span className="errmsg">{errors.content.message}</span>}
                                    </label>
                                    <textarea rows={8} {...register('content',{required: true})} className="w-full block border-2 border-gray-400 rounded-md focus:border-blue-600 focus:outline-none" style={{resize:'none'}}/>
                                </div>
                                <ModalBtnGroup text="저장" closeFun={handleClose}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}