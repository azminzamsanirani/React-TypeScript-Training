// FetchData.tsx
import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

interface Site {
  site_id: number;
  site_name: string;
}

interface Plant {
  plant_id: number;
  plant_name: string;
  site_id: number;
}

interface Department {
  department_id: number;
  department_name: string;
  plant_id: number;
}

interface WorkCenter {
  work_center_id: number;
  work_center_name: string;
  department_id: number;
}

interface WorkStation {
  work_station_id: number;
  work_station_name: string;
  work_center_id: number;
}

interface Asset {
  asset_id: number;
  asset_number: number;
  asset_name: string;
  asset_image_path: string;
  work_station_id: number;
}

interface Transaction {
  transaction_id: number;
  asset_id: number;
  timestamp: Date;
  value: number;
}

const baseURL = "http://localhost:3001";

const ReadSites: React.FC<{ onDataLoaded: (data: Site[]) => void }> = ({
  onDataLoaded,
}) => {
  const { data, isError } = useQuery("sites", async () => {
    const response = await axios.get<Site[]>(`${baseURL}/sites`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching sites from the server</p>;
  }

  return null;
};

const ReadPlants: React.FC<{ onDataLoaded: (data: Plant[]) => void }> = ({
  onDataLoaded,
}) => {
  const { data, isError } = useQuery("plants", async () => {
    const response = await axios.get<Plant[]>(`${baseURL}/plants`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching plants from the server</p>;
  }

  return null;
};

const ReadDepartments: React.FC<{
  onDataLoaded: (data: Department[]) => void;
}> = ({ onDataLoaded }) => {
  const { data, isError } = useQuery("departments", async () => {
    const response = await axios.get<Department[]>(`${baseURL}/departments`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching departments from the server</p>;
  }

  return null;
};

const ReadWorkCenters: React.FC<{
  onDataLoaded: (data: WorkCenter[]) => void;
}> = ({ onDataLoaded }) => {
  const { data, isError } = useQuery("workCenters", async () => {
    const response = await axios.get<WorkCenter[]>(`${baseURL}/work_centers`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching work centers from the server</p>;
  }

  return null;
};

const ReadWorkStations: React.FC<{
  onDataLoaded: (data: WorkStation[]) => void;
}> = ({ onDataLoaded }) => {
  const { data, isError } = useQuery("workStations", async () => {
    const response = await axios.get<WorkStation[]>(`${baseURL}/work_stations`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching work stations from the server</p>;
  }

  return null;
};

const ReadAssets: React.FC<{
  workStationId: number;
  onDataLoaded: (data: Asset[]) => void;
}> = ({ workStationId, onDataLoaded }) => {
  const { data, isError } = useQuery(["assets", workStationId], async () => {
    const response = await axios.get<Asset[]>(`${baseURL}/assets/${workStationId}`);
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching assets from the server</p>;
  }

  return null;
};

const ReadTransactions: React.FC<{
  timestamp: string;
  onDataLoaded: (data: Transaction[]) => void;
}> = ({ timestamp, onDataLoaded }) => {
  const { data, isError } = useQuery(["transactions", timestamp], async () => {
    const response = await axios.get<Transaction[]>(
      `${baseURL}/transactions/${timestamp}`
    );
    return response.data;
  });

  React.useEffect(() => {
    if (data) {
      onDataLoaded(data);
    }
  }, [data]);

  if (isError) {
    return <p>Error fetching transactions from the server</p>;
  }

  return null;
};

export {
  ReadSites,
  ReadPlants,
  ReadDepartments,
  ReadWorkCenters,
  ReadWorkStations,
  ReadAssets,
  ReadTransactions,
  type WorkStation,
  type Site,
  type Plant,
  type Department,
  type WorkCenter,
  type Asset,
  type Transaction,
};
