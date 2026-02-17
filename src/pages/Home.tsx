import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Code, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Playground from "../components/Playground";
import { APP_CONFIG } from "../lib/constants";

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="container"
        style={{ textAlign: "center", paddingTop: "6rem" }}
      >
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="glass-card"
            style={{
              display: "inline-flex",
              padding: "0.4rem 1rem",
              fontSize: "0.8rem",
              color: "var(--accent-primary)",
              marginBottom: "2rem",
              border: "1px solid rgba(124, 58, 237, 0.3)",
            }}
          >
            v{APP_CONFIG.VERSION} is now live ✨
          </div>
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            The Future of <br />
            <span className="gradient-text">Modern Scripting</span>
          </h1>
          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 3rem",
              color: "#94a3b8",
              fontSize: "1.2rem",
            }}
          >
            {APP_CONFIG.DESCRIPTION}
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
          >
            <Link
              to="/get-started"
              className="glass-card"
              style={{
                background: "var(--accent-primary)",
                color: "white",
                padding: "1rem 2rem",
                fontWeight: 600,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/docs"
              className="glass-card btn-outline"
              style={{
                padding: "1rem 2rem",
                fontWeight: 600,
                fontSize: "1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Documentation
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Built for performance.
          </h2>
          <p style={{ color: "#64748b" }}>
            Experience the power of a compiler with the simplicity of a script.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            {
              icon: <Zap color="#7c3aed" />,
              title: "Blazing Fast",
              desc: "Compiled with LLVM for native performance on any hardware.",
            },
            {
              icon: <Shield color="#3b82f6" />,
              title: "Type Safe",
              desc: "Advanced static analysis catches bugs before they even happen.",
            },
            {
              icon: <Cpu color="#10b981" />,
              title: "Modern Runtime",
              desc: "Native support for async/await, concurrency, and advanced data structures.",
            },
            {
              icon: <Code color="#f59e0b" />,
              title: "Intuitive Syntax",
              desc: "Familiar feel with powerful features like pattern matching and optional chaining.",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card"
              style={{ padding: "2rem" }}
            >
              <div
                style={{
                  marginBottom: "1.5rem",
                  background: "rgba(255,255,255,0.05)",
                  padding: "1rem",
                  borderRadius: "16px",
                  width: "fit-content",
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.8rem",
                }}
              >
                {feat.title}
              </h3>
              <p style={{ color: "#94a3b8" }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="playground" className="container" style={{ padding: "0" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Try it in your browser.
          </h2>
          <p style={{ color: "#64748b" }}>
            No installation required. Write, run, and experiment with TejX
            instantly.
          </p>
        </div>
        <Playground />
      </section>
    </>
  );
};

export default Home;
