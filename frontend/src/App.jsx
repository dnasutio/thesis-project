import { useState } from 'react'
import { useEffect } from 'react';

//import NearestWordsList from './components/NearestWordsList';

// TODO: Maybe use range slider instead of dropdown. Maybe abstract UI elements to their own component files.

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [nearestWords, setNearestWords] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleOnChange = () => {
    let updatedCheckedState = [];
    let checkBoxes = document.querySelectorAll("ul#word-boxes li input");
    for (let i = 0; i < checkBoxes.length; i++) {
      updatedCheckedState.push(checkBoxes[i].checked);
    }

    setCheckedState(updatedCheckedState);
    console.log("Update checked: ", updatedCheckedState);
  }

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
      setFileUploaded(!fileUploaded);
      return response.json()
    }
  }

  const submitWord = async () => {
    const word = document.getElementById("word_input").value;
    const numwords = document.getElementById("numwords_input").value;
    const msg = word + " " + numwords;
    const settings = {
      method: 'POST',
      body: msg,
    };

    // something is wrong with setNearestWords (its like one render behind)
    // if a render happens and search box contents doesn't change then it gets the correct value ("catches up")
    const response = await fetch('http://localhost:6969/word', settings);
    if (!response.ok) {
      throw new Error('Data could not be fetched!')
    } else {
      let result = await response.json();
      setNearestWords(result.response);
      console.log("Words: ", nearestWords);
    }
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
    if (fileUploaded) {
      document.getElementById('word_input').type = "text";

      document.getElementById('numwords_input').removeAttribute("hidden");
      let numwords_input = document.getElementById('numwords_input');
      for (let i = 1; i <= 10; i++) {
        var option = document.createElement("option");
        option.text = i;
        numwords_input.add(option);
      }
      document.getElementById('numwords_input').removeAttribute("hidden");
      
      document.getElementById('submit_word').removeAttribute("hidden");
      document.getElementById('search_docs').removeAttribute("hidden");
    }

    if (nearestWords) {
      // every time nearestWords changes we must create a new array with the correct number of elements and them to false 
      let bools = [];
      for (let i = 0; i < nearestWords.length; i++) {
        bools.push(false);
      }
      
      // reset array to nothing then set all elements to false
      setCheckedState(bools);
    }
    
  }, [fileUploaded, nearestWords]);
  
  return (
    <div className="p-20">


    {/* Maybe instead of a submit button, the user can just select their file and its automatically uploaded */}
    <div className="flex items-center justify-center pb-4">
        <label for="dropzone-file" className="flex flex-col items-center justify-center w-2/3 h-64 border-4 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
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
    

    
<form>
    <div className="flex px-72">
        <label for="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"></label>
        
        <div className="relative w-full">
            <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search related words" required/>
            <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span className="sr-only">Search</span>
            </button>
        </div>
    </div>
</form>


<div className="px-72">
  <label htmlfor="default-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Choose number of related words</label>
  <input id="default-range" type="range" min="1" max="10" defaultValue="50" className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
</div>




      <div className="flex justify-center">
        <div className="block max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
          <label htmlFor="file">Word Embedding</label><br/>
          <input type="file" name="file" onChange={changeHandler} />
          {isFilePicked ? (
            <div>
              <p>Filename: {selectedFile.name}</p>
              <p>Filetype: {selectedFile.type}</p>
              <p>Size in bytes: {selectedFile.size}</p>
            </div>
          ) : (
            <p>Select a file to show details</p>
          )}
          <div>
            <button onClick={handleSubmission}>Submit</button>
          </div>
        </div>
      </div>

      <div id="submit_word_card" className={"flex justify-center" + (fileUploaded ? 'visible' : 'hidden')}>
        <div className="block max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
          <h3>Get Nearest Words</h3>
          <div id="file_upload_response"></div>
          <br />
          <input id="word_input" className/>
          <select id="numwords_input"/>
          <button onClick={submitWord} id="submit_word">Submit</button>
          <div id="word_upload_response"></div>
        </div>  
      </div>
      

      {/* <NearestWordsList nearestWords={nearestWords} checkedState={checkedState} setCheckedState={setCheckedState} /> */}
      <div id="nearest_words_card" className={"flex justify-center" + (nearestWords.length > 0 ? 'block' : 'hidden')} >
        <div className="block max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700">
          <h3>Nearest Words</h3>
          <ul id="word-boxes">
            {nearestWords.map((word, index) => {
              return (
                <li key={index}>
                  <div>
                    <input 
                      type="checkbox"
                      onChange={() => handleOnChange()}
                    />
                    <label htmlFor={index}>{word}</label>
                  </div>
                </li>
              );
            })}
          </ul>
          <button onClick={searchDocuments} id="search_docs">Search</button>
        </div>
      </div>
        
      
      {/* Create variable to hold the first and second args for the slice (user can change them based on which "page" they want) */}
      <div className="flex justify-center px-72">
        <ul>
          {searchResults.slice(0, 5).map((doc, index) => {
            return (
              <li key={index}>
                <div>
                  <p htmlFor={index}>{index} {doc}</p>
                  <br/>
                </div>
              </li>
            );
          })}
        </ul>
      </div>      

      

      
    </div>
  )
}

export default App
