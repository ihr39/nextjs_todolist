'use client'

export default function SideBar(){
    return(
        <ul className="list-disc marker:text-sky-400">
            <li onClick={()=>{
                location.href="/menu/todoList"
            }}>TODO ✏️</li>
            <li className="pt-2">일기</li>
            <li className="pt-2">마이페이지</li>
        </ul>
    )
}