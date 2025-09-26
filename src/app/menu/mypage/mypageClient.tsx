'use client'

import Image from "next/image";
import { UserInfo } from "../../../../types/globalType";
import { useEffect, useState } from "react";
import ModalPassword from "./modalPassword";
import { useForm, SubmitHandler } from "react-hook-form"

type FormInput = {
    username: string,
    year: string,
    month: string,
    date: string,
    profile: File[],
    profileUrl: string
}

export default function MyPageClient({userInfo}:{userInfo: UserInfo}){
    const [profile, setProfile] = useState(userInfo.profile? userInfo.profile:'/blank_profile.png')
    const [modal, setModal] = useState(false)

    const{
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormInput>();

    const {onChange, ...rest} = register("profile") //--register("profile")가 반환하는 객체는 여러 속성이 존재=> 그중 onChange만 가져오고 나머지는 rest라는 객체에 담기게 함

    const handleFileChange = (e: { target: any; type?: any; })=>{
        let fileEle = e.target

        //--리엑트 훅의 온체이지 이벤트
        onChange(e)

        if(fileEle instanceof HTMLInputElement){
            if(fileEle.files != null){
                let file = fileEle.files[0]
                if(!file) setProfile('/blank_profile.png')
                else{
                    let fileUrl = URL.createObjectURL(file)
                    setProfile(fileUrl)
                }  
            }
        }
    }

    const onSubmit: SubmitHandler<FormInput> = async (data) =>{
        
        let file = data.profile[0]
        let formData = new FormData();
        formData.append('username',data.username)
        formData.append('birth', data.year+data.month+data.date)
        if(file) formData.append('pofile', data.profile[0])
        
        //console.log(formData)
        formData.append('profile',file)
        fetch('/api/mypage/edit',{
            method:'POST',
            body: formData
        }).then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            alert('수정완료')
        })
        
    }

    function onClose(){
        setModal(false)
    }

    useEffect(()=>{
        return()=>{ //--cleanup함수
            if(profile) URL.revokeObjectURL(profile)
        }
    },[profile])

    const currentYear = new Date().getFullYear()
    let year: number[] = Array.from({length: 31}, (_,i)=>(currentYear-30)+i)
    let month: number[] = Array.from({length: 12},(_,i)=>i+1)
    let date: number[] = Array.from({length: 31},(_,i)=>i+1)

    return(
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex p-5 items-center mb-10">
                    <label htmlFor={"profile"} className="cursor-pointer mr-5">
                        <Image width={70} height={70} src={profile} alt="프로필사진"/>
                        <input id="profile" {...register("profile")} type="file" className="hidden" accept="image/jpg, image/png, image/jpeg"
                            onChange={handleFileChange} {...rest}
                        />
                    </label>
                    <span className="text-[1rem]"><strong>ID :</strong> {userInfo.userid}</span>
                </div>
                <div className=" mb-10">
                    <label className=" bottom-2">이름: </label>
                    <input type="text" {...register("username", {required: true})} defaultValue={userInfo.username} 
                        aria-invalid={errors.username ? "true":'false'}
                        className="block py-2.5 ps-6 pe-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-700 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    />
                    {
                        errors.username?.type === 'required' && (<p role="alert" className="errmsg">이름은 필수 값입니다</p>) //--앞이 참이면 뒤를 return
                    }
                </div>
                <div className="mb-10">
                    <button type="button" className="default-btn" 
                        onClick={(e)=>{
                            if(userInfo.provider != ''){
                                alert(userInfo.provider+'로 로그인한 유저입니다.')
                                return
                            }
                            setModal(true)
                        }} 
                    >비밀번호변경</button>
                    <ModalPassword onShow={modal} onClose={onClose}/>
                </div>
                <div className="mb-10">
                    <input className="form-input w-[80%] mr-5" name="email" defaultValue={userInfo.email}/>
                    <button type="button" className="default-btn"
                        onClick={(e)=>{
                            let emialEle = document.querySelector('[name="email"]')
                            if(!(emialEle instanceof HTMLInputElement)) return
                            if(emialEle.value == ''){
                                alert('이메일을 입력하세요.')
                                emialEle.focus()
                                return
                            } 

                        }}
                    >인증</button>
                </div>
                <div className="mb-10">
                    <label className="">생년월일</label>
                    <div className="w-full">
                        <select id="year" {...register("year")} 
                            defaultValue={userInfo.birth.substring(0,4)}
                            className="col-start-1 row-start-1 rounded-md py-1 p-3 text-gray-500 sm:text-sm/6"
                        >
                            <option value="">년</option>
                            {
                                year.map((a,i)=>(
                                    <option key={i} value={a}>{a}</option>
                                ))
                            }
                        </select>
                        <label className="text-sm/6  text-gray-900 p-2">/</label>
                        <select id="month" {...register("month")} 
                            defaultValue={userInfo.birth.substring(4,6)}
                            className="col-start-1 row-start-1 rounded-md py-1 p-3 text-gray-500 sm:text-sm/6"
                        >
                            <option value="">월</option>
                            {
                                month.map((a,i)=>(
                                    <option key={i} value={a}>{a}</option>
                                ))
                            }
                        </select>
                        <label className="text-sm/6  text-gray-900 p-2">/</label>
                        <select id="date" {...register("date")}
                            defaultValue={userInfo.birth.substring(6,8)}
                            className="col-start-1 row-start-1 rounded-md py-1 p-3 text-gray-500 sm:text-sm/6"
                        >
                            <option value="">일</option>
                            {
                                date.map((a,i)=>(
                                    <option key={i} value={a}>{a}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="default-btn dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        저장
                    </button>
                </div>
            </form>
        </div>
    )
}

function emailAuth(email: string){
    
}