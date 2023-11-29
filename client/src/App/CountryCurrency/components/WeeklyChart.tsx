// WeeklyChart.tsx
import React from "react";
import Chart from "react-apexcharts";

interface WeeklyChartProps {
  data: number[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const options = {
    chart: {
      id: "weekly-rate",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yaxis: {
      title: {
        text: "Value",
      },
    },
    title: {
      text: "Weekly Rate",
    },
  };

  return (
    <div>
      <Chart
        options={options}
        series={[{ name: "Weekly Rate", data }]}
        type="line"
        width="600"
      />
    </div>
  );
};

export default WeeklyChart;
