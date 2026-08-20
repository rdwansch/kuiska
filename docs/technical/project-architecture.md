# Project Architecture & Directory Structure Guidelines

## 1. Tech Stack

- **Framework:** Next.js (App Router, Fullstack)
- **Language:** TypeScript
- **Database & ORM:** MySQL (Local) + Drizzle ORM
- **Authentication:** Better Auth
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library
- **Styling & UI:** Tailwind CSS + Shadcn UI
- **Deployment:** Vercel

---

## 2. Architectural Overview

This project follows a **Feature-Based Architecture** integrated with Next.js (App Router). The routing layer is strictly isolated from the core business domain logic to maintain scalability, clean separation of concerns, and high Developer Experience (DX).

---

## 3. Directory Tree Structure

```bash
src/
├── app/                      # Routing layer ONLY
│   ├── layout.tsx
│   └── page.tsx
├── features/                 # Self-contained business modules
│   └── name/                 # Example Feature Name
│       ├── components/       # Generic folder name
│       ├── hooks/            # Generic folder name
│       ├── services/         # Generic folder name
│       ├── repositories/     # Generic folder name
│       ├── schemas/          # Generic folder name
│       ├── types/            # Generic folder name
│       └── index.ts          # Feature Public API / Main Entry Point
├── components/               # Shared / Global UI Components
│   ├── ui/                   # Primitive design system components (e.g., Shadcn UI)
│   └── layout/               # Global layout elements (Navbar, Footer)
├── lib/                      # Initializations & Third-party Configs (DB, Auth)
│   ├── db.ts                 # Drizzle MySQL Connection Client
│   └── auth.ts               # Better Auth Configuration
├── utils/                    # Global pure helper functions
└── types/                    # Global TypeScript definitions
```

---

## 4. Core Architectural Rules & Naming Conventions

### A. Routing Layer (`src/app/`)

- **Purpose:** Route handlers and page views only (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Rule:** Do NOT write business logic, complex state management, or inline ORM queries inside `page.tsx`. Import views, components, or services directly from the corresponding `src/features/<feature_name>` module.

### B. Feature Subfolder & File Naming Conventions

Inside each feature directory (`src/features/<feature_name>/`):

1. **Subfolder Names:** Must use **generic, lowercase/plural** names (`components`, `hooks`, `services`, `repositories`, `schemas`, `types`).
2. **File Names:** All files placed inside these subfolders **MUST include the Feature Name** as a prefix or identifier to maintain clarity during global searches and refactoring.

#### Layer Breakdown:

- **`services/` (e.g., `ProfileService.ts`):**
  - Entrypoint for domain execution (exports Server Actions or functions used by Server Components).
  - Encapsulates core business rules, score calculations, Zod input validations, session checks via Better Auth, and workflow orchestration.
- **`repositories/` (e.g., `ProfileRepository.ts`):**
  - Directly executes Database / ORM queries using Drizzle ORM against the MySQL database.
  - Strictly isolated from UI contexts, request objects, and presentation logic.
- **`schemas/` (e.g., `ProfileSchema.ts`):**
  - Houses Zod validation schemas for forms, actions, and API payloads.
- **`types/` (e.g., `ProfileType.ts`):**
  - Contains TypeScript interfaces, types, and domain-specific type definitions.
- **`hooks/` (e.g., `ProfileHook.ts`):**
  - Feature-specific custom React hooks.
- **`components/` (e.g., `ProfileCard.tsx`):**
  - Feature-specific UI components.
- **`index.ts` (Public API):**
  - Exports only the public components, hooks, or service functions exposed to `app/` or other features.

### C. Shared & Utility Layer

- **`src/components/ui/`:** Contains atomic, feature-agnostic components (e.g., `button.tsx`, `modal.tsx`).
- **`src/lib/`:** Holds singleton instances for Drizzle ORM (`db.ts`) and Better Auth setup (`auth.ts`).
- **`src/utils/`:** Pure utility functions without side effects (e.g., date formatting, class mergers).

---

## 5. Execution Data Flow

```
[UI Component / Page]
      │
      ▼
[services/FeatureService.ts] ───> Validates input & executes business rules/calculations
      │
      ▼
[repositories/FeatureRepository.ts] ───> Performs DB read/write operations (Drizzle + MySQL)
```
