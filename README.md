# 💽 Disk Scheduling Simulator & OS Storage Architecture Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pure Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-orange.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(No%20npm%20needed)-brightgreen.svg)](#)
[![HTML5 Canvas](https://img.shields.io/badge/Visualization-HTML5%20Canvas%202D%20%26%203D-purple.svg)](#)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20%26%20Speech%20API-red.svg)](#)

A state-of-the-art, interactive educational suite and hardware physics lab for exploring Operating System **Disk Scheduling Algorithms** (Classical & Linux Kernel) and **Storage Hardware Architecture** (Mechanical Magnetic HDDs vs. NAND Flash NVMe SSDs).

Designed for university OS courses, computer architecture labs, and systems software engineers.

---

## 🌟 Complete Feature Matrix

### 1. 🎛️ 11 Scheduling Algorithms & Linux Kernel Schedulers
- **Classical OS Schedulers**:
  - **FCFS** (First-Come, First-Served)
  - **SSTF** (Shortest Seek Time First)
  - **SCAN** (Elevator Algorithm — ↗ High / ↙ Low Directional)
  - **C-SCAN** (Circular SCAN)
  - **LOOK** (Optimized Elevator)
  - **C-LOOK** (Circular LOOK)
  - **F-SCAN** (Dual-Queue Freeze SCAN)
  - **N-Step SCAN** (Batched SCAN with configurable $N$)
  - **User Custom Sequence**
- **Modern Linux Kernel Schedulers**:
  - **Linux Deadline Scheduler**: Separate Read/Write FIFO deadline queues ($500\text{ ms}$ Read / $5000\text{ ms}$ Write) alongside sorted sector sweep.
  - **Linux CFQ (Completely Fair Queuing)**: Multi-process round-robin time-slicing across concurrent processes (e.g. MySQL vs Backup vs Player).
  - **Linux NOOP / None**: Simple FIFO request merging; optimal standard for NVMe SSDs.

---

### 2. 🖥️ 7 Interactive Multi-Dimensional Visualizers

| Tab | Visualizer | Description |
| :--- | :--- | :--- |
| **🎯 1D Track** | Linear Track View | High-DPI track line with glowing head pointer (`H`), color-coded request nodes, seek arcs, and tooltips. |
| **📈 2D Graph** | OS Textbook Seek Chart | Time Steps ($Y$-axis, top-to-bottom) vs. Cylinder Number ($X$-axis, left-to-right). |
| **💽 Platter 2D** | Concentric Hard Disk Platter | Kinetic spinning disk with concentric circular tracks ($0 \to \text{Max}$) and pivoting mechanical actuator arm. |
| **💽 3D Cylinder** | 3D Multi-Platter Stack | Isometric stack of 3 platters (6 surfaces: Head 0 to Head 5) with a synchronized multi-head actuator comb. |
| **⚡ SSD Flash** | NAND Flash Memory Array | Visualizes Flash Translation Layer (FTL), channels, dies, blocks, and pages with zero mechanical seek. |
| **🐧 Linux Kernel** | Linux Queue Architecture | Live multi-queue breakdown showing Read FIFO, Write FIFO, and Sorted Dispatcher. |
| **💻 Code Sandbox** | In-Browser JS IDE | Live JavaScript code editor to write, test, and benchmark custom scheduling algorithms. |

---

### 3. ⚡ Storage Architecture: HDD vs. NVMe SSD

Toggle between **💽 Mechanical HDD** and **⚡ NVMe SSD**:
- **HDD Mode**: Calculates mechanical seek time + rotational latency ($\approx 4\text{ to } 10\text{ ms}$).
- **SSD Mode**: Demonstrates zero mechanical seek penalty ($\sim 0.04\text{ ms}$ uniform latency via PCIe Gen 4 FTL Controller), illustrating why classical elevator schedulers are replaced with NOOP on solid-state drives.

---

### 4. 📐 CHS ↔ LBA Translation Calculator
Converts between Cylinder-Head-Sector addressing and Logical Block Addressing:
$$\text{LBA} = (C \times \text{HeadsPerCyl} + H) \times \text{SectorsPerTrack} + (S - 1)$$

---

### 5. 🎞️ Interactive Timeline Scrubber & Media Controls
- **Drag-to-Scrub Timeline**: Scrub smoothly through any point in the simulation history like a video player.
- **Playback Suite**: Play, Pause, Next Step, Prev Step, Jump to Start, Jump to End, Reset, and Variable Speed ($1\times \to 5\times$).

---

### 6. 🎙️ Web Speech Voice Narration & Spatial Audio
- **AI Voice Narration (`V`)**: Synthesizes step-by-step vocal explanations in real time using the Web Speech API.
- **Binaural Audio Panning**: Web Audio stereo panner that pans sound left-to-right matching the head's physical cylinder position.

---

### 7. 🎓 Gamified OS Exam Quiz Arena
- Procedurally generated scenario questions testing next-cylinder predictions.
- Multiple-choice cards, streak tracker (`🔥 Streak`), score tracking, and mathematical explanations.

---

### 8. 📄 Homework Solution, Telemetry & Snapshot Exporter
- **📄 Homework Solution (`.md`)**: Full formatted Markdown assignment solution with LaTeX formulas and step tables ready to submit for university coursework.
- **📊 Telemetry Dataset (`.csv`)**: Raw numerical step-by-step dataset.
- **🖼️ Canvas Snapshot (`.png`)**: One-click high-resolution diagram export.

---

### 9. 🌓 Dual Theme Engine
- **Dark Obsidian Glass** (default, glowing neon cyberpunk accents)
- **Light Academic Paper** (clean, high-contrast, classroom projector friendly)
- Instant toggle via Header button or `T` shortcut with `localStorage` persistence.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | **Play / Pause** animation playback |
| <kbd>←</kbd> | **Previous Step** (Step backward) |
| <kbd>→</kbd> | **Next Step** (Step forward) |
| <kbd>Home</kbd> | **Jump to Start** (Initial head position) |
| <kbd>End</kbd> | **Jump to End** (Complete simulation) |
| <kbd>R</kbd> | **Reset** simulation state |
| <kbd>T</kbd> | **Toggle Theme** (Dark Obsidian ⇄ Light Academic) |
| <kbd>V</kbd> | **Toggle Voice Narration** |
| **Canvas Click** | **Inject I/O Request** at clicked cylinder |

---

## 🚀 How to Run Locally

Because the project is built with **Pure Vanilla Web Technologies**, no build tools or npm package installations are required.

### Method 1: Local HTTP Server (Python)
```bash
python -m http.server 8000
```
Open **[http://localhost:8000/project.html](http://localhost:8000/project.html)** in your browser.

### Method 2: Direct File Open
Double click `project.html` directly in any web browser.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
