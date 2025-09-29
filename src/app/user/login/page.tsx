'use client'

import { signIn } from "next-auth/react"
import { KeyboardEvent, useEffect, useState } from "react"

//--유저가 입력한 값만....넣고 검색...필요없으니 클라이언트 컴포넌트로 해도될듯...
export default function Login(){
    //--이번에는..state써서
    const [userid, setUserId] = useState('')
    const [password, setPassword] = useState('')

    return(
        <div className="p-15 justify-items-center">
            <div className="text-[32px] mb-15">로그인</div>
            <div className="w-[30%]">
                <form className="registerForm" action="/api/user/login" method="POST">
                    <div>
                        <label className="text-sm/6 font-medium text-gray-900">아이디</label>
                        <input type="text" name="userid" aria-label="아이디" 
                            className="form-input" 
                            onKeyDown={(e)=>idEnter(e)}
                            onChange={()=>{
                                let useridEle = document.querySelector('[name="userid"]')
                                if(useridEle instanceof HTMLInputElement){
                                    setUserId(useridEle.value)
                                }
                            }}
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm/6 font-medium text-gray-900">비밀번호</label>
                        <input type="password" name="password" aria-label="비밀번호" 
                            className="form-input" 
                            onKeyDown={(e)=>passwordEnter(e)}
                            onChange={()=>{
                                let passwordEle = document.querySelector('[name="password"]')
                                if(passwordEle instanceof HTMLInputElement){
                                    setPassword(passwordEle.value)
                                }
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <button type="button" 
                            className="w-full bg-sky-300 rounded-md py-2 hover:bg-sky-500 hover:text-white"
                            onClick={async (e)=>{
                                if(userid == ''){
                                    alert('아이디를 입력하세요')
                                    return
                                }
                                else if(password == ''){
                                    alert('비밀번호를 입력하세요')
                                    return
                                }

                                await signIn('credentials',{ //--obj형태로 넘겨서 JSON.parse할 필요가 없음
                                    userid: userid,
                                    password: password,
                                    redirect: true,
                                    callbackUrl: '/'
                                })
                            }}
                        >로그인</button>
                    </div>
                    <div className="mt-4 text-gray-400 text-center ">
                        <span className="text-[12px]">OR</span>
                        <hr className="text-gray-300 mb-4"/>
                        <img src="../../../google_login.png" className="mb-2" onClick={() => signIn("google",{redirect:true, callbackUrl:'/'})}/>
                        <img src="../../../kakao_login_medium_wide.png" className="mb-2" onClick={() => signIn("kakao",{redirect:true, callbackUrl:'/'})}/>
                        <img src="../../../naver_login.png" className="h-10" onClick={() => signIn("naver",{redirect:true, callbackUrl:'/'})}/>
                    </div>
                </form>
            </div>
        </div>
    )
}

function idEnter(event: KeyboardEvent){
    let useridEle = document.querySelector('[name="userid"]')
    let passwordEle = document.querySelector('[name="password"]')
    if(event.key == 'Enter'){
        if(useridEle instanceof HTMLInputElement){
            if(useridEle.value == '') return
            else{
                if(passwordEle instanceof HTMLInputElement) passwordEle.focus()
            }
        }
    }
}

function passwordEnter(event: KeyboardEvent){
    let buttonEle = document.querySelector('button')
    if(event.key == 'Enter'){
        if(buttonEle instanceof HTMLButtonElement){
            buttonEle.click()
        }
    }
}