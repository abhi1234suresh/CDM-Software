import React from "react";
import WidgetPropertiesPanel from "./WidgetPropertiesPanel";

const Sidebar = ({
  profiles,
  currentProfile,
  handleProfileSelect,
  handleCreateProfile,
  handleDeleteProfile,
  handleAddWidget,
  saveCurrentProfile,
  selectedWidget,
  setSelectedWidget,
  handlePropertySave,
  setWidgets,
  widgets,
  isRunning,
  isEditMode,
  setIsEditMode,
}) => {
  return (
    !isRunning && (
      <div
        style={{
          width: 300,
          padding: "1rem",
          //overflowY: "auto",
          position: "fixed",
          borderRadius: "10px",
          height: "calc(100vh - 12rem)",
          right: 0,
          boxSizing: "border-box",
        }}
      >
        <h3>Profiles</h3>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
          {Object.keys(profiles).map((name) => (
            <li key={name}>
              <button
                onClick={() => handleProfileSelect(name)}
                style={{
                  width: "100%",
                  margin: "0.25rem 0",
                  padding: "10px",
                  fontWeight: 500,
                  fontSize: 16,
                  letterSpacing: "0.03em",
                  textAlign: "center",
                  background: name === currentProfile ? "#007bff" : "#eee",
                  transition: "background 0.2s",
                  color: name === currentProfile ? "#fff" : "#000",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  display:"flex",
                  justifyContent:"space-between",
                }}
              >
                {name}
                 <button
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ width: "20%", marginBottom: "0.5rem" ,border:"none",background:"transparent" }}
          >
            {isEditMode ? "🔒" : "✏️"}
          </button>
              </button>
            </li>
          ))}
        </ul>
        

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            //marginBottom: "2rem",
          }}
        >
          <button
            onClick={handleCreateProfile}
            className="btn-modern"
            style={{ width: "100%", marginBottom: "0.5rem" }}  // optional minimal spacing
          >
            ➕
          </button>
          {/* <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="btn-modern"
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            {isEditMode ? "🔒" : "✏️"}
          </button> */}
          <button
            onClick={handleDeleteProfile}
            className="btn-modern"
            style={{ width: "100%", marginBottom: "0.5rem" }}
          >
            🗑️
          </button>
          
        </div>
        <button
            onClick={saveCurrentProfile}
            className="btn-modern"
            style={{ width: "100%", marginBottom: "0.5rem"}}  
          >
            💾 Save Profile
          </button>
        

        <div>
          <h3>Widgets</h3>
          {["Line Chart", "Bar Chart", "Pie Chart", "Gauge","Value", "Label"].map((label) => (
            <button
              key={label}
              onClick={() => handleAddWidget(label)}
              className="btn-modern"
              style={{ width: "50%", marginBottom: "0.5rem" }}  // optional minimal spacing
            >
              ➕ {label}
            </button>
          ))}
          {/* <button
            onClick={saveCurrentProfile}
            className="btn-modern"
            style={{ width: "100%", marginBottom: "0.5rem"}}  
          >
            💾 Save Profile
          </button>
           */}

        </div>

        {selectedWidget && (
          <WidgetPropertiesPanel
            widget={selectedWidget}
            onChange={(id, updatedProps) => {
              setWidgets((widgets) =>
                widgets.map((w) =>
                  w.i === id ? { ...w, props: { ...w.props, ...updatedProps } } : w
                )
              );
              setSelectedWidget((prev) =>
                prev ? { ...prev, props: { ...prev.props, ...updatedProps } } : prev
              );
            }}
            onSave={() => handlePropertySave(selectedWidget)}
            onClose={() => setSelectedWidget(null)}
          />
        )}
      </div>
    )
  );
};

export default Sidebar;
