'use client'
import { Star } from "lucide-react";
import { transDate } from "../../../util/commonFunc";

export default function BookCard({bookItem}:{bookItem:BookType}){
    return(
        <div className="flex flex-1">
            <div>
                <p className="text-xl font-bold">{bookItem.title}</p>
                {
                    bookItem.startDate != null && bookItem.endDate != null? 
                    <p className="text-xs text-gray-400">{transDate(bookItem.startDate)} ~ {transDate(bookItem.endDate)}</p>   
                    : null
                }
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex">
                    <Star size={20} color="#F59E0B" fill="#F59E0B"/>
                    <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {bookItem.score}
                    </span>
                    <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">/</span>
                    <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</span>
                </div>
                <p className="text-lg text-gray-800 italic">{bookItem.oneReview}</p>
            </div>
        </div>
    )
}