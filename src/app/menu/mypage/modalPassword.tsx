'use client'

interface PassWord {changedPassword: string, currntPassword: string}
export default function ModalPassword({onShow, onClose}:{onShow: boolean, onClose: ()=>void}){
    if(!onShow) return null
    return(
        <div className="fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="bg-white p-4 rounded-lg w-sm relative">
                <div className="absolute right-1 top-1">
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
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