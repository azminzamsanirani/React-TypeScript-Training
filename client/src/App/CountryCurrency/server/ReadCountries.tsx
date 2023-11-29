// Read.tsx
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface CountryData {
  id: number;
  country_name: string;
  value: number;
}

const fetchData = async () => {
  const response = await axios.get<CountryData[]>('http://localhost:3001/countries');
  return response.data;
};

const Read: React.FC<{ onDataLoaded: (data: CountryData[]) => void }> = ({ onDataLoaded }) => {
  const { data, error, isError, isLoading } = useQuery('countries', fetchData);

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data, onDataLoaded]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data from server</p>;
  }

  // If data is not available, you can return null or some default content
  if (!data) {
    return null;
  }

  return null;
};

export default Read;
