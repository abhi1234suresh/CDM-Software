import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import WidgetWrapper from "./WidgetWrapper";
import Sidebar from "./Sidebar";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useOutletContext } from "react-router-dom";

const MAX_WIDGETS = 20;
const COLS = 12;

const AnalyticsProfiles = () => {
  // Context values
  const { isEditMode, setIsEditMode } = useOutletContext();
  // Added local running state if not from context (adjust as needed)
  const { isRunning: contextIsRunning, setIsRunning: contextSetIsRunning } = useOutletContext() || {};
  const [isRunning, setIsRunning] = contextSetIsRunning ? [contextIsRunning, contextSetIsRunning] : useState(false);

  // Sidebar visibility state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem("analytics_profiles");
    return saved ? JSON.parse(saved) : {};
  });

  const [currentProfile, setCurrentProfile] = useState("Default");
  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);

  // Polling effect here (your existing code)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      console.log("=== POLLING START ===");
      try {
        const response = await fetch('http://10.176.11.93:8000/api/live-sensors/?format=json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const liveData = await response.json();
        console.log("API Data:", liveData);

        setWidgets((prevWidgets) =>
          prevWidgets.map((widget) => {
            if (!widget.props.apiUrl) return widget;
            const sensorId = widget.props.sensorId;
            const metricKey = widget.props.metricKey ;
            if (liveData[sensorId]) {
                const metricValue = liveData[sensorId][metricKey];
                let updatedWidget = {
        ...widget,
        value: metricValue !== undefined ? metricValue : widget.value,
        props: {
          ...widget.props,
          data: liveData[sensorId],
          value: metricValue !== undefined ? metricValue : widget.props.value,
        },
      };
      if (widget.type === "label") {
        updatedWidget.props.label = metricKey;
        updatedWidget.props.value = metricValue !== undefined ? metricValue : widget.props.value;
        updatedWidget.value = metricValue !== undefined ? metricValue : widget.value;
      }
      if (widget.type === "gauge") {
        updatedWidget.value = metricValue !== undefined ? metricValue : widget.value;
        updatedWidget.props.value = metricValue !== undefined ? metricValue : widget.props.value;
      }
      if (widget.type === "value") {
        updatedWidget.value = metricValue !== undefined ? metricValue : widget.value;
        updatedWidget.props.value = metricValue !== undefined ? metricValue : widget.props.value;
      }
      return updatedWidget;
    }
    return widget;
  })
);
      } catch (err) {
        console.error('Polling live sensor data failed:', err);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // Enhanced handleRun function
  const handleRun = async () => {
    if (isRunning) {
    // Exit run mode
    setIsRunning(false);
    setIsEditMode(true);
    setIsSidebarVisible(true);
    // Optionally reset widgets or do something else here
  } else {
    // Enter run mode
    setIsEditMode(false);
    setIsRunning(true);
    setIsSidebarVisible(false)};

    const updatedWidgets = await Promise.all(
      widgets.map(async (widget) => {
        const dataUrl = widget.props?.dataUrl?.trim();
        if (dataUrl) {
          try {
            const response = await fetch(dataUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.hourly && data.hourly.time && data.hourly.temperature_2m) {
              const chartData = data.hourly.time.map((t, idx) => ({
                name: t,
                value: data.hourly.temperature_2m[idx],
              }));
              return {
                ...widget,
                props: {
                  ...widget.props,
                  data: chartData,
                  title: widget.props.title || `Temperature @ ${data.latitude},${data.longitude}`,
                  xAxisLabel: widget.props.xAxisLabel || "Time",
                  yAxisLabel: widget.props.yAxisLabel || "Temperature (°C)",
                },
              };
            }
            if (widget.type === "gauge") {
              const gaugeValue = typeof data.value === "number" ? data.value : widget.value;
              return {
                ...widget,
                value: gaugeValue,
                props: {
                  ...widget.props,
                  title: widget.props.title || `Gauge ${widget.i}`,
                },
              };
            }
            return {
              ...widget,
              props: {
                ...widget.props,
                data,
                title: widget.props.title || `Widget ${widget.i}`,
                xAxisLabel: widget.props.xAxisLabel || "X-Axis",
                yAxisLabel: widget.props.yAxisLabel || "Y-Axis",
              },
            };
          } catch (err) {
            console.error(`Failed to fetch data for widget ${widget.i}:`, err);
            return widget;
          }
        }
        return widget;
      })
    );
    setWidgets(updatedWidgets);
  };

  // Rest of your functions unchanged...

  useEffect(() => {
    const data = profiles[currentProfile] || [];
    const filled = fillMissingPositions(data);
    setLayout(filled);
    setWidgets(filled);
  }, [currentProfile, profiles]);

  const fillMissingPositions = (items) => {
    const used = new Set();
    const result = [];
    for (let i = 0; i < items.length; i++) {
      const item = { ...items[i] };
      let pos = { x: item.x, y: item.y };
      if (
        pos.x === undefined ||
        pos.y === undefined ||
        used.has(`${pos.x},${pos.y}`)
      ) {
        pos = getNextAvailablePosition(used);
        item.x = pos.x;
        item.y = pos.y;
      }
      item.w = item.w || 3;
      item.h = item.h || 1;
      used.add(`${item.x},${item.y}`);
      result.push(item);
    }
    return result;
  };

  const getNextAvailablePosition = (
    usedSet = new Set(layout.map((l) => `${l.x},${l.y}`))
  ) => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const gridX = x * 3;
        if (!usedSet.has(`${gridX},${y}`)) {
          return { x: gridX, y };
        }
      }
    }
    return { x: 0, y: Infinity };
  };

  const handleAddWidget = (typeLabel) => {
    if (widgets.length >= MAX_WIDGETS) {
      alert("Maximum 20 widgets allowed in 4×5 layout.");
      return;
    }
    const id = Date.now().toString();
    const pos = getNextAvailablePosition();
    const type = typeLabel.toLowerCase().replace(/\s+/g, "_");

     let newWidget;

  // Add logic for new widget types:
  if (type === "value") {
    newWidget = {
      i: id,
      x: pos.x,
      y: pos.y,
      w: 3,
      h: 2,
      type,
      props: {
        title: "Value",
        value: 0, // This will be updated with live data
        unit: "", // Optionally, add a unit like "µg/m³"
        sensorId: "MZ-DSV01", // Default sensor, or select dynamically
        metricKey: "PM10", // Default metric, or select dynamically
        apiUrl: "http://10.176.11.93:8000/api/live-sensors/?format=json",
      },
      name: `Value ${id}`,
    };
  } else if (type === "label") {
    newWidget = {
      i: id,
      x: pos.x,
      y: pos.y,
      w: 3,
      h: 1,
      type,
      props: {
        label: "Sensor Label",
        value: "MZ-DSV01", // Default or customize
        sensorId: "MZ-DSV01",
        metricKey: "PM10",
        apiUrl: "http://10.176.11.93:8000/api/live-sensors/?format=json",
      },
      name: `Label ${id}`,
    };
  } else {
       newWidget = {
      i: id,
      x: pos.x,
      y: pos.y,
      w: 3,
      h: 3,
      type,
      props: {
        title: `${typeLabel} ${id}`,
        xAxisLabel: "Metric",
        yAxisLabel: "Value",
        apiUrl: "http://10.176.11.93:8000/api/live-sensors/?format=json",
        lineColor: "#8884d8",
        lineType: "linear",
        barColor: "#82ca9d",
        barSize: 30,
        dataKey: "value",
        filterLabel: null,
        data: [],
      },
      value: 0,
      name: `${typeLabel} ${id}`,
    };
  }
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    setLayout(updated);
  };

  const onLayoutChange = (newLayout) => {
    const updatedWidgets = widgets.map((w) => {
      const found = newLayout.find((l) => l.i === w.i);
      return found ? { ...w, ...found } : w;
    });
    setWidgets(updatedWidgets);
    setLayout(newLayout);
  };

  const handleNameChange = (id, newName) => {
    if (!isEditMode) return;
    setWidgets((prev) =>
      prev.map((w) => (w.i === id ? { ...w, name: newName } : w))
    );
  };

  const handleValueChange = (id, newValue) => {
    if (!isEditMode) return;
    setWidgets((prev) =>
      prev.map((w) => (w.i === id ? { ...w, value: newValue } : w))
    );
  };

  const handleDelete = (id) => {
    const updated = widgets.filter((w) => w.i !== id);
    setWidgets(updated);
    setLayout(updated);
  };

  const saveCurrentProfile = () => {
    const syncedWidgets = widgets.map((w) => {
      const match = layout.find((l) => l.i === w.i);
      if (match) {
        return {
          ...w,
          x: match.x,
          y: match.y,
          w: match.w,
          h: match.h,
        };
      }
      return w;
    });
    const updatedProfiles = { ...profiles, [currentProfile]: syncedWidgets };
    setProfiles(updatedProfiles);
    localStorage.setItem("analytics_profiles", JSON.stringify(updatedProfiles));
    alert(`Saved layout to profile "${currentProfile}"`);
  };

  const handleProfileSelect = (name) => {
    setCurrentProfile(name);
  };

  const handleCreateProfile = () => {
    const name = prompt("Enter new profile name:");
    if (name && !profiles[name]) {
      setProfiles({ ...profiles, [name]: [] });
      setCurrentProfile(name);
    }
  };

  const handleDeleteProfile = () => {
    if (currentProfile === "Default") {
      alert("Cannot delete the Default profile.");
      return;
    }
    if (window.confirm(`Delete profile "${currentProfile}"?`)) {
      const updated = { ...profiles };
      delete updated[currentProfile];
      setProfiles(updated);
      localStorage.setItem("analytics_profiles", JSON.stringify(updated));
      setCurrentProfile("Default");
    }
  };

  const handleWidgetRightClick = (widget) => {
    setSelectedWidget(widget);
  };

  const handlePropertySave = (updatedWidget) => {
    setWidgets((prev) =>
      prev.map((w) => (w.i === updatedWidget.i ? updatedWidget : w))
    );
    setSelectedWidget(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {isSidebarVisible && (
        <Sidebar
          profiles={profiles}
          currentProfile={currentProfile}
          handleProfileSelect={handleProfileSelect}
          handleCreateProfile={handleCreateProfile}
          handleDeleteProfile={handleDeleteProfile}
          handleAddWidget={handleAddWidget}
          saveCurrentProfile={saveCurrentProfile}
          selectedWidget={selectedWidget}
          setSelectedWidget={setSelectedWidget}
          handlePropertySave={handlePropertySave}
          setWidgets={setWidgets}
          widgets={widgets}
          isRunning={isRunning}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      )}
      <div style={{ flex: 1, padding: "1rem", marginRight: isSidebarVisible ? 300 : 0, overflowY: "auto" }}>
  {/* Run Button */}
  <div style={{ marginBottom: 10, position: "sticky", top: 0, zIndex: 1000 }}>
    <button onClick={handleRun} className="btn-modern">
      {isRunning ? "Stop" : "Run"}
    </button>

    {/* Profile Switch Dropdown */}
    <select
      className="btn-modern"
      value={currentProfile}
      onChange={(e) => handleProfileSelect(e.target.value)}
      //disabled={!isRunning} // Optional: Only allow switch while running
      style={{ marginLeft: "10px" }}
    >
      {Object.keys(profiles)
       // .filter((name) => name !== currentProfile)
        .map((name) => (
          <option key={name} value={name} style={{background: "black",borderRadius:"50%"}}>
             {name}
          </option> 
        ))}
    </select>
  </div>

        <GridLayout
          className="layout"
          layout={layout}
          cols={COLS}
          rowHeight={100}
          width={window.innerWidth - (isSidebarVisible ? 300 : 0)}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          onLayoutChange={onLayoutChange}
          compactType={null}
          preventCollision={true}
        >
          {widgets.map((widget) => (
            <div key={widget.i} data-grid={widget}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 10,
                  padding: 5,
                  height: "100%",
                }}
                 onContextMenu={(e) => {
                  e.preventDefault();
                 handleWidgetRightClick(widget);
                 }}
              >
                {isEditMode && !isRunning && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(widget.i);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                  >
                    ✕
                  </button>
                )}

                <WidgetWrapper
                  widget={widget}
                  onNameChange={handleNameChange}
                  onValueChange={handleValueChange}
                  isEditMode={isEditMode && !isRunning}
                  isLive={isRunning}
                />
              </div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default AnalyticsProfiles;
