import React, { FC, ReactNode } from "react";
import Label from "../label";
import "../formStyles.css";

type Props = {
  label: string;
  children: ReactNode;
};

const InputGroup: FC<Props> = ({ label, children }) => {
  return (
    <div className="bka-input-group">
      <Label text={label} />
      {children}
    </div>
  );
};

export default InputGroup;
