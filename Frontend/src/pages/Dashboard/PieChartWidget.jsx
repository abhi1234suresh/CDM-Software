import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function PieChartWidget({
  title = "Pie Chart",
  dataUrl,
  labelType = "percentage", // or "value", "none"
  showLegend = true,
  colors = "#0088FE,#00C49F,#FFBB28,#FF8042",
  tooltipEnabled = true,
}) {
  const [data, setData] = useState(null);
  const colorArray = colors.split(",");

  useEffect(() => {
    if (!dataUrl) return;

    fetch(dataUrl)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setData([]);
      });
  }, [dataUrl]);

  if (!data) return <div>Loading Pie Chart...</div>;
  if (data.length === 0) return <div>No data available</div>;

  const labelFn = (entry) => {
    if (labelType === "percentage") {
      const total = data.reduce((acc, d) => acc + d.value, 0);
      const percent = ((entry.value / total) * 100).toFixed(1);
      return `${percent}%`;
    } else if (labelType === "value") {
      return entry.value;
    } else {
      return "";
    }
  };

  return (
    <div>
      <h4>{title}</h4>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={labelFn}
        >
          {data.map((_, i) => (
            <Cell key={`cell-${i}`} fill={colorArray[i % colorArray.length]} />
          ))}
        </Pie>
        {tooltipEnabled && <Tooltip />}
        {showLegend && <Legend />}
      </PieChart>
    </div>
  );
}
