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
