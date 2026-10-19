# Sukkiri — Phase 1 audit: design-system adoption + accessibility baseline

Read-only audit, 2026-10-19. Target: `Sukkiri.dc.html` (3,029 lines: template 1–1208, logic 1209–3029), plus `js/print.js` and `js/weather.js`.
Bound DS: `_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/` ("My Calendar").
Scripts used for the measurements: `/tmp/sk/colors.js` (colour → property → line map) and `/tmp/sk/contrast.js` (WCAG ratios).

**Current state:** 82 distinct hex + 5 rgba colours, 29 font sizes, 4 weights, 2 families (Zen Maru Gothic ×48, Nunito ×29), 16 radii, 5 shadows. **Zero** `var(--*)` DS tokens and no DS files loaded, so the page breaks the CLAUDE.md rule "every DC must load the bundle + token stylesheets".

---

## 1. DS summary

**Local contents.** `readme.md` (56 lines), `styles.css` (imports only), `tokens/{fonts,colors,typography,shape,themes}.css`, `_ds_manifest.json`, `_ds_bundle.js` (174 KB) and `_adherence.oxlintrc.json`. The `components/`, `assets/` and `guidelines/` folders named in the readme are **not** in this repo. They exist only inside the bundle.

### Tokens
| Group | Tokens |
|---|---|
| Colour (theme-scoped) | `--bg --card-bg --border --txt --txt2 --accent --goal --note --diary --today-bg --wknd --btn` (colour or 135° gradient) `--btn-sh --input-bg --pattern --cell-hover --pulse` |
| Colour (fixed, same in all themes) | marks `--mark-red #d63031 --mark-pink #e84393 --mark-teal #00b894 --mark-cyan #00cec9 --mark-orange #e17055 --mark-purple #6c5ce7 --mark-yellow #fdcb6e`; `--mood-good #27ae60 --mood-bad #e74c3c --mood-neutral #999 --mood-mixed #ffd93d --live-dot #2ecc71 --wx-hi #e74c3c --wx-lo #3498db --bday-name --overlay rgba(0,0,0,.55) --hover-tint rgba(128,128,128,.12)` |
| Colour aliases | `--surface-page --surface-card --surface-input --text-body --text-muted --border-card` |
| Type | `--h-font --b-font` (alias `--font-heading --font-body`); sizes `--fs-month-title clamp(36,9vw,66) --fs-month-sub --fs-day-hdr --fs-day-num --fs-note --fs-diary --fs-modal-title 28 --fs-modal-sub 16 --fs-label 16 --fs-input 15 --fs-btn 18 --fs-control 13 --fs-stats 14 --fs-hint 12` |
| Shape | radii `--r-card 16 --r-modal 18 --r-box 20 --r-btn 12 --r-input 10 --r-panel 14 --r-opt 9 --r-tab 7 --r-pill 22 --r-badge 5`; borders `--bw-card 2px --bw-control 1.5px` |
| Shadow / motion | `--shadow` (per theme) `--sh-control 0 2px 8px rgba(0,0,0,.08) --sh-panel 0 12px 40px rgba(0,0,0,.25) --sh-btn 0 4px 15px var(--btn-sh)`; `--t-press .12s --t-color .15s --t-bg .5s --blur-overlay blur(6px)` |
| **Missing** | no spacing scale (yet the adherence lint warns on every raw `px`), no focus-ring token, no status (ok/warn/danger/info) tokens, no tertiary text colour |

### Components (manifest: 24 exports on `window.MyCalendarDesignSystem_4b2620`)
- **Core:** `Button` (`variant` primary|google|outline; width 100%, r12, 18px/700, white on `--btn`), `IconButton` (34×34 circle), `PillButton` (`variant` card|accent; 13px, r20–22).
- **Forms:** `TextInput`/`TextArea` (`label`; r10, 1.5px `--border`, focus = border → `--accent`, `outline:none`), `Checkbox` (real `<label><input type=checkbox>`), `ColorDotPicker`, `MARK_COLORS`, `MoodPicker`.
- **Overlays:** `Modal` (title/subtitle/maxWidth), `Dropdown` (trigger/options), `Toast`, `InfoBanner` (`kind` birthday|holiday|weather).
- **Calendar:** `CalendarCell`, `CalendarGrid`, `MonthHeader`, `StatsBar`. **App kit:** `CalendarApp DayModal LoginScreen BirthdayManager MonthYearPicker TopBar THEMES`.

### Loading (paths relative to `Sukkiri.dc.html`)
```html
<link rel="stylesheet" href="_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/styles.css">
<script src="_ds/my-calendar-design-system-4b262086-d495-4ab2-b123-7fa71c397820/_ds_bundle.js"></script>
```
`styles.css` @imports `tokens/fonts.css` (one Google Fonts URL with 24 families; only the faces actually used get downloaded), `colors`, `typography`, `shape` and `themes`. The bundle needs `window.React`, which `support.js` provides. A DC template uses a component via the runtime's x-import (`support.js:690`):
`<x-import component-from-global-scope="MyCalendarDesignSystem_4b2620.Button" variant="primary" onClick="{{ cloudIn }}" data-id="…">Sign in</x-import>`. `data-*` and `aria-*` attributes pass through (`support.js:433`).

> **⚠ Bundle hazard (must handle before loading `_ds_bundle.js`).** The bundle also contains the calendar's **`app_update/js/app.js` and `sukkiri.js`** (`_ds_bundle.js:11`, `:1535`). Each runs at top level inside a try/catch. If `window.supabase` already exists (Sukkiri loads supabase-js at line 14), app.js:
> - creates a **second Supabase client on the same project** (`wylxvmkcrexwfpjpbhyy`);
> - registers global `keydown` listeners (`:928`, `:1186`) that throw a TypeError on every keypress (`$('modal-ov')` is null);
> - registers `click` listeners (`:542`, `:1319`, capture phase);
> - registers a DOMContentLoaded boot handler (`:1484`).
>
> **Mitigation:** load the bundle *before* the supabase-js `<script>` (app.js then throws at line 13 and its block is skipped), and verify `MyCalendarDesignSystem_4b2620.__errors` lists `app_update/js/app.js`. Ask the DS owner to drop `app_update/**` from the bundle.

### Themes
- `[data-theme="0..13"]` on `<body>` or on **any scope element**. `:root` = theme 0 Newsprint (black on white, Tiempos→serif heading, PT Serif body).
- Light: 0 Newsprint, 1 Linen, 3 Botanical, 4 Concrete, 6 Solar Flare, 7 Parchment, 9 Forest Morning, 10 Ocean, 11 Sunset, 12 Lavender. **Dark: 2 Terminal Green, 5 Plum Velvet, 8 Midnight Tokyo, 13 Carbon Night.** In themes 7–13, `--bg` is a gradient.
- The calendar app picks the theme with `manualTheme` from Supabase `calendar_app_preferences.theme_pref`. A value of `-1` means auto: day-of-year % 14, so the theme rotates daily (`_ds_bundle.js:471–527`). It never writes the theme to localStorage.

---

## 2. Colour mapping

Legend: **KEEP** = must stay literal. **NO TOKEN** = nothing fits, so a new token is proposed (§2b). "drop" = hover shade that should be replaced by the DS hover recipe (scale / `--hover-tint`). Counts come from `grep -oiE '#[0-9a-f]{3,8}'`.

### 2a. Table (all 82 hex + 5 rgba)
| Hex (count) | Role in UI (example line) | → DS token |
|---|---|---|
| #f1f2ea (4) | page background (`21`, `68`) | `--bg` |
| #fcfcf9 (37) | card surface (`76`, `226`) | `--card-bg` |
| #fbfbf6 (3) | header bar bg (`115`); hero SVG fill | `--card-bg`; SVG → KEEP (illustration) |
| #fff (61) | input bg (`87`); text on filled buttons (`92`); print sheet bg (`1043`) | `--input-bg`; `#fff` stays as the button ink (the DS Button uses literal `#fff`); print → KEEP |
| #f7f8f2 (1), #f4f5ec (13), #f6f7f0 (2), #eef0e4 (9), #eef0e8 (2) | subtle fills: Google-button hover, out-of-month cells, photo slot, segmented-control track (`1012`), "mute" chip bg | **NO TOKEN** `--surface-sunken` |
| #3b4038 (78) | primary text (`68`, `78`) | `--txt` |
| #55604f (5), #68705f (3) | body-ish secondary text (`445`, `697`) | `--txt` |
| #7c8274 (34) | secondary text, inactive nav (`79`, `2710`) | `--txt2` |
| #8b917f (14), #9aa08e (26), #a0a696 (10), #a8ad9f (30), #b3b8a8 (2), #c9cfbe (3) | tertiary/caption/CAPS labels/placeholder/build id/timestamps | `--txt2`. Collapse all of them: every one fails AA (§7). |
| #c3c8b8 (8) | ✕ delete glyph (`568`, `730`) | `--txt2` |
| #3f5540 (38) | wordmark + headings (`73`); dark "Mark done/Restocked" button bg (`567`, `857`); active nav text (`2710`); print header rule | wordmark → `--accent`; headings → `--txt`; button bg → `--btn`; nav → `--accent`; print → KEEP |
| #2e4030 (3) | hover of dark button | drop |
| #5c7a58 (67) | **primary button bg** (`92`, `386`, `595`), links (`23`), streak, "ok/done" state, bought tick | btn → `--btn`; link/text → `--accent`; ok → **NO TOKEN** `--sk-ok` |
| #4a6647 (9), #4c6849 (2) | sage hover | drop |
| #8aa882 (8) | input `style-focus` border (`355`–`414`), active theme-sym border | `--accent` (the DS focus recipe) |
| #e7eee4 (20) | active nav pill bg, ok-chip bg, preset chips (`589`, `2710`) | `color-mix(in srgb,var(--accent) 10%,transparent)` (the PillButton accent recipe) |
| #e8efe4 (3), #e6f2e7 (2), #d9e4d4 (1), #dbe6d6 (1) | ok-status bg (`2842`), best-drying banner (`211`), hover tints | ok → **NO TOKEN** `--sk-ok-bg`; hover → drop |
| #cfdcc9 (6), #d5dfcf (2), #cfe3d2 (3) | sage chip borders | `color-mix(in srgb,var(--accent) 28%,transparent)` |
| #e0e3d6 (48) | card border, dividers (`76`, `115`) | card → `--border`; dividers → `color-mix(in srgb,var(--border) 30%,transparent)` (the readme's cell-border recipe) |
| #dde0d1 (27), #cfd4c2 (29) | input / control / outline-button border (`87`, `152`) | `--border` |
| #eaece0 (4), #ecefe2 (3) | hairlines; lined-paper rule in print (`1122`) | `color-mix(--border 30%)`; print → KEEP |
| #d6dac9 (1), #ccd1c1 (2) | inactive nav dot; out-of-month numerals | `color-mix(in srgb,var(--txt2) 40%,transparent)` |
| #d95c8a (38) | **brand pink**: points (`130`), Inspect/Finish/Send CTAs (`157`, `657`), selection tick (`2839`), nav active dot, health ring, ✕ hover | CTA → `--btn`; selection → `--accent`; brand/decor → `--mark-pink` |
| #c74a78 (4) | pink hover | drop |
| #e9c9d6 (2) | disabled "Send" bg (`2987`) | `--btn` + `opacity:.6` (the DS Button disabled state) |
| #a83e66 (30) | danger/missed/penalty text (`153`, `1866`) | **NO TOKEN** `--sk-danger` |
| #c98aa4 (9) | notice ✕, timer "Stop" (`176`, `153`) | `--sk-danger` (currently 2.35:1) |
| #8a5568 (1) | report "issues" bullet (`692`) | `--sk-danger` |
| #fbe9f0 (22), #f2cdda (17), #fdf5f8 (5) | danger/today-reminder tint bg, border, pink card wash (`174`, `342`) | **NO TOKEN** `--sk-danger-bg`; border → `color-mix(--sk-danger 25%)`; wash → `color-mix(--mark-pink 4%,var(--card-bg))` |
| #f7edd8 (13), #e8d9b0 (7), #9a6c1c (11), #e0a83a (5) | **warning** (WILL CLASH / STACKED / tomorrow reminder / rainy trash) bg, border, text, dot (`1867`, `220`); today-cell bg/border (`2093`) | **NO TOKEN** `--sk-warn`, `--sk-warn-bg`; today cell → `--today-bg` (border) + `color-mix(--today-bg 10%)` (fill) |
| #fdf1e4 (3), #b3641c (2) | "waiting" status chip (`2842`); saveErr banner bg (`168`) | `--sk-warn-bg` / `--sk-warn` |
| #eef2fa (1), #cfdcef (1), #2f5c8f (1), #5a8fc7 (1) | SLIPPING flag (`1869`) | **NO TOKEN** `--sk-info`, `--sk-info-bg`; dot → `--wx-lo` |
| #2f7d4f (5), #b03a4a (2), #6f8b6c (1) | drying verdict good/bad glyph and text (`285`, `287`, `215`); shared with `js/weather.js` | **KEEP** (weather semantic, owned by weather.js); alias as `--sk-dry-good/--sk-dry-bad` |
| **#c0392b (7) #e67e22 (4) #2980b9 (9) #27ae60 (2) #8e44ad (4) #16a085 (2) #7f8c8d (2)** | garbage categories, cycle colours, `CAL_COL` (`1558`), log dots (`2567`). #c0392b / #2980b9 also serve as Sun/Sat numerals (`2094`) | **KEEP** (calapp_sukkiri contract). The Sunday numeral could use `--wknd`; Saturday stays #2980b9 |
| #2980b922 (1) | sym-theme chip tint (`2399`) | KEEP (derived from contract blue) |
| #4285f4 #34a853 #fbbc05 #ea4335 (1 each) | Google "G" (`99`) | **KEEP** (brand asset; the DS has `google-g.svg` + `Button variant="google"`) |
| #7a9a76 #6b8a67 #b9beac #c7ccbb #dbe3d4 #cfe0c8 #e8a5c0 (1–3 each) | hero room illustration (`448`–`472`) | KEEP (illustration). Optional later: tint via `currentColor` |
| rgba(59,64,56,.08/.09/.16) (6) | card, popover and timer-bar shadows (`76`, `479`, `143`) | `--shadow` (cards), `--sh-control` (chips), `--sh-panel` (timer bar) |
| rgba(63,85,64,.88) (1) | "LOCKED" photo badge (`625`) | `color-mix(in srgb,var(--txt) 88%,transparent)` |
| rgba(255,255,255,.75) (1) | health-ring track (`2873`) | `color-mix(in srgb,var(--card-bg) 75%,transparent)` |

**Print sheets** (`1006`–`1207` + `js/print.js`, 26 hex) reuse the screen colours (#3b4038 text, #3f5540 rules, pink/sage fills, #ccc/#e8d3db/#fdf9fb in print.js) with `print-color-adjust:exact`. **KEEP all print colours literal.** Do not tokenise `.sk-page` subtrees. Today the sheets are tinted rather than strictly black on white; switching greys to #000/#fff is a separate decision.

### 2b. Proposed new tokens (NO TOKEN gaps: 10 colour + 3 non-colour = **13**)
Define these in one `<style>` in `<helmet>`, scoped to the Sukkiri root. The values below are contrast-checked on light cards:
`--surface-sunken: color-mix(in srgb,var(--txt) 4%,var(--card-bg))` · `--sk-ok:#256b41` (5.59:1 on its bg) / `--sk-ok-bg:#e6f2e7` · `--sk-warn:#7a5512` (5.76:1) / `--sk-warn-bg:#f7edd8` · `--sk-danger:#8a2f55` (6.88:1) / `--sk-danger-bg:#fbe9f0` · `--sk-info:#2f5c8f` (6.14:1) / `--sk-info-bg:#eef2fa` · `--focus-ring:0 0 0 3px color-mix(in srgb,var(--accent) 45%,transparent)`.
Non-colour: `--jp-font:'Zen Maru Gothic'` (CJK fallback), `--fs-caps:11px` (CAPS micro-label, 800, .06em), and a spacing scale `--sp-1..6` (4/6/8/12/16/22). The DS has no spacing tokens.

---

## 3. Type mapping
| Sukkiri pattern (count) | Where | → DS |
|---|---|---|
| Zen Maru Gothic 900, 28px (×10) | screen titles ("Today", "Garbage") | `font-family:var(--h-font)`, `--fs-modal-title` (28) |
| ZMG 900, 34–40px (×2) | sign-in wordmark, hero health | `--h-font`, `--fs-month-title` (clamp) |
| ZMG 900, 18–26px (×17) | card headings, timers, points/streak | `--h-font` at 20px (`--fs-month-sub` clamp for big numbers) |
| ZMG 700, 15–17px (×13) | section sub-headings | `--h-font` at `--fs-label` (16) |
| Nunito 800, 13–15.5px (≈70) | buttons, pills, nav, chip text | `--b-font`; buttons `--fs-btn`, pills/nav `--fs-control` (13) |
| Nunito 600–700, 13.5–14.5px (≈60) | body copy, list rows | `--b-font` at `--fs-stats` (14) / `--fs-input` (15) |
| Nunito 800 CAPS .06em, 10–12px (×33) | field labels (EMAIL), section eyebrows, risk tags | NO TOKEN `--fs-caps`. Better: sentence case at `--fs-hint` 12 (voice rule) |
| 7.5–10.5px (×27) | calendar-cell and weather-strip micro text, print | `--fs-note` / `--fs-diary` clamps (cells); print → KEEP px |
| Weights 600/700/800/900 = 30/70/155/38 | — | DS uses 400–900 per theme. Keep 700/900; let 800 fall to 700 if the theme font lacks it |

**Heading vs body.** Today: Zen Maru Gothic (rounded JP) for headings, Nunito for body. Under DS: `--h-font` + `--b-font` vary per theme (theme 9 = DM Serif Display + **Nunito**, so the body font stays the same). **Japanese text** (すっきり, 資源物1類, もえるごみ, 透明/半透明) is **not covered by any DS font**. Append the CJK fallback: `font-family: var(--b-font), var(--jp-font), sans-serif`. Keep the Zen Maru Gothic `<link>` for that reason (the adherence lint flags it, so record the exception).

---

## 4. Shape mapping
| Sukkiri (count) | Use | → DS |
|---|---|---|
| radius 999px (61) | pills, buttons, chips, nav | `--r-pill` (22px; same look at ≤44px height) |
| 20–22px (6) | big cards, sign-in card | `--r-box` (20) |
| 16–18px (25) | cards, timer bar, banners | `--r-card` (16) / `--r-modal` (18) |
| 13–15px (15) | inner panels, banners | `--r-panel` (14) |
| 12px (26) | inputs, small buttons | `--r-btn` (12) |
| 10–11px (27) | selects, photo slots, calendar cells | `--r-input` (10) |
| 3–6px (12) | tick boxes, chips in cells | `--r-badge` (5) |
| 50% (17) | dots, round ticks | keep `50%` |
| 1px solid (74) / 1.5px (41) / 1.6–1.8px (5) / 2px (8) / 2.5–3px (3) | cards / controls / risk rows / ticks / print rules | cards → `var(--bw-card) solid var(--border)` (**2px: heavier than today**); controls → `var(--bw-control)`; print → KEEP |
| 1px & 1.5px dashed (9) | photo drop slots, empty states | `var(--bw-control) dashed var(--border)` |
| shadows `0 10–12px 30–40px rgba(59,64,56,.08)` (3), `.09` (2), `.16` (1) | cards / popovers / timer bar | `--shadow` / `--sh-control` / `--sh-panel` |
| `transform:scale(.98)` press (many `style-active`) | buttons | already matches the DS press recipe; set `transition: transform var(--t-press)` |

---

## 5. Component mapping
| Sukkiri pattern (example line) | DS target |
|---|---|
| Nav pill item (`122`; div + dot + label, active = sage tint) | `<button>` + `PillButton variant="accent"` recipe when active, `card` when inactive; `aria-current="page"`; drop the colour-only dot or keep it decorative |
| Primary filled button (`92`, `386`, `595`, `657`) | `Button variant="primary"` (x-import) or a `<button>` with `background:var(--btn); color:#fff; box-shadow:var(--sh-btn); border-radius:var(--r-btn)`. Not full width inline: override `style="width:auto"` |
| Dark "Mark done / Restocked" (`567`, `857`) | same primary recipe (the DS has one button weight) |
| Ghost/outline button: pink outline (`544`), grey outline "+5 min" (`152`) | `Button variant="outline"` (accent border/text, 12px). Grey variant → `PillButton variant="card"` |
| Text-link actions (Snooze `507`, "Continue on this device" `108`, "Create an account") | `<button>` styled as a link: `color:var(--accent)`, underline, min 24px target |
| Chip / status tag (due label `564`, req status `2842`, risk tags `1866`) | `PillButton accent` recipe (non-interactive `<span>`); status colours via `--sk-*` |
| Weekend toggle chip (`565`) | `<button aria-pressed>` + PillButton recipe |
| Card (`76`, `226`, `526`) | `background:var(--card-bg); border:var(--bw-card) solid var(--border); border-radius:var(--r-card); box-shadow:var(--shadow)` (the DS has no Card component, so use the recipe) |
| Text input (`87`, `355`, `398`–`414`) | `TextInput label="…"` (x-import), or a `<label>` + input with the TextInput recipe and the `--accent` focus border |
| Select (`838`) | TextInput recipe on `<select>` |
| Round "bought" tick (`804`) / square "select" tick (`821`) | `Checkbox` (a real `<input type=checkbox>` in a `<label>`) |
| Segmented control (`1012`, print part toggles) | `role="radiogroup"` of PillButtons on a `--surface-sunken` track |
| Notice / saveErr banners (`168`, `174`) | `InfoBanner` shell (r10, 1.5px) with `--sk-*` colours. Its `kind`s (birthday/holiday/weather) don't fit, so pass `style` |
| Day panel (calendar tap) | `Modal title subtitle` or keep inline; on mobile a Modal is the better fit |
| Calendar month grid (`247`) | **Do not** swap to `CalendarGrid`/`CalendarCell`: their props (marked/goal/diary/mood) don't cover garbage glyphs, cycle dots or drying. Restyle with tokens (`--today-bg`, `--wknd`, `--cell-hover`, 30% border mix) |
| Bottom timer bar (`143`) | `Toast` position recipe + card recipe + `--sh-panel` |
| ✕ delete (`568` etc.) | `IconButton` (34px circle) with `aria-label="Delete <name>"` |

---

## 6. Risks
1. **The bundle runs the calendar app's code** (§1 hazard): a duplicate Supabase client, global key/click listeners that throw, and an extra auth listener if the load order is wrong. **Highest-risk item.**
2. **Brand drift.** Sukkiri's identity is pink #d95c8a + sage #5c7a58. No DS theme carries both. Theme 9 is sage-only, so pink survives only as `--mark-pink` (#e84393, a hotter pink). Following the rotating calendar theme turns Sukkiri red/black, CRT-green or neon on different days.
3. **Dark themes (2/5/8/13).** Any surface left literal (illustration fills, warn/danger tints, category-tinted chips, `#fff` input fallbacks) turns into light islands on dark cards. Glyph watermarks at `opacity .26` vanish on dark cells. Status tokens would need per-theme dark values.
4. **Contrast regressions inside the DS itself.** Theme 9 `--btn` gradient #43a047→#66bb6a with white 18px/700 text measures **3.30 → 2.36:1 (fails AA)**. Theme 9 `--txt2` on its `--bg` gradient measures 4.41 → 3.36:1. Override `--btn` locally (e.g. `#2e7d32`, 5.13:1) and keep secondary text on `--card-bg` (4.67:1).
5. **Borders get heavier.** DS cards use 2px `--border` (Newsprint #1a1a1a, Forest #a5d6a7) against today's 1px #e0e3d6. The look changes noticeably.
6. **Print sheets.** If tokens leak into `.sk-page`, a dark or gradient theme prints dark backgrounds (`print-color-adjust:exact` is on). Keep print literal and exclude it from the theme scope.
7. **Fonts.** DS fonts have no Japanese glyphs, so they need the CJK fallback (§3). The theme 0/11 heading fonts don't load (a known DS issue). `fonts.css` declares 24 families, but only the faces in use download.
8. **Same-origin copy.** CLAUDE.md says to copy `Sukkiri.dc.html` + `support.js` into `Calender_app/` for shared localStorage. The `_ds/…` relative path must be copied too, or the page loses all styling there.
9. **Emoji icons** fit the DS iconography as they are. The 10 `GLYPH` SVGs and the category colours are contract-shared, so keep their fills literal. They need `aria-hidden` or a `<title>`.
10. **Adherence lint** flags every raw px (≈1,000 occurrences) because the DS ships no spacing tokens. Phase 1 can't reach zero warnings without the proposed `--sp-*`.

**Recommendation: pin one theme. Do not follow the calendar.** Set `data-theme="9"` (Forest Morning: sage, Nunito body, light) on the Sukkiri root wrapper, with local overrides for `--btn` (contrast) and the `--sk-*` status tokens. Following the calendar would need a Supabase read of `theme_pref` plus the day-of-year rotation, all 4 dark themes made safe, and brand drift accepted. Offer "Match calendar theme" as a Phase 2 setting once the light/dark status tokens exist.

---

## 7. Accessibility baseline (WCAG 2.1 AA)

### 7a. Contrast (measured with `/tmp/sk/contrast.js`; text needs 4.5:1, large text and UI 3:1)
| FG | BG | Role | Ratio | Result |
|---|---|---|---|---|
| #3b4038 | #f1f2ea / #fcfcf9 | body text | 9.43 / 10.34 | PASS |
| #7c8274 | #fcfcf9 / #fbfbf6 | secondary text, inactive nav | 3.85 / 3.82 | **FAIL** |
| #8b917f | #fcfcf9 / #f1f2ea | muted text | 3.17 / 2.89 | **FAIL** |
| #9aa08e | #fcfcf9 / #fbfbf6 | meta / sub text | 2.62 / 2.60 | **FAIL** |
| #a0a696 | #fbfbf6 / #f1f2ea / #fcfcf9 | taglines, captions | 2.41 / 2.22 / 2.44 | **FAIL** |
| #a8ad9f | #fcfcf9 / #fff | CAPS labels, placeholders | 2.23 / 2.30 | **FAIL** |
| #b3b8a8 | #f1f2ea | build id | 1.80 | **FAIL** |
| #c3c8b8 | #fcfcf9 / #f1f2ea | ✕ delete glyph | 1.66 / 1.52 | **FAIL** (also fails 3:1 as an icon) |
| #fff | #d95c8a | pink CTA (13–14px) | 3.59 | **FAIL** |
| #fff | #c74a78 | pink CTA hover | 4.49 | **FAIL** (just under) |
| #fff | #5c7a58 / #3f5540 | sage / dark CTAs | 4.79 / 8.12 | PASS |
| #fff | #e9c9d6 | disabled Send | 1.52 | exempt (disabled) |
| #a83e66 | #fbe9f0 | danger / MISSED | 5.08 | PASS |
| #c98aa4 | #fbe9f0 / #fff | notice ✕, "Stop" | 2.35 / 2.74 | **FAIL** |
| #d95c8a | #fff | pink outline-button text | 3.59 | **FAIL** |
| #d95c8a / #5c7a58 | #fbfbf6 | points / streak (20px/900 = large) | 3.46 / 4.62 | PASS |
| #5c7a58 | #e7eee4 / #fcfcf9 | sage chip / link | 4.05 / 4.66 | **FAIL** / PASS |
| #3f5540 | #e7eee4 | active nav | 6.87 | PASS |
| #9a6c1c | #f7edd8 | warning text | 3.98 | **FAIL** |
| #b3641c | #fdf1e4 | "waiting" chip | 3.97 | **FAIL** |
| #2f5c8f | #eef2fa | SLIPPING | 6.14 | PASS |
| #2f7d4f / #6f8b6c | #e6f2e7 | best-drying banner / sub | 4.37 / 3.26 | **FAIL** |
| #55604f / #8a5568 | #eef0e4 / #fcfcf9 | pool chip / issues | 5.74 / 5.71 | PASS |
| #c0392b / #2980b9 | #fcfcf9 | Sun / Sat numerals | 5.29 / 4.18 | PASS / **FAIL** |
| #cfd4c2 / #dde0d1 | #fff | tick ring / input border (1.4.11) | 1.52 / 1.34 | **FAIL** (the border is the only boundary) |
| #8aa882 | #fff | focus border | 2.62 | **FAIL** (1.4.11 / 2.4.7) |
| #e67e22 / #27ae60 / #16a085 / #7f8c8d | #fcfcf9 | category glyphs (UI) | 2.77 / 2.80 / 3.19 / 3.38 | 2 FAIL (contract colours; pair with a label) |

**Totals: 30 of 45 assessed pairs fail** (1 more exempt). Root cause: 6 near-identical greys used for secondary text. Collapsing them all into `--txt2` (theme 9 = #5a7a5a, 4.67:1 on card) fixes 14 of those pairs at once.

### 7b. Semantics (template, lines 1–1208)
| Check | Count | Example |
|---|---|---|
| Clickable non-buttons (`onClick` on div/span) | **72** (68 div + 4 span) | nav `122`, sign-in `92`, day cell `250`, ✕ `568` |
| Real `<button>` | **1** | Inspect `657` |
| `tabindex` / `role="button"` / key handlers on clickables | 0 / 0 / 0 | none of the 72 can be reached by keyboard (2.1.1 fail) |
| Inputs + selects | 25 `<input>` (1 hidden file input) + 1 `<select>` | — |
| `<label>` elements / `aria-label` | **0 / 0** | labels are sibling divs ("EMAIL" `86`→`87`); placeholder-only `355`, `398`–`414`; select `838` (1.3.1, 4.1.2) |
| `outline:none` | 25 | `87`; only 6 inputs have `style-focus` (border #8aa882, 2.62:1); no focus style on any clickable (2.4.7) |
| `<svg>` without name / `aria-hidden` | 21 / 21 | drying legend `285`/`287`, glyph watermarks `253`, Google G `99` |
| `<img>` | 0 | photos are CSS backgrounds, so check-in photos have no text alternative |
| `<html lang>` | missing | `index.html` and `Sukkiri.dc.html:2` (3.1.1) |
| Live regions | `role="alert"` `168`, `role="status"` `174` | good. But `notice` auto-clears after 6 s (`1312`), which is borderline for 2.2.1 |
| Colour-only meaning | active nav (bg + dot only, no `aria-current`) `122`; own-note vs auto-log dot (pink vs grey) `271`; today cell (bg/border) `2093`; selected theme-sym border `234`; cycle colour dots in cells | 1.4.1 |

### 7c. Tap targets under 44px (AAA 2.5.5 is 44px; WCAG 2.2 AA 2.5.8 is 24px. Listed for mobile use)
| Control | Line | Approx. size |
|---|---|---|
| ✕ delete (cycle, holiday, shop, supply, garbage cat, note, pool task) | `568` `730` `824` `858` `872` `964` `345` `749` | ~14–22px (no or 4px padding): **fails even 24px** |
| Notice ✕ | `176` | ~20×22 |
| Snooze | `507` | ~text only, ≈17px high: fails 24px |
| Weekend chip | `565` | ≈26px high |
| Shopping bought / select ticks | `804` / `821` | 22×22: fails 24px |
| Calendar ‹ › | `228` | ≈28px |
| Sym-theme picker | `234` | 38×32 |
| Timer "+5 min" / "Stop" | `152`/`153` | ≈36px / ≈33px |
| Nav pills | `122` | ≈34px high |

---

## 8. Phase 1 checklist (2 sessions)

### Session 1: load the DS, add tokens, apply the theme scope, convert colours (no behaviour changes)
1. In `<helmet>`, add the `styles.css` `<link>`, then the `_ds_bundle.js` `<script>` **placed before** the supabase-js script (line 14). Keep the Zen Maru Gothic link (CJK fallback) and drop the Nunito family from it (the DS fonts.css loads Nunito).
   - *Accept:* `MyCalendarDesignSystem_4b2620.Button` is defined; `__errors` contains `app_update/js/app.js` (proves its block was skipped); no `keydown` TypeErrors in the console; only one `GoTrueClient` warning source.
2. Add `data-theme="9"` on the root wrapper (`68`). Add one helmet `<style>` with the §2b tokens plus the `--btn` override (`#2e7d32`) and the font stack `var(--b-font), var(--jp-font), sans-serif`.
   - *Accept:* computed `--card-bg` on the root = `#f9fdf6`.
3. Replace template hex values with tokens per §2a, screen by screen (header/nav → Today → Calendar → Check-in → Reports → Deep → Shop → Supplies → Garbage → Settings → sign-in). Then do the logic-side literals in `renderVals()`/`navItems`/`RISK`/status maps (`1866`–`1869`, `2705`–`2711`, `2836`–`2843`, `2981`–`2988`). **Skip** `1006`–`1207` (print), `js/print.js`, the CAL_COL/garbage/GLYPH colours, the Google G and the illustration.
   - *Accept:* `grep -c '#[0-9a-fA-F]\{3,6\}'` outside print/contract/illustration = 0; the contract colours are still byte-identical in `calapp_sukkiri` (diff a saved payload before and after).
4. Typography: headings → `var(--h-font)`, body → `var(--b-font)`, sizes per §3.
   - *Accept:* no `'Zen Maru Gothic'`/`'Nunito'` literals outside print; Japanese garbage labels still render in a rounded JP face.
5. Shape: radii, borders and shadows per §4.
   - *Accept:* no `border-radius:999px` outside print; screenshots of Today + Garbage at 375px and 960px reviewed side by side with the pre-change ones.

### Session 2: semantics, a11y fixes, components
6. Convert all 72 clickable div/spans to `<button type="button">` (reset styles via the token recipe), or wrap them with `x-import` `Button`/`PillButton`/`IconButton` where the shape matches. Add `aria-current="page"` to the nav, `aria-pressed` to the weekend chip and sym-theme picker, and `aria-label="Delete …"` to every ✕.
   - *Accept:* `grep -c 'onClick=' | non-button` = 0; you can tab through the nav, the cycle rows and the shopping list, and Enter/Space activate them.
7. Focus: global `:focus-visible{box-shadow:var(--focus-ring);outline:2px solid var(--accent)}` in helmet; remove `outline:none` or pair it with `style-focus-visible`.
   - *Accept:* every interactive element shows a visible ring at ≥3:1.
8. Labels: wrap or associate every input/select with a `<label>` (or use `TextInput label=`); swap the ticks to `Checkbox`.
   - *Accept:* 0 unlabelled inputs (axe or Lighthouse "Form elements have labels" passes).
9. Contrast: collapse the six greys into `--txt2`, map pink CTAs to `--btn`, apply `--sk-*` for status, darken input/tick borders to `--border`.
   - *Accept:* re-run `/tmp/sk/contrast.js` with the new values: all text pairs ≥4.5 (≥3 for large), UI ≥3.
10. Targets: ✕, Snooze, ticks and notice ✕ get min 32×32 hit areas (44 on touch via padding).
    - *Accept:* no interactive element under 24×24 (2.5.8).
11. Names and lang: `lang="en"` on `<html>` in both files; `aria-hidden="true"` on decorative SVGs; `<title>` on the drying-legend and category glyphs; a text equivalent for the own-note dot; extend notice auto-clear to ≥10 s or pause it on hover/focus.
    - *Accept:* Lighthouse a11y ≥ 95 on Today, Calendar and Shopping.
12. Regression pass: print preview (weekly + monthly) is unchanged and black-ish on white; the `calapp_sukkiri` payload is unchanged; sign-in, timer bar and risk radar work. Update the CLAUDE.md design-system section (theme pin, new tokens, bundle-order caveat).
