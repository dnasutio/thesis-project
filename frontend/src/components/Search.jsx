import { useEffect, useState } from 'react'

function Search({ nearestWords}) {
    const [checkedState, setCheckedState] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const handleChangeCheckBox = () => {
        let updatedCheckedState = [];
        let checkBoxes = document.querySelectorAll("ul#word-boxes li input");
        for (let i = 0; i < checkBoxes.length; i++) {
            updatedCheckedState.push(checkBoxes[i].checked);
        }

        setCheckedState(updatedCheckedState);
        console.log("Update checked: ", updatedCheckedState);
    }

    const searchDocuments = async () => {
        let selectedWords = [];
        for (let i = 0; i < nearestWords.length; i++) {
            if (checkedState[i])
                selectedWords.push(nearestWords[i]);
        }
        console.log(selectedWords);

        let msg = JSON.stringify(selectedWords);
        console.log(msg);
        const settings = {
            method: 'POST',
            body: msg,
        };

        const response = await fetch('http://localhost:6969/search', settings);
        if (!response.ok) {
            throw new Error('Data could not be fetched!')
        } else {
            let result = await response.json();

            console.log("Search results: ", result);
            setSearchResults(JSON.parse(result.response));
            setCurrentPage(0)
        }
    }

    useEffect(() => {
        if (nearestWords) {
            console.log("Words: ", nearestWords);
            // every time nearestWords changes we must create a new array with the correct number of elements and them to false 
            let bools = [];
            for (let i = 0; i < nearestWords.length; i++) {
                bools.push(false);
            }

            // reset array to nothing then set all elements to false
            setCheckedState(bools);
        }
    }, [nearestWords]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 5);
    }

    const handlePreviousPage = () => {
        if (currentPage != 0)
            setCurrentPage(currentPage - 5);
    }

    return (
        <>
            <div className="flex justify-center px-72">
                <div className="grid grid-cols-1 place-items-start max-w-sm rounded-lg bg-white shadow-lg dark:bg-gray-700 px-6">
                    <div className="p-4">
                        <h3 className="text-gray-500 font-bold text-xl dark:text-gray-400">Nearest Words</h3>
                        <ul id="word-boxes">
                            {nearestWords.map((word, index) => {
                                return (
                                    <li key={index}>
                                        <div>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleChangeCheckBox()}
                                            />
                                            <label className="text-gray-500 font-bold dark:text-gray-400" htmlFor={index}> {word}</label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pr-72 pt-6">
                <button id="search_docs" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-72 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={searchDocuments}>Search</button>
            </div>

            <div className="flex justify-center pr-72 pt-6">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-72 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handlePreviousPage}>Previous Page</button>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-72 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleNextPage}>Next Page</button>
            </div>

            <div className="flex justify-center px-72">
                <ul>
                    {searchResults.slice(currentPage, currentPage + 5).map((doc, index) => {
                        return (
                            <li key={index}>
                                <div>
                                    <p htmlFor={index}>{currentPage + index + 1} {doc}</p>
                                    <br />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default Search;