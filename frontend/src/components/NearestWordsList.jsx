import { useEffect } from 'react';
import { useState } from 'react'

const NearestWordsList = ({ nearestWords, callback }) => {
  const [checkedState, setCheckedState] = useState([]);

  const handleOnChange = (position) => {
    console.log("Before: ",  checkedState);
    console.log("Words length: ", nearestWords.length);
    console.log("Position: ", position);
    const updatedCheckedState = checkedState.map((item, index) => {
      index === position ? !item : item
    });
    console.log("Updated: ", updatedCheckedState);

    setCheckedState(updatedCheckedState);

    // send the checked state to parent
    console.log("Checked from nav: ", checkedState);
    callback(checkedState);
  }

  useEffect(() => {
    // every time nearestWords changes we must create a new array with the correct number of elements and them to false 
    let bools = [];
    for (let i = 0; i < nearestWords.length; i++) {
      bools.push(false);
    }
    console.log(bools);
    // reset array to nothing then set all elements to false
    setCheckedState(bools);

    console.log("Nearest Changed: ", checkedState);
  }, [nearestWords]);

  console.log("List: ", nearestWords);
  return (
    <div>
      <h3>Nearest Words</h3>
      <ul>
        {nearestWords.map((word, index) => {
          return (
            <li key={index}>
              <div>
                <input 
                  type="checkbox" 
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
                <label htmlFor={index}>{word}</label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )
};

export default NearestWordsList;