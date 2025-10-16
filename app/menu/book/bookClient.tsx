'use client'
import { useEffect, useState } from "react";
import { InsertButton } from "../../../util/button/buttonUtil";
import BookCard from "./bookCard";
import { Trash2Icon } from "lucide-react";
import ModalBook from "./modalBook";
import Loading from "@/app/loading";

export default function BookClient(){
    const [bookList, setBookList] = useState<BookType[]>([])
    const [editBookData, setEditBookData] = useState<BookType>()
    const [modalOpen, setModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    let modalClose = () => setModalOpen(false)

    useEffect(()=>{
        callBookList()
    },[])

    let addBookList = (data: BookType) => {
        let copyList = [...bookList]
        copyList.push(data)
        setBookList(copyList)
    }

    let callBookList = async () => {
        let res = await fetch('/api/book')
        if(!res.ok){
            throw new Error(`HTTP Error: ${res.status}`);
        }
        const data = await res.json()
        if(data.errMsg){
            alert(data.errMsg)
            return
        }
        setBookList(data.result)
        setIsLoading(false)
    }

    let deleteBook = (id: string) => {
        if(!confirm('정말 삭제하시겠습니까?')) return
        fetch('/api/book?id='+id,{method:'DELETE'})
        .then((r)=>r.json())
        .then((r)=>{
            if(r.errMsg){
                alert(r.errMsg)
                return
            }
            setBookList(list => list.filter((item)=> item._id != id))
        })
    }

    let editBookList = (data: BookType) => {
        setBookList(list => list.map((item)=> item._id == data._id ? data : item))
    }

    let handleModalOpen = (item?: BookType) => {
        setEditBookData(item)
        setModalOpen(true)
    }

    if(isLoading) return <Loading/>
    return(
        <div>
            <div>
                <InsertButton props={()=>handleModalOpen()}/>
                <ModalBook modalOpen={modalOpen} editBookData={editBookData} 
                    modalClose={modalClose} addBookList={addBookList} editBookList={editBookList}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {
                    bookList.map((item,index)=>(
                        <div className="flex bg-white p-5 border-1 border-gray-200 mb-2" key={item._id} onClick={()=>handleModalOpen(item)}>
                            <BookCard bookItem={item}/>
                            <div className="items-center flex">
                                <Trash2Icon size={28} className="transition-colors trashBtn" onClick={(e)=>{
                                    e.stopPropagation()
                                    deleteBook(item._id)
                                }}/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}