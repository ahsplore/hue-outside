# HUE OUTSIDE 🌿🎨
> **The "Touch Grass" Open-Source AI Challenge**  
> *A daily outdoor color-hunting ritual designed to pull people away from screens, reconnect with nature, and sharpen real-world observation skills.*

[![Built for](https://img.shields.io/badge/Challenge-Touch_Grass_AI-2D5A40?style=flat-square)](https://github.com)
[![AI Integration](https://img.shields.io/badge/AI_Engine-Ollama_Open--Weight-E8A838?style=flat-square)](https://ollama.com)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_On--Device-193826?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-4A7A5B?style=flat-square)](LICENSE)

---

## 🌟 The Philosophy

In a world dominated by endless screen time, algorithmic feeds, and digital fatigue, **HUE OUTSIDE** turns the world outside your window into an interactive game of mindfulness and color exploration.

Every day, the application assigns **one daily color** drawn from a curated palette of 35 seasonal botanical, mineral, and atmospheric pigments.

To complete the day's challenge and maintain their streak, participants must explore their environment and capture two authentic photographs:
1. **🌿 One photo in Nature:** (A flower petal, underside of an oak leaf, moss on wet rock, cloud gradient, bird plumage, river pebble).
2. **☕ One photo in Everyday Life:** (A vintage mug, clothing, notebook, bicycle, transit sign, fruit skin, furniture).

Completing both unlocks that date on the monthly story calendar, preserves your streak, and records your personal field journal.

---

## 🧭 Key Features

### 1. ☀️ Home Dashboard
- **Daily Assigned Hue:** High-contrast color swatch, hex code (`#2D5A40`), RGB coordinates, and botanical family.
- **Dynamic Motivational State:** Real-time progress tracker (`0/2 Found`, `1/2 Halfway there`, or `2/2 Grass Touched! 🎉`).
- **Countdown Timer:** Live countdown to midnight or end of the daily challenge window.
- **Dual Photo Upload Cards:** Dedicated cards with file selection, drag-and-drop, direct camera capture, preview zoom, replace, and caption editing.
- **Habit Stats Row:** Current streak, best streak, total photos taken, and total completed outdoor days.

### 2. 🗓️ Story Calendar & Streak Tracker
- **Instagram-Story Archived Grid:** Each date features that day's assigned color. Completed days display thumbnail previews of your actual captures with a check badge.
- **Cross-Month Continuity:** Streaks never reset simply because a calendar month changes.
- **Full History Preservation:** Navigate backward and forward through any month; click any past or completed day to open the full two-photo inspection journal.
- **Monthly Completion Rate:** Live calculation of completed days vs. total days in the month.

### 3. 🖼️ My Field Archive
- **Visual Outdoor Diary:** Grid gallery showcasing dual-photo pairs.
- **Multi-Facet Filters:** Filter by Category (`All Pairs`, `Nature Only`, `Everyday Only`) and Color Family (`Greens`, `Blues`, `Golds`, `Pinks`, `Purples`, `Terracotta`).
- **Inspection Modal:** Side-by-side view, photo download, field captions, and delete controls.
- **Polished Empty State:** Playful botanical illustration encouraging users to start their first hunt.

### 4. 🎨 Seasonal Color Discovery
- **35 Curated Pigments:** Explores chlorophyll, carotenoids, anthocyanins, limonite, iron oxide, and structural light scattering.
- **Hidden Scout Hints:** Hints are hidden by default behind an interactive toggle so users can exercise observation skills without spoilers.

### 5. 🤖 Open-Source AI Integration: "Color Scout"
- Powered by local open-weight models via **Ollama** (e.g. `Llama 3.2`, `Gemma 2`, `Mistral`, `Phi-3`).
- **Real-Time AI Missions:** Generates custom outdoor nature hiding spots, micro-observation tasks, and mindfulness walking challenges.
- **Configurable & Modular:** Custom endpoint URL, model selector, live connection ping, and streaming response reader.
- **Zero API Keys & Zero Costs:** Does not require proprietary paid APIs.
- **Graceful Offline Fallback:** If Ollama is not running, rich offline field guides automatically display with interactive setup instructions.

### 6. 🔒 100% On-Device Privacy & Offline Capabilities
- **IndexedDB Photo Storage:** User photos are never saved to cloud servers. Photos are stored locally inside the browser's IndexedDB engine, bypassing standard 5MB `localStorage` quotas.
- **Zero Photo Leakage:** Photographs are never transmitted to AI models or external endpoints.
- **Exportable Journal:** One-click JSON export of all logged field notes.

### 7. ⏰ Transparent Notification Scheduling
- Select preferred hunting windows: *Morning Walk (7–11 AM)*, *Lunch Stroll (11:30 AM–2:30 PM)*, *Golden Hour (4–7:30 PM)*, or *All Day*.
- Honest technical disclosure: Clearly informs users of browser sandbox constraints without false claims.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- (Optional, recommended) [Ollama](https://ollama.com) for real-time open-source AI scouting

### Quick Setup

```bash
# Clone or navigate to the repository
cd hue-outside

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🤖 Connecting the Open-Weight AI (Ollama)

Hue Outside connects to a local Ollama instance running open-weight models like **Llama 3.2** (3B) or **Gemma 2** (2B).

### 1. Install Ollama
Download and install Ollama from [ollama.com/download](https://ollama.com/download).

### 2. Pull a Lightweight Model
Open your terminal and run:

```bash
# Llama 3.2 (Meta's lightweight open model - fast & capable)
ollama run llama3.2

# OR Google's Gemma 2 2B
ollama run gemma2:2b

# OR Mistral 7B
ollama run mistral
```

### 3. Allow Browser Connection (CORS Setup)
Browsers restrict direct `fetch` calls to `http://localhost:11434` without CORS headers. Run Ollama with `OLLAMA_ORIGINS="*"`:

- **Windows PowerShell:**
  ```powershell
  $env:OLLAMA_ORIGINS="*"
  ollama serve
  ```
- **Windows Command Prompt (CMD):**
  ```cmd
  set OLLAMA_ORIGINS=*
  ollama serve
  ```
- **macOS / Linux:**
  ```bash
  OLLAMA_ORIGINS="*" ollama serve
  ```

### 4. Verify in Hue Outside
1. Navigate to the **Color Scout** tab or **Settings**.
2. Click the **Refresh / Ping** icon next to the connection pill.
3. Once connected (`● Ollama Online`), choose your model and click **Generate Mission with Ollama**!

*Note: If Ollama is offline or not installed, Hue Outside continues to work 100% smoothly with built-in seasonal field guides.*

---

## 🛠️ Tech Stack

- **Framework:** React 19, TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4, Custom Nature Color Variables
- **Icons:** Lucide React
- **Animations & Sound:** Canvas Confetti, Web Audio API (Nature Chimes)
- **Local Storage:** IndexedDB (`HueOutsidePhotoDB`), LocalStorage (Settings & Metadata)
- **AI Backend:** Ollama API (`/api/tags`, `/api/generate`)

---

## 🌿 License

Distributed under the MIT License. Step outside, breathe the air, and touch grass!
