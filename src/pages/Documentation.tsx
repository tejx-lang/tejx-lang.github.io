import React from "react";
import { motion } from "framer-motion";

const Documentation: React.FC = () => {
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
          Documentation
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            marginBottom: "2rem",
            maxWidth: "800px",
          }}
        >
          Learn how to use TejX to build high-performance applications.
        </p>

        <div
          className="glass-card"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Introduction
          </h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            TejX is a modern scripting language designed for performance and
            developer experience. It combines the simplicity of dynamic
            languages with the speed of native compilation.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "2rem" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Core Concepts
          </h2>
          <ul
            style={{ color: "#cbd5e1", lineHeight: 1.6, paddingLeft: "1.5rem" }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              Static Typing with Type Inference
            </li>
            <li style={{ marginBottom: "0.5rem" }}>Async/Await Runtime</li>
            <li style={{ marginBottom: "0.5rem" }}>LLVM-based Compilation</li>
            <li style={{ marginBottom: "0.5rem" }}>
              Memory Safety without Garbage Collection
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Documentation;
