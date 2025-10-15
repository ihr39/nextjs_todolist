
export function today(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = date.getMonth() + 1 < 10 ? '0'+(date.getDate()).toString() : (date.getDate()).toString()
    let today: string = year+'년'+ mon+'월'+ day+'일'
    return today
}

export function todayClean(): string{
    let date: DateType = new Date
    let year: string = (date.getFullYear()).toString()
    let mon:string = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() 
    let day: string = date.getMonth() + 1 < 10 ? '0'+(date.getDate()).toString() : (date.getDate()).toString()
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

//--date를 보내면 - 붙여서 변환
export function transDate(data: Date): string{
    if(typeof data == 'string') data = new Date(data)
    let year: string = (data.getFullYear()).toString()
    let mon:string = data.getMonth() + 1 < 10 ? '0'+(data.getMonth() + 1).toString() : (data.getMonth() + 1).toString() 
    let day: string = data.getDate() < 10 ? '0'+(data.getDate()).toString() : (data.getDate()).toString()
    let date: string = year+'-'+ mon+'-'+ day
    return date
}

//--시간을 초기화해서 날짜로만 비교할 수 있게
export function onlyDateCompare(data: Date){
    if(typeof data == 'string') data = new Date(data)
    if(!(data instanceof Date)) return ''
    return data.setHours(0, 0, 0, 0)
}