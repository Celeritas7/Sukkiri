# Project notes — Sukkiri (room cleaning coach)

## Design system
Bound: **My Calendar Design System** (`_ds/my-calendar-design-system-4b262086.../`). Every DC must load the bundle + token stylesheets in `<helmet>` and use `var(--*)` tokens / DS components. Emoji is the icon system; sentence case; warm second-person voice.

## Planned sync with the Calendar app (`Calender_app/`)
The calendar app **already has a Sukkiri module**: `Calender_app/js/sukkiri.js`. Sync must match its existing contract, not invent a new one.

- **Storage key**: `calapp_sukkiri` in localStorage, mirrored to Supabase table `calendar_app_sukkiri` (`user_id`, `payload` jsonb, `updated_at`) via upsert on `user_id`. Table is optional — localStorage is the fallback.
- **Division of ownership** (stated in that file): *Sukkiri owns the ideal rules* (ward garbage categories, cleaning intervals); *the calendar owns practical data* (urgent tasks, away days) and applies them to the grid.
- **Payload shape**: `{ show, wm, block:{urg,any,away,hol}, garbage:[{id,label,short,icon,days:[dow],weeks:[nth],color}], cycles:[{id,name,every,anchor,color}], overrides:{}, done:{}, away:[] }`.
  - `icon` is one of the module's 11 monochrome glyph ids: flame, recycle, bottle, can, paper, trash, leaf, box, battery, glass.
  - `anchor`/date keys are `YYYY-MM-DD` strings.
  - Colors used there: `#c0392b #e67e22 #2980b9 #27ae60 #8e44ad #16a085 #7f8c8d`.
- **Implication for Sukkiri app**: its cleaning cycles should serialize into `cycles[]` (name / every-N-days / anchor date / color) so the calendar can render them; garbage categories belong in `garbage[]`. Sukkiri's photo inspections, reports, and shopping requests stay local to Sukkiri — the calendar only needs schedulable rules.
- Other calendar tables (for context): `calendar_app_entries`, `calendar_app_diary`, `calendar_app_preferences`, `calendar_app_birthdays`.

## Cost management app link
Sukkiri sends purchase requests via localStorage key `sukkiri_cost_requests` (array of `{source, type, status, id, requestedAt, currency:"JPY", totalYen, items:[{name, priceYen, link, reason, category}]}`). The cost app gets a "Sukkiri Requests" inbox section with approve/reject writing `status` back in place. Prompt for building it: `Cost App Prompt.md`. **No CSV export** — in-app section only.

## File layout
- `Sukkiri.dc.html` — app (template + logic; styles are inline by design, no stylesheet to extract)
- `js/data.js` — editable seed data: cycles, supplies, garbage categories, station rules, ward. Loaded as a classic script from `<helmet>`. `applyDataFile()` (componentDidMount, polls for the global) adopts only items whose `id` is not already in state, so live history is never rewritten; `garbageRules` + `ward` always refresh.
- `js/print.js` — `window.SUKKIRI_PRINT(app, S)` builds the A4 weekly/monthly sheet data. `printVals()` delegates to it and falls back to a `printMissing` stub if the file is absent.
- `support.js` — runtime (never edit)

## Launch kit (built)
- `run-sukkiri-local.bat` — serves Sukkiri on :8091 (same pattern as the calendar's .bat). Shared localStorage with the calendar only works on the same origin → copy `Sukkiri.dc.html` + `support.js` into `Calender_app/` for real sync.
- `sql/sukkiri_schema_R001.sql` — tables `sukkiri_state`, `sukkiri_reports`, `sukkiri_photos`, `sukkiri_cost_requests` + RLS + `sukkiri-photos` bucket. Not yet wired in the app (localStorage only).
- App pushes `cycles[]` into `calapp_sukkiri` on every save (ids `sk_<cycleId>`, anchor = `dueAt()`, `kind:'home'`), and — when signed in — merges the same payload into the Supabase table `calendar_app_sukkiri` that the calendar reads on load, so cycles cross ports and devices. `calPayload()` preserves everything the calendar owns (away, overrides, done, block, its own `kind:'digital'` routines); `pullCalAway()` brings away days back so the WILL CLASH flag works off-device. Manual "Push cycles to calendar now" in the Log tab. Reads `garbage[]` back from that key for print sheets.
- **Miss-risk radar** (Today, above the garbage reminder): due dates now come from `dueAt()` = first occurrence since last done, so an open slot in the past reads MISSED (previously `nextDue()` always rolled to the future and silently hid misses). Four flags — MISSED, WILL CLASH (due date is in the calendar's `calapp_sukkiri.away`), STACKED (3+ phases on one day), SLIPPING (rolling `gaps[]` average > interval x 1.35). Each carries one action (mark done / pull a week earlier / loosen interval) + Snooze (6 days, `riskAck`).
- **Cross-device timer**: `timers[]` + `timerRev` in state; only `endsAt` is stored, so countdowns survive a closed tab. Synced via Supabase table `sukkiri_timers` (`sql/sukkiri_timers_R002.sql`) — push on change, poll every 15s + on visibilitychange, plus a `storage` listener for same-origin tabs. Fixed bottom bar on every tab with +5 min / Stop / Done (+10 if the timer was started from a cycle row). Notification API + WebAudio triple beep on finish.
- **Trash month grid** (Garbage tab): calendar-app visual language — the same 10 monochrome glyph paths (`GLYPH`), category colours, red Sunday / blue Saturday, today pill — plus a next-4-collections strip with bag rules (透明 vs 半透明) and TODAY / TOMORROW framing.
- Tabs: Today · Photo check-in · Reports · Deep clean · Shopping · Supplies (refill intervals → auto-add to shopping; one-time buys → Owned w/ replace-after) · Log (activity history) · Print (A4 weekly/monthly sheets, part toggles, `window.print`).
- Seeded cycles: 12 (clothes 4d, sweep/mop 3d, wardrobe 14d, bedsheets 14d, bathroom 14d, fridge/kitchen 28d, aircon 30d, futon 30d, bins 30d, desk 7d, socks 4d, doormat 14d). Supplies: fragrance, tissue, alcohol, detergent, trash bags (refill); dust pan, doormat (one-time).

## Calendar-app add-on (built, not yet installed)
`calendar-patch/sukkiri-trash.js` — drop-in next-4-collections strip for the calendar app, injected above `#cal-grid`. Reads the existing `sk` payload, reuses `skGarbageOn`/`skIconSvg`/`SK_ICONS`, styled purely with theme tokens so it follows all 14 themes. Install: copy to `Calender_app/js/sukkiri-trash.js` + one `<script src>` line after `js/sukkiri.js` in `index.html`. Wraps `saveSukkiri`/`renderCal` to repaint; no edits to `sukkiri.js`.

## Garbage schedule (REAL — さいたま市 station board, confirmed by user)
Ward: **Saitama-shi, Minami-ku**. Editable **Garbage tab** owns the rules:
- **Mon** — 資源物1類 Recyclables 1: glass bottles, cans, PET, food packaging plastic · rinse inside · separate clear/translucent bag per type
- **Wed + Sat** — もえるごみ Burnable · clear or translucent bag (半透明可)
- **Fri** — 資源物2類 (古紙: newspaper, cardboard, milk cartons, magazines; 繊維: old clothes — tied/bundled by type) + 有害危険ごみ Hazardous (spray cans, gas cartridges, lighters, fluorescent tubes, batteries, mercury thermometers — 透明 bag, separate per type) + もえないごみ Unburnable under 90cm (透明 only)
- Rules stored in `garbageRules[]`: out by 8:30 AM; bulky 90cm–2m by advance application; never remove recyclables from the station; no business/moving-out waste; さいたま市 ごみ分別アプリ for sorting search.
- **透明 (fully clear) vs 半透明**: hazardous + unburnable require 透明; burnable + recyclables 1 allow 半透明. Don't blur this.
- This is **Saitama City, not Ageo City** — rules differ by municipality; tied to this address.
Categories push into `calapp_sukkiri.garbage` (with the module's `icon` ids) and drive the Today reminder (evening-before + morning-of) and both print sheets.

## Scheduling preference
User is **busy on weekdays** — every cycle carries `wk: true` (weekend-preferred): each occurrence rolls forward to the next Sat/Sun. Per-cycle toggle on the Today row switches to any-day. New cycles default to weekend.

## Open items / blockers
1. **Cleaning intervals** are still my estimates (collection days are now real).
2. **Fonts** — `Tiempos Headline` (theme 0 headings) and `Recoleta` (theme 11 headings) are not on Google Fonts and don't load in the real calendar app either; they silently fall back to serif / DM Serif Display. Licensed font binaries needed to fix.
3. Currency is **JPY (¥)** throughout.
4. Photo check-ins are **Saturday**; ideal photos are locked once set (unlock is a deliberate action).
