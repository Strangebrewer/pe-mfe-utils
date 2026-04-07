import React, { FC } from "react";
import "../formStyles.css";

type TextareaProps = {
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
};

const Textarea: FC<TextareaProps> = ({
  name,
  value,
  onChange,
  full = false,
  autofocus = false,
}) => {
  const addedProps: Obj = {};
  if (autofocus) addedProps.autoFocus = autofocus;
  return (
    <textarea
      className={`bka-form-element bka-textarea ${full ? 'bka-form-element-full' : ''}`}
      name={name}
      value={value}
      onChange={onChange}
      {...addedProps}
    />
  );
};

export default Textarea;
