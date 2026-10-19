# Project notes — Sukkiri (room cleaning coach)

Follow AKATSUKI.md for anything touching the hub.

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
**Hub path (R017, live):** `sendToCostApp()` → `skHub.sendPurchaseRequest()` (kind `purchase_request`, to `cost`). Local record in `state.costReqs[]` (`key` stable, `id` = `uid('req')` → `req<ms><0-998>`, no hyphen; the latest record's id is always reused — open → hub updates/`skipped`, answered → `closed` → `nextId` = `<id>-2`…; only a brand-new list mints a fresh id). `sent`: hub|queued|error|local; `status` only from Cost's replies via `watchReplies` (started once after sign-in + cloudPull). AK1xx errors shown, never queued; a failed send is retried under the same id. Build id `BUILD` shown in Settings → Account & sync and on the sign-in page; `[ak]` logs when `localStorage.akatsuki_debug = '1'`. `window.sukkiri.{supabase,hub,build}`. Scripts: `js/akatsuki-client.js` (R017) → `js/adapters/sukkiri-adapter.js`. No sw.js (not a PWA).
**Legacy (delete once the hub round trip works):** the `sukkiri_cost_requests` localStorage push + clipboard JSON below.
Sukkiri sends purchase requests via localStorage key `sukkiri_cost_requests` (array of `{source, type, status, id, requestedAt, currency:"JPY", totalYen, items:[{name, priceYen, link, reason, category}]}`). The cost app gets a "Sukkiri Requests" inbox section with approve/reject writing `status` back in place. Prompt for building it: `Cost App Prompt.md`. **No CSV export** — in-app section only.

## Phase 0 behaviours (R018)
- `save()` surfaces a `localStorage` quota failure as the `saveErr` banner (role=alert) instead of swallowing it; clears on the next successful save.
- Deleted seed cycles go into `removedIds[]`; `load()` and `applyDataFile()` never re-add those ids.
- Missed check-in penalty only runs when `inspectAvailable()` (host `window.claude.complete`) **and** at least one ideal photo exists; otherwise `penalized` is just moved forward so later photos don't back-charge. Penalty stamps `lastPenalty`.
- `notice` auto-clears after 6 s and on tab change (`goNav`).
- Health = 100 − 18/overdue − risk flags (missed 10, clash/stack 6, slipping 3) − 12 if no check-in in 7 d − 10 if `lastPenalty` within 7 d, averaged with the latest report. Hero title "sukkiri" only at ≥ 90.
- Garbage reminder drops the "this morning" line after 08:30 and rolls to tomorrow's; button is "All collection days".
- `index.html` is a forwarder to `Sukkiri.dc.html` (keeps query + hash); edit only `Sukkiri.dc.html`.

## File layout
- `Sukkiri.dc.html` — app (template + logic; styles are inline by design, no stylesheet to extract)
- `js/data.js` — editable seed data: cycles, supplies, garbage categories, station rules, ward. Loaded as a classic script from `<helmet>`. `applyDataFile()` (componentDidMount, polls for the global) adopts only items whose `id` is not already in state, so live history is never rewritten; `garbageRules` + `ward` always refresh.
- `js/weather.js` — `window.SUKKIRI_WX`: Open-Meteo fetch (no key, 3h cache in `sukkiri_wx`), WMO emoji map shared with the calendar app, and the drying model. Also owns the shared **`app_location`** record.
- `js/print.js` — `window.SUKKIRI_PRINT(app, S)` builds the A4 weekly/monthly sheet data. `printVals()` delegates to it and falls back to a `printMissing` stub if the file is absent.
- `support.js` — runtime (never edit)

## Launch kit (built)
- `run-sukkiri-local.bat` — serves Sukkiri on :8091 (same pattern as the calendar's .bat). Shared localStorage with the calendar only works on the same origin → copy `Sukkiri.dc.html` + `support.js` into `Calender_app/` for real sync.
- `sql/sukkiri_schema_R001.sql` — tables `sukkiri_state`, `sukkiri_reports`, `sukkiri_photos`, `sukkiri_cost_requests` + RLS + `sukkiri-photos` bucket. Not yet wired in the app (localStorage only).
- App pushes `cycles[]` into `calapp_sukkiri` on every save (ids `sk_<cycleId>`, anchor = `dueAt()`, `kind:'home'`), and — when signed in — merges the same payload into the Supabase table `calendar_app_sukkiri` that the calendar reads on load, so cycles cross ports and devices. `calPayload()` preserves everything the calendar owns (away, overrides, done, block, its own `kind:'digital'` routines); `pullCalAway()` brings away days back so the WILL CLASH flag works off-device. Manual "Push cycles to calendar" in Settings → Account & sync. Reads `garbage[]` back from that key for print sheets.
- **Miss-risk radar** (Today, above the garbage reminder): due dates now come from `dueAt()` = first occurrence since last done, so an open slot in the past reads MISSED (previously `nextDue()` always rolled to the future and silently hid misses). Four flags — MISSED, WILL CLASH (due date is in the calendar's `calapp_sukkiri.away`), STACKED (3+ phases on one day), SLIPPING (rolling `gaps[]` average > interval x 1.35). Each carries one action (mark done / pull a week earlier / loosen interval) + Snooze (6 days, `riskAck`).
- **Cross-device timer**: `timers[]` + `timerRev` in state; only `endsAt` is stored, so countdowns survive a closed tab. Synced via Supabase table `sukkiri_timers` (`sql/sukkiri_timers_R002.sql`) — push on change, poll every 15s + on visibilitychange, plus a `storage` listener for same-origin tabs. Fixed bottom bar on every tab with +5 min / Stop / Done (+10 if the timer was started from a cycle row). Notification API + WebAudio triple beep on finish.
- **Trash month grid** (Garbage tab): calendar-app visual language — the same 10 monochrome glyph paths (`GLYPH`), category colours, red Sunday / blue Saturday, today pill — plus a next-4-collections strip with bag rules (透明 vs 半透明) and TODAY / TOMORROW framing.
- **Calendar tab** (first in nav): one month grid layering garbage collection (glyphs), cycles due (colour dots), a drying verdict (☀︎/⚠/✕ + 0–100), and note markers; 7-day forecast strip; best-drying-day nudge; rainy-paper-collection warning. Tap a day for a panel with weather, garbage, cycles due, the auto log for that date, and a free-text note box.
- **Drying model** (`js/weather.js`): the reported 0–100 score **is the outdoor score** — one question, one number, so days rank by real drying. Indoors is a separate rain fallback that never outranks it and is only named when outdoors is poor; it caps at 88 and is punished by **humidity, not rain** (fine ≤60% RH, bad >70%). A high precipitation *probability* with ~no precipitation in the total is treated as forecast noise (94% chance on a 10h-sun day must not condemn the day). **Futons need real sun** (≥3h sunshine, <0.5mm rain, ≤70% RH). Drying-dependent cycles matched by name: clothes/socks/sheets/pillow = wash, futon/mattress = sun. Daytime (9–17) mean RH, not the 24h figure.
- **`app_location`** — shared localStorage record `{label, lat, lon, tz, ward, owner, locked}`, neutral key so a future home-profile app can own it. Sukkiri's **Settings tab** edits it while `locked` is false; once the owner app sets `locked:true` (and `owner !== 'sukkiri'`) the fields go read-only automatically. Default: Saitama-shi Minami-ku, 35.8617/139.6455.
- Day notes: your own lines live in `dayNotes[YYYY-MM-DD][]`; auto entries are **derived from the existing `log[]`** by date (no duplicate storage) and cover done / check-in / timer / garbage / supplies / missed. Notes push to the calendar as `calapp_sukkiri.skNotes[date]`.
- Tabs: Calendar · Today · Photo check-in · Reports · Deep clean · Shopping · Supplies (refill intervals → auto-add to shopping; one-time buys → Owned w/ replace-after) · Print (A4 weekly/monthly sheets, part toggles, `window.print`).
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
1b. The Garbage tab keeps its own trash-only month grid by choice — Calendar is the combined view. Two grids, deliberately.
2. **Fonts** — `Tiempos Headline` (theme 0 headings) and `Recoleta` (theme 11 headings) are not on Google Fonts and don't load in the real calendar app either; they silently fall back to serif / DM Serif Display. Licensed font binaries needed to fix.
3. Currency is **JPY (¥)** throughout.
4. Photo check-ins are **Saturday**; ideal photos are locked once set (unlock is a deliberate action).

## Sign-in page
Full-screen login shown when `authReady` (session checked, not persisted) && no signed-in email && !`localOnly`. Email/password → `cloudAuth`; "Continue with Google" → `signInWithOAuth` redirecting back to `location.origin + pathname` (must be in Supabase → Auth → URL Configuration → Redirect URLs); `onAuthStateChange` SIGNED_IN → `onSignedIn`. "Continue on this device only" sets `localOnly`; sign-out or Send-while-local clears it. Log tab removed (log[] still feeds day notes); account card lives in Settings.
