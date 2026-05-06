import React, { FC, useEffect } from "react";
import "../formStyles.css";

type InputProps = {
  type: string;
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
  required?: boolean;
  step?: string;
  placeholder?: string;
}

const Input: FC<InputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  full = false,
  autofocus = false,
  required = false,
  step,
  placeholder,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autofocus]);
  const props: Record<string, any> = {};
  if (step) props.step = step;
  if (placeholder) props.placeholder = placeholder;
  return (
    <input
      className={`bka-form-element ${full ? 'bka-form-element-full' : ''}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      ref={inputRef}
      required={required}
      {...props}
    />
  );
};

export default Input;
