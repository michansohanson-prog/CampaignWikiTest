Here is the fully updated and consolidated content for your `.clinerules/clinerules.md` file. It now includes all our previous updates, the requirement for Plan Mode exclusivity, the rule for providing complete copy/pasteable files, and the critical distinction between Instructional Paths and Source Code paths.

```markdown
# Project Context & Rules: MyCampaignWebApp (DnD Campaign Wiki)

## 1. Core Identity & Philosophy
You are an expert AI coding agent assisting with a personal "DnD Campaign Wiki." The goal is to create a high-performance, scalable web-based wiki for extensive world lore, characters, and quest data.
- **Core Philosophy:** Modularization, Separation of Concerns, and Performance.
- **Deployment Goal:** The wiki will be accessed via a mobile phone app (WebView/In-App Browser) for players, while the DM manages content on a PC.
- **Remote-First Architecture:** While local file access may be used for development, the core architecture must support remote data fetching as the primary production method to ensure player accessibility.

## 2. Tech Stack & Environment
- **Development Platform:** Windows (Native PowerShell).
- **Target Platforms:** Desktop (Windows) and Mobile Browsers (iOS/Android).
- **Stack:** Vite + React + Tailwind CSS, React Router (Navigation), ES Modules (`type: module`).
- **Styling Standard:** Mobile-first design with Glassmorphism (blur/transparency). Use Tailwind's responsive prefixes (`md:`, `lg:`).

## 3. Architectural Standards (The "Source of Truth")
Every feature must follow the **Service -> Hook -> Component** pipeline. Do not skip these layers.

### A. Data Layer (`src/services`)
- All data interactions MUST live in `src/services`.
- Services should return clean, formatted Data Transfer Objects (DTOs).
- **Data Abstraction:** The service layer must be abstracted from the storage method. It must support a dual-mode approach: 
    1. **Local Mode:** Accessing local files for DM development or internal testing.
    2. **Remote Mode:** Fetching data from a hosted URL (GitHub Pages/Cloud) for player access.

### B. Logic Layer (`src/hooks` & `src/context`)
- All business logic, state management (`useState`/`useReducer`), and side-effects (`useEffect`) must be extracted into Custom Hooks or Contexts.
- Components should only contain UI layout code and "call" hooks to get data or trigger actions.

### C. Presentation Layer (`src/components`)
- Every feature must be a separate component. 
- Organize `src/components` into sub-folders: `/ui` (primitives) and `/features` (specific wiki features).

## 4. Data & Scalability Requirements
- **Markdown Format:** All data is stored as `.md` files with YAML Frontmatter for metadata.
- **Data Schema:** Every Markdown file MUST include the following fields in its header: title, type (faction|monster|region|character|item|history), parent_id (kebab-case), and summary. 
    - *Note: Tags functionality is officially deprecated and removed from the schema.*
- **Lightweight Parsing:** For parsing frontmatter in the browser, use simple string manipulation or lightweight, zero-dependency parsers to avoid Node.js runtime conflicts. 
- **Pagination/Lazy Loading:** Implement client-side pagination or scroll-loading for any list exceeding 50 items.
- **Optimization:** Use `useMemo` and `useCallback` for expensive calculations or to prevent unnecessary re-renders in large lists.

## 5. UI & UX Standards
- **Mobile-First Design:** Ensure all components are usable on small screens (<768px). Avoid "hover" states as primary interaction methods (not possible on touchscreens). Ensure large enough tap targets for buttons.
- **Layout Stability:** Always reserve space for headers or sidebars to prevent "layout shift" during component mounting.
- **Glassmorphism:** Apply transparency and blur effects consistently to follow the project's aesthetic.

## 6. AI Implementation Instructions
- **Operational Mode:** You are required to operate exclusively in **Plan mode**. Do not proceed to execution without explicit user approval after a plan has been reviewed.
- **Plan First:** Always output a structured plan before writing code. Detail which files will be created/modified and why.
- **Pathing Distinction:** 
    - **Instructional Paths (AI Only):** When communicating with the user or invoking tools, always use **absolute paths** for file references to ensure precision.
    - **Source Code Paths:** Never use absolute paths within the source code. All assets and data fetches must use **relative paths** compatible with the Vite base configuration (e.g., `./campaign_data/...`).
- **Code Delivery Standard:** Provide complete, functional code blocks directly in the chat for any edit or file creation. **Never provide placeholders** (e.g., `// ... rest of code`). The code must be complete and ready for immediate copy/paste by the user.

## 7. Version Control & Milestones
To ensure progress is never lost and development remains organized:
- **Regular Saves:** Remind the user periodically to save their current work using Git as a local versioning "save point."
- **Milestone Commits:** When an important feature or milestone is completed, provide the specific PowerShell commands for committing changes. Include a clear, descriptive title for the commit message (e.g., `git add . ; git commit -m "feat: implement mobile search bar"`).

## General Guidelines
CRITICAL SYSTEM DIRECTIVES:
1. OPERATIONAL MODE & CODE BLOCKS: Operate generally in Plan mode. For complex or large code/markup implementations, output the code block directly in the chat window rather than attempting risky, monolithic background tool calls that risk serialization errors.
2. TOOL SCHEMA INTEGRITY: When invoking tools (`write_to_file`, `edit_file`), you MUST provide all required parameters (`path`, `content`, `old_text`, `new_text`) as valid strings with forward slashes (e.g., 'C:/path/file.ext'). Never leave them undefined or blank.
3. NATIVE EXECUTION ONLY: Never simulate terminal commands, file edits, or tool completions in plain text or markdown to bypass actions. Always execute actual backend tools when files are small or explicitly targeted.
4. PAYLOAD & ESCAPING SAFETY: For large files or markup, keep tool arguments clean and avoid massive single-line strings that break JSON serialization. 
5. POWERSHELL 7 / WINDOWS: When writing scripts, use PowerShell 7 syntax only (no Bash, no `&&`). Append `-Force` or `-Confirm:$false` where applicable.
6. ZERO LOOPS: State actions briefly and stop. Do not ask repetitive permission questions.
7. NAMING CONVENTION: All files within the campaign_data folder must use **kebab-case** for filenames (e.g., `dragon-king.md`, `the-whispering-forest.md`). Avoid spaces, periods, or special characters in filenames.
```