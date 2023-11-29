// server/create.tsx
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

interface NewCountryFormProps {
  countryName: string;
  currencyValue: string;
}

export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  const createCountryMutation = useMutation(
    async ({ countryName, currencyValue }: NewCountryFormProps) => {
      const response = await axios.post('http://localhost:3001/countries', {
        country_name: countryName,
        value: currencyValue,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch the countries query after successful creation
        queryClient.invalidateQueries('countries');
      },
      onError: (error) => {
        console.error('Error submitting new country:', error);
      },
    }
  );

  return createCountryMutation;
};
