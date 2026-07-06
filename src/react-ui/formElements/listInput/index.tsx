import React, { FC, useRef } from "react";
import "../formStyles.css";

type Props = {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  full?: boolean;
};

const ListInput: FC<Props> = ({
  items,
  onChange,
  placeholder,
  full = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      onChange([...items, value]);
      e.currentTarget.value = "";
    }
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="bka-list-input">
      {items.map((item, i) => (
        <div key={i}>
          <span>{item}</span>
          <button type="button" onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? "Type and press Enter to add"}
      />
    </div>
  );
};

export default ListInput;
