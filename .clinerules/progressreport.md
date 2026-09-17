```markdown
# 🏗️ Project Infrastructure & Progress Report: MyCampaignWiki

## 📜 Current Status Summary (Today's Work)
- **Infrastructure Restoration:** Rebuilt the "Data Flow" to follow the project rules. Moved all filtering state into `WikiContext` as the single Source of Truth, eliminating "Split Brain" issues where components were out of sync.
- **Navigation Fixes:** Corrected the Sidebar category buttons by aligning the Context mapping with the UI labels (ensuring lowercase/singular consistency).
- **Search Engine Repair:** Restored Global Search functionality. The search bar now prioritizes your keywords over the sidebar selection, ensuring you can find any piece of lore regardless of which tab is active.
- **UI Stability & Polish:** 
    - Stabilized and preserved the "Long Tile" Gallery layout for high-density content viewing.
    - Resolved desktop-specific layout shifts in the search bar during input initialization.
    - Purged Tailwind linting warnings to keep the codebase clean.

---

## 🛠️ Core Infrastructure Analysis (The Blueprint)

This project follows a **Service -> Hook -> Component** architecture designed for high performance and scalability:

### 1. Data Layer (`src/services`) - "The Source"
- **Role:** The abstraction layer between raw files and the app.
- **Mechanism:** Fetches `.md` files from `campaign_data/`, parses YAML frontmatter into JSON DTOs (Data Transfer Objects), and handles the conversion of Markdown bodies into usable content strings.
- **Dual Mode:** Designed to support both a local filesystem proxy (for DM development) and a remote fetch URL (for player access).

### 2. Logic Layer (`src/context` & `src/hooks`) - "The Brain"
- **Role:** The Single Source of Truth for state management and business logic.
- **Mechanism (Context Authority):** This layer owns the current active category, search query, and currently viewed page ID. By centralizing this here, we ensure that when a user interacts with any component (e.g., clicks a sidebar button), every other component on the screen reacts instantly.
- **Filtering Logic:** Performs complex calculations (Global Search vs. Category Filtering) in one place before delivering data to the UI.

### 3. Presentation Layer (`src/components`) - "The Face"
- **Role:** Purely visual components that consume logic from the Hooks/Context.
- **Mechanism:** Components like `Gallery` and `SearchBar` do not manage their own state. They "ask" the context for what data to show. This makes the UI highly predictable, testable, and easy to style without breaking functionality.

---

## 🗺️ Roadmap: Next Steps

### Phase 2: Interaction & Connectivity
1. **Cross-Linking:** Implement an internal link parser so that `[[Entry Name]]` inside your Markdown files automatically links to that entry's page.
2. **Search Behavior Polish:** 
    - Ensure the search bar clears its query automatically whenever a category button is selected (Reset on selection).
    - Add real-time feedback and visual highlighting for search results.
3. **Media Integration:** Integrate image handling for portraits, maps, and lore assets within the content viewer.

### Phase 3: Aesthetics & Polish
1. **Glassmorphism:** Apply advanced transparency, background blurs, and thin borders to follow the requested aesthetic.
2. **Mobile Optimization:** Fine-tune touch targets and "sticky" navigation behaviors for mobile browser usage.

---
*Snapshot saved under commit: FoundationFunctional*
```