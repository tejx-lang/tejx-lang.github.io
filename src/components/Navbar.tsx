import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { APP_CONFIG, ASSETS } from "../lib/constants";

const Navbar: React.FC = () => {
  return (
    <nav
      className="container"
      style={{
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          letterSpacing: "-1px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <img
          src={ASSETS.TEJX_LOGO}
          alt={APP_CONFIG.NAME}
          style={{ height: "32px", width: "32px" }}
        />
        {APP_CONFIG.NAME.split("X")[0]}
        <span style={{ color: "var(--accent-primary)" }}>X</span>
      </Link>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link to="/docs" style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
          Docs
        </Link>
        <Link
          to="/get-started"
          style={{ fontSize: "0.9rem", color: "#94a3b8" }}
        >
          Get Started
        </Link>
        <a href="/#playground" style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
          Playground
        </a>
        <a
          href={APP_CONFIG.GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card"
          style={{
            padding: "0.5rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Github size={18} /> GitHub
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
