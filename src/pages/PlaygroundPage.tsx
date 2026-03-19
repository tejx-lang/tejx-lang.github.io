import React from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Playground from "../components/Playground";

const PlaygroundPage: React.FC = () => {
  return (
    <div
      style={{
        height: "calc(100vh - 80px)", // Full viewport minus Navbar height
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.55rem",
          padding: "0.45rem 0.7rem",
          borderColor: "rgba(245, 158, 11, 0.25)",
          background: "rgba(245, 158, 11, 0.08)",
          flexWrap: "nowrap",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <AlertTriangle
            size={14}
            style={{ color: "#f59e0b", flexShrink: 0 }}
          />
          <p
            style={{
              color: "#f8fafc",
              margin: 0,
              lineHeight: 1.2,
              fontSize: "0.82rem",
            }}
          >
            Browser mode may miss some features. Install TejX to use
            everything.
          </p>
        </div>

        <Link
          to="/docs/get-started"
          className="btn-secondary"
          style={{
            padding: "0.34rem 0.65rem",
            borderRadius: "9px",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#fcd34d",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.78rem",
            lineHeight: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Install TejX
        </Link>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Playground height="100%" />
      </div>
    </div>
  );
};

export default PlaygroundPage;
