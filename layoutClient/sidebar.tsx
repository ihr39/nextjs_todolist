'use client'

import Link from "next/link"

export default function SideBar(){
    return(
        <ul className="list-disc marker:text-gray-400">
            <li className="mt-3" onClick={()=>{
                location.href="/menu/todoList"
            }}>📋TODO</li>
            <li className="pt-5" onClick={()=>{
                location.href="/menu/diary"
            }}>📓일기</li>
            <li className="pt-5" onClick={()=>{
                location.href="/menu/goal"
            }}>🏆GOAL</li>
            <li className="pt-5"><Link href={'/menu/mypage'}>👤마이페이지</Link></li>
        </ul>
    )
}