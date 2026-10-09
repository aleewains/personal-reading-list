# Personal Reading List (Brief C)

A personal reading list application built with React, TypeScript, and Vite, backed by persistent client storage with simulated asynchronous network semantics.

This project specifically demonstrates and distinguishes **Loading**, **Error**, and **Empty** states, making all three independently demonstrable without editing code.

---

## 🎯 Architectural Principles & Acceptance Criteria

### 1. Zero vs. Unmeasured (`Empty` vs. `Loading`)
* **Unmeasured (Loading)**: The request is in-flight. The system does not know how many records exist. Displaying "0 books" or an empty shelf during this phase is factually inaccurate. This state renders pulsing skeleton cards, an active progress indicator, and explicit textual guidance: `STATUS: IN-FLIGHT REQUEST (UNMEASURED)`.
* **Zero Recorded (Empty)**: The request has completed successfully and authoritatively confirmed that the collection contains 0 entries. This state displays a welcoming onboarding screen explaining the value of the reading list and presenting the primary action: **"+ Add Your First Book"**.

### 2. Actionable Error Messages (`Error`)
The failure screen is visually distinct (high-visibility danger alert styling) and delivers 3 mandatory pieces of diagnostic context:
1. **What Failed**: Specific technical failure (e.g., HTTP 503 database gateway failure or HTTP 408 network timeout).
2. **What To Do Next**: Actionable steps, including an interactive **"Try Again"** retry button.
3. **When Retrying Will Not Help**: Explicit guidance stating when immediate retries are futile (e.g., scheduled database maintenance windows or complete offline network disconnection).

### 3. Reviewer Demonstrability
Reviewers can trigger every state **without modifying any code** through multiple independent methods:
* **URL Query Parameters** (ideal for automated evaluation and deep links)
* **Interactive Reviewer DevBar** (one-click state switcher & latency control)
* **Real Persistent Storage Operations** (adding books, removing books, clearing storage)
* **Browser DevTools Network Throttling / Offline Simulation**

---

## 🚀 Quick Start

### Prerequisites
* Node.js (v18+ or v20+)
* npm (v9+)

### Installation & Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite verifying all states
npm test

# 3. Start development server
npm run dev
```

Visit the app in your browser (typically `http://localhost:5173`).

---

## 📋 Reviewer Guide: Exact Steps to Reach Each State

### Method A: Via Direct URL Query Parameters (Recommended)

Open any of the following URLs in your browser:

| Target State | URL / Query Parameter | Description |
| :--- | :--- | :--- |
| **Loading State** | `http://localhost:5173/?state=loading` | Holds the in-flight unmeasured state. Displays skeleton loaders and unmeasured status note. |
| **Error State (503)** | `http://localhost:5173/?state=error` | Simulates an HTTP 503 Database Unavailable failure. Displays failure details, retry button, and maintenance notice. |
| **Timeout Error (408)** | `http://localhost:5173/?state=timeout` | Simulates an HTTP 408 Network Request Timeout with socket reconnection instructions. |
| **Empty State** | `http://localhost:5173/?state=empty` | Displays verified 0-item state explaining the feature with "+ Add Your First Book" CTA. |
| **Populated State** | `http://localhost:5173/?state=populated` | Displays the populated reading shelf with pre-seeded books. |
| **Live Store (Auto)** | `http://localhost:5173/` | Default mode connected to persistent `localStorage`. |

---

### Method B: Via Interactive Reviewer DevBar (In-App Switcher)

At the top of the application screen, an integrated **Reviewer State Switcher** is provided:

1. **To view Loading State**:
   * Click **"2. Force Loading State"**.
   * Observe skeleton cards and the unmeasured data banner.
2. **To view Error State**:
   * Click **"3. Force Error (503)"** or **"4. Force Timeout (408)"**.
   * Observe the error badge, diagnostic card, "What Failed", "What To Do Next", and "When retrying will NOT help" alert.
   * Click the **"Try Again"** button to observe retry handling.
3. **To view Empty State**:
   * Click **"5. Force Empty State"** (or click **"Clear Storage"** in Auto mode).
   * Observe the explanation of the reading list and click **"Add Your First Book"** to open the creation dialog.
4. **To view Populated State**:
   * Click **"1. Live Store (Auto)"** or **"6. Force Populated"**.
   * Click **"Reset Demo Books"** at any time to restore the default 3 books.

---

### Method C: Testing Genuine Empty & Populated via User Actions

1. In **Live Store (Auto)** mode, click **"Clear Storage"** on the DevBar (or delete books individually using the trash icon on each card).
2. Once the last book is deleted, observe that the UI immediately transitions to the **Empty State**, inviting the user to start reading.
3. Click **"+ Add Your First Book"** to open the modal dialog.
4. Fill in the title (e.g., *"Clean Architecture"*), author (e.g., *"Robert C. Martin"*), status, rating, and notes.
5. Click **"Add Book to Shelf"**.
6. The book is saved to persistent `localStorage` and immediately appears in the populated list. Refreshing the browser preserves the saved book.

---

### Method D: Via Browser Network Throttling

1. Open Chrome / Firefox / Safari DevTools (`F12` or `Cmd + Option + I`).
2. Switch to the **Network** tab.
3. In the throttling dropdown, select **Slow 3G** (or set simulated latency to 2500ms in the DevBar).
4. Reload the page or click **"Refetch"** to clearly inspect the skeleton pulse animation during the unmeasured loading phase.
5. Set throttling to **Offline** to observe genuine disconnection handling.

---

## 🧪 Automated Test Verification

This project includes automated unit and integration tests covering all acceptance criteria using **Vitest** and **React Testing Library**:

```bash
npm test
```

### Test Suite Coverage:
* `1. Loading State`:
  * Verifies visual and textual distinction (`STATUS: IN-FLIGHT REQUEST (UNMEASURED)`).
  * Verifies rendering of skeleton placeholders.
  * Verifies direct accessibility via `?state=loading`.
* `2. Error State`:
  * Verifies failure explanation (`whatFailed`).
  * Verifies recovery guidance (`suggestedAction`).
  * Verifies non-recoverable notice (`When retrying will NOT help`).
  * Verifies active retry callback trigger.
  * Verifies direct accessibility via `?state=error`.
* `3. Empty State`:
  * Verifies feature explanation text and value proposition.
  * Verifies first action CTA button (`+ Add Your First Book`).
  * Verifies direct accessibility via `?state=empty` and via zero-item storage.
* `4. Populated State`:
  * Verifies book display, reading status update, and adding/removing books.
* `5. Reviewer Controls`:
  * Verifies DevBar interaction and automatic URL query parameter synchronization.

---

## 🛠️ Tech Stack
* **UI Library**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Styling**: Modern responsive CSS with custom design system variables & dark mode aesthetics
* **Icons**: Lucide React
* **Persistence**: Browser `localStorage` with simulated asynchronous latency & error injection
* **Testing**: Vitest + React Testing Library + JSDOM
