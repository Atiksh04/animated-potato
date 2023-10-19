import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import JSONData from "../../data.json";



interface MentionComponentProps {
  value: string;
  onChange: (value: string) => void;
}

type SuggestionType = {
    id: string,
    first_name: string,
    last_name: string,
    gender: string,
    email: string
}

const MentionComponent: React.FC<MentionComponentProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>(JSONData);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (newValue.includes('@')) {
      const query = newValue.split('@')[1];
      const newSuggestions = getSuggestions(query);
      setSuggestions(newSuggestions);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && selectedSuggestionIndex !== -1) {
      e.preventDefault();
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      setInputValue((prev) => prev.replace(/@\w+\s*$/, `@${selectedSuggestion} `));
      setSuggestions([]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue((prev) => prev.replace(/@\w+\s*$/, `@${suggestion} `));
    setSuggestions([]);
  };

  const getSuggestions = (query: string) => {
    const filteredSuggestions = JSONData.filter((data)=> data.first_name.toLowerCase().includes(query.toLowerCase()))
    return filteredSuggestions;
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.first_name)}
            className={index === selectedSuggestionIndex ? 'selected' : ''}
          >
            {suggestion.first_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentionComponent;
