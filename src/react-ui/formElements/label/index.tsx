import React, { FC } from 'react';

type LabelProps = {
  text: string;
  inline?: boolean;
}

const Label: FC<LabelProps> = ({ text, inline }) => {
  return (
    <label className={`bka-label ${inline ? 'bka-label-inline' : ''}`}>{text}</label>
  );
};

export default Label;
