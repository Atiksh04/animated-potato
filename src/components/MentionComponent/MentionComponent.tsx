import React, { useState, ChangeEvent, KeyboardEvent, useRef } from 'react';
import JSONData from "../../../data.json";
import "./MentionComponent.css";

interface MentionComponentProps {
  value: string;
  onChange: (value: string) => void;
}

type SuggestionType = {
  id: number,
  first_name: string,
  last_name: string,
  gender: string,
  email: string
}

const MentionComponent: React.FC<MentionComponentProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const [showDialog, setShowDialog] = useState(false);

  const dialogListRef = useRef(null);

  // handling input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // setting state and passing value to the onChange prop
    setInputValue(newValue);
    onChange(newValue);
    // if showDialog is true then getting suggestions based on query string
    if (showDialog) {
      const splittedString = newValue.split('@');
      const query = splittedString[splittedString.length -1]
      const newSuggestions = getSuggestions(query);
      setSuggestions(newSuggestions);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  // handles keydown event of input box
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "@") {
      // if @ is present, then showing the suggestion dialog bpx
      setShowDialog(true);
    } else if (e.key === 'Enter' && selectedSuggestionIndex !== -1) {
      e.preventDefault();
      // if enter event occurs then calling handleSuggestionClick with id of the selectedSuggestion
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      if(selectedSuggestion && selectedSuggestion?.id)
        handleSuggestionClick(selectedSuggestion.id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // in arrowup event changing suggestionindex accordingly
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // in arrowup event changing suggestionindex accordingly
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
  };

  // handles the suggestion onClick event
  const handleSuggestionClick = (suggestionID: number) => {
    // getting selected suggestions from id
    const selectedSuggestions = suggestions.find((suggestion)=> suggestion.id === suggestionID);
    // splitting current input value and replacing the last element
    const splittedParts = inputValue.split("@");
    splittedParts[splittedParts.length - 1] = `@${selectedSuggestions?.first_name} ${selectedSuggestions?.last_name}`;
    const finalString = splittedParts.join('');
    // setting states
    setInputValue(finalString);
    setSuggestions([]);
    setShowDialog(false);
  };

  const getSuggestions = (query: string) => {
    // filtering suggestionlist based on query 
    const filteredSuggestions = JSONData.filter((data)=> data.first_name.toLowerCase().includes(query.toLowerCase()))
    return filteredSuggestions;
  }

  const SuggestionBox = ()=>{
    // renders a dialog and valid suggestions in a list
    return(
      <div className='dialog' ref={dialogListRef}>
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.id)}
            className={index === selectedSuggestionIndex ? 'dialog-element dialog-selected-element' : 'dialog-element'}
          >
            {suggestion.first_name} {suggestion.last_name}
          </div>
        ))}
      </div>
    )
  }


  // rendering input and the suggestion box
  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='inputbox'
      />
      {showDialog ? <SuggestionBox/> : null}
    </div>
  );
};

export default MentionComponent;
