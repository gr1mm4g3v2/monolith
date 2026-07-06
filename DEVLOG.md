# Monolith Development Log 🗒️

This file tracks the development process, log entries, milestones, and task checklists for **Monolith**. It will be updated continuously as features are added, modified, or completed.

---

## 🚦 Quick Status
* **Current Phase**: Phase 1 - Foundation & Project setup
* **Overall Progress**: 20%
* **Last Updated**: 2026-07-06

---

## 🛠️ Task Board

### 🚀 Phase 1: Foundation, Storage & Core Layout
* [x] Initialize Next.js project with Tailwind CSS v4 & TypeScript
* [x] Create comprehensive `README.md` introducing the project and its 4 pillars
* [x] Create `DEVLOG.md` to track milestones and tasks
* [x] Design local-first state storage system with SQLite & Prisma ORM
* [x] Implement global dashboard layout with high-end dark mode aesthetics, sidebar navigation, and quick-action menu
* [x] Design and implement multi-project isolation architecture and project switcher dropdown
* [ ] Integrate Gemini API / AI Logic client utility for generating data (Wiki, tickets, test scenarios)

### 📝 Phase 2: The Wiki Module (Confluence Lite)
* [ ] Build documentation listing page and detail editor page (markdown support)
* [ ] Implement manual documentation creation and editing
* [ ] Implement AI-assisted document generator (prompt to write PRD/spec docs)
* [ ] Build the "AI Review Workflow" (Show AI draft -> allow edits -> approve/reject)
* [ ] Support linking documents to The Board tasks and The Laboratory test scenarios

### 📋 Phase 3: The Board Module (Jira Lite)
* [ ] Build Kanban board & list views for managing tickets (Tasks, Bugs, Epics, E2E Test Tasks)
* [ ] Build manual ticket creation forms
* [ ] Implement AI ticket extractor (analyzes a Wiki document and generates recommended Kanban tasks)
* [ ] Support manual editing, deletion, status columns drag-and-drop, and priority settings
* [ ] Create E2E test task ticket types that tie directly to quality assurance runs

### 🧪 Phase 4: The Laboratory Module (qTest Lite)
* [ ] Build Test Case management dashboard (list, filter by requirements)
* [ ] Implement manual test case creator (steps, expected results)
* [ ] Implement AI test scenario generator (creates test cases automatically from Wiki PRDs or Board user stories)
* [ ] Create "Test Run Runner" (interactive checklist to run tests, mark Pass/Fail for each step, write comments)
* [ ] Implement auto-bug generation: when a test run fails, automatically create a Bug ticket on The Board linking back to the failed test run step

### 🎨 Phase 5: The Canvas Module (Figma Lite - Optional)
* [ ] Build infinite canvas component with basic vector shapes, text, and connector lines
* [ ] Create a layout inspector (adjust sizes, position, colors, alignment)
* [ ] Implement AI Canvas Generator (describe UI layout -> AI puts wireframe blocks on canvas)
* [ ] Add linkage to Wiki docs and Board tickets (embed Canvas viewport or mock link)

### ✨ Phase 6: Integration, Polish & E2E Validation
* [ ] Build full end-to-end flow: Wiki (PRD) -> AI -> Board (Jira Tickets) -> AI -> Tests (Scenarios) -> Run Tests -> Bug Creation
* [ ] Polish visual aesthetics (rich transitions, dark/glassmorphic theme, micro-animations)
* [ ] Add database backup/restore (JSON import/export)
* [ ] Validate accessibility (a11y) and keyboard navigation

---

## 🪵 Development Log

### 2026-07-06
* **Init & Documentation setup**:
  * Cleaned up default `README.md` and created project-specific `README.md` defining the 4 pillars of the Monolith suite.
  * Created `DEVLOG.md` with structured developmental phases, tasks, and future backlog items.
  * Verified Next.js 16 configuration with Tailwind CSS v4.
* **Database & ORM Foundation**:
  * Installed Prisma and `@prisma/client` dependencies.
  * Configured local SQLite database environment (`dev.db`).
  * Defined relational schema in `prisma/schema.prisma` covering models for Documents (Wiki), Canvases, Issues (Board), and TestScenarios/Steps/Runs/RunSteps (Laboratory).
  * Built global PrismaClient helper `lib/prisma.ts`.
  * Updated module nomenclature to official names: *The Wiki*, *The Canvas*, *The Board*, and *The Laboratory*.
* **Global Layout & Navigation**:
  * Configured global Tailwind v4 properties, glassmorphism panel/card selectors, custom scrollbars, and helper classes in `globals.css`.
  * Created client navigation sidebar component `components/Sidebar.tsx` displaying vector icons, active state styling, and AI Context Engine dashboard cards.
  * Integrated sidebar into root layout shell `app/layout.tsx`.
  * Created routing placeholder page stubs for `/wiki`, `/canvas`, `/board`, and `/laboratory`.
  * Built the main Homepage dashboard `app/page.tsx` that dynamically queries workspace database counts (Wiki docs, Canvas boards, Board tickets completed/in progress, Laboratory runs passed/failed) and showcases interactive AI actions.
* **Project Isolation & Onboarding Switcher**:
  * Updated `prisma/schema.prisma` to include a new `Project` table and linked all primary entities (`Document`, `Canvas`, `Issue`, `TestScenario`) to it.
  * Created Next.js Server Actions `app/actions.ts` for type-safe project selection via httpOnly cookies (`active_project_id`) and project creation.
  * Built client dropdown switcher `components/ProjectSelector.tsx` for toggling projects and triggering new project creation modal screens.
  * Built onboarding page screen overlay `components/OnboardingOverlay.tsx` to prompt users to initialize a project on first load.
  * Updated `app/layout.tsx` to handle project switching and onboarding.
  * Updated homepage dashboard `app/page.tsx` queries to segment metrics and recent lists by the active project ID.
