// Chart.tsx
import React, { useEffect, useRef, useState } from "react";
import "./style/Chart.css";
import HourlyChart from "./HourlyChart";
import WeeklyChart from "./WeeklyChart";

interface ChartProps {
  countryData: {
    id: number;
    country_name: string;
    value: number;
  };
  onClose: () => void;
}

const ChartComponent: React.FC<ChartProps> = ({ countryData, onClose }) => {
  const [hourlyData, setHourlyData] = useState<number[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const generateRandomArray = (length: number, value: number) => {
    const min = value - 0.2 * value;
    const max = value + 0.2 * value;

    return Array.from({ length }, () =>
      Math.round(Math.random() * (max - min) + min)
    );
  };

  useEffect(() => {
    setHourlyData(generateRandomArray(24, countryData.value));
    setWeeklyData(generateRandomArray(7, countryData.value));
  }, [countryData.value]);

  const handleClickOutside = (event: MouseEvent) => {
    if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="ChartPopup" ref={chartRef}>
      <div className="ChartTitle">
        <h2>{countryData.country_name} Currency</h2>
      </div>

      <div className="ChartContainer">
        <HourlyChart data={hourlyData} />
      </div>
      <div className="ChartContainer">
        <WeeklyChart data={weeklyData} />
      </div>
    </div>
  );
};

export default ChartComponent;
