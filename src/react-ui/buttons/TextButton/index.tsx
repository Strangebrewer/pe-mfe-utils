import React, { FC } from "react";
import "./styles.css";

type TextButtonProps = {
  onClick: () => any;
  type: 'button' | 'submit' | 'reset';
  text: string;
  color?: 'blue' | 'red' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
};

const TextButton: FC<TextButtonProps> = ({
  onClick,
  type = 'button',
  text,
  color = 'blue',
  size = 'md',
  title,
}) => {
  const style: Obj = { fontSize: '12px' };
  if (size !== 'md') {
    if (size === 'sm') style.fontSize = '8px';
    if (size === 'lg') style.fontSize = '16px';
    if (size === 'xl') style.fontSize = '20px';
  }
  
  return (
    <button
      type={type}
      style={style}
      title={title}
      className={`bka-text-btn bka-text-btn-${color}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TextButton;
