import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

export default function ChartWidget({
  title = "Bar Chart",
  xAxisLabel = "Timestamp",
  yAxisLabel = "Value",
  barColor = "#4682b4",
  apiUrl = "http://localhost:8000/api/live-sensors/", // point to live sensors API
  barSize = 40,
  showGrid = true,
  tooltipEnabled = true,
  sensorId = "MZ-DSV01" // choose which sensor to display
}) {
  const [data, setData] = useState([]);

  // List of keys to display in chart
  const metricsToShow = ["PM10", "PM2.5", "Temperature", "Humidity"];

  useEffect(() => {
    const fetchData = () => {
      fetch(apiUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then((json) => {
          console.log("Fetched sensor SHM data:", json);

          if (json[sensorId] && typeof json[sensorId] === "object") {
            const sensorObj = json[sensorId];

            // Only include specified metrics & convert to chart format
            const chartData = metricsToShow
              .filter((key) => key in sensorObj && !isNaN(parseFloat(sensorObj[key])))
              .map((key) => ({
                name: key,
                value: parseFloat(sensorObj[key]) || 0
              }));

            setData(chartData);
          } else {
            setData([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch data", err);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // refresh every 1s
    return () => clearInterval(interval);
  }, [apiUrl, sensorId]);

  return (
    <div
      style={{
        height: 360,
        padding: "12px",
        backgroundColor: "#fff",
        borderRadius: "12px",
       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {title && (
        <div
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {title} - {sensorId}
        </div>
      )}

      <div style={{ height: 300 }}>
        <ResponsiveBar
          data={data}
          keys={["value"]}
          indexBy="name"
          margin={{ top: 10, right: 20, bottom: 60, left: 60 }}
          padding={0.3}
          colors={barColor}
          axisBottom={{
            legend: xAxisLabel,
            legendPosition: "middle",   
            legendOffset: 40,
          }}
          axisLeft={{
            legend: yAxisLabel,
            legendPosition: "middle",
            legendOffset: -50,
          }}
          enableGridX={showGrid}
          enableGridY={showGrid}
          tooltip={tooltipEnabled ? undefined : () => null}
          barAriaLabel={(d) => `${d.indexValue}: ${d.value}`}
        />
      </div>
    </div>
  );
}
