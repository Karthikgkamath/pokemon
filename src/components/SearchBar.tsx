import React, { useRef } from "react";
import "./SearchBar.css";
interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}
export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search Pokémon...",
}:Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="search-bar">
      
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
