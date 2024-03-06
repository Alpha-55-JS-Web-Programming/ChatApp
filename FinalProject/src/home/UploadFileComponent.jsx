export function UploadFileComponent() {
   
    return (

        <div className="inline-block" title="Attached File">
        <input onChange={handleUploadFile} type="file" className="hidden" id="fileInput" />
        <label htmlFor="fileInput" className="border-transparent btn group/tooltip group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
            <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Attached File
                </span>
            </div>
            <i className="ri-attachment-line"></i>
        </label>

        {file && (
            <button onClick={uploadFileURL} type="submit" className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600 ml-2">
                {loading ? 'Uploading...' : <i className="ri-send-plane-2-fill"></i>}
            </button>
        )}
    </div>
    )
}