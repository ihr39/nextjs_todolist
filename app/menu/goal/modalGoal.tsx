'use client'

import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { CloseBtn, ModalBtnGroup } from "../../../util/button/buttonUtil"
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import Loading from "app/loading";

export default function ModalGoal({showModal, onClose, addGoalList}
    :{
        showModal:boolean,
        onClose: ()=>void,
        addGoalList:(data: ModalGoalType)=>void
    }
){
    const initialValues = { //-- 초기화 시킬 값
        startDate: new Date(),
        endDate: new Date(),
        goal: '',
        content: ''
    };
    const schema = yup.object({
        startDate: yup.date().required('시작일을 입력하세요'),
        endDate: yup.date().required('종료일을 입력하세요'),
        goal: yup.string().required('목표를 입력하세요'),
        content: yup.string().required('목표 설명을 입력하세요'),
    })

    const {register, handleSubmit, control, reset, formState, formState: { errors },} 
        = useForm<ModalGoalType>({
            defaultValues: initialValues,
            resolver: yupResolver(schema)
        })
    const { isSubmitting } = formState;
    const onSubmit: SubmitHandler<ModalGoalType> = async (data) =>{
        await new Promise(resolve => setTimeout(resolve, 1000));
        //console.log(data)
        fetch('/api/goal/add',{
            method:'POST',
            body: JSON.stringify(data)
        }).then((r)=>r.json())
        .then((r)=>{
            console.log(r)
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            let addValue:ModalGoalType = {
                _id: r.returnMsg,
                goal: data.goal,
                content: data.content,
                startDate: data.startDate,
                endDate: data.endDate
            }
            addGoalList(addValue)
            alert('저장했습니다!')
            handlerClose()
        })
    }

    const handlerClose = ()=>{
        reset(initialValues)
        onClose()
    }

    if(!showModal) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center ">
            {isSubmitting&&<Loading/>}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="w-xl relative">
                <div className="flex justify-between bg-gray-200 p-4 rounded-t-lg">
                    <div className="flex justify-start">
                        <p className="text-xl font-bold">목표설정</p>
                    </div>
                    <div className="flex justify-end">
                        <CloseBtn func={handlerClose}/>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-b-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex">
                            <div className="flex w-[50%] justify-start">
                                <label className="text-sm/6 font-bold text-gray-900">시작일자</label>
                            </div>
                            <div className="flex w-[50%] justify-start">
                                <label className="text-sm/6 font-bold text-gray-900">종료일자</label>
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className="flex">
                                <div className="flex w-[50%] justify-start">
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={
                                            ({field}) => (
                                                <DatePicker className="underlineInput pt-0 pb-0"
                                                    selected={field.value} dateFormat="yyyy-MM-dd"
                                                    onChange={(date: Date | null) => field.onChange(date)}
                                                />
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex w-[50%] justify-start">
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={
                                            ({field})=>(
                                                <DatePicker className="underlineInput pt-0 pb-0"
                                                    selected={field.value} dateFormat="yyyy-MM-dd"
                                                    onChange={(date: Date | null) => field.onChange(date)}
                                                />
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex w-[50%] justify-start">
                                    {errors.startDate &&<p className="errmsg">{errors.startDate.message}</p>}
                                </div>
                                <div className="flex w-[50%] justify-start">
                                    {errors.endDate &&<p className="errmsg">{errors.endDate.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="text-sm font-bold text-gray-900">🏆목표</label>
                            <input {...register("goal")} className="underlineInput peer pt-0 pb-0" placeholder="달성할 목표를 입력하세요"/>
                            {errors.goal &&<p className="errmsg">{errors.goal.message}</p>}
                        </div>
                        <div className="">
                            <label className="text-sm font-bold text-gray-900">목표설명</label>
                            <input {...register("content")} className="underlineInput peer pt-0 pb-0" placeholder="목표를 설명해보세요"/>
                            {errors.content &&<p className="errmsg">{errors.content.message}</p>}
                        </div>
                        <ModalBtnGroup text={"저장"} closeFun={handlerClose}/>
                    </form>
                </div>
            </div>
        </div>
    )
}