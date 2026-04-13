import React, { FC } from 'react';

type LabelProps = {
  text: string;
}

const Label: FC<LabelProps> = ({ text }) => {
  return (
    <label className='bka-label'>{text}</label>
  );
};

export default Label;
