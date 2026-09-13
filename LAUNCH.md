# Launching Sukkiri — step by step

## What you have

| File | Purpose |
|---|---|
| `Sukkiri.dc.html` | The app itself |
| `support.js` | Runtime it needs (must sit next to it) |
| `run-sukkiri-local.bat` | Local server on port 8091 |
| `sql/sukkiri_schema_R001.sql` | Supabase tables (optional, for cloud sync) |
| `Cost App Prompt.md` | Paste into your cost app to build the request inbox |

---

## Step 1 — Get the files onto your PC

Download the project (chat → download card, or the project menu). Unzip it somewhere permanent, e.g.:

```
C:\Users\<you>\Documents\Sukkiri\
```

Keep `Sukkiri.dc.html`, `support.js` and `run-sukkiri-local.bat` **in the same folder**.

## Step 2 — Run it

Double-click **`run-sukkiri-local.bat`**. It opens
`http://localhost:8091/Sukkiri.dc.html` in your browser and leaves a black
console window open — that's the server, keep it open while using the app.
Close the window to stop.

If nothing happens, you need Python: install from python.org (tick *"Add
Python to PATH"*), then run the .bat again.

> Do **not** open `Sukkiri.dc.html` by double-clicking the file itself —
> `file://` blocks the parts the app needs. Always go through the .bat.

## Step 3 — Make it feel like an app

In Chrome/Edge, with Sukkiri open: **⋮ → Cast, save and share → Install page
as app**. You get a desktop icon and a window with no address bar. On your
phone, use your PC's local IP instead of `localhost`
(e.g. `http://192.168.1.20:8091/Sukkiri.dc.html`) while both are on the same
Wi-Fi, then "Add to Home screen".

## Step 4 — Set up your real data (do this once)

1. **Today** — delete cycles you don't do, adjust intervals by re-adding with
   the right day count. Mark everything done once so the schedule starts from
   today rather than my seeded dates.
2. **Photo check-in** — take one photo per area *when the room is at its best*
   and set it as the **ideal**. These lock; that's deliberate.
3. **Supplies** — set real prices and refill intervals; hit "Restocked" on
   anything you already have so it stops nagging.
4. **Deep clean** — add your long holidays; each one builds a plan from the
   task pool.
5. **Print** — pick Week or Month, toggle the parts you want, hit Print. A4.

## Step 5 — Weekly rhythm

- **Every day**: open Today, mark what you did.
- **Every Saturday**: Photo check-in → upload one photo per area → Run
  inspection. You get a scored, area-by-area report with instructions.
  Skipping costs 15 points and resets the streak.
- **When supplies run low**: they auto-appear in Shopping → "Send request to
  cost app".
- **Any time**: print the weekly sheet and tick boxes by hand.

---

## Step 6 — Sync with your calendar app (optional)

Sukkiri writes its cycles into the `calapp_sukkiri` key your
`Calender_app/js/sukkiri.js` already reads. Browsers only share that storage
between pages on the **same origin**, so:

1. Copy `Sukkiri.dc.html` + `support.js` into your `Calender_app` folder.
2. Start the calendar with **`run-calendar-local.bat`** as usual.
3. Open Sukkiri at that same port, e.g. `http://localhost:8080/Sukkiri.dc.html`.

Now cycles pushed from Sukkiri appear on the calendar grid, and Sukkiri reads
your ward's garbage days back out of the calendar for its print sheets. The
"Re-push cycles to calendar" button in the **Log** tab forces a resync.

## Step 7 — Cloud sync (optional, later)

Run `sql/sukkiri_schema_R001.sql` in your Supabase SQL editor. It creates
`sukkiri_state`, `sukkiri_reports`, `sukkiri_photos`, `sukkiri_cost_requests`,
row-level security, and a private `sukkiri-photos` bucket. The app is still
localStorage-only — say the word and I'll wire it to Supabase like the
calendar.

---

## Before you trust it

- **Garbage days are placeholders.** Enter your ward's real 市役所 collection
  schedule in the calendar app's Sukkiri panel; the print sheets pick it up.
- **Cleaning intervals are my guesses.** Adjust to how you actually live.
- **Data lives in this browser.** Clearing site data wipes it. Use the same
  browser and profile, and don't use private windows.
