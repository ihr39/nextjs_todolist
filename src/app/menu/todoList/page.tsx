'use client'

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { todayClean } from "../../../../util/commonFunc"

export default function TodoList(){
    const [todoDetail, setTodoDetail] = useState<TodoDetailType[]>([]) //--체크여부와 데이터를 같이 관리 [{},{}]
    const [todoDateList, setTodoDateList] = useState([{date:''}])
    const [todoDate, setTodoDate] = useState(todayClean())

    //--오늘 todo가 없으면 추가
    let todayTodoAdd = ()=>{
        fetch('/api/todoList/today?date='+todayClean())
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            } else if(!r.result) return

            let copyList = [...todoDateList, {date: todayClean()}]
            setTodoDateList(copyList)
        })
    }

    let allTodoList = () => {
        fetch('/api/todoList')
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            setTodoDateList(r.result)
        })
    }

    useEffect(()=>{
        fetch('/api/todoList/detail?date='+todoDate)
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                console.log(r.errMsg)
                return
            }
            setTodoDetail(r.result)
        })
    },[todoDate])

    useEffect(()=>{
        todayTodoAdd()
        allTodoList()
    },[])

    let timeRef = useRef<NodeJS.Timeout | null>(null)
    let editTodoContent = (e:ChangeEvent<HTMLInputElement>, id: string, date: string) => {
        if(timeRef.current){
            clearTimeout(timeRef.current)
        }
        let newTimeId = setTimeout(()=>{
            fetch('/api/todoList/detail',{method:'PUT', body:JSON.stringify({content:e.target.value, id: id, date: date})})
            .then((r)=>r.json())
            .then((r)=>{
                console.log(r)
                if(r.errMsg){
                    alert(r.errMsg)
                    return
                }
            })
        },500)

        timeRef.current = newTimeId
    }

    let editTodoComplete = (e:ChangeEvent<HTMLInputElement>, id: string, date: string) => {
        if(timeRef.current){
            clearTimeout(timeRef.current)
        }
        let newTimeId = setTimeout(()=>{
            fetch('/api/todoList/detail',{method:'PUT', body:JSON.stringify({complete:e.target.checked, id: id, date: date})})
            .then((r)=>r.json())
            .then((r)=>{
                console.log(r)
                if(r.errMsg){
                    alert(r.errMsg)
                    return
                }
                setTodoDetail(details=>
                    details.map((a,i)=>{
                        if(a._id==id) return {...a, complete: e.target.checked}
                        return a
                    })
                )
                
            })
        },500)

        timeRef.current = newTimeId
    }

    return(
        <div className="flex">
            <div className="w-[25%] pl-15 pt-20 pb-5 text-left">
                <span className="text-lg font-bold">Todo-List</span>
                <ul className="list-disc marker:text-gray-700 mt-10">
                    {
                        todoDateList.map((a,i)=>(
                            <li key={i} className="mb-2" onClick={()=>{
                                setTodoDate(a.date)
                            }}>{a.date}</li>
                        ))
                    }
                </ul>
            </div>
            <div className="w-[85%] text-left p-5 place-items-center">
                <span className="text-lg font-bold">{todoDate.substring(0,4)+'년 '+todoDate.substring(4,6)+'월 '+todoDate.substring(6)+'일'}</span>
                <div className="w-[50%] mt-20 px-10 py-5 rounded-xl outline-1 outline-gray-400 bg-white">
                    <button type="button" className="mb-5 bg-gray-300 px-2 py-0.5 rounded-xl" 
                        onClick={(e)=>{
                            fetch('/api/todoList/detail?date='+todoDate,{
                                method: 'POST'
                            }).then((r)=>r.json())
                            .then((r)=>{
                                if(r.errMsg){
                                    alert(r.errMsg)
                                    return
                                }
                                let copyDetailList = [...todoDetail]
                                let addData = {
                                    _id: '', 
                                    userid:'',
                                    date: '',
                                    content: '', 
                                    complete: false
                                }
                                copyDetailList.push(addData)
                                setTodoDetail(copyDetailList)
                            })
                    }}>추가</button>
                    <fieldset className="space-y-3">
                        {
                            todoDetail.map((a,i)=>(
                                <div key={a._id} className="grid grid-cols-[1fr_24px] items-center gap-6">
                                    <label className="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-gray-100 dark:hover:bg-white/5">
                                        <input name="complete" className="peer size-3.5 appearance-none rounded-sm border border-gray-300 accent-pink-500 checked:appearance-auto dark:border-gray-600 dark:accent-pink-600" type="checkbox"
                                            defaultChecked={a.complete}
                                            onChange={(e)=>{
                                                editTodoComplete(e, a._id, a.date)
                                            }}
                                        />
                                        <input type="text" name="content" placeholder="할일을 작성하세요" className="content text-gray-700 select-none peer-checked:text-gray-400 peer-checked:line-through dark:text-gray-300" 
                                            defaultValue={ a.content ? a.content : ''}
                                            onChange={(e)=>{
                                                editTodoContent(e, a._id, a.date)
                                            }}
                                        />
                                    </label>
                                    <div className="size-[26px] rounded-md p-1 peer-has-checked:hidden hover:bg-red-50 hover:text-pink-500" 
                                        onClick={(e)=>{
                                            fetch('/api/todoList/detail?id='+a._id,{
                                                method: 'DELETE'
                                            }).then((r)=>r.json())
                                            .then((r)=>{
                                                if(r.errMsg){
                                                    alert(r.errMsg)
                                                    return
                                                }
                                                let copyDetailList = [...todoDetail]
                                                let cleanDetailList = copyDetailList.filter((detail)=>detail._id != a._id)
                                                setTodoDetail(cleanDetailList)
                                            })
                                        }}>
                                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" ></path>
                                        </svg>
                                    </div>
                                </div>
                            ))
                        }
                    </fieldset>
                </div>
            </div> 
        </div>
    )
}
