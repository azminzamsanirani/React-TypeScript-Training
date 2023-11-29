// ReadEvents.tsx
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  notes: string;
  date: Date;
  priority: string;
}

const fetchData = async () => {
  const response = await axios.get<Event[]>('http://localhost:3001/events');
  return response.data;
};

const ReadEvent: React.FC<{ onDataLoaded: (data: Event[]) => void }> = ({ onDataLoaded }) => {
  const { data, isError } = useQuery('event', fetchData);

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching event from the server</p>;
  }

  // If data is not available, return null
  if (!data) {
    return null;
  }

  return null;
};

export default ReadEvent;
