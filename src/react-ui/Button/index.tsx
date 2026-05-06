import React, { FC } from "react";
import "../theme.css";
import "./styles.css";

type ButtonProps = {
  text: string;
  color: 'blue' | 'green' | 'red' | 'grey' | 'purple' | 'yellow';
  type?: 'button' | 'submit' | 'reset';
  small?: boolean;
  last?: boolean;
  disabled?: boolean;
  onClick?: (event?: any) => void;
}

const Button: FC<ButtonProps> = ({
  text,
  color = 'blue',
  type = 'button',
  small = false,
  last = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`
        button-base
        ${small ? 'button-small' : ''}
        ${last ? 'button-last' : ''}
        button-${color}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
