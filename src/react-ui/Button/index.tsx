import React, { FC } from "react";
import "../theme.css";
import "./styles.css";

type ButtonProps = {
  text: string;
  variant: 'blue' | 'green' | 'red' | 'grey' | 'lime' | 'purple' | 'yellow';
  color?: string;
  small?: boolean;
  last?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FC<ButtonProps> = ({
  text,
  variant,
  color,
  small = false,
  last = false,
  disabled = false,
  onClick,
}) => {
  const style: Obj = {};
  if (color) style.color = color;
  return (
    <button
      className={`
        button-base
        ${small ? 'button-small' : ''}
        ${last ? 'button-last' : ''}
        button-${variant}
      `}
      {...style}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
