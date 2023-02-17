import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
//import NearestWordsList from './components/NearestWordsList';

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
    <div>
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
      <div id="file_upload_response"></div>
      <br />
      <input type="hidden" id="word_input"/>
      <select id="numwords_input" hidden/>
      <button onClick={submitWord} id="submit_word" hidden>Submit</button>
      <div id="word_upload_response"></div>

      {/* <NearestWordsList nearestWords={nearestWords} checkedState={checkedState} setCheckedState={setCheckedState} /> */}
      <div>
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
      </div>
        
      <button onClick={searchDocuments} id="search_docs" hidden>Search</button>

      <div>
        <h3>Search Results</h3>
        <ul>
          {searchResults.map((doc, index) => {
            return (
              <li key={index}>
                <div>
                  <p htmlFor={index}>{doc}</p>
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
