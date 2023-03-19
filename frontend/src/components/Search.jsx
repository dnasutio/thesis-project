import { useEffect, useState } from 'react'

function Search({ nearestWords}) {
    const [checkedState, setCheckedState] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

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

    return (
        <>
            <div className="block max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
                <h3>Nearest Words</h3>
                <ul id="word-boxes">
                    {nearestWords.map((word, index) => {
                        return (
                            <li key={index}>
                                <div>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleChangeCheckBox()}
                                    />
                                    <label htmlFor={index}>{word}</label>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <button onClick={searchDocuments} id="search_docs">Search</button>
            </div>
            <div className="flex justify-center px-72">
                <ul>
                    {searchResults.slice(0, 5).map((doc, index) => {
                        return (
                            <li key={index}>
                                <div>
                                    <p htmlFor={index}>{index} {doc}</p>
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