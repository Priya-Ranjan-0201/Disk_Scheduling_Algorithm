<div align="center">

# 💽 Disk Scheduling Simulator & OS Storage Architecture Lab
### *A Next-Generation Interactive Operating Systems Simulator & Hardware Physics Suite*

[![GitHub stars](https://img.shields.io/github/stars/Priya-Ranjan-0201/Disk_Scheduling_Algorithm?style=for-the-badge&color=ffd700)](https://github.com/Priya-Ranjan-0201/Disk_Scheduling_Algorithm/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Priya-Ranjan-0201/Disk_Scheduling_Algorithm?style=for-the-badge&color=6366f1)](https://github.com/Priya-Ranjan-0201/Disk_Scheduling_Algorithm/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Pure Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-f97316?style=for-the-badge)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(No%20npm%20needed)-06b6d4?style=for-the-badge)](#)

<br/>

**[⚡ Live Demo](http://localhost:8000/project.html)** • **[📖 Documentation](#-complete-feature-matrix)** • **[🧠 Algorithms](#-supported-scheduling-algorithms)** • **[⏱️ Hardware Physics](#-hardware-drive-physics--latency-equations)** • **[👨‍💻 Developed By](#-developed--maintained-by)**

</div>

---

## 🌌 Overview

The **Disk Scheduling Simulator & OS Storage Architecture Lab** is an interactive, browser-based computer science laboratory designed to visualize, benchmark, and teach **Operating System Storage Subsystems**. 

Bridging the gap between classical theoretical algorithms and real-world storage hardware, it simulates both **Mechanical Magnetic Hard Disk Drives (HDDs)** (with rotating platters and actuator arm kinematics) and **NAND Flash NVMe Solid State Drives (SSDs)** (with uniform zero-seek Flash Translation Layer controllers).

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         SIMULATOR ARCHITECTURE                          │
  ├───────────────────┬───────────────────────────────┬─────────────────────┤
  │ 🎛️ CONFIG & SPECS │     🖥️ MULTI-VIEW ENGINE      │  📊 LIVE TELEMETRY  │
  │ • 11 Schedulers   │  • 🎯 1D Linear Physical Track │  • Total Seek Cyl   │
  │ • Direction Toggle│  • 📈 2D Trajectory Seek Graph│  • Seek Latency ms  │
  │ • Drive RPM (5.4k-│  • 💽 Concentric 2D Platter   │  • Rotational Delay │
  │   15k RPM)        │  • 💽 3D Cylinder Multi-Stack │  • Access Time ms   │
  │ • HDD vs. SSD Mode│  • ⚡ NVMe SSD NAND Die Grid  │  • Head Reversals   │
  │ • Preset Workloads│  • 🐧 Linux Kernel Multi-Queue│  • Live Progress    │
  │ • Live I/O Stream │  • 💻 In-Browser JS Sandbox   │  • Step Math Proof  │
  └───────────────────┴───────────────────────────────┴─────────────────────┘
```

---

## 🌟 Complete Feature Matrix

### 🎛️ 1. Eleven Scheduling & Linux Kernel Algorithms
- **Classical OS Schedulers**:
  - `FCFS` (First-Come, First-Served)
  - `SSTF` (Shortest Seek Time First)
  - `SCAN` (Elevator Algorithm — ↗ High / ↙ Low Directional)
  - `C-SCAN` (Circular SCAN with rapid return)
  - `LOOK` (Optimized Elevator reversing at boundary requests)
  - `C-LOOK` (Circular LOOK)
  - `F-SCAN` (Dual-Queue Freeze SCAN preventing starvation)
  - `N-Step SCAN` (Batched SCAN with configurable batch size $N$)
  - `User Custom Sequence` (Raw input trace verification)
- **Modern Linux Kernel Schedulers**:
  - `Linux Deadline Scheduler`: Separate Read FIFO ($500\text{ ms}$) and Write FIFO ($5000\text{ ms}$) expiration queues alongside a sorted sector dispatcher.
  - `Linux CFQ (Completely Fair Queuing)`: Multi-process round-robin time-slicing across concurrent processes (`MySQL` vs `Backup` vs `Video`).
  - `Linux NOOP / None`: Pure FIFO request merging with zero sorting overhead (the gold standard for NVMe SSDs).

---

### 🖥️ 2. Seven Interactive Multi-Dimensional Visualizers

| Mode | Name | Visual Experience & Physical Details |
| :---: | :--- | :--- |
| 🎯 | **1D Linear Track** | High-DPI physical track with glowing magnetic head pointer (`H`), color-coded request nodes, seek arcs, and interactive tooltips. |
| 📈 | **2D Seek Graph** | OS textbook-style coordinate chart plotting Time Steps ($Y$-axis, top-to-bottom) vs. Cylinder Number ($X$-axis, left-to-right). |
| 💽 | **Concentric 2D Platter** | Kinetic rotating magnetic platter ($0 \to \text{Max}$) with a mechanical actuator arm pivoting its read/write head tip over tracks. |
| 💽 | **3D Cylinder Stack** | Isometric stack of 3 platters (6 surfaces: Head 0 to Head 5) with a synchronized multi-head actuator comb demonstrating CHS addressing. |
| ⚡ | **NVMe SSD Flash Array** | 4-channel, 16-die NAND Flash cell array demonstrating Flash Translation Layer (FTL) wear-leveling and zero mechanical seek penalty. |
| 🐧 | **Linux Kernel Lab** | Real-time multi-queue visualization showing Read FIFO, Write FIFO, and Sorted Dispatcher queues. |
| 💻 | **In-Browser JS Sandbox** | Integrated Monaco-style JavaScript code editor allowing students to write, execute, and test their own custom scheduling algorithms. |

---

### ⚡ 3. Storage Hardware Architecture: Mechanical HDD vs. NVMe SSD

Toggle between **💽 Mechanical HDD** and **⚡ NVMe SSD** with one click:
- **Mechanical HDD Mode**:
  - Accurately models physical actuator arm acceleration ($2.0\text{ ms startup} + \Delta C \times 0.15\text{ ms/cyl}$) and rotational delays across $5400$, $7200$, $10000$, and $15000\text{ RPM}$ spindles.
- **NAND Flash NVMe SSD Mode**:
  - Demonstrates why classical elevator schedulers are bypassed on SSDs in favor of `NOOP`/`none`, showcasing uniform $\sim 0.04\text{ ms}$ latency across arbitrary logical block addresses.

---

### 📐 4. CHS ↔ LBA Translation Calculator
Built-in live mathematical translator converting between **Cylinder-Head-Sector (CHS)** and **Logical Block Addressing (LBA)**:
$$\text{LBA} = (C \times \text{HeadsPerCyl} + H) \times \text{SectorsPerTrack} + (S - 1)$$

---

### 🎞️ 5. Interactive Drag-to-Scrub Timeline & Voice Narration
- **Video-Style Scrubber**: Drag continuously through the seek history to inspect head positions at any micro-step.
- **AI Voice Narration (`V`)**: Live Web Speech API voice synthesis announcing each cylinder seek.
- **Binaural Stereo Audio**: Web Audio stereo panner that pans sound left-to-right matching the head's physical cylinder position.

---

### 🎓 6. Gamified OS Exam Quiz Arena
- Procedurally generated university exam questions testing next-cylinder predictions.
- Multiple-choice cards, streak tracker (`🔥 Streak`), score tracking, and mathematical step explanations.

---

### 📄 7. Homework Solution & Data Export Suite
- **📄 Homework Solution (`.md`)**: Full formatted Markdown assignment report with LaTeX formulas, seek distance tables, and final metrics ready to submit for university coursework.
- **📊 Telemetry Dataset (`.csv`)**: Raw numerical step-by-step dataset.
- **🖼️ Canvas Snapshot (`.png`)**: One-click high-resolution diagram export.

---

### 🌓 8. Dual Theme Engine
- **Dark Obsidian Glass** (Cyberpunk neon glow, default)
- **Light Academic Paper** (High-contrast, classroom projector friendly)
- Toggle instantly via Header button or <kbd>T</kbd> shortcut with `localStorage` persistence.

---

## 🧠 Supported Scheduling Algorithms Comparison

| Algorithm | Type | Time Complexity | Starvation Risk | Directional | Best Use Case |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **FCFS** | Classical | $\mathcal{O}(N)$ | None (100% Fair) | No | Light, sequential workloads |
| **SSTF** | Classical | $\mathcal{O}(N^2)$ | High (Boundary Starvation) | No | Batch workloads with clustered requests |
| **SCAN** | Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | High-load shared HDD servers |
| **C-SCAN** | Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | Systems requiring uniform wait times |
| **LOOK** | Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | General-purpose desktop HDDs |
| **C-LOOK** | Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | High-throughput server workloads |
| **F-SCAN** | Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | High dynamic arrival environments |
| **N-Step SCAN**| Classical | $\mathcal{O}(N \log N)$ | None | Yes (↗ / ↙) | Systems prone to arm stickiness |
| **Linux Deadline**| Linux Kernel | $\mathcal{O}(N \log N)$ | Guaranteed None | Yes | Real-time & database servers (MySQL) |
| **Linux CFQ** | Linux Kernel | $\mathcal{O}(P \times N)$ | None | Round-Robin | Multi-user & desktop Linux systems |
| **Linux NOOP** | Linux Kernel | $\mathcal{O}(N)$ | None | No | **NVMe SSDs, Flash, & Virtual Disks** |

---

## ⏱️ Hardware Drive Physics & Latency Equations

Disk access time is calculated using the official Operating Systems physics formulation:

$$\text{Total Access Time } (T_{\text{access}}) = T_{\text{seek}} + T_{\text{rotational}} + T_{\text{transfer}}$$

### 1. Seek Time ($T_{\text{seek}}$)
The time required for the mechanical actuator arm to position the read/write head over the desired cylinder track:
$$T_{\text{seek}} = T_{\text{startup}} + (\Delta C \times \text{Seek Rate})$$
- Default: $2.0\text{ ms startup} + (\text{Seek Cylinders} \times 0.15\text{ ms/cyl})$

### 2. Average Rotational Latency ($T_{\text{rotational}}$)
The average time for the requested disk sector to rotate under the read/write head (equivalent to half a rotation):
$$T_{\text{rotational}} = \frac{1}{2} \times \left(\frac{60}{\text{RPM}}\right) \times 1000\text{ ms}$$

| Spindle Speed (RPM) | Category | Average Rotational Delay |
| :---: | :---: | :---: |
| **5,400 RPM** | Laptop / Power-Saving HDD | **5.56 ms** |
| **7,200 RPM** | Desktop Standard HDD | **4.17 ms** |
| **10,000 RPM** | VelociRaptor High-Performance | **3.00 ms** |
| **15,000 RPM** | Enterprise SAS / Server HDD | **2.00 ms** |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :---: | :--- |
| <kbd>Space</kbd> | **Play / Pause** animation playback |
| <kbd>←</kbd> | **Previous Step** (Step backward) |
| <kbd>→</kbd> | **Next Step** (Step forward) |
| <kbd>Home</kbd> | **Jump to Start** (Initial head position) |
| <kbd>End</kbd> | **Jump to End** (Complete simulation) |
| <kbd>R</kbd> | **Reset** simulation state |
| <kbd>T</kbd> | **Toggle Theme** (Dark Obsidian ⇄ Light Academic) |
| <kbd>V</kbd> | **Toggle AI Voice Narration** |
| **Canvas Click** | **Inject I/O Request** at clicked cylinder/sector |

---

## 🚀 How to Run Locally

Because the project is built with **Pure Vanilla Web Technologies**, zero build tools or npm package installations are required.

### Method 1: Local HTTP Server (Python)
```bash
python -m http.server 8000
```
Open **[http://localhost:8000/project.html](http://localhost:8000/project.html)** in your browser.

### Method 2: Direct File Open
Double click `project.html` directly in any modern web browser.

---

## 👨‍💻 Developed & Maintained By

<div align="center">

### **PRIYA RANJAN**
*Full-Stack Engineer & Systems Architecture Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-Priya--Ranjan--0201-181717?style=for-the-badge&logo=github)](https://github.com/Priya-Ranjan-0201)
[![Repository](https://img.shields.io/badge/Repository-Disk__Scheduling__Algorithm-6366f1?style=for-the-badge&logo=git)](https://github.com/Priya-Ranjan-0201/Disk_Scheduling_Algorithm)

<br/>

**Crafted with ❤️ and precision for Operating Systems education and computer engineering students worldwide.**

</div>

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

<div align="center">
  <sub>⭐ If you find this project helpful for your Operating Systems studies or coursework, please consider starring the repository!</sub>
</div>
