import React, { useEffect, useState } from "react";
import { TYPE_COLORS } from "../utils/constants";
import { fetchAllTypes } from "../utils/api";
import "./TypeFilter.css";
interface Props {
  selected: string;
  onChange: (type: string) => void;
}
export const TypeFilter = ({ selected, onChange }:Props) => {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTypes().then(setTypes).catch(() => {});
  }, []);

  return (
    <div className="type-filter">
      <button
        className={`type-filter-btn all-btn ${!selected ? "active" : ""}`}
        onClick={() => onChange("")}
      >
        All Types
      </button>
      {types.map((type) => {
        const colors = TYPE_COLORS[type];
        const isActive = selected === type;
        return (
          <button
            key={type}
            className={`type-filter-btn ${isActive ? "active" : ""}`}
            style={
              isActive && colors
                ? { background: colors.bg, color: colors.text, borderColor: colors.bg }
                : colors
                ? { borderColor: colors.bg + "66", color: colors.bg }
                : {}
            }
            onClick={() => onChange(isActive ? "" : type)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};
