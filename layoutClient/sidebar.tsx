'use client'

export default function SideBar(){
    return(
        <ul className="list-disc marker:text-sky-400">
            <li onClick={()=>{
                location.href="/menu/todoList"
            }}>TODO ✏️</li>
            <li className="pt-2" onClick={()=>{
                location.href="/menu/diary"
            }}>일기</li>
            <li className="pt-2">마이페이지</li>
        </ul>
    )
}