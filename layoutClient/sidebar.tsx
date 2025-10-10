'use client'

import Link from "next/link"

export default function SideBar(){
    return(
        <ul className="list-disc marker:text-gray-400">
            <li className="mt-3"><Link href={'/menu/todoList'}>📋TODO</Link></li>
            <li className="pt-5"><Link href={'/menu/diary'}>📓일기</Link></li>
            <li className="pt-5"><Link href={'/menu/goal'}>🏆GOAL</Link></li>
            <li className="pt-5"><Link href={'/menu/routine'}>🔁루틴관리</Link></li>
            <li className="pt-5"><Link href={'/menu/mypage'}>👤마이페이지</Link></li>
        </ul>
    )
}