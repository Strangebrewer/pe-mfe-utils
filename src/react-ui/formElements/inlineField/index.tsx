import React, { FC, useState } from "react";
import GhostButton from "../../buttons/GhostButton";

type InlineFieldProps = {
  label: string;
  value: string | number | undefined;
  onSave: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
};

const InlineField: FC<InlineFieldProps> = ({
  label,
  value,
  onSave,
  type = "text",
  placeholder,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value?.toString() ?? "");

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setDraft(value?.toString() ?? "");
      setEditing(false);
    }
  };

  return (
    <div className="bka-inline-field">
      <span>{label}</span>
      {editing ? (
        <div>
          <input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <GhostButton
            text="Save"
            size="sm"
            color="purple"
            onClick={handleSave}
            last
          />
          <GhostButton
            text="Cancel"
            size="sm"
            color="red"
            onClick={() => {
              setDraft(value?.toString() ?? "");
              setEditing(false);
            }}
          />
        </div>
      ) : (
        <span
          onClick={() => {
            setDraft(value?.toString() ?? "");
            setEditing(true);
          }}
          title="Click to edit"
        >
          {value !== undefined && value !== "" ? (
            value
          ) : (
            <span>{placeholder ?? "Not set"}</span>
          )}
        </span>
      )}
    </div>
  );
};

export default InlineField;
