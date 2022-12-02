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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const submitWord = () => {
    const word = document.getElementById("word_input").value
    fetch(
      'http://localhost:6969/word',
      {
        method: 'POST',
        body: JSON.stringify(word),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    // 👇️ use a ref (best)
    const el2 = ref.current;
    console.log(el2);

    // 👇️ use document.getElementById()
    // should only be used when you can't set a ref prop on the element
    // (you don't have access to the element)
    getDate();
  }, []);

  /* var xhr = null;
  const getXmlHttpRequestObject = function () {
    if (!xhr) {
      // Create a new XMLHttpRequest object 
      xhr = new XMLHttpRequest();
    }
    return xhr;
  }; */
  /* function dataCallback() {
    // Check response is ready or not
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log("User data received!");
      getDate();
      let dataDiv = document.getElementById('result-container');
      // Set current data text
      dataDiv.innerHTML = xhr.responseText;
    }
  }
  function getUsers() {
    console.log("Get users...");
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = dataCallback;
    // asynchronous requests
    xhr.open("GET", "http://localhost:6969/users", true);
    // Send the request over the network
    xhr.send(null);
  }
  */
  function getDate() {
    let date = new Date().toString();
    document.getElementById('time_container').textContent
      = date;
  }

  /* function sendDataCallback() {
    // Check response is ready or not
    if (xhr.readyState == 4 && xhr.status == 201) {
      console.log("Data creation response received!");
      getDate();
      let dataDiv = document.getElementById('sent-data-container');
      // Set current data text
      dataDiv.innerHTML = xhr.responseText;
    }
  } */

  /* function sendData() {
    let dataToSend = document.getElementById('data-input').value;
    if (!dataToSend) {
      console.log("Data is empty.");
      return;
    }
    console.log("Sending data: " + dataToSend);
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = sendDataCallback;
    // asynchronous requests
    xhr.open("POST", "http://localhost:6969/users", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // Send the request over the network
    xhr.send(JSON.stringify({ "data": dataToSend }));
  } */

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
      <br />
      <input type="text" id="word_input"/>
      <button onClick={submitWord}>Submit</button>
    </div>
  )
}

export default App
