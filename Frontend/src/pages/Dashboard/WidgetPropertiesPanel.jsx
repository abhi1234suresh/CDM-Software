import React, { useEffect, useState } from "react";

// List of sensor ids you want in your dropdown; update as needed
const SENSOR_OPTIONS = [
  "MZ-DSV01",
  "MZ-DSV02",
  "MZ-DSV03",
  "MZ-DSV04",
  "MZ-DSV05",
  "MZ-DSV06",
  "MZ-DSV07",
];

export default function WidgetPropertiesPanel({
  widget,
  onChange,
  onSave,
  onClose,
}) {
  const [props, setProps] = useState({ ...widget });

  useEffect(() => {
    setProps({ ...widget });
  }, [widget.i]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProps = {
      ...props,
      [name]: name === "threshold" ? Number(value) : value,
    };
    setProps(updatedProps);
    onChange(widget.i, updatedProps);
  };

  // Common list of metrics for dropdown
  const metricsOptions = ["PM10", "PM2.5", "Temperature", "Humidity"];

  const getFieldsForWidget = (type) => {
    switch (type) {
      case "line":
        return [
          { key: "title", label: "Chart Title", type: "text" },
          { key: "xAxisLabel", label: "X-Axis Label", type: "text" },     // updated key
          { key: "yAxisLabel", label: "Y-Axis Label", type: "text" },     // updated key
          { key: "lineColor", label: "Line Color", type: "color" },
          { key: "lineType", label: "Line Type", type: "dropdown", options: ["linear", "monotone", "step", "natural"] },
          { key: "metricKey", label: "Metric to Display", type: "dropdown", options: metricsOptions },
          { key: "sensorId", label: "Sensor", type: "dropdown", options: SENSOR_OPTIONS },
          { key: "apiUrl", label: "API URL", type: "text" },
        ];
      case "bar":
        return [
          { key: "title", label: "Chart Title", type: "text" },
          { key: "xAxisLabel", label: "X-Axis Label", type: "text" },     // updated key
          { key: "yAxisLabel", label: "Y-Axis Label", type: "text" },     // updated key
          { key: "barColor", label: "Bar Color", type: "color" },
          { key: "barSize", label: "Bar Size", type: "number" },
          { key: "metricKey", label: "Metric to Display", type: "dropdown", options: metricsOptions },
          { key: "sensorId", label: "Sensor", type: "dropdown", options: SENSOR_OPTIONS },
          { key: "apiUrl", label: "API URL", type: "text" },
        ];
      case "pie":
        return [
          { key: "title", label: "Chart Title", type: "text" },
          { key: "dataKey", label: "Data Key", type: "text" },
          { key: "colors", label: "Colors (comma-separated)", type: "text" },
          { key: "apiUrl", label: "API URL", type: "text" },
        ];
      case "gauge":
        return [
          { key: "title", label: "Gauge Title", type: "text" },
          { key: "min", label: "Minimum Value", type: "number" },
          { key: "max", label: "Maximum Value", type: "number" },
          { key: "threshold", label: "Threshold Value", type: "number" },
          { key: "metricKey", label: "Metric to Display", type: "dropdown", options: metricsOptions },
          { key: "sensorId", label: "Sensor", type: "dropdown", options: SENSOR_OPTIONS },
          { key: "apiUrl", label: "API URL", type: "text" },
        ];
      case "value":
        return [
          {key:"title", label:"value title", type:"text", },
          { key: "metricKey", label: "Metric to Display", type: "dropdown", options: metricsOptions },
          { key: "sensorId", label: "Sensor", type: "dropdown", options: SENSOR_OPTIONS },
          { key: "apiUrl", label: "API URL", type: "text" },
        ]  
      case "label":
        return[
          {key:"label", label:"label Title", type:"text", },
          { key: "metricKey", label: "Metric to Display", type: "dropdown", options: metricsOptions },
          { key: "sensorId", label: "Sensor", type: "dropdown", options: SENSOR_OPTIONS },
          { key: "apiUrl", label: "API URL", type: "text" },
        ]  
      default:
        return [
          { key: "title", label: "Title", type: "text" },
          { key: "apiUrl", label: "API URL", type: "text" },
        ];
    }
  };

  const rawType = widget.type || widget.widgetType;
  const normalizedType = rawType?.replace("_chart", "");
  const fields = getFieldsForWidget(normalizedType);

  return (
    <div style={{ marginTop: 15, borderTop: "1px solid #000000ff", paddingTop: 16, }}>
      <h3>Edit Widget Properties</h3>
       <div style={{ maxHeight:300, overflowY: "auto", paddingRight: 8 }}>
      {fields.map((field) => (
        <div key={field.key} style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            {field.label}:
          </label>
          {field.type === "dropdown" ? (
            <select
              name={field.key}
              value={props[field.key] || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: 4, borderRadius:"10px" }}
            >
              <option value="">Select</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.key}
              value={props[field.key] || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: 4 , borderRadius:"10px"}}
            />
          )}
        </div>
      ))}
      <button onClick={onSave} className="btn-modern">
        Save
      </button>
      <button onClick={onClose}  className="btn-modern btn-modern-cancel" style={{ marginLeft: 8 }}>
        Cancel
      </button>
    </div>
    </div>
  );
}
