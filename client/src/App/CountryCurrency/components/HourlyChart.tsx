// HourlyChart.tsx
import React from "react";
import Chart from "react-apexcharts";

interface HourlyChartProps {
  data: number[];
}

const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: "hourly-rate",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => {
        if (i % 3 === 0) {
          const date = new Date();
          date.setHours(i);
          date.setMinutes(0);
          return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else {
          // Return an empty string for non-annotated hours
          return "";
        }
      }),
    },
    yaxis: {
      title: {
        text: "Value",
      },
    },
    title: {
      text: "Hourly Rate",
    },
  };

  return (
    <div>
      <Chart
        options={options}
        series={[{ name: "Hourly Rate", data }]}
        type="line"
        width="600"
      />
    </div>
  );
};

export default HourlyChart;
