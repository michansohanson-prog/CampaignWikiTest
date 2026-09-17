# PROJECT BLUEPRINT: THE CAMPAIGN WIKI (Wiki System)

This document serves as the "Master Plan" for building a scalable, persistent, and portable D&D Wiki. It ensures that your personal planning tool can be seamlessly transitioned into a player-facing website without rebuilding anything from scratch.

---

## 1. Core Identity & Philosophy
- **Goal:** Create a high-performance, scalable web-based wiki for extensive world lore, characters, and quest data.
- **Core Philosophy:** Modularization, Separation of Concerns, and Performance.
- **Deployment Goal:** The wiki will be accessed via a mobile phone app (WebView/In-App Browser) for players, while the DM manages content on PC.
- **Remote-First Architecture:** Core architecture must support remote data fetching as the primary production method to ensure player accessibility.

## 2. Tech Stack & Environment
- **Framework:** Vite + React (Fast development, high performance).
- **Styling:** Tailwind CSS (Rapid UI prototyping and consistent styling; Mobile-first focus).
- **Data Format:** Markdown (.md) files with YAML Frontmatter (Human-readable, AI-friendly).
- **Local Engine:** Remote Fetch / API (Primary for players) & Public Folder Proxy (DM Development).
- **Search/Indexing:** Global Search functionality prioritizing keywords over category filtering.
- **Deployment Target:** GitHub Pages (Hosting the public version of the wiki).

## 3. Architectural Standards (The "Source of Truth")
Every feature must follow the **Service -> Hook -> Component** pipeline. Do not skip these layers.

### A. Data Layer (`src/services`) - "The Source"
- All data interactions MUST live in `src/services`.
- **Data Abstraction:** The service layer must be abstracted from the storage method (Local vs. Remote).
- **Pathing Strategy:** To ensure stability on nested routes (e.g., `/wiki/id`), all fetches must use absolute root paths starting with a slash (`/campaign_data/...`).

### B. Logic Layer (`src/context` & `src/hooks`) - "The Brain"
- All business logic, state management (`useState`/`useReducer`), and side-effects (`useEffect`) must be extracted into Custom Hooks or Contexts.
- **Context Authority:** This layer owns the current active category, search query, and currently viewed page ID. By centralizing this here, we ensure that every component on the screen reacts instantly to user input.

### C. Presentation Layer (`src/components`) - "The Face"
- Every feature must be a separate component. 
- Components should only contain UI layout code; they "call" hooks or context for data. This makes the UI highly predictable and easy to style without breaking functionality.

## 4. Data & Scalability Requirements
- **Markdown Format:** All data is stored in `public/campaign_data/` as `.md` files with YAML Frontmatter.
- **Data Schema (Required Fields):** Every Markdown file MUST include the following fields:
    - title: The display name of the entry.
    - type: category (e.g., faction|monster|region|character|item|history).
    - parent_id: The kebab-case ID of the parent category (for nesting).
    - summary: A short blurb for search results and list previews.
    - *Note: Tags functionality is officially deprecated and removed from the schema.*
- **Lightweight Parsing:** Use simple string manipulation or zero-dependency parsers to avoid Node.js runtime conflicts. 
- **Optimization:** Use `useMemo` and `useCallback` for expensive calculations or to prevent unnecessary re-renders in large lists.

## 5. UI & UX Standards
- **Mobile-First Design:** Ensure all components are usable on small screens (<768px). Avoid "hover" states as primary interaction methods (not possible on touchscreens).
- **Layout Stability:** Always reserve space for headers or sidebars to prevent "layout shift" during component mounting.
- **Glassmorphism:** Apply transparency and blur effects consistently to follow the project's aesthetic.

## 6. Progress Report (Current Status)
### ✅ Completed Infrastructure & Interactions:
- **Data Flow Restoration:** Rebuilt the Data Flow to follow the project rules. Moved all filtering state into `WikiContext` as the single Source of Truth, eliminating "Split Brain" issues where components were out of sync.
- **Navigation Fixes:** Corrected Sidebar category buttons by aligning Context mapping with UI labels (ensuring lowercase/singular consistency).
- **Search Engine Repair:** Restored Global Search functionality. The search bar now prioritizes keywords over the sidebar selection, ensuring you can find any piece of lore regardless of which tab is active. Added regex highlighting for results.
- **UI Stability & Polish:** Stabilized and preserved the "Long Tile" Gallery layout; resolved desktop-specific layout shifts in the search bar during input initialization; purged Tailwind linting warnings.
- **Tag Feature Scrub:** Successfully scrubbed all tag states, discovery logic, and visual elements from the entire stack to reduce maintenance complexity.
- **Pathing Correction:** Moved `campaign_data` to `/public/` folder and updated service paths to absolute root paths (`/`) to resolve 404 errors on nested routes.

---

## 7. Roadmap: Next Steps

### Phase 2: Aesthetics & Polish
1.  **Glassmorphism:** Apply advanced transparency, background blurs, and thin borders to follow the requested aesthetic.
2.  **Mobile Optimization:** Fine-tune touch targets and "sticky" navigation behaviors for mobile browser usage.

### Phase 3: The Expansion
1.  Integrate GitHub Pages workflow -> Final polish for player access.

---
*Snapshot saved under commit: FoundationFunctional_TagScrubbed_PathFixed*
