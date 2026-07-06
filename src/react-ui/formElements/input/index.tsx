import React, { FC, forwardRef, useEffect } from "react";
import "../formStyles.css";

type InputProps = {
  type?: string;
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  autofocus?: boolean;
  required?: boolean;
  step?: string;
  placeholder?: string;
  min?: string;
  max?: string;
};

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      name,
      value,
      onChange,
      full = false,
      autofocus = false,
      required = false,
      step,
      placeholder,
      min,
      max,
    },
    forwardedRef,
  ) => {
    const localRef = React.useRef<HTMLInputElement | null>(null);

    const mergedRef = (node: HTMLInputElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    useEffect(() => {
      if (autofocus) {
        requestAnimationFrame(() => localRef.current?.focus());
      }
    }, [autofocus]);

    const props: Record<string, any> = {};
    if (step) props.step = step;
    if (placeholder) props.placeholder = placeholder;
    if (min) props.min = min;
    if (max) props.max = max;
    return (
      <input
        className={`bka-form-element ${full ? "bka-form-element-full" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        ref={mergedRef}
        required={required}
        {...props}
      />
    );
  },
);

export default Input;
