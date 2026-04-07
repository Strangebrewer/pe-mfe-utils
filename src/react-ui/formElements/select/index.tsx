import React, { FC } from 'react';
import "../formStyles.css";

type SelectProps = {
  name: string;
  value: any;
  onChange: (e: any) => any;
  full?: boolean | "true";
  children: React.ReactNode
}

const Select: FC<SelectProps> = ({
  name,
  value,
  onChange,
  full = false,
  children,
}) => {
  return (
    <select
      className={`bka-form-element bka-select ${full ? 'bka-form-element-full' : ''}`}
      name={name}
      value={value}
      onChange={onChange}
      autoFocus
    >
      {children}
    </select>
  );
};

export default Select;
