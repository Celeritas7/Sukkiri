# My Calendar — Design System

Design system for **My Calendar**, a personal calendar / life-tracking web app. One product, one screen-centric surface: a month-grid calendar where each day can carry a colored ✕ mark (habit tracking), a ⭐ goal, a 📝 note, and a 📖 multi-line mood diary (each line inked good/neutral/bad). It also layers birthdays (with age), Japanese public holidays 🎌, and a 7-day weather forecast onto the grid. Auth is email/password or Google via Supabase.

The app's defining trait is its **14-theme system**: every visual token (background, card, fonts, accent, shadows, patterns) is a CSS custom property redefined per `[data-theme="0..13"]` scope. A theme auto-rotates daily unless the user pins one. Themes range from newspaper (`Newsprint`) to CRT terminal (`Terminal Green`) to neon (`Midnight Tokyo`). Theme 0 "Newsprint" serves as the `:root` default here.

## Sources
- Local codebase `Calender_app/` (mounted read-only): `index.html` (production single-file app, ground truth), `react/calendar-app.jsx` (earlier React port, 7 themes), `sql/` schemas, `Temp/` prior revisions, `docs/themes-audit-bundle.html`.
- No Figma, no logo files, no font binaries provided.

## CONTENT FUNDAMENTALS
- **Voice**: warm, personal, second person ("Sign in to your calendar", "Manage birthdays — they show every year with age", "Write your thoughts..."). Never corporate.
- **Casing**: sentence case everywhere ("Mark this day", "Goal achieved", "Check your email to confirm your account!"). Title case only for proper nouns and theme names ("Midnight Tokyo").
- **Emoji lead labels**: nearly every label/section starts with an emoji: "✕ Mark this day", "⭐ Goal achieved", "📝 Note", "📖 Personal Diary", "🎂 Birthdays". Emoji ARE the icon system (see ICONOGRAPHY).
- **Brevity**: microcopy is short and instructional. Hints use middots: "Click month name to jump · ✕ bulk mark · 🎂 birthdays". Placeholders are casual ellipses: "Quick note...", "Type a line... switch ink color for the next line".
- **Empty states** invite action: "No birthdays yet — add one below!", "Tap any day to start tracking".
- **Success/status** uses ✓ prefix and exclamation: "✓ Check your email to confirm your account!".
- **Stats** are compact emoji+count spans: "✕ 3 marked · ⭐ 2 goals · 📖 5 diary entries".

## VISUAL FOUNDATIONS
- **Tokens, not values**: all color/type comes from theme vars (`--bg --card-bg --border --h-font --b-font --txt --txt2 --accent --goal --note --diary --today-bg --wknd --btn --btn-sh --input-bg --pattern --shadow --cell-hover --pulse`). Components never hardcode theme colors.
- **Type**: two-font system per theme — heavy display heading font (`--h-font`, weight 700–900, e.g. Playfair Display 900) + body font (`--b-font`). Month title is huge: `clamp(36px, 9vw, 66px)`, letter-spacing −1px. Fluid `clamp()` sizing throughout.
- **Backgrounds**: flat or 145° 3-stop gradients per theme; optional `--pattern` overlay (fixed, pointer-events:none) for scanlines/vignettes.
- **Cards**: `--card-bg`, 2px solid `--border`, radius 16–18px, theme shadow (soft `0 8px 40px` blurs, or hard offsets like `4px 4px 0 #1a1a1a` in Solar Flare, or neon glows in Terminal Green).
- **Controls**: 1.5px borders, radius 10–12px inputs, 12px buttons, pills 20–22px, circles for icon buttons/dots. Focus = border-color → `--accent` (no rings).
- **Buttons**: `--btn` is a color OR a 135° gradient; white text; glow shadow `0 4px 15px var(--btn-sh)`. Weight 700.
- **Hover = scale**: hover `scale(1.02–1.15)`, press `scale(.97–.98)`, `.12s` transforms. Dropdown options hover with `rgba(128,128,128,.12)` tint instead.
- **Motion**: `slideIn` (fade + 12px rise, .35s) for the grid on month change; `mIn` (fade + rise + scale .96, .25s) for modals; `fadeIn` .2s overlays; `livePulse` 1.8s infinite on the today-dot. Background transitions .5s on theme switch.
- **Overlays**: `rgba(0,0,0,.55)` + `backdrop-filter: blur(6px)`.
- **Semantic colors**: weekend/holiday text `--wknd`; notes `--note`; goals `--goal`; diary `--diary`; mood ink fixed across themes (good #27ae60, bad #e74c3c, neutral gray, mixed #ffd93d); weather hi #e74c3c / lo #3498db; live dot #2ecc71. Mark palette (7 fixed colors): red #d63031, pink #e84393, teal #00b894, cyan #00cec9, orange #e17055, purple #6c5ce7, yellow #fdcb6e.
- **Birthday cells**: rainbow gradient border-image + pink/gold tint — the one intentionally loud exception.
- **Layout**: single centered column, max-width 840px; 7-col CSS grid calendar; cell inner borders at 30% border color via `color-mix`.

## ICONOGRAPHY
- **Emoji is the icon system.** No icon font, no icon SVG set. UI glyphs: 📅 (app mark/favicon), 🎂 🌤️ 🚪 ⭐ 📝 📖 🎌 🔄 😊 😐 😟 ✏️ 🗑️, theme emojis (📰 🪷 🟢 🌾 🧱 🍷 🌞 📜 🌃 🌿 🌊 🌅 🪻 🖤), weather emojis (☀️ 🌤️ ⛅ ☁️ 🌫️ 🌦️ 🌧️ ❄️ ⛈️ 🥶).
- **Unicode chars as icons**: ✕ (marks, close, bulk), ● (today pill), ‹ › (month nav), ▾ (dropdown caret), ★ (GOAL badge), · (hint separators).
- **Inline SVGs (only two)**: the ✕ day-mark (two round-capped 4px strokes, saved at `assets/x-mark.svg`) and the multicolor Google "G" in the Google sign-in button (`assets/google-g.svg`).
- **No logo exists.** The mark is the 📅 emoji favicon; render "My Calendar" in `--h-font` wherever a wordmark is needed.

## Fonts
All webfonts load from Google Fonts CDN (`tokens/fonts.css`), matching the app. **Two fonts the source references are NOT on Google Fonts and don't load in the real app either** (they fall back): `Tiempos Headline` (theme 0 headings → falls back to PT Serif/serif) and `Recoleta` (theme 11 headings → falls back to serif; `DM Serif Display` is the closest loaded match). Flagged — supply licensed binaries to fix.

## Index
- `styles.css` — global entry (imports only)
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `shape.css`, `themes.css` (all 14 theme scopes)
- `assets/` — `x-mark.svg`, `google-g.svg`
- `components/core/` — Button, IconButton, PillButton
- `components/forms/` — TextInput, TextArea, Checkbox, ColorDotPicker, MoodPicker
- `components/overlays/` — Modal, Dropdown, Toast, InfoBanner
- `components/calendar/` — MonthHeader, CalendarCell, CalendarGrid, StatsBar
- `guidelines/` — foundation specimen cards
- `ui_kits/calendar/` — interactive recreation (login → calendar → day modal → birthdays → themes)
- `SKILL.md` — agent skill entry point

## Intentional additions
None — component inventory is derived strictly from `index.html`.
