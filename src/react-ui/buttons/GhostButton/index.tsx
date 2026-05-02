import React, { FC } from "react";
import "./styles.css";

type GhostButtonProps = {
  onClick: () => any;
  text: string;
  color?: 'violet' | 'cyan' | 'lime' | 'red';
  size?: 'sm' | 'md';
  last?: boolean;
  disabled?: boolean;
  title?: string;
};

const GhostButton: FC<GhostButtonProps> = ({
  onClick,
  text,
  color = 'violet',
  size = 'md',
  last = false,
  disabled = false,
  title,
}) => {
  return (
    <button
      title={title}
      disabled={disabled}
      className={`bka-ghost-btn bka-ghost-btn-${color}${size === 'sm' ? ' bka-ghost-btn-small' : ''}${last ? ' bka-ghost-btn-last' : ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default GhostButton;
