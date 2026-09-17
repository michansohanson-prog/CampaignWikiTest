# PROJECT BLUEPRINT: THE CAMPAIGN BIBLE (Wiki System)

This document serves as the "Master Plan" for building a scalable, persistent, and portable D&D Wiki. It ensures that your personal planning tool can be seamlessly transitioned into a player-facing website without rebuilding anything from scratch.

---

## 1. The Tech Stack & Tools
* Framework: React + Vite (Fast development, high performance).
* Styling: Tailwind CSS (Rapid UI prototyping and consistent styling).
* Data Format: Markdown (.md) files with YAML Frontmatter (Human-readable, AI-friendly).
* Local Engine: Remote Fetch / API (Primary for players) & Local File Proxy (DM Development).
* Search/Indexing: FlexSearch or a custom lightweight indexer for instant navigation.
* Deployment Target: GitHub Pages (Hosting the public version of the wiki).

---

## 2. Project Directory Structure
├── campaign_data/             <-- THE DATA SOURCE (Your "Database")
│   ├── assets/                <-- Images, maps, portraits
│   ├── characters/           <-- All NPC and Player files
│   ├── factions/             <-- Groups, organizations, and guilds
│   ├── regions/              <-- Geography, cities, and landmarks
│   ├── history/              <-- Timeline, world lore, and events
│   ├── items/                <-- Magic items, weapons, and equipment
│   └── monsters/             <-- Bestiary, creatures, and hazards
├── src/
    ├── assets/                <-- App-specific assets (logos, etc.)
    ├── components/            <-- UI Components (Shared)
    │   ├── ui/                <-- Buttons, Inputs, Modals
    │   └── wiki/              <-- Wiki-specific items (Sidebar, PageViewer)
    ├── hooks/                 <-- Logic Hooks (useWikiData, useAutoSave)
    ├── lib/                   <-- Third party library wrappers & utils
    ├── services/              <-- Data Fetching Layer
    │   └── wikiService.js     <-- Handles Remote Fetch vs Local Proxy logic
    ├── context/               <-- Global State Contexts (WikiContext, ThemeContext)
    ├── pages/                 <-- Route definitions
    └── styles/                <-- Global CSS / Tailwind Config
├── public/                    <-- Static assets for production build
├── package.json
└── vite.config.js

---

## 3. Pathing & Integrity Strategy
* Relative Paths Only: NEVER use absolute paths. Always use relative paths starting from the campaign root (e.g., ./assets/world_map.png).
* Base URL Handling: We will configure Vite to handle "base" paths so that when you deploy to GitHub, all links correctly point to your repo's subfolder.
* Abstraction Layer: The Service layer must be agnostic of the source. It should support a SOURCE_TYPE toggle (LOCAL for DM development, REMOTE for player deployment).

---

## 4. Data & Scalability Requirements
- Markdown Format: All data is stored as .md files with YAML Frontmatter for metadata.
- Data Schema: Every Markdown file MUST include the following fields in its header:
    - title: The display name of the entry.
    - type: category (e.g., faction|monster|region|character|item|history).
    - parent_id: The kebab-case ID of the parent category (for nesting).
    - tags: An array of descriptive tags (e.g., ["military", "secret"]).
    - summary: A short blurb for search results and list previews.
- Lightweight Parsing: For parsing frontmatter in the browser, use simple string manipulation or lightweight, zero-dependency parsers to avoid Node.js runtime conflicts. 
- Pagination/Lazy Loading: Implement client-side pagination or scroll-loading for any list exceeding 50 items.
- Optimization: Use useMemo and useCallback for expensive calculations or to prevent unnecessary re-renders in large lists.

---

## 5. UI & UX Standards
- Mobile-First Design: Ensure all components are usable on small screens (<768px). Avoid "hover" states as primary interaction methods (not possible on touchscreens). Ensure large enough tap targets for buttons.
- Layout Stability: Always reserve space for headers or sidebars to prevent "layout shift" during component mounting.
- Glassmorphism: Apply transparency and blur effects consistently to follow the project's aesthetic.

---

## 6. Integration & Deployment Workflow
Stage 1: Local Development (Currently)
* Source: The app reads from a local proxy of the campaign_data/ folder for instant feedback while you write content.
* Mode: High-frequency "Auto-save" as you plan your world.
* Tooling: Using Vite's HMR for instant UI updates while vibe-coding.

Stage 2: Player Integration (Deployment)
1. The "Publish" Sync: You move the campaign_data/ folder into a GitHub Repository.
2. Build & Deploy: Run npm run build. Vite creates a static version of your site.
3. Host on GitHub Pages: Your players get a URL (e.g., yourname.github.io/campaign-bible).
4. Remote Fetch Mode: The app switches to fetching JSON versions of the Markdown files from the hosted URL.

---

## 7. Execution Roadmap (Step-by-Step)
1. Phase 1: The Core. Setup Folder Structure -> Build Sidebar Navigation -> Markdown Parser.
2. Phase 2: The Interaction. Implement WikiContext -> Remote Fetch Service Layer -> Search Functionality.
3. Phase 3: The Aesthetics. Apply Tailwind Styling (Mobile-first/Glassmorphism) -> Image support -> Responsive Layouts.
4. Phase 4: The Expansion. Integrate GitHub Pages workflow -> Final polish for player access.
