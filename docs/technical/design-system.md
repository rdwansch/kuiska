# Kuiska Design System: Kinetic Social Field

> Status: Approved redesign specification. This document is the visual authority for future Kuiska UI work. Product truth remains in [`product-direction.md`](../business/product-direction.md). Existing screens are implementation evidence, not visual authority; when they conflict with this document, this document wins.

## 1. Design Thesis

Kuiska is an interactive social trivia field. Topics move through the page, players meet, answers lock, and a result resolves the tension. The interface should make knowledge feel active before a player even enters a room.

The visual system is called **Kinetic Social Field**:

- Content sits in a single spatial composition, not a collection of unrelated boxes.
- Curves, paths, waves, and geometric objects connect discovery to competition.
- Space is generous, but never inert; controlled motion gives quiet areas depth.
- Color creates layers and changes of energy without gradients or neon.
- The quiz content remains readable while the surrounding field feels alive.

Kuiska must feel clean, colorful, calm, and playful. It must not resemble a school portal, an admin dashboard, a generic SaaS landing page, a childish learning app, or an esports interface.

## 2. Non-Negotiable Anti-Slop Contract

These rules override common landing-page and component-library defaults.

### 2.1 Typography bans

1. Use sans-serif typefaces only.
2. Never use italic, oblique, script, cursive, handwriting, or serif styles.
3. Never use monospace as visual decoration. Timers and scores use tabular numerals in the body sans-serif.
4. Never add wide letter spacing to imitate code, labels, or technical interfaces.
5. Never put an eyebrow, kicker, category label, or small uppercase sentence above a heading.
6. Never use all-caps section labels. Room codes may be uppercase because they are identifiers, but they keep normal letter spacing.
7. Headings begin the section. Supporting metadata comes after the heading or beside the related content.

### 2.2 Shape and component bans

1. No pill badges. Text-bearing labels use a compact soft rectangle with a 6 px radius.
2. `border-radius: 9999px` is allowed only for true circles, avatars, dots, progress tracks, and circular icon controls. It is forbidden on text labels and buttons.
3. Do not place every section inside a rounded card.
4. Do not nest cards inside cards.
5. Do not use a repeated icon + heading + paragraph card grid as page structure.
6. Do not use hard offset shadows, thick black borders, sticker outlines, or neo-brutalist treatment.
7. Do not use glass panels, decorative blur, glowing borders, or gradient text. The sole exception is the floating landing navigation bar: it may use translucent canvas color, blur, a thin border, a clipped specular highlight, and a soft neutral shadow so it stays legible over moving content.
8. Do not use gradients in content, page backgrounds, or text. A clipped linear highlight inside the liquid-glass navigation bar is the only allowed gradient.

### 2.3 Composition bans

1. No default left-copy/right-visual split hero.
2. No alternating left-right feature rows.
3. No three or four equal cards used to explain the product.
4. No dashboard-like matrix on marketing, onboarding, or discovery pages.
5. No ornamental shapes placed randomly. Every ornament must connect, frame, reveal, or respond to content.
6. No dark rectangle used merely to make a section feel premium.
7. No repeated entrance animation on every section.

## 3. Visual Signature

Kuiska owns three recurring visual devices. Future UI may vary their execution but must preserve their roles.

### 3.1 The Knowledge Path

A continuous authored line represents movement from topic to question to result.

- It may appear as an SVG curve, a masked solid band, a dotted answer route, or a thin animated stroke.
- It should enter or leave the viewport rather than sit as a decorative squiggle in the center.
- It may pass behind content and emerge around an interactive element.
- Its route should explain reading order or interaction direction.
- It never carries body copy.
- Stroke width ranges from 1.5 to 4 px depending on scale.
- Use one path system per viewport, not many unrelated lines.

### 3.2 Player Nodes

Two distinct geometric nodes represent the social encounter.

- Nodes use different shapes or solid colors, not only initials or profile photos.
- A curved path, timer, or answer state visibly relates the two nodes.
- Nodes may become real avatars when user imagery exists, but the surrounding geometry remains part of the identity.
- A versus state is spatial: two positions connected by a shared system. It is not a generic “VS” badge between two cards.

### 3.3 Topic Objects

Each quiz topic receives a small visual vocabulary made from crisp geometry.

- General knowledge: arcs, rings, intersecting paths, index marks.
- Technology: nodes, routes, modular bars, controlled angular forms.
- Pop culture: frames, spotlight arcs, rhythmic blocks, cropped circles.
- Education: diagrams, steps, brackets, measured lines without classroom clichés.

Topic objects are authored compositions, not icon tiles. They can be interactive, crop beyond their container, and respond subtly to pointer or scroll movement.

## 4. Color System

The palette keeps the approved berry, lilac, jade, and blue identity. Light canvases stay white, dark canvases stay neutral charcoal, and chromatic colors mark actions, status, paths, and player states.

### 4.1 Brand colors

| Token                | Name         | Value     | Role                                                                    |
| :------------------- | :----------- | :-------- | :---------------------------------------------------------------------- |
| `brand-berry`        | Club Berry   | `#8A214E` | Primary action, player A, selected answer                               |
| `brand-berry-bright` | Berry Pulse  | `#C54D80` | Active motion, focus accents, celebratory detail                        |
| `brand-lilac`        | Social Lilac | `#7759A6` | Player B, secondary interactive emphasis                                |
| `brand-lilac-bright` | Lilac Signal | `#A98BD1` | Active lilac details on dark fields                                     |
| `brand-jade`         | Room Jade    | `#28735E` | Correct answer, completed state, positive result                        |
| `brand-blue`         | Trivia Blue  | `#356DA8` | Discovery paths, informational state                                    |
| `brand-ink`          | Blue Ink     | `#172435` | Focused light-theme room state; dark mode remaps it to neutral charcoal |

Berry remains the primary action color. Lilac, jade, and blue communicate different roles and must not become interchangeable call-to-action colors.

### 4.2 Light theme surfaces

| Token             | Value     | Usage                                           |
| :---------------- | :-------- | :---------------------------------------------- |
| `canvas`          | `#FFFFFF` | Pure-white main page background                 |
| `canvas-cool`     | `#FFFFFF` | Same pure-white page canvas; no tinted sections |
| `surface`         | `#FFFFFF` | Main readable content surface                   |
| `surface-strong`  | `#FFFFFF` | Raised controls and focused quiz content        |
| `surface-neutral` | `#EEF0F2` | Contained quiet geometry or interaction support |
| `surface-berry`   | `#F5EAEE` | Small selected or berry-related context only    |
| `surface-lilac`   | `#EBEAF1` | Player B or social context field                |
| `surface-jade`    | `#DDEEE8` | Correct or completed context                    |
| `surface-blue`    | `#E6EDF4` | Discovery and information context               |
| `ink`             | `#20242B` | Primary text                                    |
| `ink-muted`       | `#626A75` | Supporting text                                 |
| `border`          | `#D8DDE3` | Dividers and control boundaries                 |

### 4.3 Dark theme surfaces

Dark mode uses a neutral charcoal canvas, not a navy or nearly black page. Large page sections share the same canvas value; surface elevation comes from neutral luminance steps.

| Token             | Value     | Usage                                 |
| :---------------- | :-------- | :------------------------------------ |
| `canvas`          | `#1C1C1E` | Main dark canvas                      |
| `canvas-cool`     | `#1C1C1E` | Same dark canvas; no tinted sections  |
| `surface`         | `#242426` | Primary readable surface              |
| `surface-strong`  | `#2C2C2F` | Focused controls and answer surfaces  |
| `surface-neutral` | `#343437` | Neutral ornament or interaction field |
| `surface-berry`   | `#4A2E3A` | Berry contextual field                |
| `surface-lilac`   | `#3B3544` | Lilac contextual field                |
| `surface-jade`    | `#26433A` | Correct or completed context          |
| `surface-blue`    | `#293640` | Discovery and information context     |
| `ink`             | `#F5F5F7` | Primary text                          |
| `ink-muted`       | `#B7B7BC` | Supporting text                       |
| `border`          | `#77777C` | Dividers and control boundaries       |

### 4.4 Semantic states

| State         | Light foreground / fill | Dark foreground / fill |
| :------------ | :---------------------- | :--------------------- |
| Correct       | `#28735E` / `#DDEEE8`   | `#82D0B3` / `#26433A`  |
| Incorrect     | `#B93952` / `#F6E1E6`   | `#F18B9D` / `#542B3A`  |
| Warning       | `#80602E` / `#F1E7D8`   | `#E6C47E` / `#4A3D28`  |
| Selected      | `#8A214E` / `#F5EAEE`   | `#F1A2C1` / `#4A2E3A`  |
| Informational | `#356DA8` / `#E6EDF4`   | `#8EC2F1` / `#293640`  |

Semantic colors always include an icon, label, or explanatory sentence when they communicate an outcome. Color is never the only signal.

### 4.5 Color composition rules

- Light viewports start from a pure-white canvas. Dark viewports start from the neutral charcoal canvas. Content may match the canvas in either theme; hierarchy comes from space, linework, controlled overlap, and surface elevation.
- Large solid color fields are not used as page background. Keep color to small player nodes, selection, paths, and contained quiz states.
- Use at most three chromatic brand families in one viewport. Neutral surfaces do not count.
- Pink never tints the page background. Use berry for decisive actions, selected answers, and small player-state moments—not headings, large fields, or ambient ornament.
- In light mode, the base canvas and every page section are exact white. In dark mode, the base canvas and every page section are `#1C1C1E`. Use contained neutral or semantic surfaces only when they clarify an interaction.
- Glass is a navigation treatment only. The floating liquid-glass navigation uses translucent white in light mode and translucent charcoal in dark mode, plus blur, a fine border, a clipped specular highlight, and a neutral shadow. Do not repeat it on cards, sections, dialogs, or ornaments.
- Keep the landing page and Explore feed on their theme canvas. Reserve contained dark fields for rooms, focused gameplay, and short dramatic transitions.
- Do not use gradients to create page richness. The clipped navigation highlight is the only exception; use solid shapes and surfaces everywhere else.

## 5. Typography

All typography is sans-serif and upright.

| Role    | Typeface                      | Weight  | Usage                                         |
| :------ | :---------------------------- | :------ | :-------------------------------------------- |
| Display | DM Sans                       | 650–750 | Hero statements, major scores, result moments |
| Heading | DM Sans                       | 600–700 | Page and section headings                     |
| Body    | DM Sans                       | 400–600 | Questions, navigation, forms, descriptions    |
| Data    | DM Sans with tabular numerals | 600–700 | Timers, ranks, score comparisons, room codes  |

DM Sans is the only interface typeface. Existing `font-data` usages must migrate to DM Sans with `font-variant-numeric: tabular-nums`.

### 5.1 Type scale

| Style      | Desktop                  | Mobile    | Line height | Maximum measure |
| :--------- | :----------------------- | :-------- | :---------- | :-------------- |
| Hero       | `clamp(56px, 7vw, 96px)` | `44–58px` | `0.96–1.02` | 11–13 words     |
| Display    | `48–64px`                | `38–48px` | `1.02–1.08` | 14 words        |
| H1         | `40–52px`                | `34–42px` | `1.08–1.14` | 18 words        |
| H2         | `30–40px`                | `28–34px` | `1.12–1.2`  | 22 words        |
| H3         | `21–26px`                | `20–24px` | `1.2–1.3`   | 2 lines         |
| Body large | `18–20px`                | `17–19px` | `1.55–1.7`  | 60 characters   |
| Body       | `16px`                   | `16px`    | `1.5–1.65`  | 68 characters   |
| Meta       | `13–14px`                | `13–14px` | `1.4–1.5`   | Contextual      |

### 5.2 Type rules

- Headings use normal or slightly tight tracking between `0` and `-0.03em`.
- Body and metadata use normal tracking.
- Positive tracking above `0.02em` is prohibited.
- No italics for emphasis. Use weight, color, or placement.
- No all-caps eyebrow text.
- A section starts with its heading, visual, or interactive content—not a label announcing the section.
- Metadata follows its title: “Teknologi · 8 soal”, never a floating badge above it.
- Use sentence case for buttons and navigation.
- Balance display headings deliberately; never allow a single orphan word on the final line.

## 6. Spatial System

### 6.1 Spacing scale

Use a 4 px base with the following semantic steps:

| Token      |  Value | Usage                     |
| :--------- | -----: | :------------------------ |
| `space-1`  |   4 px | Fine alignment            |
| `space-2`  |   8 px | Tight internal gap        |
| `space-3`  |  12 px | Control content gap       |
| `space-4`  |  16 px | Standard internal spacing |
| `space-5`  |  24 px | Related content group     |
| `space-6`  |  32 px | Component separation      |
| `space-7`  |  48 px | Section sub-group         |
| `space-8`  |  72 px | Mobile section spacing    |
| `space-9`  | 104 px | Desktop section spacing   |
| `space-10` | 144 px | Major narrative pause     |

Generous space is part of the identity. Empty areas should usually contain a path passing through, a cropped solid field, or one restrained depth layer—not filler copy or another card.

### 6.2 Layout grammar

Use a 12-column desktop grid and a 4-column mobile grid as alignment infrastructure, not as visible boxes.

- Build each major section as one composition with a dominant focal point.
- Let selected visuals span, overlap, crop, or break the content grid while text remains aligned.
- Vary density across the scroll: active field, readable passage, interactive moment, quiet resolution.
- Use vertical sequencing and overlap instead of default two-column explanation layouts.
- Avoid centered stacks for every section. Change alignment when the story changes, not on an automatic alternating pattern.
- A content surface can be wide, narrow, offset, or partially overlaid, but must remain one hierarchy.
- Use separators sparingly. Prefer space, color-field boundaries, and the Knowledge Path.

### 6.3 Shape language

- Controls: 8–10 px radius.
- Content surfaces: 12–18 px radius when a boundary is necessary.
- Large color fields: custom curves, asymmetric corner combinations, cropped circles, or SVG masks.
- Text labels: 6 px radius; never pill-shaped.
- Avatars and player nodes may be circular or irregular.
- Fine borders use 1 px. Strong selected controls may use 2 px in their semantic color.
- Elevation uses a soft neutral shadow with a visible downward offset and blur. Most content remains borderless on contrasting fields.

## 7. Composition Patterns

### 7.1 Landing first viewport

The first viewport is a single kinetic stage, not a hero split into copy and demo columns.

Required structure:

1. A minimal floating liquid-glass navigation bar sits above the stage within horizontal page padding. It remains fixed while the page moves and is the only glass container.
2. The headline is the first semantic content. No text label appears above it.
3. The primary action is attached to the headline group.
4. A live duel preview enters the same field below, behind, or partially overlapping the headline composition. It is not isolated in a right-side card.
5. One Knowledge Path travels through the viewport and connects a topic object to the two player nodes.
6. Small player nodes and the Knowledge Path create depth without filling the white canvas.
7. The viewport uses approximately 85–105 `dvh`, with enough bottom visibility to suggest the next movement.

The hero should still explain, within seconds, that Kuiska is an interactive social trivia game and that the visitor can challenge another player.

Forbidden landing patterns:

- eyebrow + giant headline + paragraph + two buttons + dashboard card;
- copy on the left and product mockup on the right;
- three numbered cards explaining how it works;
- three equal feature cards with icons;
- full-screen dark background with neon accents;
- decorative blobs that do not respond to content or interaction.

### 7.2 Product explanation

Explain the game through one continuous playable or scroll-linked sequence:

```text
Choose a topic → send a challenge → lock an answer → reveal the result
```

Each step occupies a distinct part of the same path. Use scale and motion to advance the sequence. Do not convert the four steps into four equal cards.

### 7.3 Explore

Explore is an editorial river of playable topics.

- Start with one dominant featured quiz or active challenge.
- Follow with a wide, liquid-glass topic navigator that sticks above the Explore flow and navigates to related quiz entries. It is centred within a 1024 px maximum width, uses a 32 px radius, and must sit above the app chrome while it is sticky. Its neutral border must remain legible on the light canvas so the rounded silhouette reads. Its markers and labels stay compact; counts and descriptions belong to the destination section. It is in-page navigation only until Feature 7 has an approved random-play contract; it must not imply personalised ranking or random selection.
- Follow each station with a paced, vertical group of related quiz entries rather than an equal card grid.
- Allow topic art to crop beyond its entry and connect visually to the next item.
- Place category, question count, creator, and activity after the title or in a clear metadata row.
- Keep the create-quiz action visible but secondary.
- A Match Ticket may interrupt the river only for an active room or incoming challenge. Do not use it as generic product explanation.

On mobile, Explore becomes a paced vertical feed. It must not collapse into a stack of visually identical cards.

### 7.4 Authentication

Authentication uses one focused vertical path.

- Do not split the screen into an illustrated left panel and a form panel.
- Center the form in open canvas space with one player-path ornament moving behind it.
- Keep the form surface clear and high contrast.
- Let a compact challenge context sit above or after the form title as content, not as a decorative badge.
- The primary action remains visible without scrolling on common mobile heights.

### 7.5 Live Trivia room

The room is an arena organized around the question, not a dashboard.

- Place the question at the visual center.
- Show the two player nodes as opposing positions connected by the timer path.
- Answer options form one readable stack or arc around the question; do not present them as a dense tile grid.
- The selected answer visibly settles into the path.
- The shared reveal transforms the same geometry rather than opening a separate result card.
- Hide running score and leader until the final result, per product rules.

The dark room uses a neutral charcoal field with brighter berry, lilac, blue, and jade details. It stays layered and legible without turning the entire field navy.

### 7.6 Results

Results resolve the field.

- Score and rank become the dominant type.
- The two player paths converge, cross, or finish at different endpoints.
- The time tie-break appears directly after the score comparison.
- Rematch is the primary action; share is secondary.
- Use one controlled celebratory motion. Do not use endless confetti or floating particles.

## 8. Components

### 8.1 Buttons

- Primary: solid Club Berry, light foreground, 8–10 px radius.
- Secondary: contrasting surface with a 1 px border.
- Ghost: no container at rest; use for contextual actions.
- Destructive: semantic red only for irreversible actions.
- Minimum target: 44 × 44 px.
- Buttons use specific sentence-case verbs such as “Buat room”, “Kunci jawaban”, and “Main lagi”.
- No pill buttons, gradients, colored drop shadows, or automatic icon tiles.

### 8.2 Text labels and status

- Labels are small rectangles, inline metadata, or text with an icon.
- Radius: 6 px maximum for text-bearing labels.
- No pill badges.
- No uppercase with wide tracking.
- An error alert includes the problem and recovery action. A decorative category label must not use `role="alert"`.

### 8.3 Quiz entries

A quiz entry consists of topic art, title, metadata, and one clear action. Its composition can change by context.

- Featured entries may use large cropped artwork and open text placement.
- Feed entries may use a compact horizontal rhythm on desktop and a vertical rhythm on mobile.
- Do not force every quiz into the same bordered card.
- Do not place metadata in multiple floating badges.
- Topic art uses the approved geometric vocabulary, not a generic gradient or stock illustration.

### 8.4 Match Ticket

The Match Ticket is a social interruption inside another flow, not a reusable generic card.

- Use a broad solid field or ribbon shape with one curved entry edge.
- Show both player nodes and the connection between them.
- Keep topic, room state, and decisive action in one hierarchy.
- Use ink or a strong chromatic field, but avoid a thick border and hard offset shadow.
- The ticket may overlap the Explore flow or hero path by 16–40 px on larger screens.
- On mobile it becomes a full-width stage with safe padding, not a tiny ticket metaphor.

### 8.5 Answer options

- Minimum height: 56 px; preferred height: 64–72 px for short answers.
- Use a 1 px neutral boundary at rest and 2 px semantic boundary when selected or revealed.
- Use berry for selected, jade for correct, and red for incorrect.
- Include an icon and text for revealed states.
- Keep answer text left aligned.
- No detached A/B/C/D pill. The option marker is integrated into the row or path.

### 8.6 Inputs

- Height: 48–52 px.
- Radius: 8–10 px.
- Labels sit above inputs in normal sentence case.
- Focus uses a 2 px berry or theme-specific ring with at least 2 px offset.
- Error copy sits below the input and explains how to recover.
- Do not rely on placeholder text as the label.

### 8.7 Shared primitives and icons

- Feature UI composes primitives from `src/components/`; it does not redefine generic controls locally.
- `src/components/ui/` is the component boundary for `Button`, `Input`, `Textarea`, `Select`, `RadioGroup`, `Label`, `Badge`, `Card`, and `Icon`.
- Generate an absent Shadcn primitive with `bunx shadcn@latest add <component> --yes`, then adapt it to the semantic tokens and project import aliases before shipping it.
- Use `Icon` from `~/components/ui/icon` for standard UI symbols: `<Icon name="lucide:arrow-right" aria-hidden="true" />`.
- Use an Iconify collection-qualified name and forward sizing or styling through `className`. Do not import icon packages directly in feature files.
- A standard UI icon is never a hand-authored inline SVG. Inline SVG remains appropriate for original topic art, game paths, and other purpose-built Kuiska geometry; decorative SVGs stay `aria-hidden`.
- If an icon conveys meaning, pair it with visible text or an accessible name. Decorative icons use `aria-hidden="true"`.

### 8.8 Navigation

- Keep navigation visually light. The landing navigation may float above the page canvas in the approved liquid-glass container; product navigation outside the landing stays directly on its canvas.
- Active state uses weight, color, or a short path segment—not a pill background.
- Mobile navigation may use a bottom bar for the product experience, but labels remain visible for unfamiliar actions.
- Landing navigation contains only actions necessary for orientation and conversion.

#### Public and authenticated shells

- The public shell is the landing navigation: orientation links plus **Masuk**
  and **Buat akun**. It never impersonates signed-in product navigation.
- The authenticated shell is present on every standard signed-in product route.
  Its desktop header contains the Kuiska mark, **Explore**, **Aktivitasku**,
  the secondary-but-always-visible **Buat kuis** action, and an account trigger
  showing an initial avatar and the player's first name. Active trivia and room
  routes intentionally use their own focused chrome.
- The account trigger is a normal button, not a pill badge. Its menu contains
  **Aktivitasku** and **Keluar**. Avatar images are optional enhancement only;
  the initial mark is the MVP identity treatment.
- On mobile, render labelled bottom navigation for **Explore** and
  **Aktivitasku**. Do not create an empty **Main** destination: introduce it
  only when room state exists. Keep **Buat kuis** as a clearly labelled header
  action until there is a proven room-aware mobile action model.
- App navigation remains directly on the page canvas—no liquid glass, sidebar,
  or decorative badge system. Reserve the tactile Match Ticket for a real
  active room or incoming challenge.
- The selected destination must use both a visible active treatment and
  `aria-current="page"`.

## 9. Ornament and Interaction System

Ornaments are functional atmosphere. They create depth and guide attention without becoming UI chrome.

### 9.1 Allowed ornaments

- authored SVG paths and waves;
- partial rings and cropped arcs;
- solid geometric fields with asymmetric cropping;
- player nodes connected to a shared route;
- topic-specific geometry;
- thin index lines that align with real content;
- subtle cursor or scroll response on nonessential geometry.

### 9.2 Ornament constraints

- Every ornament must have a named anchor: headline, topic, player, question, action, or section transition.
- Keep ornaments out of paragraph text and form-control hit areas.
- Decorative geometry must never reduce text contrast below WCAG AA.
- One dominant ornament system per viewport is enough.
- Avoid a collection of unrelated circles, sparkles, stars, and blobs.
- Avoid emoji and Unicode symbols as visual assets.

## 10. Motion and Parallax

Motion gives generous space a sense of activity. It must be orchestrated as one field, not scattered across every element.

### 10.1 Depth layers

Each kinetic viewport may use up to three layers:

| Layer | Scroll response | Pointer response | Typical content                  |
| :---- | :-------------- | :--------------- | :------------------------------- |
| Far   | 4–10 px         | 2–4 px           | Large solid field or slow path   |
| Mid   | 10–22 px        | 4–8 px           | Topic geometry or secondary node |
| Near  | 18–36 px        | 6–12 px          | Cropped arc or foreground accent |

Text, forms, primary actions, and quiz answers do not parallax. They remain stable and readable.

### 10.2 Motion grammar

- Use exponential ease-out: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Micro-interaction duration: 140–200 ms.
- State transition duration: 220–360 ms.
- Narrative path transition: 500–900 ms.
- Continuous ambient motion, when used, lasts 10–18 seconds and moves no more than 8–16 px.
- Prefer transform and opacity for smooth motion. Animate SVG stroke progress only when it explains sequence or timing.
- Hover motion should reveal relation or depth, not make every card lift.

### 10.3 Signature interactions

- Landing: pointer movement shifts the topic object and player nodes at different depths while the headline remains still.
- Product sequence: the Knowledge Path draws forward as each step enters the viewport.
- Explore: a quiz entry may slightly advance its topic geometry toward the next path node on hover or focus.
- Room: selecting an answer causes that answer segment to settle and connect to the player node.
- Result: both player paths resolve into the final score position once, then stop.

### 10.4 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- remove parallax and ambient loops;
- render paths in their final state;
- keep essential answer and result feedback immediate;
- preserve every piece of information and every control;
- do not hide content behind an animation trigger.

## 11. Responsive Behavior

Responsive design changes composition, not only size.

### Desktop, 1024 px and above

- Use the full spatial field and controlled overlaps.
- Allow ornaments to extend outside the content grid.
- Mix content widths and create deliberate open zones.
- Keep body copy within 60–68 characters per line.

### Tablet, 768–1023 px

- Reduce overlap depth by approximately one third.
- Keep one dominant path and no more than two parallax layers.
- Convert mixed-scale Explore entries into a clear editorial sequence.
- Protect touch targets and text measure before preserving ornament placement.

### Mobile, below 768 px

- Use a 4-column alignment grid and 16–20 px page gutters.
- Keep the composition vertical without turning every element into a full-width card.
- Crop ornament fields at viewport edges to retain energy.
- Reduce parallax travel by at least 50%; disable pointer-specific effects.
- Keep primary actions reachable and answer options full width.
- Do not preserve desktop overlaps when they obscure content or create horizontal scrolling.

## 12. Accessibility and Performance

### Accessibility

- Meet WCAG AA contrast for text, controls, focus states, and game outcomes in both themes.
- Keep body text at 16 px or larger.
- Give every interactive element a visible keyboard focus state.
- Ensure all pointer-driven ornament reactions also respond to keyboard focus where they communicate meaning.
- Decorative SVGs use `aria-hidden="true"` and cannot contain required information.
- State changes use text and icons in addition to color.
- Preserve logical DOM order even when elements overlap visually.

### Performance

- Use CSS transforms for simple parallax. Use one shared `requestAnimationFrame` loop when JavaScript is necessary.
- Do not attach independent scroll listeners to every ornament.
- Pause offscreen ambient animation with `IntersectionObserver`.
- Keep decorative SVG paths compact and reuse path definitions where practical.
- Avoid heavy blur filters, large shadow stacks, and full-screen canvas effects on low-power devices.
- The page must remain understandable and attractive before JavaScript motion initializes.

## 13. Voice and Content Placement

- Use casual Indonesian with “kamu”, never formal “Anda”.
- Keep action labels specific and short.
- Let headings carry the idea; do not explain them with a label above.
- Supporting copy follows the heading and should rarely exceed three lines on desktop.
- Do not invent testimonials, player counts, ratings, performance claims, or educational outcomes.
- Mark illustrative quiz data as demonstration content when it could be mistaken for live data.

## 14. Implementation Contract

### 14.1 Semantic tokens

Components consume semantic tokens only:

```text
background          → canvas
background-alt      → canvas-cool
foreground          → ink
muted-foreground    → ink-muted
surface             → surface
surface-strong      → surface-strong
primary             → brand-berry
secondary-accent    → brand-lilac
success             → brand-jade
info                → brand-blue
focus-room          → brand-ink
border              → border
```

Raw hex values belong in the theme token layer or an authored visual asset, not in feature components.

### 14.2 Build order for generated UI

Any agent implementing this system should work in this order:

1. Establish the canvas and large solid color fields.
2. Place the semantic hierarchy and primary action.
3. Build the content flow without cards.
4. Add only the boundaries required for interaction and readability.
5. Author the Knowledge Path and anchored topic/player geometry.
6. Add one orchestrated motion system.
7. Adapt the composition for mobile.
8. Verify focus, reduced motion, contrast, overflow, and loading states.

Starting from a card grid and decorating it afterward is a failed implementation of this system.

### 14.3 Migration rules

- Treat the current landing-page layout as an anti-reference where it uses split columns, eyebrow text, wide-tracked labels, numbered explanation boxes, equal quiz cards, hard shadows, or isolated decorative circles.
- Preserve factual copy and product behavior unless a feature specification changes them.
- Replace `DM Mono` and `font-data` presentation with DM Sans tabular numerals.
- Replace pill badges with rectangular labels or inline metadata.
- Remove pre-heading labels instead of restyling them.
- Replace card grids with a connected composition before adding motion.
- Add parallax only after the static hierarchy is complete and readable.
- Do not recreate removed patterns under new component names.

## 15. Definition of Done

A surface follows Kinetic Social Field only when all of these are true:

- [ ] All visible type is sans-serif and upright.
- [ ] There is no monospace presentation, cursive style, or italic emphasis.
- [ ] No heading has an eyebrow or small label above it.
- [ ] No text-bearing label or button is pill-shaped.
- [ ] The layout is not a split hero, alternating feature list, or equal card grid.
- [ ] The base canvas visibly contrasts with readable content surfaces.
- [ ] Color is bolder than a neutral SaaS page but never neon, gradient-led, or neo-brutalist.
- [ ] At least one authored path, wave, or anchored geometric system supports the content flow.
- [ ] Open space is paced with controlled depth or motion rather than filler cards.
- [ ] Parallax affects decoration only and has a reduced-motion fallback.
- [ ] Mobile is recomposed rather than merely stacked.
- [ ] Interactive controls have complete hover, focus, active, disabled, error, and loading states.
- [ ] Both light and dark themes preserve hierarchy and semantic color meaning.
- [ ] The interface remains useful and visually coherent before animation initializes.
- [ ] Product facts, score rules, and room behavior still match `product-direction.md`.

## 16. Quick Rejection Test

Reject a generated design immediately if any of these appear:

```text
small uppercase label
large headline
paragraph
two pill buttons
three equal cards
right-side dashboard mockup
random gradient blobs
monospace room metadata
every section inside rounded rectangles
dark section added only for contrast
the same fade-up animation everywhere
```

That composition is the category default Kuiska is replacing.
