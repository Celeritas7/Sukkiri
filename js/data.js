/* ════════════════════════════════════════════════════════════════════════
   SUKKIRI — editable data file
   ────────────────────────────────────────────────────────────────────────
   This is the file to open when you want to change WHAT the app tracks.
   Plain script, no build step: edit, save, reload the app.

   HOW IT APPLIES
   · Anything NEW you add here appears in the app on next load.
   · Anything already in the app keeps its own history — editing an
     interval here does NOT rewrite a cycle you have been running.
     To change a live cycle's interval, use the app (the SLIPPING flag
     offers it) or delete the cycle and let this file re-add it.
   · Garbage rules and station rules DO refresh from here, since they
     are municipal facts rather than personal history.
   ════════════════════════════════════════════════════════════════════════ */
window.SUKKIRI_DATA = {

  /* Ward — printed on the Garbage tab. Rules differ by municipality;
     these are Saitama City, not Ageo. */
  ward: 'Saitama-shi, Minami-ku',

  /* ── CLEANING CYCLES ──────────────────────────────────────────────────
     days : interval in days
     wk   : true = weekend-preferred (rolls each occurrence to the next
            Sat/Sun, because weekdays are busy). false = any day.
     id   : must stay unique; it is how the app knows this is not new. */
  cycles: [
    { id: 'c1',  name: 'Clothes wash',              days: 4,  wk: true },
    { id: 'c2',  name: 'Room sweep & mop',          days: 3,  wk: true },
    { id: 'c3',  name: 'Wardrobe organizing',       days: 14, wk: true },
    { id: 'c4',  name: 'Bedsheets & pillow covers', days: 14, wk: true },
    { id: 'c5',  name: 'Bathroom deep clean',       days: 14, wk: true },
    { id: 'c6',  name: 'Fridge & kitchen',          days: 28, wk: true },
    { id: 'c7',  name: 'Aircon filter',             days: 30, wk: true },
    { id: 'c8',  name: 'Futon / blanket sun-dry',   days: 30, wk: true },
    { id: 'c9',  name: 'Trash bins wash',           days: 30, wk: true },
    { id: 'c10', name: 'Desk wipe-down',            days: 7,  wk: true },
    { id: 'c11', name: 'Socks wash',                days: 4,  wk: true },
    { id: 'c12', name: 'Doormat cleaning',          days: 14, wk: true }
  ],

  /* ── SUPPLIES ─────────────────────────────────────────────────────────
     kind 'refill'  : recurring buy — every N days it lands on the
                      shopping list by itself.
     kind 'onetime' : own it once; replaceMonths > 0 means the app will
                      remind you to replace it after that long.
     price          : yen, used for the shopping total and cost requests. */
  supplies: [
    { id: 'p1', name: 'Room fragrance',     kind: 'refill',  every: 30, price: 600 },
    { id: 'p2', name: 'Tissue paper',       kind: 'refill',  every: 21, price: 400 },
    { id: 'p3', name: 'Alcohol / sanitizer', kind: 'refill', every: 45, price: 500 },
    { id: 'p4', name: 'Detergent',          kind: 'refill',  every: 30, price: 700 },
    { id: 'p5', name: 'Trash bags',         kind: 'refill',  every: 30, price: 300 },
    { id: 'p6', name: 'Dust collector pan', kind: 'onetime', price: 900,  replaceMonths: 0 },
    { id: 'p7', name: 'Doormat',            kind: 'onetime', price: 1500, replaceMonths: 12 }
  ],

  /* ── GARBAGE CATEGORIES (さいたま市 南区 station board) ─────────────────
     days  : 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
     weeks : [] = every week, or e.g. [2,4] for 2nd & 4th week
     icon  : one of the calendar app's glyphs —
             flame recycle bottle can paper trash leaf box battery glass
     note  : bag rule. 透明 = fully clear (hazardous, unburnable);
             半透明 = translucent allowed (burnable, recyclables 1).
             Keep this distinction exact — the station enforces it. */
  garbage: [
    { id: 'g1', jp: 'もえるごみ', label: 'Burnable', short: '燃 BURN', icon: 'flame',
      days: [3, 6], weeks: [], color: '#c0392b',
      note: 'Clear or translucent bag (半透明可)' },

    { id: 'g2', jp: '資源物1類', label: 'Recyclables 1', short: '資1 REC', icon: 'bottle',
      days: [1], weeks: [], color: '#2980b9',
      note: 'Glass bottles, cans, PET, plastic packaging · rinse inside · separate bag per type' },

    { id: 'g3', jp: '資源物2類', label: 'Recyclables 2 — paper & cloth', short: '資2 紙布', icon: 'paper',
      days: [5], weeks: [], color: '#27ae60',
      note: '古紙: newspaper, cardboard, milk cartons, magazines · 繊維: old clothes · tie with string, bundled by type' },

    { id: 'g4', jp: '有害危険ごみ', label: 'Hazardous', short: '有害 HAZ', icon: 'battery',
      days: [5], weeks: [], color: '#8e44ad',
      note: 'Spray cans, gas cartridges, lighters, fluorescent tubes, batteries, thermometers · 透明 bag, separate per type' },

    { id: 'g5', jp: 'もえないごみ', label: 'Unburnable', short: '不燃 NON', icon: 'trash',
      days: [5], weeks: [], color: '#7f8c8d',
      note: 'Under 90cm · 透明 (fully clear) bag only' }
  ],

  /* ── STATION RULES — printed on the sheets, shown on the Garbage tab ── */
  garbageRules: [
    'Out by 8:30 AM on collection day',
    'Bulky items 90cm–2m: apply in advance, city collects door-to-door',
    'Never remove recyclables from the station',
    'No business waste or moving-out volumes',
    'さいたま市 ごみ分別アプリ — search any item to check its category'
  ]
};
