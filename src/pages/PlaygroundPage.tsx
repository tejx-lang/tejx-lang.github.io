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
          gap: "0.6rem",
          padding: "0.42rem 0.62rem",
          borderColor: "rgba(245, 158, 11, 0.25)",
          background:
            "linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.04))",
          flexWrap: "wrap",
          flexShrink: 0,
          rowGap: "0.4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(245, 158, 11, 0.14)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={12} style={{ color: "#f59e0b" }} />
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                color: "#cbd5e1",
                margin: 0,
                lineHeight: 1.22,
                fontSize: "0.74rem",
              }}
            >
              Browser Preview: Runs a limited TejX build for basic syntax and
              language testing. Install locally for the full compiler and
              runtime features.
            </p>
          </div>
        </div>

        <Link
          to="/docs/get-started"
          className="btn-secondary"
          style={{
            padding: "0.32rem 0.58rem",
            borderRadius: "8px",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#fcd34d",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.74rem",
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
