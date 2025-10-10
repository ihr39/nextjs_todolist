'use client'

import { useState } from "react";
import 'react-calendar/dist/Calendar.css'
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false
});

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function CalendarPage(){
    const [value, onChange] = useState(new Date());
    return(
        <div className="flex justify-center p-6 bg-gray-50"> 
            <Calendar formatDay ={(locale, date) => dayjs(date).format('DD')}/>
        </div>
    )
}