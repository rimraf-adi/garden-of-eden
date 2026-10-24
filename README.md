# Garden of Eden 🌿
> **A Living Computational Arboretum & First-Principles AI Engineering Sanctuary**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/KaTeX-495+_Equations-00d084?style=flat-square)](https://katex.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square)](LICENSE)

**Garden of Eden** is an open-access sanctuary designed for AI engineers, researchers, and students. It bridges foundational mathematics (linear algebra, vector calculus, probability, information theory) with frontier systems (KV cache mechanics, FlashAttention SRAM tiling, distributed consensus, and autonomous agent loops)—all derived from first principles.

---

## 🏛️ Pedagogy & Design Ethos

- **Sanctuary Aesthetic**: An ethereal, serene experience inspired by mindful living platforms—featuring an edge-to-edge sacred Tree of Knowledge, tranquil atmospheric morning mist, and luxury editorial serif typography.
- **Fanout-Inspired Field Binders**: 7 tabbed, pastel-tinted physical folder portfolios with line art vector artwork, monospace status capsules, and structured lesson breakdowns.
- **Chronological Table of Contents**: 25 meticulously ordered modules sequenced from **Pure Mathematics** → **Statistical Learning** → **Deep Learning** → **Systems & GPU** → **Distributed Scale** → **Agentic Systems**.
- **No External Textbooks or Vendor Lock-in**: An authentic, self-contained computational platform formulated from open scientific principles.

---

## 📚 Curricula Structure (Chronological Order)

The platform is organized into 7 core field binders and 25 sequential modules:

| Order | Portfolio | Focus Areas | Key Formulations |
| :---: | :--- | :--- | :--- |
| **01** | **Mathematics for Machine Learning** | Vector spaces, SVD, Hessians, KKT conditions | $\mathbf{A} = \mathbf{U} \mathbf{\Sigma} \mathbf{V}^T$, $\nabla^2 f(\mathbf{x})$ |
| **02** | **Information Theory & Probability** | Shannon entropy, KL-divergence, Bayes rule | $D_{KL}(P \parallel Q) = \sum P \log \frac{P}{Q}$ |
| **03** | **Statistical Learning Theory** | PAC learnability, VC dimension, Rademacher complexity | $R(h) \le \hat{R}(h) + \sqrt{\frac{8d \ln(2em/d)}{m}}$ |
| **04** | **AI Research & Deep Architectures** | Multi-head attention, RoPE, MoE routing | $\text{Softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}}\right)\mathbf{V}$ |
| **05** | **Inference Engineering** | GPU SRAM tiling, KV cache sizing, FlashAttention | $2 \times L \times H \times D \times \text{bytes}$ |
| **06** | **System Design in Depth** | Raft consensus, FSDP parallelism, sharding topologies | Log replication, quorum majorities |
| **07** | **Agentic Systems & Production RAG** | ReAct loops, grammar-constrained decoding, vector indices | Tool dispatch, recursive reflection |

---

## ⚡ Core Capabilities

- **495+ Verified KaTeX Formulations**: Every mathematical theorem, bounds proof, and gradient calculation is rendered cleanly with rigorous derivations.
- **Interactive Simulation Laboratories**: Browser-native analytical calculators for testing decision boundaries, KV cache memory footprint budgets, and learning dynamics.
- **Instant Command Palette (`⌘K`)**: Fast global search across all 25 modules, algorithms, mathematical notations, and interactive workbenches.
- **Adaptive Light & Dark Modes**: Responsive color tokens optimized for readability across high-contrast daylight and midnight editing sessions.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.18.0
- **npm**, **pnpm**, or **yarn**

### Installation

```bash
# Clone repository
git clone https://github.com/rimraf-adi/garden-of-eden.git
cd garden-of-eden

# Install dependencies
npm install
```

### Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port reported in your terminal) to explore the living garden.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Repository Architecture

```text
garden-of-eden/
├── app/                      # Next.js 16 App Router
│   ├── page.tsx              # Sanctuary landing page with full-bleed hero tree & folder binders
│   ├── modules/              # Chronological Table of Contents (All 25 modules)
│   ├── chapter/[slug]/       # Interactive reader interface for chapters
│   ├── paths/[slug]/         # Deep portfolio views for curated field binders
│   ├── workbench/            # Browser simulation laboratories
│   ├── practice/             # Deliberate practice drills & problem sets
│   ├── notations/            # Verified mathematical index
│   └── layout.tsx            # Global fonts (Newsreader, Geist) & theme wrappers
├── components/               # UI components
│   ├── Navbar.tsx            # Glassmorphic top bar with Zen Cairn icon & instant search
│   ├── Footer.tsx            # Sanctuary footer with navigation groves & typographic seal
│   ├── FolderCard.tsx        # Fanout-style physical tabbed binder cards
│   └── ...
├── lib/                      # Core data & domain models
│   ├── pathsData.ts          # 7 curated portfolios with pastel palettes & vector art
│   ├── curriculum.ts         # 25 chronological modules and concept DAG definitions
│   └── bookData.ts           # Chapter index metadata
└── public/
    └── hero-tree.jpg         # Full-bleed Tree of Knowledge centerpiece
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
All mathematical formulations and algorithms are derived from open scientific literature.
