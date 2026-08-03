import React from "react";

export default function ValueWidget({ value }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        width: 100,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      {value !== undefined && value !== null ? value : ""}
    </div>
  );
}
