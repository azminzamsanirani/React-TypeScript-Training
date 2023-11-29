import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface User {
  id: number;
  name: String;
  position: String;
  country: String;
}

const fetchData = async () => {
  const response = await axios.get<User[]>('http://localhost:3001/users');
  return response.data;
};

const Read: React.FC<{ onDataLoaded: (data: User[]) => void }> = ({ onDataLoaded }) => {
  const { data, isError } = useQuery('user', fetchData);

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]); // Only include 'data' in the dependency array

  if (isError) {
    return <p>Error fetching user from the server</p>;
  }

  // If data is not available, return null
  if (!data) {
    return null;
  }

  return null;
};

export default Read;
