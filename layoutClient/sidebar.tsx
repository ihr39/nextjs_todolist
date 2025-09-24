'use client'

import Link from "next/link"

export default function SideBar(){
    return(
        <ul className="list-disc marker:text-sky-400">
            <li onClick={()=>{
                location.href="/menu/todoList"
            }}>TODO ✏️</li>
            <li className="pt-2" onClick={()=>{
                location.href="/menu/diary"
            }}>일기</li>
            <li className="pt-2"><Link href={'/menu/mypage'}>마이페이지</Link></li>
        </ul>
    )
}