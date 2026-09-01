# Contributing to Disk Scheduling Simulator & OS Storage Lab

Thank you for your interest in contributing! Whether you are adding a new scheduling algorithm, improving visualizations, or fixing documentation, your contributions are welcome.

## How to Contribute

1. **Fork the Repository**:
   Click the **Fork** button at the top right of [https://github.com/Priya-Ranjan-0201/Disk_Scheduling_Algorithm](https://github.com/Priya-Ranjan-0201/Disk_Scheduling_Algorithm).

2. **Clone your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Disk_Scheduling_Algorithm.git
   cd Disk_Scheduling_Algorithm
   ```

3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/awesome-feature
   ```

4. **Make Your Changes**:
   - `project.html`: UI structure & semantic markup
   - `project.css`: Design system & theme styling
   - `project.js`: Algorithm logic & canvas renderers
   - `README.md`: Documentation & mathematical explanations

5. **Test Your Changes**:
   Run a local server:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000/project.html` and verify canvas animations, algorithm step accuracy, and responsive layout.

6. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   git push origin feature/awesome-feature
   ```

7. **Submit a Pull Request**:
   Open a Pull Request against the `main` branch with a clear description of your changes.

## Code Guidelines
- **Zero External Dependencies**: Keep the application purely in Vanilla HTML5, CSS3, and modern JavaScript (ES6+).
- **High-DPI Canvas Rendering**: Ensure canvas elements scale crisply on Retina/4K screens via `devicePixelRatio`.
- **Dual-Theme Compatibility**: Test styles in both Dark Obsidian Glass and Light Academic Paper themes.
