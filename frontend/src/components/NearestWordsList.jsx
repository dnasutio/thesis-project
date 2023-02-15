import { useEffect } from 'react';

const NearestWordsList = ({ nearestWords, checkedState, setCheckedState }) => {

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => {
      index === position ? !item : item
      console.log("----------------------------------");
      console.log("Index: ", index, "; Position: ", position, "; Item: ", item, "; Index=Position?: ", index === position);
      console.log("----------------------------------");
    });

    setCheckedState(updatedCheckedState);
    console.log("Update checked: ", updatedCheckedState);
  }

  useEffect(() => {
    // every time nearestWords changes we must create a new array with the correct number of elements and them to false 
    let bools = [];
    for (let i = 0; i < nearestWords.length; i++) {
      bools.push(false);
    }
    
    // reset array to nothing then set all elements to false
    setCheckedState(bools);
    console.log("Reset checked: ", checkedState);
  }, [nearestWords]);

  console.log("Words from child: ", nearestWords);

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