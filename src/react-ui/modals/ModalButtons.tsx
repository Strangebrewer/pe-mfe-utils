import React, { FC } from "react";
import GhostButton from "../buttons/GhostButton";
import Button from "../Button";

type Props = {
  onClose: () => void;
  onConfirm?: () => void;
  confirmText: string;
  confirmColor?: string;
  declineText?: string;
  isDisabled?: boolean;
};

const ModalButtons: FC<Props> = ({
  onClose,
  onConfirm,
  declineText = "Cancel",
  confirmText,
  confirmColor = "green",
  isDisabled = false,
}) => {
  const props: any = {};
  if (typeof onConfirm === "function") props.onClick = onConfirm;
  return (
    <div>
      <GhostButton color="red" text={declineText} onClick={onClose} />
      <Button
        type="submit"
        color={confirmColor}
        text={confirmText}
        disabled={isDisabled}
        last
        {...props}
      />
    </div>
  );
};

export default ModalButtons;
