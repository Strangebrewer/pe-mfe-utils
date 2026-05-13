import React, { FC } from "react";
import { Modal, GhostButton, Button } from "../index";
import "./styles.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name?: string;
};

const DeleteConfirmationModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  name,
}) => {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} close={onClose}>
      <div className="bka-modal---delete-confirmation">
        <p>Are you sure you want to delete</p>
        <p>
          {name}
          <span>&nbsp;?</span>
        </p>
        <div>
          <GhostButton color="grey" text="Cancel" onClick={onClose} />
          <Button color="red" text="Delete" onClick={handleConfirm} last />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
