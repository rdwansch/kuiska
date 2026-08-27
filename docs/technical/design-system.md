# Design System: Ocean Clean (Option 1)

Use these tokens for every new component. Match the HEX, the Tailwind class, or the CSS variable. Do not invent colors.

## 1. Core Palette

| Role               | Color Name | HEX       | Tailwind Class                  | You use it for                                              |
| :----------------- | :--------- | :-------- | :------------------------------ | :---------------------------------------------------------- |
| Primary            | Royal Blue | `#2563EB` | `bg-blue-600` / `text-blue-600` | CTA buttons, active tabs, navbar highlights, active borders |
| Secondary / Accent | Sky Blue   | `#38BDF8` | `bg-sky-400` / `text-sky-400`   | Badges, progress bars, tooltips, focus highlights           |
| Background         | Slate 50   | `#F8FAFC` | `bg-slate-50`                   | Page background                                             |
| Surface / Card     | Pure White | `#FFFFFF` | `bg-white`                      | Question containers, cards, modals, option boxes            |
| Text Main          | Slate 900  | `#0F172A` | `text-slate-900`                | Headings, question text, nav links                          |
| Text Muted         | Slate 500  | `#64748B` | `text-slate-500`                | Subtitles, meta info (dates, authors, quiz duration)        |

## 2. Interactive & Status Feedback

| State           | Accent (HEX)            | Background (HEX)         | You use it for                          |
| :-------------- | :---------------------- | :----------------------- | :-------------------------------------- |
| Correct Answer  | `#22C55E` _(Green 500)_ | `#DCFCE7` _(Green 100)_  | Correct choice highlight, success modal |
| Wrong Answer    | `#EF4444` _(Red 500)_   | `#FEE2E2` _(Red 100)_    | Wrong choice indicator, error toast     |
| Selected Option | `#2563EB` _(Blue 600)_  | `#E0E7FF` _(Indigo 100)_ | Active option border and fill           |
| Disabled / Idle | `#94A3B8` _(Slate 400)_ | `#F1F5F9` _(Slate 100)_  | Default borders, disabled buttons       |

## 3. Shadcn UI Configuration (`src/app/globals.css`)

You define HSL triplets here for `hsl(var(--token))` usage.

```css
@layer base {
  :root {
    --background: 210 40% 98%; /* #F8FAFC */
    --foreground: 222 47% 11%; /* #0F172A */

    --card: 0 0% 100%; /* #FFFFFF */
    --card-foreground: 222 47% 11%; /* #0F172A */

    --popover: 0 0% 100%; /* #FFFFFF */
    --popover-foreground: 222 47% 11%;

    --primary: 221 83% 53%; /* #2563EB */
    --primary-foreground: 210 40% 98%;

    --secondary: 199 89% 48%; /* #38BDF8 */
    --secondary-foreground: 222 47% 11%;

    --muted: 215 16% 47%; /* #64748B */
    --muted-foreground: 215 16% 47%;

    --accent: 199 89% 48%; /* #38BDF8 */
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%; /* #EF4444 */
    --destructive-foreground: 210 40% 98%;

    --border: 214 32% 91%; /* #E2E8F0 */
    --input: 214 32% 91%;
    --ring: 221 83% 53%; /* #2563EB */

    --radius: 0.5rem;
  }
}
```

### Additional Semantic Tokens

| Token             | HEX       | You use it for           |
| :---------------- | :-------- | :----------------------- |
| `--success`       | `#22C55E` | Correct state accent     |
| `--success-muted` | `#DCFCE7` | Correct state background |
| `--selected-bg`   | `#E0E7FF` | Selected option fill     |
| `--disabled`      | `#94A3B8` | Disabled text/border     |
| `--disabled-bg`   | `#F1F5F9` | Disabled background      |

## 4. Usage Rules

1. You reference `bg-primary` or `text-foreground`, not raw HEX.
2. You paint page wrappers with `bg-background` (`#F8FAFC`) and elevated surfaces with `bg-card` (`#FFFFFF`).
3. You reserve `primary` for CTAs and active states. You use `secondary` / `accent` (`#38BDF8`) for badges and progress.
4. You use `success` and `destructive` for feedback only, not branding.
5. You outline focus states with `ring` (`#2563EB`).
