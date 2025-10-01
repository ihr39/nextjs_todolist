'use client'

import { useState } from "react"
import ModalDiary from "./modalDiary"
import { todayClean } from "../../../../util/commonFunc"

export default function DiaryClient({contents}:{contents: {date:string, content:string}[]}){
    const [modalOpen, setModalOpen] = useState(false) //--모달 show 여부
    const [contentList, setContentList] = useState(contents) //-- 해당 리스트에 값을 추가 하거나 수정
    const [diarys, setDiarys] = useState({date: todayClean(), content: ''}) //-- 날짜에 맞는 데이터를 넘기는 용도
    const [update, setUpdate] = useState(false) //-- 세이브 타입
    
    const handlerSaveDiary = (newContent: Diary) => {
        if(update){
            let updateList = contentList.map((item,i)=>{
                if(item.date == newContent.date){
                    return {...item, content: newContent.content}
                }
                return item
            })
            setContentList(updateList)
        }else{
            let copyContentList = [...contentList]
            copyContentList.push(newContent)
            setContentList(copyContentList)
        }
    }

    return(
        <div className="">
            <div className="mb-5 absolute top-33 right-10">
                <button type="button" className="light-btn" 
                    onClick={(e)=>{
                        setModalOpen(true)
                        setDiarys({date: todayClean(), content: ''})
                        setUpdate(false)
                    }}
                >추가</button>
            </div>
            <div className="grid grid-cols-4 gap-20">
                {
                    contentList ? contentList.map((a,i)=>(
                        <div key={a.date} className="py-5 px-6 rounded-xl outline-1 outline-gray-300 shadow-md bg-white" 
                            onClick={()=>{
                                setModalOpen(true)
                                setDiarys(a)
                                setUpdate(true)
                            }}
                        >
                            {a.date}
                            <div className="text-gray-500 text-[12px]">짧게라도 일기 내용보여주면 더 이쁠 듯?</div>
                        </div>
                    ))
                    : <div></div>
                }
            </div>
            <ModalDiary update={update} modalOpen={modalOpen} diarys={diarys} onClose={()=>setModalOpen(false)} onSave={handlerSaveDiary}/>
        </div>
    )
}
