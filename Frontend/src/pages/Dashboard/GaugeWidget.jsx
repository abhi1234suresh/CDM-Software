import React from "react";
import { RadialBarChart, RadialBar } from "recharts";

const GaugeWidget = ({
  title = "Gauge",
  value = 50,
  min = 0,
  max = 100,
  unit = "%",
  gaugeColor = "#8884d8",
  threshold = 70,
}) => {
  const data = [{ name: "Progress", value: value, fill: gaugeColor }];
  const gaugeValue = Math.max(min, Math.min(value, max));

  return (
    <div style={{ width: "100%", height: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h4>{title}</h4>
      <RadialBarChart
        width={220}
        height={160}
        cx={110}
        cy={140}
        innerRadius={90}
        outerRadius={105}
        barSize={18}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar minAngle={15} background clockWise={false} dataKey="value" />
      </RadialBarChart>
      <div style={{ fontSize: "24px", marginTop: "10px", color: gaugeValue >= threshold ? "red" :"#fff" }}>
        {gaugeValue}{unit}
      </div>
    </div>
  );
};

export default GaugeWidget;
