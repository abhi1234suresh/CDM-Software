import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Legend, // Un-comment if legend needed
  // Cell,
} from "recharts";
import ValueWidget from "./ValueWidget";
import LabelWidget from "./LabelWidget";
//import PieChartWidget from "./PieChartWidget";
import GaugeWidget from "./GaugeWidget";

const SENSOR_COLORS_MAP = {
  "MZ-DSV01": "#8884d8",
  "MZ-DSV02": "#82ca9d",
  "MZ-DSV03": "#ffc658",
  "MZ-DSV04": "#ff7300",
  "MZ-DSV05": "#387908",
  "MZ-DSV06": "#003f5c",
  "MZ-DSV07": "#bc5090",
};

function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const WidgetWrapper = ({ widget, onRightClick, isEditMode, isLive }) => {
  const theme = useTheme();
  const config = widget.props || {};
  const value = widget.value || 0;
  const metricKey = config.metricKey || "PM10";
  const sensorId = config.sensorId;

  const [barData, setBarData] = useState([]);
  const barDataRef = useRef([]);

  useEffect(() => {
    if (!isLive) {
      barDataRef.current = [];
      setBarData([]);
      return;
    }
    // eslint-disable-next-line
  }, [config.apiUrl, metricKey, sensorId]);

  useEffect(() => {
    if (!isLive) return;
    if (config.apiUrl) {
      const fetchData = () => {
        fetch(config.apiUrl)
          .then((res) => res.json())
          .then((json) => {
            let value = null;
            if (
              json &&
              typeof json === "object" &&
              !Array.isArray(json)
            ) {
              const entry = Object.entries(json).find(([sid]) => sid === sensorId);
              if (entry && entry[1]) {
                const data = entry[1];
                if (Array.isArray(data)) {
                  const metricObj = data.find((d) => d.name === metricKey);
                  value = metricObj ? metricObj.value : null;
                } else if (typeof data === "object" && data !== null) {
                  const val = data[metricKey];
                  value = val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
                }
              }
            }
            if (value !== null && !isNaN(value)) {
              const newPoint = {
                timestamp: Date.now(),
                value: Number(value),
              };
              let updatedData = [...barDataRef.current, newPoint].slice(-10);
              barDataRef.current = updatedData;
              setBarData(updatedData);
            }
          })
          .catch(() => {
            setBarData([]);
            barDataRef.current = [];
          });
      };
      fetchData();
      const interval = setInterval(fetchData, config.pollInterval || 1000);
      return () => clearInterval(interval);
    }
  }, [config.apiUrl, config.pollInterval, widget.type, metricKey, sensorId, isLive]);

  const axisLabelColor = theme.palette.text.primary || "#fff";
  const axisTickColor = theme.palette.text.primary || "#fff";
  const chartBg = theme.palette.background.paper || "#181D31";

  const renderChart = () => {
    switch (widget.type) {
      case "bar_chart":
        return (
          <>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: axisLabelColor,
                marginBottom: 12,
                textAlign: "center"
              }}
            >
              {config.title ||
                `Bar Chart (Time Series) - ${metricKey}${sensorId ? ` (${sensorId})` : ""}`}
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                layout="horizontal"
                style={{
                  background: chartBg,
                  borderRadius: "14px"
                }}
              >
                <CartesianGrid stroke={theme.palette.divider || "#444"} strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={["auto", "auto"]}
                  tickFormatter={formatTimestamp}
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  stroke={axisTickColor}
                  interval={0}
                  minTickGap={1}
                  dy={5}
                  label={{
                    value: config.xAxisLabel|| "",
                    position: "bottom",
                    offset: 10,
                    fontSize: 14,
                    fill: axisLabelColor,
                  }}
                />
                <YAxis
                  dataKey="value"
                  type="number"
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  axisLine={false} 
                  stroke={axisTickColor}
                  domain={config.yAxisDomain || ["auto", "auto"]}
                  label={{
                    value: config.yAxisLabel || "",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 14,
                    fill: axisLabelColor,
                  }}
                />
                <Tooltip
                  labelFormatter={formatTimestamp}
                  contentStyle={{ background: chartBg, border: `1px solid ${axisLabelColor}`, color: axisLabelColor }}
                  itemStyle={{ color: axisLabelColor }}
                />
                <Bar
                  dataKey="value"
                  barSize={config.barSize || 30}
                  isAnimationActive={false}
                  fill={config.barColor || SENSOR_COLORS_MAP[sensorId] || "#888"}
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        );
      case "line_chart":
        return (
          <>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: axisLabelColor,
                textAlign: "center",
                //borderLeft: "none"
              }}
            >
              {config.title ||
                `Line Chart (Time Series) - ${metricKey}${sensorId ? ` (${sensorId})` : ""}`}
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={barData}
                margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                style={{
                  background: chartBg,
                  borderRadius: "14px"
                }}
              >
                <CartesianGrid stroke={theme.palette.divider || "#444"} strokeDasharray="3 3"  />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={["auto", "auto"]}
                  tickFormatter={formatTimestamp}
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  stroke={axisTickColor}
                  interval={0}
                  minTickGap={0}
                  dy={5}
                  label={{
                    value: config.xAxisLabel || "",
                    position: "bottom",
                    offset: 10,
                    fontSize: 14,
                    fill: axisLabelColor,
                  }}
                />
                <YAxis
                  dataKey="value"
                  type="number"
                  domain={config.yAxisDomain || ["auto", "auto"]}
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  stroke={axisTickColor}
                  label={{
                    value: config.yAxisLabel || "",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 14,
                    fill: axisLabelColor,
                  }}
                />
                <Tooltip
                  labelFormatter={formatTimestamp}
                  contentStyle={{ background: chartBg, border: `1px solid ${axisLabelColor}`, color: axisLabelColor }}
                  itemStyle={{ color: axisLabelColor }}
                  cursor={false} 
                />
                <Line
                  type={config.lineType || "monotone"}
                  dataKey="value"
                  stroke={config.lineColor || SENSOR_COLORS_MAP[sensorId] || "#8884d8"}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        );
      case "gauge":
  return (
    <GaugeWidget
      value={widget.value !== undefined ? widget.value : config.value} // always use live value
      title={config.title}
      min={config.min}
      max={config.max}
      threshold={config.threshold}
      // Add any other needed props here
    />
  );

      case "pie_chart":
        // return <PieChartWidget value={value} config={config} />;
        return <div>Pie Chart Placeholder</div>;
      default:
        return <p>Unknown widget type: {widget.type}</p>;
      case "value":
        return <ValueWidget title={config.title || "Value"} value={config.value} unit={config.unit || ""} />;
      case "label":
        return <LabelWidget label={config.label || "Label"} value={config.value || ""} />;
    }
  };

  return (
    <div
      key={widget.i}
      data-grid={widget}
      style={{
        background: chartBg,
        borderRadius: "18px",
        // boxShadow: "0px 6px 24px rgba(160, 172, 191, 0.19)",
        padding: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 320,
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onRightClick) onRightClick(widget);
      }}
    >
      {renderChart()}
    </div>
  );
};

export default WidgetWrapper;
