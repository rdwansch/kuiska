# Project Architecture & Directory Structure Guidelines

## 1. Tech Stack

- **Framework:** Next.js (App Router, Fullstack)
- **Language:** TypeScript
- **Database & ORM:** MySQL (Local) + Drizzle ORM
- **Authentication:** Better Auth
- **Validation:** Zod
- **Testing:** No automated test framework is currently configured. If tests
  are added, use Vitest + React Testing Library.
- **Styling & UI:** Tailwind CSS + Shadcn UI + Iconify (see `docs/technical/design-system.md` for the Kinetic Social Field system)
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
│       └── index.ts          # Feature entry point and main page
├── components/               # Shared / Global UI Components
│   ├── brand/                # Shared brand assets and marks
│   ├── ui/                   # Primitive design system components (Shadcn-generated or local wrappers)
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
- **Rule:** Do NOT write business logic, complex state management, or inline ORM queries inside `page.tsx`. A route file exports `Page` and returns only the corresponding feature's main page, forwarding any Next.js route props such as `params`.

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
  - Always separate UI and business logic. Put business logic in hook.
- **`components/` (e.g., `ProfileCard.tsx`):**
  - Feature-specific compositions that consume shared UI primitives from `src/components/`.
  - Do not define reusable control primitives here. Native `button`, `input`, `textarea`, `select`, and radio controls must be supplied by `src/components/ui/`.
- **`index.ts` (Feature Entry Point):**
  - Defines and exports the feature's main page component (for example, `QuizTakingPage`) plus the feature API needed by other features.
  - Owns page-level access checks, data loading, and route-state handling. The matching `src/app/**/page.tsx` stays a thin Next.js route wrapper.

### C. Shared & Utility Layer

- **`src/components/ui/`:** Contains atomic, feature-agnostic components. Features import primitives from this directory instead of reimplementing controls locally. The current inventory is `badge`, `button`, `card`, `icon`, `input`, `label`, `radio-group`, `select`, and `textarea`.
- **Shadcn primitives:** Generate a missing primitive with `bunx shadcn@latest add <component> --yes`, then review the generated source before use. Keep the project alias (`~/utils/cn`), semantic token classes, and the shared Iconify wrapper; do not import an icon library directly into feature code.
- **`src/components/ui/icon.tsx`:** The single Iconify boundary. Import `Icon` from `~/components/ui/icon` and render `<Icon name="lucide:check" />`; pass `aria-hidden="true"` for decorative icons and provide an accessible name when an icon conveys a control's purpose.
- **Custom SVG:** Keep only purpose-built Kuiska artwork, paths, and geometry in feature code. Do not use inline SVG as a substitute for a standard UI icon.
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
