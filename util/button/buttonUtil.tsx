'use client'

export function InsertButton({props}:{props:()=>void}){
    return(
        <div className="mb-5 absolute top-33 right-10">
            <button type="button" className="light-btn" 
                onClick={(e)=>{
                    props()
            }}
            >추가</button>
        </div>
    )
}

export function CloseBtn({func}:{func:()=>void}){
    return(
        <button type="button" className="justify-end text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={()=>func()}
        >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    )
}