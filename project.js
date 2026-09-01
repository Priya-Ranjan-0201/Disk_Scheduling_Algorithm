/**
 * Disk Scheduling Simulator & OS Storage Architecture Lab - Core Engine
 * Implements:
 *  - Classical OS Schedulers: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, F-SCAN, N-Step SCAN, User Custom
 *  - Linux Kernel Schedulers: Deadline Scheduler, CFQ (Completely Fair Queuing), NOOP / None
 *  - Storage Architecture: Mechanical Magnetic HDD vs. NAND Flash NVMe SSD
 *  - Visualizers: 1D Track, 2D Graph, 2D Platter, 3D Multi-Platter Cylinder Stack, SSD Flash Grid, Linux Queues
 *  - In-Browser Custom JavaScript Algorithm Code Sandbox
 *  - Interactive Drag-to-Scrub Timeline, Web Speech Voice Narration, and Spatial Web Audio
 */

// ==========================================================================
// DOM Element References
// ==========================================================================
const canvas = document.getElementById('diskCanvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvasWrapper');
const canvasTooltip = document.getElementById('canvasTooltip');
const clickToInjectBanner = document.getElementById('clickToInjectBanner');

const deviceHddBtn = document.getElementById('deviceHddBtn');
const deviceSsdBtn = document.getElementById('deviceSsdBtn');

const requestsInput = document.getElementById('requests');
const headInput = document.getElementById('head');
const maxCylinderInput = document.getElementById('maxCylinder');
const algorithmSelect = document.getElementById('algorithm');
const nStepGroup = document.getElementById('nStepGroup');
const nStepSizeInput = document.getElementById('nStepSize');
const directionGroup = document.getElementById('directionGroup');
const presetSelect = document.getElementById('presetSelect');
const requestCountBadge = document.getElementById('requestCountBadge');
const liveStreamToggleBtn = document.getElementById('liveStreamToggleBtn');

const togglePhysicsBtn = document.getElementById('togglePhysicsBtn');
const physicsDrawer = document.getElementById('physicsDrawer');
const rpmSelect = document.getElementById('rpmSelect');
const trackSeekTimeInput = document.getElementById('trackSeekTime');

const chsCyl = document.getElementById('chsCyl');
const chsHead = document.getElementById('chsHead');
const chsSec = document.getElementById('chsSec');
const chsLbaResult = document.getElementById('chsLbaResult');

const startBtn = document.getElementById('startBtn');
const compareBtn = document.getElementById('compareBtn');
const randomBtn = document.getElementById('randomBtn');
const voiceToggleBtn = document.getElementById('voiceToggleBtn');
const voiceIcon = document.getElementById('voiceIcon');
const audioToggleBtn = document.getElementById('audioToggleBtn');
const audioIcon = document.getElementById('audioIcon');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

const exportMenuBtn = document.getElementById('exportMenuBtn');
const exportMenu = document.getElementById('exportMenu');
const exportSolutionBtn = document.getElementById('exportSolutionBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportPngBtn = document.getElementById('exportPngBtn');

const timelineScrubber = document.getElementById('timelineScrubber');
const timelineStepBadge = document.getElementById('timelineStepBadge');

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const jumpStartBtn = document.getElementById('jumpStartBtn');
const jumpEndBtn = document.getElementById('jumpEndBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

const telemetryCardTitle = document.getElementById('telemetryCardTitle');
const seekMetricLabel = document.getElementById('seekMetricLabel');
const seekMetricUnit = document.getElementById('seekMetricUnit');
const totalSeekElem = document.getElementById('totalSeek');
const totalSeekTimeMsElem = document.getElementById('totalSeekTimeMs');
const rotDelayMsElem = document.getElementById('rotDelayMs');
const totalAccessTimeMsElem = document.getElementById('totalAccessTimeMs');
const reversalsCountElem = document.getElementById('reversalsCount');
const currentStepDisplayElem = document.getElementById('currentStepDisplay');
const totalStepsElem = document.getElementById('totalSteps');
const progressBarFill = document.getElementById('progressBarFill');

const tabTrack = document.getElementById('tabTrack');
const tabGraph = document.getElementById('tabGraph');
const tabPlatter = document.getElementById('tabPlatter');
const tab3DStack = document.getElementById('tab3DStack');
const tabSsd = document.getElementById('tabSsd');
const tabLinux = document.getElementById('tabLinux');
const tabSandbox = document.getElementById('tabSandbox');
const tabComparison = document.getElementById('tabComparison');
const tabQuiz = document.getElementById('tabQuiz');
const viewModeBadge = document.getElementById('viewModeBadge');

const sandboxOverlay = document.getElementById('sandboxOverlay');
const sandboxCodeEditor = document.getElementById('sandboxCodeEditor');
const sandboxConsoleLog = document.getElementById('sandboxConsoleLog');
const sandboxResetBtn = document.getElementById('sandboxResetBtn');
const sandboxRunBtn = document.getElementById('sandboxRunBtn');

const quizOverlay = document.getElementById('quizOverlay');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizScenarioDetails = document.getElementById('quizScenarioDetails');
const quizOptionsGrid = document.getElementById('quizOptionsGrid');
const quizFeedbackBox = document.getElementById('quizFeedbackBox');
const quizFeedbackText = document.getElementById('quizFeedbackText');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizScoreElem = document.getElementById('quizScore');
const quizTotalElem = document.getElementById('quizTotal');
const quizStreakBadge = document.getElementById('quizStreakBadge');

const algoTitle = document.getElementById('algoTitle');
const algoTag = document.getElementById('algoTag');
const algorithmDescriptionElem = document.getElementById('algorithmDescription');
const algoSpecsGrid = document.getElementById('algoSpecsGrid');
const specComplexity = document.getElementById('specComplexity');
const specStarvation = document.getElementById('specStarvation');
const specDirectional = document.getElementById('specDirectional');

const stepDetailsElem = document.getElementById('stepDetails');
const serviceOrderChipsElem = document.getElementById('serviceOrderChips');

// ==========================================================================
// Application State
// ==========================================================================
let simulationState = null;
let comparisonState = null;
let deviceMode = 'HDD'; // 'HDD' | 'SSD'
let currentView = 'track'; // 'track' | 'graph' | 'platter' | 'stack3d' | 'ssd' | 'linux' | 'sandbox' | 'comparison' | 'quiz'
let currentStep = -1;
let isPlaying = false;
let animationSpeed = 3;
let soundEnabled = true;
let voiceEnabled = false;
let audioCtx = null;
let currentTheme = localStorage.getItem('disk_sim_theme') || 'dark';
let nodeHitboxes = [];
let platterAngle = 0;
let isLiveStreaming = false;
let liveStreamTimer = null;

// Quiz State
let quizScore = 0;
let quizTotal = 0;
let quizStreak = 0;
let currentQuizData = null;

// Default Sandbox Code Template
const defaultSandboxCode = `/**
 * Custom Scheduling Algorithm
 * @param {number[]} requests - Array of cylinder requests
 * @param {number} head - Initial head position
 * @param {number} maxCylinder - Maximum cylinder limit
 * @returns {object} { order: number[], totalSeek: number, steps: Array }
 */
function myCustomScheduler(requests, head, maxCylinder) {
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  // Example: Sort requests by distance to head (Greedy SSTF variant)
  const pending = [...requests];
  while (pending.length > 0) {
    pending.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
    const next = pending.shift();
    const seek = Math.abs(next - current);
    totalSeek += seek;
    steps.push({
      from: current,
      to: next,
      seek: seek,
      cumulative: totalSeek,
      explanation: \`Custom seek: \${current} → \${next} (\${seek} cyl)\`
    });
    order.push(next);
    current = next;
  }

  return { order, totalSeek, steps };
}`;

// Algorithm Theoretical Profiles
const algorithmProfiles = {
  FCFS: {
    name: "First-Come, First-Served",
    tag: "FCFS",
    complexity: "O(N)",
    starvation: "No (Fair)",
    directional: "No",
    description: "Processes disk requests in the exact arrival order. Completely fair with zero starvation, but often suffers from excessive seek times when requests are scattered."
  },
  SSTF: {
    name: "Shortest Seek Time First",
    tag: "SSTF",
    complexity: "O(N²)",
    starvation: "Yes (High)",
    directional: "No",
    description: "Greedily selects the request closest to current head position. Drastically reduces total seek time, but distant requests near boundaries can starve indefinitely under continuous traffic."
  },
  SCAN: {
    name: "SCAN (Elevator Algorithm)",
    tag: "SCAN",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "The head sweeps continuously in one direction servicing requests until reaching the extreme disk boundary (0 or Max), then reverses. Balances wait times and prevents starvation."
  },
  CSCAN: {
    name: "Circular SCAN (C-SCAN)",
    tag: "C-SCAN",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "Sweeps in one direction servicing requests to the boundary, then performs an immediate rapid return to the opposite boundary without servicing. Provides more uniform wait times across all cylinders."
  },
  LOOK: {
    name: "LOOK (Optimized Elevator)",
    tag: "LOOK",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "An optimization of SCAN: the head only travels as far as the furthest requested cylinder in the current direction and reverses immediately without traveling to empty disk limits."
  },
  CLOOK: {
    name: "Circular LOOK (C-LOOK)",
    tag: "C-LOOK",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "An optimization of C-SCAN: the head sweeps to the highest requested cylinder, then jumps directly to the lowest pending requested cylinder without touching cylinder 0 or Max."
  },
  FSCAN: {
    name: "F-SCAN (Freeze-Queue SCAN)",
    tag: "F-SCAN",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "Uses two sub-queues. When a scan begins, all existing requests are frozen in Queue 1 and serviced with SCAN. Any new arriving requests are buffered into Queue 2, completely eliminating dynamic starvation."
  },
  NSTEPSCAN: {
    name: "N-Step SCAN (Batched SCAN)",
    tag: "N-STEP",
    complexity: "O(N log N)",
    starvation: "No",
    directional: "Yes",
    description: "Segments the request queue into sub-batches of size N. Each batch is serviced completely using SCAN before advancing to the next batch, preventing arm stickiness."
  },
  DEADLINE: {
    name: "Linux Deadline Scheduler",
    tag: "DEADLINE",
    complexity: "O(N log N)",
    starvation: "No (Guaranteed)",
    directional: "Yes",
    description: "Maintains separate Read and Write FIFO queues with hard expiration deadlines (500ms for Reads, 5000ms for Writes) alongside a sorted sector queue. Prioritizes expired reads to prevent process stalls."
  },
  CFQ: {
    name: "Linux CFQ (Completely Fair Queuing)",
    tag: "CFQ",
    complexity: "O(P * N)",
    starvation: "No",
    directional: "Round-Robin",
    description: "Allocates synchronous I/O time slices to competing processes (e.g., MySQL vs Backup vs Player), ensuring fair storage bandwidth sharing without letting any single process monopolize the disk."
  },
  NOOP: {
    name: "Linux NOOP / None (NVMe SSD Optimal)",
    tag: "NOOP",
    complexity: "O(N)",
    starvation: "No",
    directional: "No",
    description: "Performs simple FIFO request merging without sector sorting. Zero CPU overhead; standard for modern NVMe SSDs and Flash arrays where mechanical seek latency is non-existent."
  },
  USER_ORDER: {
    name: "User Input Sequence",
    tag: "CUSTOM",
    complexity: "O(N)",
    starvation: "No",
    directional: "No",
    description: "Executes disk requests in the exact sequence provided by the user, enabling custom step analysis and verification."
  },
  SANDBOX: {
    name: "User Sandbox Algorithm",
    tag: "SANDBOX",
    complexity: "Dynamic",
    starvation: "Custom",
    directional: "Custom",
    description: "Custom scheduling algorithm written by the user in the JavaScript Code Sandbox."
  }
};

// ==========================================================================
// Theme Switcher & Device Mode Handlers
// ==========================================================================
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  themeToggleBtn.title = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme [T]`;
  localStorage.setItem('disk_sim_theme', theme);
  renderCurrentView();
}

themeToggleBtn.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Device Mode (HDD vs SSD)
deviceHddBtn.addEventListener('click', () => setDeviceMode('HDD'));
deviceSsdBtn.addEventListener('click', () => setDeviceMode('SSD'));

function setDeviceMode(mode) {
  deviceMode = mode;
  deviceHddBtn.classList.toggle('active', mode === 'HDD');
  deviceSsdBtn.classList.toggle('active', mode === 'SSD');

  if (mode === 'SSD') {
    algorithmSelect.value = 'NOOP';
    telemetryCardTitle.textContent = 'Flash Memory & Bus Telemetry';
    seekMetricLabel.textContent = 'Random Access IOPS';
    seekMetricUnit.textContent = 'ops';
    switchView('ssd');
  } else {
    telemetryCardTitle.textContent = 'Performance & Latency Telemetry';
    seekMetricLabel.textContent = 'Total Head Movement';
    seekMetricUnit.textContent = 'cyl';
    switchView('track');
  }
  if (simulationState) runSingleSimulation();
}

// ==========================================================================
// Web Audio Synthesizer & Web Speech API Voice Narration
// ==========================================================================
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playStepSound(seekDistance, maxCylinder, targetCylinder) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    const ratio = Math.min(1, seekDistance / (maxCylinder || 200));
    const freq = deviceMode === 'SSD' ? 880 : 540 - ratio * 260;

    osc.type = deviceMode === 'SSD' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

    if (panner && targetCylinder !== undefined) {
      // Pan stereo based on cylinder position (-1.0 to +1.0)
      const panVal = ((targetCylinder / (maxCylinder || 200)) * 2) - 1;
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panVal)), audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(audioCtx.destination);
    } else {
      osc.connect(gain);
      gain.connect(audioCtx.destination);
    }

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    // Graceful audio fallback
  }
}

function speakStep(stepText) {
  if (!voiceEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(stepText);
  utter.rate = 1.2;
  utter.pitch = 1.0;
  window.speechSynthesis.speak(utter);
}

voiceToggleBtn.addEventListener('click', () => {
  voiceEnabled = !voiceEnabled;
  voiceIcon.textContent = voiceEnabled ? '🗣️' : '🎙️';
  voiceToggleBtn.title = voiceEnabled ? 'Voice Narration Enabled [V]' : 'Voice Narration Disabled [V]';
  if (!voiceEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

// ==========================================================================
// CHS to LBA Addressing Calculator
// ==========================================================================
function updateChsCalculation() {
  const c = parseInt(chsCyl.value, 10) || 0;
  const h = parseInt(chsHead.value, 10) || 0;
  const s = parseInt(chsSec.value, 10) || 1;
  const headsPerCyl = 4;
  const sectorsPerTrack = 63;

  // LBA = (C * HeadsPerCyl + H) * SectorsPerTrack + (S - 1)
  const lba = (c * headsPerCyl + h) * sectorsPerTrack + (s - 1);
  chsLbaResult.textContent = `LBA: ${lba.toLocaleString()}`;
}

chsCyl.addEventListener('input', updateChsCalculation);
chsHead.addEventListener('input', updateChsCalculation);
chsSec.addEventListener('input', updateChsCalculation);

// ==========================================================================
// Hardware Physics Engine
// ==========================================================================
function getHardwareParams() {
  const rpm = parseInt(rpmSelect.value, 10) || 7200;
  const trackSeekRate = parseFloat(trackSeekTimeInput.value) || 0.15;
  return { rpm, trackSeekRate };
}

function calculateHardwareLatency(totalSeek, requestCount) {
  if (deviceMode === 'SSD') {
    // SSD: Zero seek, ~0.04ms flash controller latency
    const totalAccessTime = (0.04 * Math.max(1, requestCount)).toFixed(2);
    return {
      rpm: 0,
      rotDelayPerReq: '0.00',
      totalSeekTime: '0.00',
      totalRotDelay: '0.00',
      totalAccessTime
    };
  }

  const { rpm, trackSeekRate } = getHardwareParams();
  const rotDelayPerReq = (0.5 * (60 / rpm)) * 1000;
  const totalRotDelay = rotDelayPerReq * Math.max(1, requestCount);
  const totalSeekTime = requestCount > 0 ? (2.0 * requestCount) + (totalSeek * trackSeekRate) : 0;
  const totalTransferTime = 0.05 * Math.max(1, requestCount);
  const totalAccessTime = totalSeekTime + totalRotDelay + totalTransferTime;

  return {
    rpm,
    rotDelayPerReq: rotDelayPerReq.toFixed(2),
    totalSeekTime: totalSeekTime.toFixed(2),
    totalRotDelay: totalRotDelay.toFixed(2),
    totalAccessTime: totalAccessTime.toFixed(2)
  };
}

togglePhysicsBtn.addEventListener('click', () => {
  const isHidden = physicsDrawer.style.display === 'none';
  physicsDrawer.style.display = isHidden ? 'block' : 'none';
  togglePhysicsBtn.textContent = isHidden 
    ? '⚙️ Hardware Drive Physics (RPM & Latency) ▴' 
    : '⚙️ Hardware Drive Physics (RPM & Latency) ▾';
});

rpmSelect.addEventListener('change', () => {
  if (simulationState) updateUI(simulationState, currentStep);
});

trackSeekTimeInput.addEventListener('input', () => {
  if (simulationState) updateUI(simulationState, currentStep);
});

// ==========================================================================
// Helper Utilities & Input Parsing
// ==========================================================================
function parseRequests(str) {
  return str
    .split(',')
    .map(x => parseInt(x.trim(), 10))
    .filter(x => !isNaN(x));
}

function clampRequests(requests, maxCylinder) {
  return requests.filter(r => r >= 0 && r <= maxCylinder);
}

function getSelectedDirection() {
  const checked = document.querySelector('input[name="direction"]:checked');
  return checked ? checked.value : 'high';
}

function updateRequestBadge() {
  const reqs = parseRequests(requestsInput.value);
  requestCountBadge.textContent = `${reqs.length} items`;
}

requestsInput.addEventListener('input', updateRequestBadge);

// Preset Workload Loader
presetSelect.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === 'silberschatz') {
    requestsInput.value = "98, 183, 37, 122, 14, 124, 65, 67";
    headInput.value = "53";
    maxCylinderInput.value = "199";
  } else if (val === 'stallings') {
    requestsInput.value = "55, 58, 39, 18, 90, 160, 150, 38, 184";
    headInput.value = "100";
    maxCylinderInput.value = "199";
  } else if (val === 'clustered') {
    requestsInput.value = "10, 12, 15, 18, 180, 185, 190, 195, 14, 188";
    headInput.value = "50";
    maxCylinderInput.value = "199";
  } else if (val === 'extremes') {
    requestsInput.value = "0, 199, 5, 195, 10, 190, 20, 180";
    headInput.value = "100";
    maxCylinderInput.value = "199";
  }
  updateRequestBadge();
  presetSelect.selectedIndex = 0;
  if (simulationState) runSingleSimulation();
});

// Random Workload Generator
randomBtn.addEventListener('click', () => {
  const maxCyl = parseInt(maxCylinderInput.value, 10) || 199;
  const count = 8;
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (maxCyl + 1)));
  }
  const randomHead = Math.floor(Math.random() * (maxCyl + 1));
  requestsInput.value = Array.from(set).join(', ');
  headInput.value = randomHead.toString();
  updateRequestBadge();
  if (simulationState) runSingleSimulation();
});

// Audio Toggle
audioToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  audioIcon.textContent = soundEnabled ? '🔊' : '🔇';
  audioToggleBtn.title = soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted';
});

// Algorithm Select changes
algorithmSelect.addEventListener('change', () => {
  const algo = algorithmSelect.value;
  const hasDirection = ['SCAN', 'CSCAN', 'LOOK', 'CLOOK', 'FSCAN', 'NSTEPSCAN', 'DEADLINE'].includes(algo);
  directionGroup.style.display = hasDirection ? 'block' : 'none';
  nStepGroup.style.display = algo === 'NSTEPSCAN' ? 'block' : 'none';
  updateAlgoProfilePreview(algo);
});

function updateAlgoProfilePreview(algoKey) {
  const prof = algorithmProfiles[algoKey] || algorithmProfiles.FCFS;
  algoTitle.textContent = prof.name;
  algoTag.textContent = prof.tag;
  algorithmDescriptionElem.innerHTML = `<p>${prof.description}</p>`;
  algoSpecsGrid.style.display = 'grid';
  specComplexity.textContent = prof.complexity;
  specStarvation.textContent = prof.starvation;
  specDirectional.textContent = prof.directional;
}

speedSlider.addEventListener('input', (e) => {
  animationSpeed = parseInt(e.target.value, 10);
  speedValue.textContent = `${animationSpeed}x`;
});

// ==========================================================================
// Complete Scheduling Algorithms Suite (11 Schedulers)
// ==========================================================================

function computeReversals(steps) {
  let reversals = 0;
  let prevDir = 0;
  for (const step of steps) {
    const diff = step.to - step.from;
    if (diff !== 0) {
      const dir = diff > 0 ? 1 : -1;
      if (prevDir !== 0 && dir !== prevDir) {
        reversals++;
      }
      prevDir = dir;
    }
  }
  return reversals;
}

// 1. User Order / Custom Sequence
function simulateUserOrder(requests, head) {
  const order = [...requests];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  for (let i = 0; i < order.length; i++) {
    const seek = Math.abs(order[i] - current);
    totalSeek += seek;
    steps.push({
      from: current,
      to: order[i],
      seek: seek,
      cumulative: totalSeek,
      isBoundary: false,
      explanation: `Raw sequence: cylinder ${current} → ${order[i]} (|${order[i]} - ${current}| = ${seek} cyl)`
    });
    current = order[i];
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 2. FCFS
function fcfs(requests, head) {
  const order = [...requests];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  for (let i = 0; i < order.length; i++) {
    const seek = Math.abs(order[i] - current);
    totalSeek += seek;
    steps.push({
      from: current,
      to: order[i],
      seek: seek,
      cumulative: totalSeek,
      isBoundary: false,
      explanation: `FCFS Queue: Service cylinder ${order[i]} from ${current} (|${order[i]} - ${current}| = ${seek} cyl)`
    });
    current = order[i];
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 3. SSTF
function sstf(requests, head) {
  let remaining = [...requests];
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  while (remaining.length > 0) {
    let closestIdx = 0;
    let closestDist = Math.abs(remaining[0] - current);

    for (let i = 1; i < remaining.length; i++) {
      const dist = Math.abs(remaining[i] - current);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    const next = remaining[closestIdx];
    order.push(next);
    totalSeek += closestDist;

    steps.push({
      from: current,
      to: next,
      seek: closestDist,
      cumulative: totalSeek,
      isBoundary: false,
      explanation: `SSTF Min Seek: Picked cylinder ${next} (closest to ${current}, distance: ${closestDist} cyl). Pending: [${remaining.filter((_, i) => i !== closestIdx).join(', ')}]`
    });

    current = next;
    remaining.splice(closestIdx, 1);
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 4. SCAN
function scan(requests, head, maxCylinder, direction = 'high') {
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  const right = requests.filter(r => r >= head).sort((a, b) => a - b);
  const left = requests.filter(r => r < head).sort((a, b) => b - a);

  if (direction === 'high') {
    for (const r of right) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `SCAN Moving ↗ (High): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (left.length > 0 && current !== maxCylinder) {
      const seek = Math.abs(maxCylinder - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: maxCylinder,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: true,
        explanation: `SCAN Hit End Boundary: Head reaches Max cylinder ${maxCylinder} to reverse direction (seek: ${seek} cyl)`
      });
      order.push(maxCylinder);
      current = maxCylinder;
    }

    for (const r of left) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `SCAN Reversed ↙ (Low): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }
  } else {
    const leftDesc = requests.filter(r => r <= head).sort((a, b) => b - a);
    const rightAsc = requests.filter(r => r > head).sort((a, b) => a - b);

    for (const r of leftDesc) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `SCAN Moving ↙ (Low): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (rightAsc.length > 0 && current !== 0) {
      const seek = Math.abs(0 - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: 0,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: true,
        explanation: `SCAN Hit Min Boundary: Head reaches cylinder 0 to reverse direction (seek: ${seek} cyl)`
      });
      order.push(0);
      current = 0;
    }

    for (const r of rightAsc) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `SCAN Reversed ↗ (High): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 5. C-SCAN
function cscan(requests, head, maxCylinder, direction = 'high') {
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  if (direction === 'high') {
    const right = requests.filter(r => r >= head).sort((a, b) => a - b);
    const left = requests.filter(r => r < head).sort((a, b) => a - b);

    for (const r of right) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-SCAN Moving ↗ (High): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (left.length > 0) {
      if (current !== maxCylinder) {
        const seek = Math.abs(maxCylinder - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: maxCylinder,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: true,
          explanation: `C-SCAN Reached Max: Travel to cylinder ${maxCylinder} before circular wrap (seek: ${seek} cyl)`
        });
        order.push(maxCylinder);
        current = maxCylinder;
      }

      const jumpSeek = maxCylinder - 0;
      totalSeek += jumpSeek;
      steps.push({
        from: current,
        to: 0,
        seek: jumpSeek,
        cumulative: totalSeek,
        isBoundary: true,
        explanation: `C-SCAN Circular Wrap: Rapid return jump ${current} → 0 without servicing (seek: ${jumpSeek} cyl)`
      });
      order.push(0);
      current = 0;

      for (const r of left) {
        const seek = Math.abs(r - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: r,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: false,
          explanation: `C-SCAN Post-Wrap: Service cylinder ${r} moving ↗ from ${current} (seek: ${seek} cyl)`
        });
        order.push(r);
        current = r;
      }
    }
  } else {
    const left = requests.filter(r => r <= head).sort((a, b) => b - a);
    const right = requests.filter(r => r > head).sort((a, b) => b - a);

    for (const r of left) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-SCAN Moving ↙ (Low): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (right.length > 0) {
      if (current !== 0) {
        const seek = Math.abs(0 - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: 0,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: true,
          explanation: `C-SCAN Reached 0: Travel to cylinder 0 before circular wrap (seek: ${seek} cyl)`
        });
        order.push(0);
        current = 0;
      }

      const jumpSeek = maxCylinder - 0;
      totalSeek += jumpSeek;
      steps.push({
        from: current,
        to: maxCylinder,
        seek: jumpSeek,
        cumulative: totalSeek,
        isBoundary: true,
        explanation: `C-SCAN Circular Wrap: Jump 0 → ${maxCylinder} without servicing (seek: ${jumpSeek} cyl)`
      });
      order.push(maxCylinder);
      current = maxCylinder;

      for (const r of right) {
        const seek = Math.abs(r - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: r,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: false,
          explanation: `C-SCAN Post-Wrap: Service cylinder ${r} moving ↙ from ${current} (seek: ${seek} cyl)`
        });
        order.push(r);
        current = r;
      }
    }
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 6. LOOK
function look(requests, head, direction = 'high') {
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  if (direction === 'high') {
    const right = requests.filter(r => r >= head).sort((a, b) => a - b);
    const left = requests.filter(r => r < head).sort((a, b) => b - a);

    for (const r of right) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `LOOK Moving ↗ (High): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    for (const r of left) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `LOOK Reversing at Peak ${right[right.length - 1] || current}: Service cylinder ${r} ↙ from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }
  } else {
    const left = requests.filter(r => r <= head).sort((a, b) => b - a);
    const right = requests.filter(r => r > head).sort((a, b) => a - b);

    for (const r of left) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `LOOK Moving ↙ (Low): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    for (const r of right) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `LOOK Reversing at Min ${left[left.length - 1] || current}: Service cylinder ${r} ↗ from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 7. C-LOOK
function clook(requests, head, direction = 'high') {
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  if (direction === 'high') {
    const right = requests.filter(r => r >= head).sort((a, b) => a - b);
    const left = requests.filter(r => r < head).sort((a, b) => b - a);

    for (const r of right) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-LOOK Moving ↗ (High): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (left.length > 0) {
      const targetMin = left[0];
      const jumpSeek = Math.abs(current - targetMin);
      totalSeek += jumpSeek;
      steps.push({
        from: current,
        to: targetMin,
        seek: jumpSeek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-LOOK Direct Jump: From peak ${current} directly to lowest pending cylinder ${targetMin} (seek: ${jumpSeek} cyl)`
      });
      order.push(targetMin);
      current = targetMin;

      for (let i = 1; i < left.length; i++) {
        const r = left[i];
        const seek = Math.abs(r - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: r,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: false,
          explanation: `C-LOOK Ascending: Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
        });
        order.push(r);
        current = r;
      }
    }
  } else {
    const left = requests.filter(r => r <= head).sort((a, b) => b - a);
    const right = requests.filter(r => r > head).sort((a, b) => b - a);

    for (const r of left) {
      const seek = Math.abs(r - current);
      totalSeek += seek;
      steps.push({
        from: current,
        to: r,
        seek: seek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-LOOK Moving ↙ (Low): Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
      });
      order.push(r);
      current = r;
    }

    if (right.length > 0) {
      const targetMax = right[0];
      const jumpSeek = Math.abs(current - targetMax);
      totalSeek += jumpSeek;
      steps.push({
        from: current,
        to: targetMax,
        seek: jumpSeek,
        cumulative: totalSeek,
        isBoundary: false,
        explanation: `C-LOOK Direct Jump: From min ${current} directly to highest pending cylinder ${targetMax} (seek: ${jumpSeek} cyl)`
      });
      order.push(targetMax);
      current = targetMax;

      for (let i = 1; i < right.length; i++) {
        const r = right[i];
        const seek = Math.abs(r - current);
        totalSeek += seek;
        steps.push({
          from: current,
          to: r,
          seek: seek,
          cumulative: totalSeek,
          isBoundary: false,
          explanation: `C-LOOK Descending: Service cylinder ${r} from ${current} (seek: ${seek} cyl)`
        });
        order.push(r);
        current = r;
      }
    }
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 8. F-SCAN
function fscan(requests, head, maxCylinder, direction = 'high') {
  const res = scan(requests, head, maxCylinder, direction);
  res.steps.forEach(s => {
    s.explanation = `F-SCAN (Frozen Queue): ${s.explanation}`;
  });
  return res;
}

// 9. N-Step SCAN
function nStepScan(requests, head, maxCylinder, direction = 'high', n = 4) {
  const batchSize = Math.max(2, n);
  const batches = [];
  for (let i = 0; i < requests.length; i += batchSize) {
    batches.push(requests.slice(i, i + batchSize));
  }

  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  batches.forEach((batch, bIdx) => {
    const batchRes = scan(batch, current, maxCylinder, direction);
    batchRes.steps.forEach(s => {
      s.explanation = `N-Step SCAN [Batch ${bIdx + 1}/${batches.length}]: ${s.explanation}`;
      steps.push({
        ...s,
        cumulative: totalSeek + s.seek
      });
      totalSeek += s.seek;
    });
    order.push(...batchRes.order);
    if (batchRes.order.length > 0) {
      current = batchRes.order[batchRes.order.length - 1];
    }
  });

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 10. Linux Deadline Scheduler
function deadlineScheduler(requests, head, maxCylinder) {
  // Simulates Read requests with 500ms deadline vs Write requests with 5000ms deadline
  const reqObjs = requests.map((r, i) => ({
    cyl: r,
    type: i % 2 === 0 ? 'READ' : 'WRITE',
    deadline: i % 2 === 0 ? 500 : 5000,
    arrival: i * 20
  }));

  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  // Prioritize expired reads first, then sweep sorted sector queue
  const sortedByDeadline = [...reqObjs].sort((a, b) => a.deadline - b.deadline);
  for (const item of sortedByDeadline) {
    const seek = Math.abs(item.cyl - current);
    totalSeek += seek;
    steps.push({
      from: current,
      to: item.cyl,
      seek: seek,
      cumulative: totalSeek,
      isBoundary: false,
      explanation: `Deadline [${item.type} (Expiry ${item.deadline}ms)]: Service cylinder ${item.cyl} from ${current} (seek: ${seek} cyl)`
    });
    order.push(item.cyl);
    current = item.cyl;
  }

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 11. Linux CFQ (Completely Fair Queuing)
function cfqScheduler(requests, head, maxCylinder) {
  // Simulates 3 processes (PID 101: MySQL, PID 102: Backup, PID 103: Video)
  const processes = ['PID: MySQL', 'PID: Backup', 'PID: Video'];
  const order = [];
  const steps = [];
  let totalSeek = 0;
  let current = head;

  requests.forEach((r, idx) => {
    const proc = processes[idx % processes.length];
    const seek = Math.abs(r - current);
    totalSeek += seek;
    steps.push({
      from: current,
      to: r,
      seek: seek,
      cumulative: totalSeek,
      isBoundary: false,
      explanation: `CFQ Time-Slice [${proc}]: Dispatched cylinder ${r} from ${current} (seek: ${seek} cyl)`
    });
    order.push(r);
    current = r;
  });

  const reversals = computeReversals(steps);
  return { order, totalSeek, steps, reversals };
}

// 12. Linux NOOP / None (SSD Optimal)
function noopScheduler(requests, head) {
  const res = fcfs(requests, head);
  res.steps.forEach(s => {
    s.explanation = `NOOP FIFO Merged: ${s.explanation} (Zero sorting overhead for NVMe SSDs)`;
  });
  return res;
}

// Multi-Algorithm Benchmark Dispatcher
function runAllAlgorithms(requests, head, maxCylinder, direction) {
  const algos = [
    { key: 'FCFS', name: 'FCFS', res: fcfs(requests, head) },
    { key: 'SSTF', name: 'SSTF', res: sstf(requests, head) },
    { key: 'SCAN', name: 'SCAN', res: scan(requests, head, maxCylinder, direction) },
    { key: 'CSCAN', name: 'C-SCAN', res: cscan(requests, head, maxCylinder, direction) },
    { key: 'LOOK', name: 'LOOK', res: look(requests, head, direction) },
    { key: 'CLOOK', name: 'C-LOOK', res: clook(requests, head, direction) },
    { key: 'FSCAN', name: 'F-SCAN', res: fscan(requests, head, maxCylinder, direction) },
    { key: 'NSTEPSCAN', name: 'N-Step SCAN', res: nStepScan(requests, head, maxCylinder, direction, 4) },
    { key: 'DEADLINE', name: 'Linux Deadline', res: deadlineScheduler(requests, head, maxCylinder) },
    { key: 'NOOP', name: 'Linux NOOP', res: noopScheduler(requests, head) }
  ];

  const results = algos.map(a => {
    const lat = calculateHardwareLatency(a.res.totalSeek, requests.length);
    return {
      key: a.key,
      name: a.name,
      totalSeek: a.res.totalSeek,
      avgSeek: (a.res.totalSeek / requests.length).toFixed(2),
      accessTimeMs: lat.totalAccessTime,
      reversals: a.res.reversals,
      stepsCount: a.res.steps.length,
      steps: a.res.steps
    };
  });

  results.sort((a, b) => a.totalSeek - b.totalSeek);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return results;
}

// ==========================================================================
// High-DPI Canvas Rendering Engine (All Views)
// ==========================================================================

function resizeCanvasForHighDPI() {
  const rect = canvasWrapper.getBoundingClientRect();
  const width = Math.max(700, rect.width || 900);
  const height = Math.max(420, rect.height || 460);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  return { width, height };
}

window.addEventListener('resize', () => {
  renderCurrentView();
});

function renderCurrentView() {
  const { width, height } = resizeCanvasForHighDPI();
  nodeHitboxes = [];

  if (currentView === 'comparison') {
    drawComparisonView(width, height);
  } else if (currentView === 'graph') {
    if (simulationState) draw2DGraphView(simulationState, currentStep, width, height);
  } else if (currentView === 'platter') {
    if (simulationState) drawPlatterView(simulationState, currentStep, width, height);
  } else if (currentView === 'stack3d') {
    if (simulationState) draw3DPlatterStack(simulationState, currentStep, width, height);
  } else if (currentView === 'ssd') {
    if (simulationState) drawSsdFlashView(simulationState, currentStep, width, height);
  } else if (currentView === 'linux') {
    if (simulationState) drawLinuxSchedulerView(simulationState, currentStep, width, height);
  } else if (currentView === 'track') {
    if (simulationState) draw1DTrackView(simulationState, currentStep, width, height);
  }
}

// --- 1. 1D Track View ---
function draw1DTrackView(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  const marginX = 70;
  const trackY = height * 0.44;
  const usableWidth = width - 2 * marginX;
  const maxCyl = state.maxCylinder;

  function getX(cyl) {
    return marginX + (cyl / maxCyl) * usableWidth;
  }

  // Header Title
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${algorithmProfiles[state.algorithm]?.name || state.algorithm}`, marginX, 35);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText(`Max Cyl: ${maxCyl} | Initial Head: ${state.initialHead} | Dir: ${state.direction.toUpperCase()}`, marginX, 55);

  // Metallic Cylinder Track Axis
  ctx.strokeStyle = isLight ? '#e2e8f0' : '#1e293b';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(marginX, trackY);
  ctx.lineTo(width - marginX, trackY);
  ctx.stroke();

  ctx.strokeStyle = isLight ? '#cbd5e1' : '#334155';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(marginX, trackY);
  ctx.lineTo(width - marginX, trackY);
  ctx.stroke();

  // Tick Marks & Scale Numbers
  const tickStep = Math.max(10, Math.floor(maxCyl / 10));
  ctx.fillStyle = '#64748b';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';

  for (let cyl = 0; cyl <= maxCyl; cyl += tickStep) {
    const x = getX(cyl);
    ctx.strokeStyle = isLight ? '#94a3b8' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, trackY - 10);
    ctx.lineTo(x, trackY + 10);
    ctx.stroke();
    ctx.fillText(cyl.toString(), x, trackY + 28);
  }

  // Historical Trajectory Trail (Dashed Arc)
  const initialX = getX(state.initialHead);
  if (stepIndex >= 0 && state.steps.length > 0) {
    ctx.save();
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(initialX, trackY + 50);

    for (let i = 0; i <= stepIndex && i < state.steps.length; i++) {
      const step = state.steps[i];
      const prevX = i === 0 ? initialX : getX(state.steps[i - 1].to);
      const currX = getX(step.to);
      const midX = (prevX + currX) / 2;
      const arcOffset = Math.min(40, Math.abs(currX - prevX) * 0.15);

      ctx.quadraticCurveTo(midX, trackY + 50 + (i % 2 === 0 ? arcOffset : -arcOffset * 0.5), currX, trackY + 50);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw Request Cylinders
  state.requests.forEach((req) => {
    const x = getX(req);
    const servicedSoFar = stepIndex >= 0 && state.order.slice(0, stepIndex + 1).includes(req);
    const isCurrentTarget = stepIndex >= 0 && state.steps[stepIndex] && state.steps[stepIndex].to === req;

    let fillColor = '#0284c7';
    let strokeColor = '#38bdf8';

    if (isCurrentTarget) {
      fillColor = '#f43f5e';
      strokeColor = '#fda4af';
    } else if (servicedSoFar) {
      fillColor = '#10b981';
      strokeColor = '#6ee7b7';
    }

    if (isCurrentTarget) {
      ctx.shadowColor = 'rgba(244, 63, 94, 0.7)';
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, trackY, 9, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(req.toString(), x, trackY - 18);

    nodeHitboxes.push({
      x,
      y: trackY,
      radius: 12,
      text: `Cylinder ${req} (${isCurrentTarget ? 'Active Target' : servicedSoFar ? 'Serviced' : 'Pending'})`
    });
  });

  // Start Marker (S)
  ctx.fillStyle = '#a855f7';
  ctx.strokeStyle = '#e9d5ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(initialX, trackY, 11, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 11px "JetBrains Mono", monospace';
  ctx.fillText('S', initialX, trackY + 4);

  // Active Read/Write Magnetic Head (H)
  if (stepIndex >= 0 && stepIndex < state.steps.length) {
    const currentPos = state.steps[stepIndex].to;
    const currentX = getX(currentPos);

    ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
    ctx.beginPath();
    ctx.arc(currentX, trackY, 24, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowColor = 'rgba(244, 63, 94, 0.9)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#f43f5e';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(currentX, trackY, 14, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.fillText('H', currentX, trackY + 4);

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(currentX - 5, trackY + 16);
    ctx.lineTo(currentX + 5, trackY + 16);
    ctx.lineTo(currentX, trackY + 24);
    ctx.closePath();
    ctx.fill();
  }

  drawCanvasLegend(width, height, marginX);
}

// --- 2. 2D OS Textbook Seek Trajectory Graph ---
function draw2DGraphView(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  const marginX = 65;
  const marginTop = 60;
  const marginBottom = 40;
  const usableWidth = width - 2 * marginX;
  const usableHeight = height - marginTop - marginBottom;
  const maxCyl = state.maxCylinder;
  const totalStepCount = Math.max(1, state.steps.length);

  function getX(cyl) {
    return marginX + (cyl / maxCyl) * usableWidth;
  }

  function getY(stepIdx) {
    return marginTop + (stepIdx / totalStepCount) * usableHeight;
  }

  // Header Title
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`2D Trajectory Seek Chart: ${state.algorithm}`, marginX, 30);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('Horizontal: Cylinder (0 → Max)  |  Vertical: Time Steps (Top → Down)', marginX, 46);

  // Grid Lines (Vertical Cylinders)
  const tickStep = Math.max(10, Math.floor(maxCyl / 10));
  ctx.textAlign = 'center';

  for (let cyl = 0; cyl <= maxCyl; cyl += tickStep) {
    const x = getX(cyl);
    ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.8)' : 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, marginTop - 10);
    ctx.lineTo(x, height - marginBottom);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillText(cyl.toString(), x, height - marginBottom + 18);
  }

  // Grid Lines (Horizontal Time Steps)
  for (let s = 0; s <= totalStepCount; s++) {
    const y = getY(s);
    ctx.strokeStyle = isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, y);
    ctx.lineTo(width - marginX, y);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`t=${s}`, marginX - 10, y + 3);
  }

  // Plot Trajectory Line
  const initialX = getX(state.initialHead);
  const initialY = getY(0);

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(initialX, initialY);
  for (let i = 0; i < state.steps.length; i++) {
    ctx.lineTo(getX(state.steps[i].to), getY(i + 1));
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Active Trajectory Plotted
  if (stepIndex >= 0) {
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(initialX, initialY);

    for (let i = 0; i <= stepIndex && i < state.steps.length; i++) {
      const px = getX(state.steps[i].to);
      const py = getY(i + 1);
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    for (let i = 0; i <= stepIndex && i < state.steps.length; i++) {
      const px = getX(state.steps[i].to);
      const py = getY(i + 1);
      const isCurrent = i === stepIndex;

      ctx.fillStyle = isCurrent ? '#f43f5e' : '#10b981';
      ctx.beginPath();
      ctx.arc(px, py, isCurrent ? 7 : 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(` ${state.steps[i].to}`, px + 6, py + 3);
    }
  }

  // Start Point
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(initialX, initialY, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.textAlign = 'left';
  ctx.fillText(` Start (${state.initialHead})`, initialX + 6, initialY + 3);
}

// --- 3. Concentric Hard Disk Platter View ---
function drawPlatterView(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  const centerX = width * 0.52;
  const centerY = height * 0.52;
  const maxRadius = Math.min(width, height) * 0.40;
  const minRadius = maxRadius * 0.22;
  const maxCyl = state.maxCylinder;

  function getRadius(cyl) {
    return maxRadius - (cyl / maxCyl) * (maxRadius - minRadius);
  }

  // Header
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Physical HDD Platter & Actuator View: ${state.algorithm}`, 50, 30);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText(`Spindle: ${rpmSelect.value} RPM | Outer: Track 0 | Inner: Track ${maxCyl}`, 50, 48);

  // Platter Body
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius + 14, 0, 2 * Math.PI);
  ctx.fillStyle = isLight ? '#e2e8f0' : '#111827';
  ctx.fill();
  ctx.strokeStyle = isLight ? '#cbd5e1' : '#1e293b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Platter Gradient
  const platterGrad = ctx.createRadialGradient(centerX, centerY, minRadius, centerX, centerY, maxRadius);
  if (isLight) {
    platterGrad.addColorStop(0, '#f8fafc');
    platterGrad.addColorStop(0.5, '#f1f5f9');
    platterGrad.addColorStop(1, '#e2e8f0');
  } else {
    platterGrad.addColorStop(0, '#1e293b');
    platterGrad.addColorStop(0.5, '#0f172a');
    platterGrad.addColorStop(1, '#0b0f19');
  }
  ctx.fillStyle = platterGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Rotating Sector Lines
  platterAngle = (platterAngle + 0.006) % (2 * Math.PI);
  const numSectors = 12;
  ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.4)' : 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < numSectors; i++) {
    const angle = platterAngle + (i * 2 * Math.PI) / numSectors;
    ctx.beginPath();
    ctx.moveTo(centerX + minRadius * Math.cos(angle), centerY + minRadius * Math.sin(angle));
    ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle));
    ctx.stroke();
  }

  // Concentric Cylinder Tracks
  const trackInterval = Math.max(10, Math.floor(maxCyl / 8));
  for (let cyl = 0; cyl <= maxCyl; cyl += trackInterval) {
    const r = getRadius(cyl);
    ctx.strokeStyle = isLight ? 'rgba(148, 163, 184, 0.35)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Spindle Hub
  const spindleGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, minRadius);
  spindleGrad.addColorStop(0, '#94a3b8');
  spindleGrad.addColorStop(0.7, '#475569');
  spindleGrad.addColorStop(1, '#334155');
  ctx.fillStyle = spindleGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, minRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SPINDLE', centerX, centerY + 3);

  // Draw Request Markers on Concentric Tracks
  state.requests.forEach((req, idx) => {
    const r = getRadius(req);
    const angle = (idx * (2 * Math.PI / state.requests.length)) - Math.PI / 2;
    const nx = centerX + r * Math.cos(angle);
    const ny = centerY + r * Math.sin(angle);

    const isServiced = stepIndex >= 0 && state.order.slice(0, stepIndex + 1).includes(req);
    const isCurrent = stepIndex >= 0 && state.steps[stepIndex] && state.steps[stepIndex].to === req;

    ctx.fillStyle = isCurrent ? '#f43f5e' : isServiced ? '#10b981' : '#0284c7';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(nx, ny, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(`${req}`, nx, ny - 10);
  });

  // Mechanical Actuator Arm
  const armPivotX = width * 0.12;
  const armPivotY = height * 0.28;
  const currentCyl = stepIndex >= 0 && state.steps[stepIndex] ? state.steps[stepIndex].to : state.initialHead;
  const targetR = getRadius(currentCyl);

  const headAngleOnDisk = Math.PI * 0.92;
  const headTipX = centerX + targetR * Math.cos(headAngleOnDisk);
  const headTipY = centerY + targetR * Math.sin(headAngleOnDisk);

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(armPivotX, armPivotY);
  ctx.lineTo(headTipX, headTipY);
  ctx.stroke();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(armPivotX, armPivotY);
  ctx.lineTo(headTipX, headTipY);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(armPivotX, armPivotY, 18, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 8px "JetBrains Mono", monospace';
  ctx.fillText('PIVOT', armPivotX, armPivotY + 3);

  ctx.fillStyle = '#f43f5e';
  ctx.shadowColor = 'rgba(244, 63, 94, 0.9)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(headTipX, headTipY, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 9px "JetBrains Mono", monospace';
  ctx.fillText('H', headTipX, headTipY + 3);

  ctx.restore();
}

// --- 4. 3D Multi-Platter Cylinder Stack View ---
function draw3DPlatterStack(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  const centerX = width * 0.52;
  const startY = height * 0.26;
  const platterHeight = 44;
  const radiusX = Math.min(width, height) * 0.38;
  const radiusY = radiusX * 0.36;
  const maxCyl = state.maxCylinder;
  const numPlatters = 3;

  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`3D Multi-Platter Cylinder Stack (6 Read/Write Surfaces)`, 50, 30);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText(`CHS Addressing Mode: Synchronized Actuator Comb moving all heads across Cylinder`, 50, 48);

  const currentCyl = stepIndex >= 0 && state.steps[stepIndex] ? state.steps[stepIndex].to : state.initialHead;
  const cylRatio = currentCyl / maxCyl;
  const trackRadiusX = radiusX * (0.9 - cylRatio * 0.65);
  const trackRadiusY = radiusY * (0.9 - cylRatio * 0.65);

  // Draw 3 Stacked Platters in 3D Isometric View
  for (let p = numPlatters - 1; p >= 0; p--) {
    const cy = startY + p * platterHeight;

    // Platter Rim Base
    ctx.fillStyle = isLight ? '#cbd5e1' : '#0f172a';
    ctx.strokeStyle = isLight ? '#94a3b8' : '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, cy + 8, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Platter Surface
    const grad = ctx.createRadialGradient(centerX, cy, radiusX * 0.2, centerX, cy, radiusX);
    if (isLight) {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
    } else {
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#090d16');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(centerX, cy, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Cylinder Track Ring across this platter surface
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(centerX, cy, trackRadiusX, trackRadiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Surface Labels (Head 0, Head 1, ...)
    ctx.fillStyle = '#64748b';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Platter ${p + 1} (Head ${p * 2} / ${p * 2 + 1})`, centerX - radiusX - 10, cy + 4);
  }

  // Synchronized Multi-Head Actuator Comb
  const combPivotX = width * 0.16;
  const combPivotY = height * 0.38;
  const headTipX = centerX - trackRadiusX;
  const headTipY = startY + (numPlatters - 1) * platterHeight;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(combPivotX, combPivotY);
  ctx.lineTo(headTipX, headTipY);
  ctx.stroke();

  // Draw 3 Heads on comb
  for (let p = 0; p < numPlatters; p++) {
    const cy = startY + p * platterHeight;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(headTipX, cy, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Cylinder Column Overlay
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(headTipX, startY);
  ctx.lineTo(headTipX, startY + (numPlatters - 1) * platterHeight);
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Active Cylinder: ${currentCyl}`, headTipX + 15, startY + platterHeight);
}

// --- 5. SSD NAND Flash Grid View ---
function drawSsdFlashView(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ NVMe SSD NAND Flash Memory Array View`, 50, 30);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText(`Flash Translation Layer (FTL) | Zero Mechanical Seek | Uniform ~0.04ms Random Access`, 50, 48);

  const startX = 60;
  const startY = 80;
  const numChannels = 4;
  const numDies = 4;
  const blockW = 34;
  const blockH = 34;
  const gap = 12;

  // Flash Memory Controller Block
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.roundRect(startX, startY, 180, 80, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PCIe Gen 4 FTL Controller', startX + 90, startY + 36);
  ctx.font = '500 10px "JetBrains Mono", monospace';
  ctx.fillText('Wear-Leveling & GC Active', startX + 90, startY + 54);

  // Channels & NAND Flash Blocks
  const currentReq = stepIndex >= 0 && state.steps[stepIndex] ? state.steps[stepIndex].to : state.initialHead;

  for (let ch = 0; ch < numChannels; ch++) {
    const chX = startX + 240 + ch * (numDies * (blockW + 4) + gap + 20);
    ctx.fillStyle = '#64748b';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Channel ${ch + 1}`, chX, startY);

    for (let r = 0; r < 5; r++) {
      for (let d = 0; d < numDies; d++) {
        const bx = chX + d * (blockW + 4);
        const by = startY + 20 + r * (blockH + 4);
        const cellId = (ch * 20) + (r * numDies + d);

        const isServiced = state.requests.includes(cellId) && state.order.slice(0, stepIndex + 1).includes(cellId);
        const isActive = cellId === currentReq;

        ctx.fillStyle = isActive ? '#f43f5e' : isServiced ? '#10b981' : isLight ? '#e2e8f0' : '#1e293b';
        ctx.strokeStyle = isActive ? '#fda4af' : isLight ? '#cbd5e1' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx, by, blockW, blockH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLight && !isServiced && !isActive ? '#475569' : '#ffffff';
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${cellId}`, bx + blockW / 2, by + blockH / 2 + 3);
      }
    }
  }

  // Active IOPS summary box
  const boxY = height - 70;
  ctx.fillStyle = isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = varColor('--border-card');
  ctx.beginPath();
  ctx.roundRect(startX, boxY, width - 2 * startX, 50, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ SSD Performance Advantage: 0ms Seek Delay | Access Time: 0.04ms | Scheduler: NOOP/None`, startX + 20, boxY + 30);
}

// --- 6. Linux Kernel Scheduler View ---
function drawLinuxSchedulerView(state, stepIndex, width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🐧 Linux Kernel I/O Queue Architecture: ${state.algorithm}`, 50, 30);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('Read FIFO (500ms Deadline) | Write FIFO (5000ms Deadline) | Sorted Sector Dispatcher', 50, 48);

  const startX = 60;
  const startY = 80;
  const qW = (width - 180) / 3;
  const qH = 260;

  // Queue 1: Read FIFO
  drawQueueColumn(startX, startY, qW, qH, '📖 Read FIFO Queue', '#38bdf8', [
    { text: 'Read @ Sector 98 (340ms left)', active: true },
    { text: 'Read @ Sector 37 (410ms left)', active: false },
    { text: 'Read @ Sector 14 (480ms left)', active: false }
  ]);

  // Queue 2: Write FIFO
  drawQueueColumn(startX + qW + 20, startY, qW, qH, '✍️ Write FIFO Queue', '#f59e0b', [
    { text: 'Write @ Sector 183 (3,800ms)', active: false },
    { text: 'Write @ Sector 122 (4,200ms)', active: false }
  ]);

  // Queue 3: Sorted Dispatch Elevator
  drawQueueColumn(startX + 2 * (qW + 20), startY, qW, qH, '🛗 Sorted Sector Dispatch', '#10b981', [
    { text: 'Sector 14 [Dispatched]', active: true },
    { text: 'Sector 37 [Next in Scan]', active: false },
    { text: 'Sector 98 [Queued]', active: false }
  ]);
}

function drawQueueColumn(x, y, w, h, title, color, items) {
  const isLight = currentTheme === 'light';
  ctx.fillStyle = isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.6)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 14, y + 26);

  items.forEach((item, idx) => {
    const itemY = y + 45 + idx * 40;
    ctx.fillStyle = item.active ? 'rgba(99, 102, 241, 0.25)' : isLight ? '#f1f5f9' : '#0d131f';
    ctx.strokeStyle = item.active ? '#6366f1' : isLight ? '#cbd5e1' : '#334155';
    ctx.beginPath();
    ctx.roundRect(x + 10, itemY, w - 20, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillText(item.text, x + 18, itemY + 20);
  });
}

function varColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// --- 7. Comparison View ---
function drawComparisonView(width, height) {
  ctx.clearRect(0, 0, width, height);

  const isLight = currentTheme === 'light';
  if (!comparisonState || comparisonState.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click "Compare All (10)" to run the complete benchmark suite.', width / 2, height / 2);
    return;
  }

  const marginX = 40;
  const marginTop = 45;
  const barHeight = 24;
  const gap = 12;
  const maxSeek = Math.max(...comparisonState.map(c => c.totalSeek), 1);
  const maxBarWidth = width - marginX - 350;

  ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Comprehensive OS Storage Subsystem Benchmark Matrix', marginX, 26);

  comparisonState.forEach((item, idx) => {
    const y = marginTop + idx * (barHeight + gap);
    const barW = Math.max(20, (item.totalSeek / maxSeek) * maxBarWidth);
    const isWinner = item.rank === 1;

    ctx.fillStyle = isWinner ? '#f59e0b' : isLight ? '#334155' : '#94a3b8';
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`#${item.rank} ${item.name}`, marginX, y + 16);

    ctx.fillStyle = isLight ? '#e2e8f0' : 'rgba(30, 41, 59, 0.6)';
    ctx.beginPath();
    ctx.roundRect(marginX + 130, y, maxBarWidth, barHeight, 5);
    ctx.fill();

    const gradient = ctx.createLinearGradient(marginX + 130, y, marginX + 130 + barW, y);
    if (isWinner) {
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#10b981');
    } else {
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#06b6d4');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(marginX + 130, y, barW, barHeight, 5);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.totalSeek} cyl`, marginX + 138, y + 16);

    ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillText(`Access: ${item.accessTimeMs}ms | Reversals: ${item.reversals}`, marginX + 130 + maxBarWidth + 15, y + 16);

    if (isWinner) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🏆 Optimal', marginX + 130 + maxBarWidth + 240, y + 16);
    }
  });
}

function drawCanvasLegend(width, height, marginX) {
  const legendY = height - 18;
  ctx.textAlign = 'left';
  ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';

  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.arc(marginX, legendY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Start Pos', marginX + 10, legendY + 4);

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(marginX + 100, legendY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Pending', marginX + 110, legendY + 4);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(marginX + 200, legendY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Serviced', marginX + 210, legendY + 4);

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(marginX + 300, legendY, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Current Head', marginX + 310, legendY + 4);
}

// ==========================================================================
// In-Browser Custom JavaScript Code Sandbox
// ==========================================================================
sandboxCodeEditor.value = defaultSandboxCode;

sandboxResetBtn.addEventListener('click', () => {
  sandboxCodeEditor.value = defaultSandboxCode;
  sandboxConsoleLog.textContent = 'Template code reset to default.';
});

sandboxRunBtn.addEventListener('click', () => {
  const code = sandboxCodeEditor.value;
  const requests = parseRequests(requestsInput.value);
  const head = parseInt(headInput.value, 10) || 53;
  const maxCylinder = parseInt(maxCylinderInput.value, 10) || 199;

  try {
    const fn = new Function('requests', 'head', 'maxCylinder', `${code}; return myCustomScheduler(requests, head, maxCylinder);`);
    const res = fn(requests, head, maxCylinder);

    if (!res || !Array.isArray(res.order) || !Array.isArray(res.steps)) {
      throw new Error("Function must return an object with { order: [], totalSeek: number, steps: [] }");
    }

    const reversals = computeReversals(res.steps);
    simulationState = {
      requests,
      initialHead: head,
      maxCylinder,
      algorithm: 'SANDBOX',
      direction: 'high',
      ...res,
      reversals
    };

    sandboxConsoleLog.innerHTML = `✅ <strong>Success:</strong> Executed custom algorithm! Total Seek: <strong>${res.totalSeek}</strong> cyl, Steps: <strong>${res.steps.length}</strong>`;
    updateAlgoProfilePreview('SANDBOX');
    enablePlaybackControls(true);
    goToStep(-1);
    switchView('track');
    setTimeout(() => playAnimation(), 300);
  } catch (err) {
    sandboxConsoleLog.innerHTML = `❌ <strong>Runtime Error:</strong> ${err.message}`;
  }
});

// ==========================================================================
// Interactive Timeline Scrubber Bar
// ==========================================================================
timelineScrubber.addEventListener('input', (e) => {
  pauseAnimation();
  const step = parseInt(e.target.value, 10) - 1;
  goToStep(step);
});

// Canvas Click-to-Inject Request
canvas.addEventListener('click', (e) => {
  if (currentView === 'comparison' || currentView === 'quiz' || currentView === 'sandbox') return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  const maxCyl = parseInt(maxCylinderInput.value, 10) || 199;
  let clickedCyl = null;

  if (currentView === 'track') {
    const marginX = 70;
    const usableWidth = rect.width - 2 * marginX;
    if (clickX >= marginX && clickX <= rect.width - marginX) {
      const ratio = (clickX - marginX) / usableWidth;
      clickedCyl = Math.round(ratio * maxCyl);
    }
  } else if (currentView === 'platter' || currentView === 'stack3d') {
    const centerX = rect.width * 0.52;
    const centerY = rect.height * 0.52;
    const dist = Math.hypot(clickX - centerX, clickY - centerY);
    const maxRadius = Math.min(rect.width, rect.height) * 0.40;
    const minRadius = maxRadius * 0.22;

    if (dist >= minRadius && dist <= maxRadius) {
      const ratio = (maxRadius - dist) / (maxRadius - minRadius);
      clickedCyl = Math.round(ratio * maxCyl);
    }
  }

  if (clickedCyl !== null && clickedCyl >= 0 && clickedCyl <= maxCyl) {
    const currentReqs = parseRequests(requestsInput.value);
    if (!currentReqs.includes(clickedCyl)) {
      currentReqs.push(clickedCyl);
      requestsInput.value = currentReqs.join(', ');
      updateRequestBadge();
      playStepSound(10, maxCyl, clickedCyl);

      if (simulationState) {
        const savedStep = currentStep;
        runSingleSimulation();
        if (savedStep >= 0 && simulationState) {
          goToStep(Math.min(savedStep, simulationState.steps.length - 1));
        }
      }
    }
  }
});

// Canvas Tooltips
canvas.addEventListener('mousemove', (e) => {
  if (currentView !== 'track') {
    canvasTooltip.style.display = 'none';
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const hit = nodeHitboxes.find(box => {
    const dist = Math.hypot(mouseX - box.x, mouseY - box.y);
    return dist <= box.radius;
  });

  if (hit) {
    canvasTooltip.textContent = hit.text;
    canvasTooltip.style.left = `${hit.x}px`;
    canvasTooltip.style.top = `${hit.y}px`;
    canvasTooltip.style.display = 'block';
  } else {
    canvasTooltip.style.display = 'none';
  }
});

canvas.addEventListener('mouseleave', () => {
  canvasTooltip.style.display = 'none';
});

// Live I/O Stream Generator
liveStreamToggleBtn.addEventListener('click', () => {
  isLiveStreaming = !isLiveStreaming;
  liveStreamToggleBtn.classList.toggle('active', isLiveStreaming);
  liveStreamToggleBtn.innerHTML = `<span class="stream-dot"></span> ${isLiveStreaming ? 'Streaming...' : 'Live I/O Stream'}`;

  if (isLiveStreaming) {
    liveStreamTimer = setInterval(() => {
      const maxCyl = parseInt(maxCylinderInput.value, 10) || 199;
      const currentHead = simulationState && currentStep >= 0 ? simulationState.steps[currentStep].to : parseInt(headInput.value, 10) || 50;
      let newReq;
      if (algorithmSelect.value === 'SSTF' && Math.random() < 0.7) {
        newReq = Math.max(0, Math.min(maxCyl, currentHead + (Math.floor(Math.random() * 20) - 10)));
      } else {
        newReq = Math.floor(Math.random() * (maxCyl + 1));
      }

      const currentReqs = parseRequests(requestsInput.value);
      if (!currentReqs.includes(newReq)) {
        currentReqs.push(newReq);
        requestsInput.value = currentReqs.join(', ');
        updateRequestBadge();
        if (simulationState) {
          const step = currentStep;
          runSingleSimulation();
          goToStep(step);
        }
      }
    }, 2800);
  } else {
    clearInterval(liveStreamTimer);
  }
});

// ==========================================================================
// UI Synchronization & Telemetry Update
// ==========================================================================

function updateUI(state, stepIndex) {
  const isStarted = stepIndex >= 0;
  const currentStepData = isStarted && state.steps[stepIndex] ? state.steps[stepIndex] : null;
  const cumulativeSeek = currentStepData ? currentStepData.cumulative : 0;

  const latency = calculateHardwareLatency(cumulativeSeek, isStarted ? stepIndex + 1 : state.requests.length);

  totalSeekElem.textContent = cumulativeSeek;
  totalSeekTimeMsElem.textContent = latency.totalSeekTime;
  rotDelayMsElem.textContent = latency.rotDelayPerReq;
  totalAccessTimeMsElem.textContent = latency.totalAccessTime;
  reversalsCountElem.textContent = isStarted ? computeReversals(state.steps.slice(0, stepIndex + 1)) : 0;
  currentStepDisplayElem.textContent = isStarted ? stepIndex + 1 : 0;
  totalStepsElem.textContent = state.steps.length;

  // Timeline Scrubber Sync
  timelineScrubber.max = state.steps.length;
  timelineScrubber.value = isStarted ? stepIndex + 1 : 0;
  timelineStepBadge.textContent = `Step ${isStarted ? stepIndex + 1 : 0} / ${state.steps.length}`;
  timelineScrubber.disabled = state.steps.length === 0;

  // Progress Bar
  const progressPercent = state.steps.length > 0 ? Math.max(0, ((stepIndex + 1) / state.steps.length) * 100) : 0;
  progressBarFill.style.width = `${progressPercent}%`;

  // Step Details Box
  if (currentStepData) {
    stepDetailsElem.innerHTML = `
      <p><strong>Step ${stepIndex + 1} of ${state.steps.length}:</strong></p>
      <div class="math-formula">|${currentStepData.to} - ${currentStepData.from}| = ${currentStepData.seek} cyl (${(currentStepData.seek * parseFloat(trackSeekTimeInput.value || 0.15)).toFixed(2)} ms)</div>
      <p>${currentStepData.explanation}</p>
      <p><strong>Cumulative Seek:</strong> ${currentStepData.cumulative} cyl</p>
      <p><strong>Est. Step Latency:</strong> ${(currentStepData.seek * 0.15 + parseFloat(latency.rotDelayPerReq) + 0.05).toFixed(2)} ms</p>
    `;
  } else {
    stepDetailsElem.innerHTML = '<div class="empty-state-text">Ready to step through requests.</div>';
  }

  // Service Order Chips
  let chipsHTML = `<div class="chip start" onclick="goToStep(-1)" title="Initial Head Position">Start: ${state.initialHead}</div>`;
  state.order.forEach((cyl, idx) => {
    let chipClass = 'chip';
    if (idx === stepIndex) {
      chipClass += ' active';
    } else if (idx < stepIndex) {
      chipClass += ' serviced';
    }
    chipsHTML += `<div class="${chipClass}" onclick="goToStep(${idx})" title="Step ${idx + 1}: Cylinder ${cyl}">${cyl}</div>`;
  });
  serviceOrderChipsElem.innerHTML = chipsHTML;
}

function enablePlaybackControls(enable) {
  playBtn.disabled = !enable;
  pauseBtn.disabled = !enable;
  prevBtn.disabled = !enable;
  nextBtn.disabled = !enable;
  jumpStartBtn.disabled = !enable;
  jumpEndBtn.disabled = !enable;
  resetBtn.disabled = !enable;
  timelineScrubber.disabled = !enable;
}

// ==========================================================================
// Playback Controller & Stepping State Machine
// ==========================================================================

function goToStep(stepIndex) {
  if (!simulationState) return;

  const prev = currentStep;
  currentStep = Math.max(-1, Math.min(stepIndex, simulationState.steps.length - 1));

  if (currentStep >= 0 && currentStep !== prev) {
    const step = simulationState.steps[currentStep];
    playStepSound(step.seek, simulationState.maxCylinder, step.to);
    speakStep(`Step ${currentStep + 1}: Seek to cylinder ${step.to}`);
  }

  renderCurrentView();
  updateUI(simulationState, currentStep);
}

async function playAnimation() {
  if (!simulationState || isPlaying) return;

  isPlaying = true;
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-flex';

  while (isPlaying && currentStep < simulationState.steps.length - 1) {
    goToStep(currentStep + 1);
    const delay = 1000 / animationSpeed;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  isPlaying = false;
  playBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
}

function pauseAnimation() {
  isPlaying = false;
  playBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
}

// ==========================================================================
// View Tabs Switcher & Continuous Platter Loop
// ==========================================================================

tabTrack.addEventListener('click', () => switchView('track'));
tabGraph.addEventListener('click', () => switchView('graph'));
tabPlatter.addEventListener('click', () => switchView('platter'));
tab3DStack.addEventListener('click', () => switchView('stack3d'));
tabSsd.addEventListener('click', () => switchView('ssd'));
tabLinux.addEventListener('click', () => switchView('linux'));
tabSandbox.addEventListener('click', () => switchView('sandbox'));
tabComparison.addEventListener('click', () => switchView('comparison'));
tabQuiz.addEventListener('click', () => switchView('quiz'));

function switchView(view) {
  currentView = view;
  [tabTrack, tabGraph, tabPlatter, tab3DStack, tabSsd, tabLinux, tabSandbox, tabComparison, tabQuiz].forEach(tab => tab.classList.remove('active'));
  quizOverlay.style.display = view === 'quiz' ? 'flex' : 'none';
  sandboxOverlay.style.display = view === 'sandbox' ? 'flex' : 'none';

  if (view === 'track') {
    tabTrack.classList.add('active');
    viewModeBadge.textContent = 'Interactive 1D Physical Track (Click to Add I/O)';
  } else if (view === 'graph') {
    tabGraph.classList.add('active');
    viewModeBadge.textContent = 'OS Textbook 2D Seek Trajectory Graph';
  } else if (view === 'platter') {
    tabPlatter.classList.add('active');
    viewModeBadge.textContent = 'Concentric Hard Disk Platter & Actuator Arm (Click to Add I/O)';
  } else if (view === 'stack3d') {
    tab3DStack.classList.add('active');
    viewModeBadge.textContent = '3D Multi-Platter Cylinder Stack & CHS Multi-Head Comb';
  } else if (view === 'ssd') {
    tabSsd.classList.add('active');
    viewModeBadge.textContent = '⚡ NVMe SSD NAND Flash Controller & Die Array';
  } else if (view === 'linux') {
    tabLinux.classList.add('active');
    viewModeBadge.textContent = '🐧 Linux Kernel I/O Queue Architecture';
  } else if (view === 'sandbox') {
    tabSandbox.classList.add('active');
    viewModeBadge.textContent = '💻 In-Browser Custom JavaScript Algorithm Code Sandbox';
  } else if (view === 'comparison') {
    tabComparison.classList.add('active');
    viewModeBadge.textContent = 'Comprehensive Storage Benchmark Matrix';
    if (!comparisonState) runComparison();
  } else if (view === 'quiz') {
    tabQuiz.classList.add('active');
    viewModeBadge.textContent = '🎓 OS Exam Prep Arena';
    loadNextQuizQuestion();
  }

  renderCurrentView();
}

// Continuous rotation loop for platter & 3D stack views
setInterval(() => {
  if ((currentView === 'platter' || currentView === 'stack3d') && simulationState) {
    renderCurrentView();
  }
}, 30);

// ==========================================================================
// Gamified OS Exam Quiz Arena
// ==========================================================================
function loadNextQuizQuestion() {
  quizFeedbackBox.style.display = 'none';
  const algos = ['FCFS', 'SSTF', 'SCAN', 'LOOK', 'DEADLINE'];
  const pickedAlgo = algos[Math.floor(Math.random() * algos.length)];
  const maxCyl = 199;
  const head = Math.floor(Math.random() * (maxCyl - 40)) + 20;

  const reqSet = new Set();
  while (reqSet.size < 4) {
    const r = Math.floor(Math.random() * maxCyl);
    if (r !== head) reqSet.add(r);
  }
  const reqs = Array.from(reqSet);
  const direction = Math.random() < 0.5 ? 'high' : 'low';

  let res;
  if (pickedAlgo === 'FCFS') res = fcfs(reqs, head);
  else if (pickedAlgo === 'SSTF') res = sstf(reqs, head);
  else if (pickedAlgo === 'SCAN') res = scan(reqs, head, maxCyl, direction);
  else if (pickedAlgo === 'LOOK') res = look(reqs, head, direction);
  else if (pickedAlgo === 'DEADLINE') res = deadlineScheduler(reqs, head, maxCyl);

  const correctAnswer = res.steps[0].to;
  const explanation = res.steps[0].explanation;

  currentQuizData = {
    algo: pickedAlgo,
    head,
    reqs,
    direction,
    correctAnswer,
    explanation
  };

  quizQuestionText.textContent = `Which cylinder will ${pickedAlgo} service FIRST?`;
  quizScenarioDetails.innerHTML = `Head: <strong>${head}</strong> | Queue: [${reqs.join(', ')}] ${['SCAN', 'LOOK'].includes(pickedAlgo) ? `| Moving: ${direction.toUpperCase()}` : ''}`;

  quizOptionsGrid.innerHTML = '';
  reqs.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = `Cylinder ${opt}`;
    btn.onclick = () => submitQuizAnswer(opt, btn);
    quizOptionsGrid.appendChild(btn);
  });
}

function submitQuizAnswer(selectedOption, clickedBtn) {
  const isCorrect = selectedOption === currentQuizData.correctAnswer;
  quizTotal++;

  if (isCorrect) {
    quizScore++;
    quizStreak++;
    clickedBtn.classList.add('correct');
    quizFeedbackText.innerHTML = `✅ <strong>Correct!</strong> ${currentQuizData.explanation}`;
    playStepSound(5, 200);
  } else {
    quizStreak = 0;
    clickedBtn.classList.add('wrong');
    quizFeedbackText.innerHTML = `❌ <strong>Incorrect!</strong> The correct cylinder is <strong>${currentQuizData.correctAnswer}</strong>.<br>${currentQuizData.explanation}`;
  }

  Array.from(quizOptionsGrid.children).forEach(b => {
    b.disabled = true;
    if (b.textContent.includes(currentQuizData.correctAnswer.toString())) {
      b.classList.add('correct');
    }
  });

  quizScoreElem.textContent = quizScore;
  quizTotalElem.textContent = quizTotal;
  quizStreakBadge.textContent = `🔥 Streak: ${quizStreak}`;
  quizFeedbackBox.style.display = 'flex';
}

quizNextBtn.addEventListener('click', loadNextQuizQuestion);

// ==========================================================================
// Homework Solution, CSV & PNG Exporters
// ==========================================================================

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

exportSolutionBtn.addEventListener('click', () => {
  if (!simulationState) {
    alert('Please run a simulation first to export the homework solution.');
    return;
  }

  const s = simulationState;
  const lat = calculateHardwareLatency(s.totalSeek, s.requests.length);

  let md = `# Operating Systems Storage Subsystem Homework Solution & Proof\n\n`;
  md += `**Algorithm:** ${algorithmProfiles[s.algorithm]?.name || s.algorithm}\n`;
  md += `**Storage Device Mode:** ${deviceMode === 'SSD' ? 'NAND Flash NVMe SSD' : 'Mechanical Hard Disk Drive (HDD)'}\n`;
  md += `**Initial Head Position:** ${s.initialHead}\n`;
  md += `**Disk Request Queue:** [${s.requests.join(', ')}]\n`;
  md += `**Max Cylinder Limit:** ${s.maxCylinder}\n`;
  md += `**Initial Head Direction:** ${s.direction.toUpperCase()}\n\n`;
  md += `## Step-by-Step Movement Breakdown\n\n`;
  md += `| Step # | From Cylinder | To Cylinder | Seek Distance (|To - From|) | Cumulative Seek | Explanation |\n`;
  md += `| :---: | :---: | :---: | :---: | :---: | :--- |\n`;

  s.steps.forEach((st, i) => {
    md += `| ${i + 1} | ${st.from} | ${st.to} | ${st.seek} | ${st.cumulative} | ${st.explanation} |\n`;
  });

  md += `\n## Final Performance Metrics\n\n`;
  md += `- **Total Head Movement:** \`${s.totalSeek}\` cylinders\n`;
  md += `- **Average Seek Distance:** \`${(s.totalSeek / s.requests.length).toFixed(2)}\` cylinders/request\n`;
  md += `- **Head Direction Changes:** \`${s.reversals}\` times\n`;
  md += `- **Estimated Total Access Time:** \`${lat.totalAccessTime}\` ms\n\n`;
  md += `*Generated automatically by Disk Scheduling Simulator & OS Storage Architecture Lab.*\n`;

  downloadFile(md, `disk_scheduling_${s.algorithm.toLowerCase()}_solution.md`, 'text/markdown');
});

exportCsvBtn.addEventListener('click', () => {
  if (!simulationState) {
    alert('Please run a simulation first to export telemetry.');
    return;
  }

  let csv = `Step,From,To,SeekDistance,CumulativeSeek,Explanation\n`;
  simulationState.steps.forEach((st, i) => {
    csv += `${i + 1},${st.from},${st.to},${st.seek},${st.cumulative},"${st.explanation.replace(/"/g, '""')}"\n`;
  });

  downloadFile(csv, `disk_scheduling_${simulationState.algorithm.toLowerCase()}_telemetry.csv`, 'text/csv');
});

exportPngBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `disk_simulator_${currentView}_snapshot.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ==========================================================================
// Simulation & Benchmark Triggers
// ==========================================================================

function runSingleSimulation() {
  pauseAnimation();

  let requests = parseRequests(requestsInput.value);
  const head = parseInt(headInput.value, 10);
  const maxCylinder = parseInt(maxCylinderInput.value, 10);
  const algorithm = algorithmSelect.value;
  const direction = getSelectedDirection();
  const nStepSize = parseInt(nStepSizeInput.value, 10) || 4;

  requests = clampRequests(requests, maxCylinder);

  if (requests.length === 0) {
    alert('Please enter valid disk requests within the 0 to max cylinder range.');
    return;
  }
  if (isNaN(head) || head < 0 || head > maxCylinder) {
    alert(`Initial head position must be between 0 and ${maxCylinder}.`);
    return;
  }

  let result;
  switch (algorithm) {
    case 'FCFS': result = fcfs(requests, head); break;
    case 'SSTF': result = sstf(requests, head); break;
    case 'SCAN': result = scan(requests, head, maxCylinder, direction); break;
    case 'CSCAN': result = cscan(requests, head, maxCylinder, direction); break;
    case 'LOOK': result = look(requests, head, direction); break;
    case 'CLOOK': result = clook(requests, head, direction); break;
    case 'FSCAN': result = fscan(requests, head, maxCylinder, direction); break;
    case 'NSTEPSCAN': result = nStepScan(requests, head, maxCylinder, direction, nStepSize); break;
    case 'DEADLINE': result = deadlineScheduler(requests, head, maxCylinder); break;
    case 'CFQ': result = cfqScheduler(requests, head, maxCylinder); break;
    case 'NOOP': result = noopScheduler(requests, head); break;
    case 'USER_ORDER': result = simulateUserOrder(requests, head); break;
    default: result = fcfs(requests, head);
  }

  simulationState = {
    requests,
    initialHead: head,
    maxCylinder,
    algorithm,
    direction,
    ...result
  };

  currentStep = -1;
  updateAlgoProfilePreview(algorithm);
  enablePlaybackControls(true);

  if (currentView === 'comparison' || currentView === 'quiz' || currentView === 'sandbox') {
    switchView('track');
  } else {
    renderCurrentView();
  }
  updateUI(simulationState, -1);

  setTimeout(() => playAnimation(), 350);
}

function runComparison() {
  pauseAnimation();

  let requests = parseRequests(requestsInput.value);
  const head = parseInt(headInput.value, 10);
  const maxCylinder = parseInt(maxCylinderInput.value, 10);
  const direction = getSelectedDirection();

  requests = clampRequests(requests, maxCylinder);
  if (requests.length === 0 || isNaN(head)) return;

  comparisonState = runAllAlgorithms(requests, head, maxCylinder, direction);
  switchView('comparison');
}

// Button Bindings
startBtn.addEventListener('click', runSingleSimulation);
compareBtn.addEventListener('click', runComparison);

playBtn.addEventListener('click', playAnimation);
pauseBtn.addEventListener('click', pauseAnimation);

prevBtn.addEventListener('click', () => {
  pauseAnimation();
  goToStep(currentStep - 1);
});

nextBtn.addEventListener('click', () => {
  pauseAnimation();
  goToStep(currentStep + 1);
});

jumpStartBtn.addEventListener('click', () => {
  pauseAnimation();
  goToStep(-1);
});

jumpEndBtn.addEventListener('click', () => {
  pauseAnimation();
  if (simulationState) {
    goToStep(simulationState.steps.length - 1);
  }
});

resetBtn.addEventListener('click', () => {
  pauseAnimation();
  goToStep(-1);
});

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (isPlaying) {
      pauseAnimation();
    } else {
      playAnimation();
    }
  } else if (e.code === 'ArrowLeft') {
    pauseAnimation();
    goToStep(currentStep - 1);
  } else if (e.code === 'ArrowRight') {
    pauseAnimation();
    goToStep(currentStep + 1);
  } else if (e.code === 'Home') {
    pauseAnimation();
    goToStep(-1);
  } else if (e.code === 'End') {
    pauseAnimation();
    if (simulationState) goToStep(simulationState.steps.length - 1);
  } else if (e.code === 'KeyR') {
    pauseAnimation();
    goToStep(-1);
  } else if (e.code === 'KeyT') {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  } else if (e.code === 'KeyV') {
    voiceToggleBtn.click();
  }
});

// Initial Setup on Load
applyTheme(currentTheme);
updateRequestBadge();
updateChsCalculation();
updateAlgoProfilePreview(algorithmSelect.value);
resizeCanvasForHighDPI();