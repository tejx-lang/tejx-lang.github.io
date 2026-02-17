# TejX Homepage

TejX is a high-performance, type-safe scripting language designed for humans and built for speed. This repository contains the source code for the TejX landing page and interactive playground.

## 🚀 Features

- **Blazing Fast**: Compiled with LLVM for native performance.
- **Type Safe**: Advanced static analysis catches bugs early.
- **Modern Runtime**: Support for async/await, concurrency, and advanced data structures.
- **Interactive Playground**: Try TejX directly in your browser using WebAssembly.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with [Tailwind CSS](https://tailwindcss.com/) utilities.
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tejx-lang/homepage.git
   cd tejx-homepage
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

## 🚀 Deployment

This project is configured to deploy automatically to **GitHub Pages** using GitHub Actions.

- The deployment triggers on every push to the `main` or `init-release` branches.
- The build process uses `yarn build` and uploads the `dist` directory.
- Configuration is handled via the `base` property in `vite.config.ts`.

## ⚙️ Configuration

Centralized configuration can be found in `src/lib/constants.ts`. This file contains:

- `APP_CONFIG`: App names, versions, and social links.
- `ASSETS`: Paths to logos and favicons in the `public` directory.

---

Built with speed and safety by the TejX Language Team.
