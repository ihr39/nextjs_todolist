'use client'

import { useEffect } from "react"

//--유저한테 보여줄...내용도 없고 검색에 들어가야할 것도 아니니 그냥 클라이언트 컴포넌트로 만들었다
export default function Register(){
    useEffect(()=>{
        let year = new Date().getFullYear()
        let yearSeletor = document.querySelector('#year')
        let monthSeletor = document.querySelector('#month')
        let dateSeletor = document.querySelector('#date')
        
        for(var i=(year-30); i< (year-10); i++){
            var yearOption = document.createElement("option")
            yearOption.value= i.toString()
            yearOption.text= i.toString()
            yearSeletor?.appendChild(yearOption)
        }

        for(var i=1; i< 13; i++){
            var monthOption = document.createElement("option")
            if(i<10) monthOption.value = '0'+i.toString()
            else monthOption.value= i.toString()
            monthOption.text= i.toString()
            monthSeletor?.appendChild(monthOption)
        }

        for(var i=1; i< 32; i++){
            var dateOption = document.createElement("option")
            dateOption.value= i.toString()
            dateOption.text= i.toString()
            dateSeletor?.appendChild(dateOption)
        }
    },[])
    return(
        <div className="p-15 justify-items-center">
            <div className="text-[32px] mb-15">회원가입</div>
            <div className="w-[50%]">
                <form className="registerForm" action="/api/user/register" method="POST">
                    <div>
                        <label className="text-sm/6 font-medium text-gray-900">아이디</label>
                        <input type="text" name="userid" aria-label="아이디" className="w-full rounded-md px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm/6 font-medium text-gray-900">비밀번호</label>
                        <input type="password" name="password" aria-label="비밀번호" className="w-full rounded-md px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm/6 font-medium text-gray-900">이름</label>
                        <input type="text" name="username" aria-label="이름" className="w-full rounded-md px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm/6 font-medium text-gray-900">이메일</label>
                        <input type="email" name="email" className="w-full rounded-md px-3 py-1.5 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" />
                    </div>
                    <div className="mt-5">
                        <label className="text-sm/6 font-medium text-gray-900">생년월일</label>
                        <div className="w-full">
                            <select id="year" name="year" className="col-start-1 row-start-1 rounded-md py-0.5 p-1 text-gray-500 sm:text-sm/6">
                                <option value="">년</option>
                            </select>
                            <label className="text-sm/6  text-gray-900 p-2">/</label>
                            <select id="month" name="month" className="col-start-1 row-start-1 rounded-md py-0.5 p-1 text-gray-500 sm:text-sm/6">
                                <option value="">월</option>
                            </select>
                            <label className="text-sm/6  text-gray-900 p-2">/</label>
                            <select id="date" name="date" className="col-start-1 row-start-1 rounded-md py-0.5 p-1 text-gray-500 sm:text-sm/6">
                                <option value="">일</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button type="button" 
                            className="outline-1 -outline-offset-1 outline-sky-300 hover:bg-sky-300 hover:text-white py-2 px-3 rounded-full"
                            onClick={(e)=>{
                                let useridEle = document.querySelector('[name="userid"]')
                                let passwordEle = document.querySelector('[name="password"]')
                                let usernameEle = document.querySelector('[name="username"]')
                                let myForm = document.querySelector('.registerForm')

                                if(useridEle instanceof HTMLInputElement){
                                    let result = userInfoChk(useridEle)
                                    if(!result) return
                                } 
                                if(passwordEle instanceof HTMLInputElement){
                                    let result = userInfoChk(passwordEle)
                                    if(!result) return
                                }
                                if(usernameEle instanceof HTMLInputElement){
                                    let result = userInfoChk(usernameEle)
                                    if(!result) return
                                }
                                
                                if(myForm instanceof HTMLFormElement) myForm.submit()
                            }}
                        >가입하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function userInfoChk(Element: HTMLInputElement) :boolean{
    if(Element.value == ''){
        alert(Element.ariaLabel+'를 입력하세요')
        Element.focus()
        return false
    }
    return true
}