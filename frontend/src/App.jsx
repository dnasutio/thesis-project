import { useState } from 'react'
import { useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const ref = useRef(null);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append('File', selectedFile);
    fetch(
      'http://localhost:6969/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        document.getElementById("file_upload_response").innerHTML = result.response;
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById("file_upload_response").innerHTML = "Error: file not uploaded";
      });
  };

  const submitWord = () => {
    const word = document.getElementById("word_input").value
    fetch(
      'http://localhost:6969/word',
      {
        method: 'POST',
        body: word,
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
        let words = "";
        for (let i = 0; i < result.response.length; i++) {
          if (i != result.response.length - 1) 
            words += result.response[i] + ", ";
          else
            words += result.response[i];
        }
        document.getElementById("word_upload_response").innerHTML = words;
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById("word_upload_response").innerHTML = "Error";
      });
  }

  useEffect(() => {
    const el2 = ref.current;
    console.log(el2);

    
    getDate();
  }, []);

  function getDate() {
    let date = new Date().toString();
    document.getElementById('time_container').textContent
      = date;
  }

  return (
    <div>
      <div><span>Last update: </span><span id="time_container"></span></div><br />
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
      <input type="text" id="word_input"/>
      <button onClick={submitWord}>Submit</button>
      <div id="word_upload_response"></div>
    </div>
  )
}

export default App
