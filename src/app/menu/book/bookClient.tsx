'use client'
import { useState } from "react";
import { InsertButton } from "../../../../util/button/buttonUtil";
import ModalBook from "./modalBook";

export default function BookClient(){
    const [modalOpen, setModalOpen] = useState(false)
    let modalClose = () => setModalOpen(false)
    return(
        <div>
            <InsertButton props={()=>setModalOpen(true)}/>
            <ModalBook modalOpen={modalOpen} modalClose={modalClose}/>
        </div>
    )
}