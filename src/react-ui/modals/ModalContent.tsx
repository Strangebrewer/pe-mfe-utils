import React, { ReactNode, FC } from "react";
import "./styles.css";

type Props = {
  heading?: string;
  children: ReactNode;
};

const ModalContent: FC<Props> = ({ heading, children }) => {
  return (
    <div className="bka-modal-content">
      {heading ? <h2>{heading}</h2> : null}
      {children}
    </div>
  );
};

export default ModalContent;
