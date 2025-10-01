'use client'

import { dateKoreaChange, todayClean } from "../../../../util/commonFunc"

export default function ModalDiary({update, modalOpen, diarys, onClose, onSave}:
    {update: boolean, modalOpen:boolean, diarys:Diary, onClose:()=>void, onSave: (content:Diary)=>void}){
    if(!modalOpen) return null
    else{
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="bg-white p-6 rounded-lg w-xl relative">
                        <input type="hidden" name="date" value={diarys.date}/>
                        <div className="flex justify-between py-4 px-0">
                            <label htmlFor="message" className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">{dateKoreaChange(diarys.date)} 일기</label>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal"
                                onClick={onClose}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>
                        <textarea id="message" name="content" rows={10} 
                            className="diary-area dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="오늘은 무슨일이 있었나요?"
                            defaultValue={diarys.content}
                        >
                        </textarea>
                        <div className="mt-3 right-0">
                            <button className="default-btn dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e)=>{
                                    let params:{date: string, content:string, update: boolean} ={date: '', content: '', update: update}
                                    let dateEle = document.querySelector('[name="date"]')
                                    let contentEle = document.querySelector('[name="content"]')
                                    if(dateEle instanceof HTMLInputElement) params.date = dateEle.value
                                    if(contentEle instanceof HTMLTextAreaElement) params.content = contentEle.value
                                    fetch('/api/diary', {method:'POST',
                                        body: JSON.stringify(params)
                                    }).then((r)=>r.json())
                                    .then((r)=>{
                                        if(r.errMsg){
                                            alert(r.errMsg)
                                            return
                                        }
                                        alert('작성완료')
                                        onSave({date: params.date, content: params.content})
                                        //let closeEle = document.querySelector('#close')
                                        //if(closeEle instanceof HTMLButtonElement) closeEle.click()
                                    })
                                    onSave({date: params.date, content: params.content})
                                }}
                            >작성</button>
                            <button type="button" id="close"
                                className="light-btn dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                onClick={onClose}
                            >
                            닫기</button>
                        </div>
                </div>
            </div>
        )
    }
}