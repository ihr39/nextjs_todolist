import { DateType } from "../types/globalType"

export function today(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = (date.getDate()).toString()
    let today: string = year+'년'+ mon+'월'+ day+'일'
    return today
}

export function todayClean(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = (date.getDate()).toString()
    let today: string = year+ mon+ day
    return today
}

export function dateKoreaChange(date: string): string{
    return date.substring(0,4)+'년 '+date.substring(4,6)+'월 '+date.substring(6)+'일'
}

export function formatMinSec(totalSeconds: number): string{
    if(totalSeconds<0) return "00:00"
    let min = String(Math.floor(totalSeconds/60)).padStart(2,'0')
    let sec = String(totalSeconds % 60).padStart(2, '0')
    return `${min}:${sec}`
}