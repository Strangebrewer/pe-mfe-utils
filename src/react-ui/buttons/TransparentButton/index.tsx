import React, { FC } from "react";
import "./styles.css";

type TransparentButtonProps = {
  onClick: () => any;
  text: string;
  color?: 'blue' | 'red' | 'purple' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
};

const TransparentButton: FC<TransparentButtonProps> = ({
  onClick,
  text,
  color = 'blue',
  size = 'md',
  title,
}) => {
  const style: Obj = { fontSize: '16px' };
  if (size !== 'md') {
    if (size === 'sm') style.fontSize = '12px';
    if (size === 'lg') style.fontSize = '20px';
    if (size === 'xl') style.fontSize = '24px';
  }
  return (
    <button
      style={style}
      title={title}
      className={`bka-transparent-btn bka-transparent-btn-${color}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default TransparentButton;
