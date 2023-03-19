import { useState } from 'react'

function FileUpload({setFileUploaded}) {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = async () => {
        const formData = new FormData();
        formData.append('File', selectedFile);
        const settings = {
            method: 'POST',
            body: formData,
        };

        const response = await fetch('http://localhost:6969/upload', settings)
        if (!response.ok) {
            throw new Error('Data coud not be fetched!')
        } else {
            console.log(response)
            setFileUploaded(true);
            return response.json()
        }
    }

    return (
        <>
            <div className="flex items-center justify-center pb-4">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-2/3 h-64 border-4 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Upload a word embedding</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={changeHandler} />
                    {isFilePicked ? (
                        <div>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Filename: {selectedFile.name}</p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Filetype: {selectedFile.type}</p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Size in bytes: {selectedFile.size}</p>
                        </div>
                    ) : (
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Select a file to show details</p>
                    )}
                </label>
            </div>

            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-72 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmission}>Upload</button>
        </>
    );
}

export default FileUpload;