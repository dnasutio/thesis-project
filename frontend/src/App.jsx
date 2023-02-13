import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import NearestWordsList from './components/NearestWordsList';

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [nearestWords, setNearestWords] = useState([]);
  const [checkedState, setCheckedState] = useState([]);

  const callback = payload => {
    console.log("Payload: ", payload);
    setCheckedState(payload);

    console.log("Checked:", checkedState);
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
      throw new Error('Data coud not be fetched!')
    } else {
      let result = await response.json();
      console.log(result);
      console.log("Success: ", result.response);
      let words = result.response;
      console.log("Words: ", words);
      setNearestWords(await words);
      console.log("Nearest: ", nearestWords);
    }

    console.log("Nearest2: ", nearestWords);
  }

  const searchDocuments = async () => {
    const settings = {
      method: 'GET',
      body: msg,
    };



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
      <NearestWordsList nearestWords={nearestWords} callback={callback} />
      <button onClick={searchDocuments} id="search_docs" hidden>Search</button>
    </div>
  )
}

export default App
