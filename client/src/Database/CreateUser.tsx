// Database/CreateUser.tsx
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

interface NewUserProps {
  id: string;
  name: string;
  position: string;
  country: string;
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    async ({ id, name, position, country }: NewUserProps) => {
      const response = await axios.post("http://localhost:3001/users", {
        id: id,
        name: name,
        position: position,
        country: country,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch the countries query after successful creation
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        console.error("Error submitting new user:", error);
      },
    }
  );

  return createUserMutation;
};
