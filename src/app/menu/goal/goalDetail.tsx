'use client'

export default function GoalDetail({detailOpen}:{detailOpen: boolean}){


    return(
        <div id="accordion-collapse-body-1" className={detailOpen ? '':'hidden'} aria-labelledby="accordion-collapse-heading-1">
            <div className="py-4 px-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex justify-end">
                    <button type="button" className="light-btn p-2 rounded-sm">수정</button>
                    <button type="button" className="light-btn p-2 rounded-sm">삭제</button>
                </div>
                <div className="mb-5">
                    <span className="text-lg font-bold">목표설명:</span>
                    <div>올해 총 10권의 책을 읽고 독후감을 작성한다.</div>
                </div>
                <div>
                    <span className="text-lg font-bold">진행상황</span>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-5">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '45%'}}> 45%</div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="likeLinkBtn dark:text-blue-500">추가</button>
                    </div>
                    <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-[5%]">Num</th>
                                <th scope="col" className="px-6 py-3 w-[75%]"> 내용</th>      
                                <th scope="col" className="px-6 py-3 w-[10%]">완료</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function TableRow(){
    return(
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                1
            </th>
            <td className="px-6 py-4">
                <input name="content" className="underlineInput peer pt-0 pb-0"/>
            </td>
            <td className="px-6 py-4">
                <input type="checkbox" name="complete"/>
            </td>
            <td className="px-6 py-4 text-right">
                <button type="button" className="likeLinkBtn dark:text-blue-500 ">삭제</button>
            </td>
        </tr>
    )
}