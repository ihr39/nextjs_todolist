import CalendarPage from "./calendarPage";


export default function Routine(){
    return(
        <div className="p-10"  id="accordion-collapse" data-accordion="collapse">
            <div className=" flex mb-10">
                <h1 className="text-2xl">루틴관리</h1>
            </div>
            <div>
                <CalendarPage/>
            </div>
        </div>
    )
}