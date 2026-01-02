<div align="center">
  <img src="src/assets/Banny_Bridge_logo.svg" alt="Banny Bridge" width="300" />
  
  <p>
    <strong>A Next-Generation Cross-Chain Bridging Interface</strong>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#%EF%B8%8F-technical-overview">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-Rapid-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-Deep_Space-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Wagmi-Hooks-grey?style=for-the-badge&logo=walletconnect&logoColor=white" alt="Wagmi" />
  </p>
</div>

<br />

> **Banny Bridge** reimagines the cross-chain experience by combining robust utility with premium design. Built on top of the **Across Protocol SDK**, it ensures fast, low-cost transfers while guiding users with intelligent route filtering and real-time fee estimation.

---

## 🚀 Features

<table>
  <tr>
    <td align="center">🧠</td>
    <td>
      <strong>Smart Routing</strong>
      <br />
      Automatically validates token pairs, prevents invalid transfers, and filters routes based on real-time availability.
    </td>
  </tr>
  <tr>
    <td align="center">🎨</td>
    <td>
      <strong>Immersive "Deep Space" UI</strong>
      <br />
      Features interactive, high-performance background animations, glassmorphic components, and a premium aesthetic.
    </td>
  </tr>
  <tr>
    <td align="center">⚡</td>
    <td>
      <strong>Production Ready</strong>
      <br />
      Supports major L2s including <code>Mainnet</code>, <code>Optimism</code>, <code>Arbitrum</code>, <code>Base</code>, <code>Blast</code>, <code>Linea</code>, <code>Scroll</code>, and <code>zkSync</code>.
    </td>
  </tr>
  <tr>
    <td align="center">🛠️</td>
    <td>
      <strong>Developer Friendly</strong>
      <br />
      Built-in <strong>Testnet Mode</strong> for safe development and testing, with environment-aware caching.
    </td>
  </tr>
</table>

<br />

## 🛠️ Technical Overview

**Banny Bridge** is a performant, fully-typed React application designed to demonstrate the power of the **Across Protocol V3 API**.

### 💻 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Fast HMR & Optimized Builds)
- **Languages:** [TypeScript](https://www.typescriptlang.org/) (Strict Type Checking)
- **Web3:** [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/) (Blockchain Interactions)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) (Custom "Deep Space" Theme)

### 🏗️ Architecture Highlights

<details>
<summary><strong>Environment-Aware Caching</strong></summary>
<br />
Route data is cached separately for Mainnet and Testnet using a <code>Map</code> keyed by environment. This prevents data pollution when switching between modes and ensures users always see the correct routes.
</details>

<details>
<summary><strong>Secure Proxying</strong></summary>
<br />
The development server is configured to enforce SSL verification by default, with an optional environment variable <code>VITE_DEV_ALLOW_INSECURE</code> for specific testing scenarios.
</details>

<details>
<summary><strong>Performance Optimization</strong></summary>
<br />
Extensive use of <code>useMemo</code> for computational logic (like particle generation) ensuring <strong>60fps rendering</strong> even with active background effects. Components initialize state lazily to prevent "flash of wrong content" (FOUC).
</details>

<br />

## 📦 Getting Started

Follow these steps to set up the project locally.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173` (or the next available port).

### 3. Build for Production
```bash
npm run build
```

---

<div align="center">
  <p>Powered by <a href="https://across.to/">Across Protocol</a></p>
</div>
