
export default function TodoList(){
    function today(){
        let date = new Date
        return date.getFullYear()
    }
    return(
        <div className="flex">
            <div className="w-[25%] bg-orange-500 pl-15 pt-5 pb-5 text-left">날짜별...</div>
            <div className="w-[85%] bg-gray-500 pl-15 pt-5 pb-5 text-left place-items-center">{today()}
                <div className="w-[50%] bg-blue-500">
                    <fieldset className="space-y-3">
                        <div className="grid grid-cols-[1fr_24px] items-center gap-6">
                            <label className="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-gray-100 dark:hover:bg-white/5">
                                <input className="peer size-3.5 appearance-none rounded-sm border border-gray-300 accent-pink-500 checked:appearance-auto dark:border-gray-600 dark:accent-pink-600" type="checkbox"/>
                                <span className="text-gray-700 select-none peer-checked:text-gray-400 peer-checked:line-through dark:text-gray-300">Create a to do list</span>
                            </label>
                            <div className="size-[26px] rounded-md p-1 peer-has-checked:hidden hover:bg-red-50 hover:text-pink-500">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg></div>
                            </div>
                            <div className="grid grid-cols-[1fr_24px] items-center gap-6">
                                <label className="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-gray-100 dark:hover:bg-white/5">
                                <input className="peer size-3.5 appearance-none rounded-sm border border-gray-300 accent-pink-500 checked:appearance-auto dark:border-gray-600 dark:accent-pink-600" type="checkbox"/>
                                <span className="text-gray-700 select-none peer-checked:text-gray-400 peer-checked:line-through dark:text-gray-300">Check off first item</span>
                            </label>
                            <div className="size-[26px] rounded-md p-1 peer-has-checked:hidden hover:bg-red-50 hover:text-pink-500">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="grid grid-cols-[1fr_24px] items-center gap-6">
                            <label className="peer grid grid-cols-[auto_1fr] items-center gap-3 rounded-md px-2 hover:bg-gray-100 dark:hover:bg-white/5">
                            <input className="peer size-3.5 appearance-none rounded-sm border border-gray-300 accent-pink-500 checked:appearance-auto dark:border-gray-600 dark:accent-pink-600" type="checkbox"/>
                            <span className="text-gray-700 select-none peer-checked:text-gray-400 peer-checked:line-through dark:text-gray-300">Investigate race condition</span></label><div className="block size-[26px] rounded-md p-1 peer-has-checked:hidden hover:bg-red-50 hover:text-pink-500">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </div>
    )
}