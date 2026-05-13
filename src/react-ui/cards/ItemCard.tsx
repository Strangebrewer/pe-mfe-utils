import React, { FC } from "react";
import "./styles.css";

type Props = {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
};

const ItemCard: FC<Props> = ({ children, onClick }) => {
  return (
    <div
      className={`bka-item-card ${!!onClick ? "bka-item-card-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ItemCard;
