// DeleteButton.tsx
import React, { useState } from "react";
import useDeleteCountry from "../server/delete";
import DeleteConfirmation from "./DeleteConfirmation";
import "./style/DeleteButton.css";

interface DeleteButtonProps {
  countryId: number | undefined;
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ countryId, onDelete }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const deleteCountry = useDeleteCountry();

  const handleDelete = () => {
    if (countryId !== undefined) {
      setIsConfirmationOpen(true);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div>
      <button className="DeleteButton" onClick={handleDelete}>
        Delete
      </button>

      {isConfirmationOpen && (
        <DeleteConfirmation
          onConfirm={async () => {
            try {
              // window.location.reload();
              if (countryId !== undefined) {
                await deleteCountry.mutateAsync(countryId);
                setIsConfirmationOpen(false);
                onDelete();
              } else {
                console.error("Invalid country ID");
              }
            } catch (error) {
              console.error("Error deleting country:", error);
            }
          }}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DeleteButton;
