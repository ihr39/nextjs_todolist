import { Trash2Icon } from "lucide-react";
import BookClient from "./bookClient";

export default function Book(){
    return(
        <div className="p-10">
            <div className=" flex mb-10">
                <h1 className="text-2xl">독서기록</h1>
            </div>
            <BookClient/>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex bg-white p-5 border-1 border-gray-200 mb-2">
                    <div>
                        <p className="text-xl font-bold">책이름</p>
                        <p className="text-xs text-gray-400">2024.10.11 ~ 2024.05.11</p>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-lg text-gray-800 italic">"책 개별로"</p>
                    </div>
                    <div className="items-center flex">
                        <Trash2Icon size={28} className="transition-colors trashBtn"/>
                    </div>
                </div>
                <div className="flex bg-white p-5 border-1 border-gray-200 mb-2">
                    <div>
                        <p className="text-xl font-bold">책이름</p>
                        <p className="text-xs text-gray-400">2024.10.11 ~ 2024.05.11</p>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-lg text-gray-800 italic">"이딴게 책이냐 내가 적어도 이것보단 낫다"</p>
                    </div>
                    <div className="items-center flex">
                        <Trash2Icon size={28} className="transition-colors trashBtn"/>
                    </div>
                </div>
            </div>
        </div>
    )
}