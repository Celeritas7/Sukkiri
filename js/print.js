/* ════════════════════════════════════════════════════════════════════════
   SUKKIRI — print sheet builders
   ────────────────────────────────────────────────────────────────────────
   Everything that shapes the A4 weekly / monthly sheets lives here:
   the 7-day grid, the tick boxes, the garbage row, the month calendar,
   and the part toggles. Pure layout data — it reads the app's state and
   returns values the Print tab renders. No state is written here except
   through app.save (the mode / part toggles and the print log entry).

   Loaded by Sukkiri.dc.html as a plain script; if it is missing the app
   still runs and the Print tab says so.
   ════════════════════════════════════════════════════════════════════════ */
window.SUKKIRI_PRINT = function (app, S) {
  const P = S.print || {}, D = app.D;
  const checkDow = (app.props.checkInDay ?? 'Saturday') === 'Sunday' ? 0 : 6;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  /* ── this week: Monday-first, so the sheet matches the calendar app ── */
  const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const days = [...Array(7)].map((_, i) => new Date(mon.getTime() + i * D));
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekDays = days.map(d => ({
    dow: DOW[d.getDay()], num: String(d.getDate()),
    bg: d.getDay() === checkDow ? '#fdf5f8' : '#eef0e4',
    color: d.getDay() === 0 ? '#a83e66' : d.getDay() === 6 ? '#2980b9' : '#5c7a58'
  }));

  /* one row per cycle; a filled box means the phase is due that day */
  const weekRows = (S.cycles || []).map(c => ({
    id: c.id, name: c.name, every: `${c.days}d`,
    cells: days.map(d => {
      const due = app.dueOn(c, d);
      return {
        border: due ? '#3f5540' : '#c3c8b8',
        fill: due ? '#e7eee4' : 'transparent',
        bg: d.getDay() === checkDow ? '#fdf9fb' : '#fff'
      };
    })
  }));

  const checkinCells = days.map(d => ({
    border: d.getDay() === checkDow ? '#d95c8a' : '#e8d3db',
    fill: d.getDay() === checkDow ? '#fbe9f0' : 'transparent'
  }));

  const weekGarbage = days.map(d => {
    const g = app.garbOn(d);
    return { tags: g.map(x => ({ short: x.short || x.label, color: x.color })), border: g.length ? '#3f5540' : '#d6dac9' };
  });

  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  /* ── this month: Monday-first grid, padded to whole weeks ── */
  const m0 = new Date(today.getFullYear(), today.getMonth(), 1);
  const mN = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const lead = (m0.getDay() + 6) % 7, total = Math.ceil((lead + mN.getDate()) / 7) * 7;
  const monthCells = [...Array(total)].map((_, i) => {
    const dn = i - lead + 1;
    if (dn < 1 || dn > mN.getDate()) return { num: '', bg: '#f6f7f0', numColor: '#ccc', boxBorder: 'transparent', garbage: [], due: [], isCheck: false };
    const d = new Date(today.getFullYear(), today.getMonth(), dn);
    const isCheck = d.getDay() === checkDow;
    return {
      num: String(dn), bg: isCheck ? '#fdf5f8' : '#fff',
      numColor: d.getDay() === 0 ? '#a83e66' : '#3b4038', boxBorder: '#9aa08e',
      garbage: app.garbOn(d).map(x => ({ short: x.short || x.label, color: x.color })),
      due: (S.cycles || []).filter(c => app.dueOn(c, d)).map(c => c.name), isCheck
    };
  });

  const modes = [['week', 'Week'], ['month', 'Month'], ['both', 'Both']];
  const parts = [['cycles', 'Cycles'], ['checkin', 'Photo check-in'], ['garbage', 'Garbage days'], ['deep', 'Deep-clean pool'], ['notes', 'Notes'], ['points', 'Points / streak']];

  return {
    print: P,
    printModes: modes.map(([id, label]) => ({ id, label, bg: (P.mode || 'week') === id ? '#fff' : 'transparent', color: (P.mode || 'week') === id ? '#3f5540' : '#7c8274' })),
    printParts: parts.map(([key, label]) => ({ key, label, mark: P[key] ? '✓' : '○', border: P[key] ? '#5c7a58' : '#cfd4c2', bg: P[key] ? '#e7eee4' : 'transparent', color: P[key] ? '#3f5540' : '#9aa08e' })),
    setPrintMode: e => app.save({ print: { ...P, mode: e.currentTarget.dataset.mode } }),
    togglePrintPart: e => { const k = e.currentTarget.dataset.key; app.save({ print: { ...P, [k]: !P[k] } }); },
    doPrint: () => { app.save({}, { kind: 'info', text: `Printed ${P.mode || 'week'} sheet` }); setTimeout(() => window.print(), 150); },
    showWeekSheet: P.mode !== 'month', showMonthSheet: P.mode === 'month' || P.mode === 'both',
    weekRangeLabel: `Week of ${fmt(days[0])} – ${fmt(days[6])}, ${days[6].getFullYear()}`,
    weekDays, weekRows, checkinCells, weekGarbage,
    monthLabel: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    monthHead: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(l => ({ label: l, color: l === 'Sun' ? '#a83e66' : l === 'Sat' ? '#2980b9' : '#5c7a58' })),
    monthCells,
    printedOn: fmt(today),
    printMissing: false
  };
};
