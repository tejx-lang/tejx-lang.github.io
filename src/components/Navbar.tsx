import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Menu, X } from "lucide-react";
import { APP_CONFIG, ASSETS } from "../lib/constants";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/docs/intro", label: "Docs" },
    { to: "/docs/get-started", label: "Get Started" },
    { to: "/playground", label: "Playground" },
  ];

  return (
    <nav className="relative z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
        >
          <img
            src={ASSETS.TEJX_LOGO}
            alt={APP_CONFIG.NAME}
            className="w-8 h-8 rounded-lg"
          />
          <span className="hidden sm:inline">{APP_CONFIG.NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={APP_CONFIG.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex items-center gap-2 px-4 py-2 text-sm font-bold border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <Github size={18} /> <span>GitHub</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden z-50"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-gray-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={APP_CONFIG.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 font-bold"
              >
                <Github size={20} /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

import { motion, AnimatePresence } from "framer-motion";

export default Navbar;
