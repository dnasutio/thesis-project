import { useState, forwardRef, useImperativeHandle, memo } from 'react'

const NearestWordsList = forwardRef(({ nearestWords }, ref) => {
  const [checkedState, setCheckedState] = useState(
    new Array(nearestWords.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
  }

  useImperativeHandle(ref, () => ({
    getChecked: () => {
      return checkedState;
    }
  }));

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
});

export default memo(NearestWordsList);