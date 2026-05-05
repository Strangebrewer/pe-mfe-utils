import React, { FC } from "react";
import "./styles.css";

type ActionButtonProps = {
  iconClass?: string;
  text?: string;
  onClick: () => any;
  color?: 'blue' | 'red' | 'green' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

const ActionButton: FC<ActionButtonProps> = ({
  iconClass,
  color = 'green',
  size = 'md',
  text,
  onClick,
  title,
}) => {
  const style: Obj = { fontSize: '12px' };
  if (size !== 'md') {
    if (size === 'sm') style.fontSize = '9px';
    if (size === 'lg') style.fontSize = '15px';
    if (size === 'xl') style.fontSize = '18px';
  }

  return (
    <button
      style={style}
      title={title}
      className={`bka-action-btn bka-action-btn--${color}`}
      onClick={onClick}
    >
      {iconClass ? <i className={iconClass} /> : text}
    </button>
  );
};

export default ActionButton;
