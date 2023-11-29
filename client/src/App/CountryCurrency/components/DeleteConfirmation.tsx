// DeleteConfirmation.tsx
import React from "react";
import "./style/DeleteConfirmation.css";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="DeleteConfirmation">
      <p>Are you sure?</p>
      <div className="button-container">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
