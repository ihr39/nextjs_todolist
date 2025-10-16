export default function Loading(){
    return(
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            aria-live="assertive"
            aria-label="로딩 중"
        >
            <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-2xl">
                <div 
                    className="
                        w-12 h-12 border-4 border-t-4 border-gray-200 
                        border-t-blue-500 rounded-full 
                        animate-spin 
                        mb-3
                    "
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}