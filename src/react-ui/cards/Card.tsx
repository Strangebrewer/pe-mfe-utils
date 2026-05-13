import React, { FC } from "react";
import "./styles.css";

type Props = {
  children: React.ReactNode;
  heading?: string;
  size?: "sm" | "md" | "lg";
};

const Card: FC<Props> = ({ heading, size = "md", children }) => {
  return (
    <div className="bka-card">
      {heading && <h2 className={`bka-card-heading--${size}`}>{heading}</h2>}
      {children}
    </div>
  );
};

export default Card;
