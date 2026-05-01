import React from "react";
import "./LoadingSpinner.css";

interface Props {
  message?: string;
}

export const LoadingSpinner = ({ message = "Loading Pokémon..." }:Props) => {
  return (
    <div className="loading-container">
      <div className="pokeball-spinner">
        <div className="pokeball">
          <div className="pokeball-top" />
          <div className="pokeball-bottom" />
          <div className="pokeball-stripe" />
          <div className="pokeball-center">
            <div className="pokeball-button" />
          </div>
        </div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};
