import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const LineChartWidget = ({ config }) => {
  const data = config.data || [];

  const title = config.title || "Linechart";
  const xLabel = config.xAxisLabel || "Month";
  const yLabel = config.yAxisLabel || "Value";
  const lineColor = config.lineColor || "#8884d8";
  const lineType = config.lineType || "monotone";

  return (
    <div style={{ width: "100%", height: "100%",display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 8 }}>
        {title}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: xLabel,
              position: "insideBottom",
              dy: 10, // move it up slightly
              offset: 0,
            }}
          />
          <YAxis
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              dy: -10,
            }}
          />
          <Tooltip />
          <Line
            type={lineType}
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartWidget;
