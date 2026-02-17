import React from "react";
import { APP_CONFIG, ASSETS } from "../lib/constants";

const Footer: React.FC = () => {
  return (
    <footer
      className="container"
      style={{
        borderTop: "1px solid var(--glass-border)",
        padding: "4rem 0",
        marginTop: "4rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: "1.2rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <img
          src={ASSETS.TEJX_LOGO}
          alt={APP_CONFIG.NAME}
          style={{ height: "24px", width: "24px" }}
        />
        {APP_CONFIG.NAME}
      </div>
      <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
        {APP_CONFIG.FOOTER_TEXT}
      </p>
    </footer>
  );
};

export default Footer;
