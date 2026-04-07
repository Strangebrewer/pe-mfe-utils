import React, { FC } from "react";
import { createPortal } from "react-dom";
import "./styles.css"

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  close?: () => void;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  close,
  children,
  closeOnOutsideClick = true,
}) => {
  if (!isOpen) return null;

  function onClickOutside(e: React.BaseSyntheticEvent) {
    if (e.target.className.includes('bka-modal-wrapper') && closeOnOutsideClick) {
      close?.();
    }
  }

  const modalWrapper = () => {
    return (
      <div className="bka-modal-fade-in bka-modal-wrapper" onClick={onClickOutside}>
        <div className="bka-modal-fade-in bka-modal-body">
          <button className="bka-modal-x-btn" onClick={close}>x</button>
          {children}
        </div>
      </div>
    )
  }
  return createPortal(modalWrapper(), document.body);
}

export default Modal;
