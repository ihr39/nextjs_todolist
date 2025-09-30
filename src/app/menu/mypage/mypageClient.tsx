'use client'

import Image from "next/image";
import { FormInput, UserInfo } from "../../../../types/globalType";
import { useEffect, useState } from "react";
import ModalPassword from "./modalPassword";
import { useForm, SubmitHandler } from "react-hook-form"
import { formatMinSec } from "../../../../util/commonFunc";

export default function MyPageClient({userInfo}:{userInfo: UserInfo}){
    const [profile, setProfile] = useState(userInfo.profile? userInfo.profile:'/blank_profile.png')
    const [modal, setModal] = useState(false)
    const [timer, setTimer] = useState(180)
    const [timerActive, setTimerActive] = useState(false)

    useEffect(()=>{
        if(!timerActive || timer <= 0) return

        const timerId = setInterval(()=>{
            setTimer(restTime=>{
                let time = restTime- 1
                if(time <=0 ){
                    alert('시간이 만료됐습니다.')
                    clearInterval(timerId)
                    setTimerActive(false)
                    let hideEle = document.querySelector('#email-auth-div')
                    if(hideEle instanceof HTMLDivElement) hideEle.style.display = 'none'
                }
                return time
            })
        },1000)

        return ()=>clearInterval(timerId)
    },[timerActive, timer])

    const{
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        getValues,
    } = useForm<FormInput>({
        defaultValues: {
            email: userInfo.email
        }
    });

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

    let emailSend = async () =>{
        let isValid = await trigger('email')
        if(isValid){
            let email = getValues('email')
            fetch('/api/mail',{method:'POST',body: JSON.stringify({email: email})})
            .then((r)=>r.json())
            .then((r)=>{
                if(r.errMsg){
                    alert(r.errMsg)
                    return
                }
                let eadEele = document.querySelector('#email-auth-div')
                if(!(eadEele instanceof HTMLDivElement)) return;
                eadEele.style.display = 'block'
                let inputEle = eadEele.children.namedItem('authNum')
                if(inputEle instanceof HTMLInputElement) inputEle.focus()
                setTimer(180)
                setTimerActive(true)
            })
        }else{
            let emailEle = document.querySelector('[name="email"]')
            if(emailEle instanceof HTMLInputElement) emailEle.focus()
        }
    }  

    let onClose = () => setModal(false)
    
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
                        className="underlineInput ps-6 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 peer" 
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
                    <input className="form-input w-[80%] mr-5" 
                        {...register("email",{required: true})} name="email" defaultValue={userInfo.email}
                        disabled={userInfo.auth}
                    />
                    <button type="button" className="default-btn"
                        onClick={ ()=> emailSend() }
                    >인증</button>
                    { errors.email && <p className="errmsg">이메일은 필수 값입니다</p> }
                    <div id="email-auth-div" style={{display: 'none'}}>
                        <label className="mr-4">인증번호</label>
                        <input className="form-input w-[48%] mr-7" name="authNum"/>
                        <span className="mr-7">{formatMinSec(timer)}</span>
                        <button type="button" className="default-btn"
                            onClick={(e)=>{
                                let authEle = document.querySelector('[name="authNum"]')
                                let emailEle = document.querySelector('[name="email"]')
                                if(!(authEle instanceof HTMLInputElement)) return
                                else if(!(emailEle instanceof HTMLInputElement)) return

                                fetch('/api/mail/auth',{
                                    method:'POST',
                                    body: JSON.stringify({authNum: authEle.value, email: emailEle.value})
                                })
                                .then((r)=>r.json())
                                .then((r)=>{
                                    console.log(r)
                                    if(r.errMsg){
                                        alert(r.errMsg)
                                        return
                                    }
                                    alert('인증 성공했습니다.')
                                    let parentEle = authEle.parentElement
                                    if(parentEle instanceof HTMLDivElement) parentEle.style.display = 'none'
                                    authEle.disabled = true
                                    emailEle.disabled = true
                                })
                            }}
                        > 확인</button>
                    </div>
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
