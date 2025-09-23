'use client'

import { useEffect, useState } from "react"

interface todoState{
    id: number, content: string, complete: boolean
}
type DateType = (string|number|Date)

export default function TodoList(){
    const [contentChck, setContentChck] = useState([{id:0,content:'',complete:false}]) //--체크여부와 데이터를 같이 관리 [{},{}]
    const [todoDateList, setTodoDateList] = useState([{date:''}])
    const [todoDate, setTodoDate] = useState(todayClean())

    let copyContentChck:todoState[] = [...contentChck]
    const addTodo = ()=>{
        let lastId = copyContentChck[copyContentChck.length-1].id
        copyContentChck.push({id: lastId+1, content: '', complete: false})
        setContentChck(copyContentChck)
    }

    const deleteTodo = (i: number)=>{
        let filteredArr = copyContentChck.filter((a,index)=> index != i)
        copyContentChck = [...filteredArr]
        setContentChck(filteredArr)
    }

    useEffect(()=>{
        fetch('/api/todoList/allDate')
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            //console.log(r)
            setTodoDateList(r)
        })
    },[])

    useEffect(()=>{ 
        fetch('/api/todoList/today?today='+todoDate)
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            if(r.todos.length > 0){
                let obj = r.todos.map((a: todoState, i: number)=>({
                    id: i,
                    content: a.content,
                    complete: a.complete
                }))
                setContentChck(obj)
            }
            let element = document.querySelector('#todoId')
            if(element instanceof HTMLInputElement) element.value = r._id.toString()
        })
    }, [todoDate])
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
                <div className="w-[50%] mt-20 px-10 py-5 rounded-xl outline-1 outline-cyan-300">
                    <input type="hidden" id="todoId"/>
                    <button type="button" className="mb-5 bg-gray-300 px-2 py-0.5 rounded-xl" 
                        onClick={(e)=>{
                            addTodo()
                    }}>추가</button>
                    <fieldset className="space-y-3">
                        {
                            contentChck.map((a,i)=>(
                                <div key={a.id} className="grid grid-cols-[1fr_24px] items-center gap-6">
                                    <label className="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-gray-100 dark:hover:bg-white/5">
                                        <input name="complete" className="peer size-3.5 appearance-none rounded-sm border border-gray-300 accent-pink-500 checked:appearance-auto dark:border-gray-600 dark:accent-pink-600" type="checkbox"
                                            checked={a.complete}
                                            onChange={(e)=>{
                                                if(e.target instanceof HTMLInputElement){
                                                    copyContentChck[i].complete = e.target.checked
                                                    setContentChck(copyContentChck)
                                                    changeData(copyContentChck)
                                                }
                                            }}
                                        />
                                        <input type="text" name="content" placeholder="할일을 작성하세요" className="content text-gray-700 select-none peer-checked:text-gray-400 peer-checked:line-through dark:text-gray-300" 
                                            defaultValue={ a.content ? a.content : ''}
                                            onBlur={(e)=>{
                                                copyContentChck[i].content = e.target.value
                                                setContentChck(copyContentChck)
                                                changeData(copyContentChck)
                                            }}
                                        />
                                    </label>
                                    <div className="size-[26px] rounded-md p-1 peer-has-checked:hidden hover:bg-red-50 hover:text-pink-500" 
                                        onClick={(e)=>{
                                            deleteTodo(i)
                                            changeData(copyContentChck)
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

function today(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = (date.getDate()).toString()
    let today: string = year+'년'+ mon+'월'+ day+'일'
    return today
}

function todayClean(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = (date.getDate()).toString()
    let today: string = year+ mon+ day
    return today
}

function changeData(params: todoState[]){
    let element = document.querySelector('#todoId')
    if(element instanceof HTMLInputElement){
        let data = {
            todos: params,
            id: element.value
        }
        fetch('/api/todoList/add',{
            method: 'POST',
            body: JSON.stringify(data)
        }).then((r)=>r.json())
        .then((r)=>{
            console.log(r)
        })
    }    
}