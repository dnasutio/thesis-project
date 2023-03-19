import { useState } from 'react'
import { useEffect } from 'react';
import FileUpload from './components/FileUpload';
import NearestWords from './components/NearestWords';
import Search from './components/Search'

function App() {
    const [fileUploaded, setFileUploaded] = useState(false);
    const [nearestWords, setNearestWords] = useState([]);

    return (
        <div className="p-20">

            <FileUpload setFileUploaded={setFileUploaded} />
            {fileUploaded && <NearestWords setNearestWords={setNearestWords} />}
            {nearestWords.length != 0 && <Search nearestWords={nearestWords} /> }

        </div>
    )
}

export default App
