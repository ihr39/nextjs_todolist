import BookClient from "./bookClient";

export default function Book(){
    return(
        <div className="p-10">
            <div className=" flex mb-10">
                <h1 className="text-2xl">독서기록</h1>
            </div>
            <BookClient/>
        </div>
    )
}