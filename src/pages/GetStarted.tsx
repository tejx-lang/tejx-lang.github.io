import React from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";

const GetStarted: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const installCommand = "curl -fsSL https://tejx.dev/install.sh | sh";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "2rem", minHeight: "80vh" }}
    >
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            marginBottom: "1.5rem",
          }}
        >
          Get Started
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            marginBottom: "3rem",
            maxWidth: "800px",
          }}
        >
          Start building with TejX in under 30 seconds.
        </p>

        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            Installation
          </h2>
          <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
            Install the TejX compiler and toolchain using our install script:
          </p>

          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: "1.1rem",
              maxWidth: "600px",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Terminal size={20} color="#94a3b8" />
              <span>{installCommand}</span>
            </div>
            <button
              onClick={handleCopy}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: copied ? "#10b981" : "#94a3b8",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </section>

        <section>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            Your First Program
          </h2>
          <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
            Create a file named `hello.tx` and add the following code:
          </p>

          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              fontFamily: "monospace",
              fontSize: "1rem",
              maxWidth: "600px",
              background: "rgba(0,0,0,0.3)",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ color: "#c678dd" }}>func</span>{" "}
            <span style={{ color: "#61afef" }}>main</span>() {"{"}
            <br />
            &nbsp;&nbsp;<span style={{ color: "#e06c75" }}>print</span>(
            <span style={{ color: "#98c379" }}>"Hello, World!"</span>);
            <br />
            {"}"}
          </div>

          <p style={{ color: "#cbd5e1", marginBottom: "1rem" }}>
            Run it with the TejX compiler:
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1rem 1.5rem",
              fontFamily: "monospace",
              fontSize: "1rem",
              maxWidth: "600px",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            tejx run hello.tx
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default GetStarted;
