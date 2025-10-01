'use client'

import { CloseBtn } from "../../../../util/button/buttonUtil"

interface PassWord {changedPassword: string, currntPassword: string}
export default function ModalPassword({onShow, onClose}:{onShow: boolean, onClose: ()=>void}){
    if(!onShow) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="bg-white p-4 rounded-lg w-sm relative">
                <div className="flex justify-end">
                    <CloseBtn func={onClose}/>
                </div>
                <div className="mt-5">
                    <div className="">
                        <div>
                            <label>현재 비밀번호</label>
                            <input type="password" className='form-input' name="currntPassword"/>
                            <p className="errmsg" id="chckMsg"></p>
                        </div>

                        <div className="my-7 ">
                            <label>바꿀 비밀번호</label>
                            <input type="password" className="form-input" name="changedPassword"/>
                        </div>

                        <div className="">
                            <button type="button" className="default-btn dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e)=>{
                                    let param: PassWord= {changedPassword: '', currntPassword: ''}
                                    let chanedPasswordEle = document.querySelector('[name="changedPassword"]')
                                    let currentPasswordEle = document.querySelector('[name="currntPassword"]')

                                    if(!(chanedPasswordEle instanceof HTMLInputElement)) return
                                    if(!(currentPasswordEle instanceof HTMLInputElement)) return

                                    param.changedPassword = chanedPasswordEle.value
                                    param.currntPassword = currentPasswordEle.value
                                    fetch('/api/user/password',{
                                        method:'POST',
                                        body: JSON.stringify(param)
                                    }).then((r)=>r.json())
                                    .then((r)=>{
                                        if(r.errMsg){
                                            alert(r.errMsg)
                                            return
                                        }
                                        if(r.resultMsg == '0'){//--다를 때
                                            currentPasswordEle.className = 'error-input'
                                            let chckMsgEle = document.querySelector('#chckMsg')
                                            if(chckMsgEle instanceof HTMLElement){
                                                chckMsgEle.innerText = '비밀번호가 다릅니다.'
                                                chckMsgEle.className = 'errmsg'
                                                currentPasswordEle.focus()
                                                return
                                            }
                                        }
                                        alert('변경 성공')
                                        let closeEle = document.querySelector('#close')
                                        if(closeEle instanceof HTMLButtonElement) closeEle.click()
                                    })
                                }}  
                            >
                                변경
                            </button>
                            <button type="button" id="close" onClick={onClose}
                                className="light-btn dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            > 닫기 </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}