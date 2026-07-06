import React, { FC, ReactNode } from "react";
import Label from "../label";
import "../formStyles.css";

type Props = {
  text: string;
  children: ReactNode;
};

const InputGroup: FC<Props> = ({ text, children }) => {
  return (
    <div className="bka-input-group">
      <Label text={text} />
      {children}
    </div>
  );
};

export default InputGroup;
