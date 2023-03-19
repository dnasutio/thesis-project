import { useState } from 'react'

function NearestWords({ setNearestWords }) {
    const [word, setWord] = useState('')
    const [numWords, setNumWords] = useState(10);
    
    const handleChangeWord = (e) => {
        setWord(e.target.value);
    }


    const handleChangeNumWords = () => {
        setNumWords(document.getElementById("numwords_input").value);
    }

    const submitWord = async () => {
        const msg = word + " " + numWords;
        
        const settings = {
            method: 'POST',
            body: msg,
        };

        try {
            const response = await fetch('http://localhost:6969/word', settings);
            if (!response.ok) {
                throw new Error('Data could not be fetched!')
            } else {
                let result = await response.json();
                setNearestWords(result.response);
            }
        } catch (error) {
            console.log(error)
            console.log(msg)
        }
        
    }

    return (
        <>
            <div className="flex px-72">
                <label htmlFor="word_input" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"></label>

                <div className="relative w-full">
                    <input type="search" id="word_input" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search related words" onChange={handleChangeWord} required />
                    <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={submitWord}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        
                    </button>
                </div>
            </div>

            <div className="px-72">
                <label htmlFor="numwords_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Choose number of related words: {numWords}</label>
                <input id="numwords_input" type="range" min="1" max="10" defaultValue="50" className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleChangeNumWords}/>
            </div>
        </>
    );
}

export default NearestWords;