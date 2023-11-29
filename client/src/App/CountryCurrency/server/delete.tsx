// server/delete.tsx
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const deleteCountry = async (countryId: number) => {
  try {
    await axios.delete(`http://localhost:3001/countries/${countryId}`);
  } catch (error) {
    console.error("Error deleting country:", error);
    throw error;
  }
};

const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCountry, {
    onSuccess: () => {
      // Invalidate and refetch the data after successful deletion
      queryClient.invalidateQueries("countries");
    },
  });
};

export default useDeleteCountry;
