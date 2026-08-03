import React from "react";

export default function LabelWidget({
  label,
  value,
  ledColor = "#4caf50",
  isBlinking = false,
  onLedColorChange,
  onBlinkToggle,
  editable
}) {
  const ledStyle = {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: ledColor,
    marginBottom: 10,
    boxShadow: "0 0 8px " + ledColor,
    animation: isBlinking
      ? "led-blink 1s linear infinite"
      : undefined,
    border: "2px solid #222"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        //background: "#383a42",
        borderRadius: 14,
        padding: 24,
        minWidth: 220,
        height: "100%",
        color: "#fff"
      }}
    >
      <div style={ledStyle}></div>
      {editable && (
        <div style={{marginBottom: 8}}>
          <input type="color" value={ledColor}
            onChange={(e) => onLedColorChange(e.target.value)}
            style={{marginRight: 8}}
          />
          <label>
            <input
              type="checkbox"
              checked={isBlinking}
              onChange={(e) => onBlinkToggle(e.target.checked)}
              style={{marginRight: 4}}
            />
            Blink
          </label>
        </div>
      )}
      <div style={{ fontSize: 16, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 22, marginTop: 12 }}>
        {value !== undefined && value !== null ? value : "--"}
      </div>
      <style>
        {`
          @keyframes led-blink {
            0% { opacity: 1; }
            50% { opacity: 0.15; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
