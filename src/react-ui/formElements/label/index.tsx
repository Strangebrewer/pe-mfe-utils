import React, { FC } from 'react';

type LabelProps = {
  text: string;
}

const Label: FC<LabelProps> = ({ text }) => {
  return (
    <label className='tw:block tw:text-[.9rem] tw:mb-[4px] tw:w-[100%]'>{text}</label>
  );
};

export default Label;
