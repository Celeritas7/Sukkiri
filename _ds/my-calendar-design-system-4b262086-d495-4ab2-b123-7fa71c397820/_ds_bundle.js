/* @ds-bundle: {"format":4,"namespace":"MyCalendarDesignSystem_4b2620","components":[{"name":"CalendarCell","sourcePath":"components/calendar/CalendarCell.jsx"},{"name":"CalendarGrid","sourcePath":"components/calendar/CalendarGrid.jsx"},{"name":"MonthHeader","sourcePath":"components/calendar/MonthHeader.jsx"},{"name":"StatsBar","sourcePath":"components/calendar/StatsBar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"PillButton","sourcePath":"components/core/PillButton.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"MARK_COLORS","sourcePath":"components/forms/ColorDotPicker.jsx"},{"name":"ColorDotPicker","sourcePath":"components/forms/ColorDotPicker.jsx"},{"name":"MoodPicker","sourcePath":"components/forms/MoodPicker.jsx"},{"name":"TextArea","sourcePath":"components/forms/TextArea.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Dropdown","sourcePath":"components/overlays/Dropdown.jsx"},{"name":"InfoBanner","sourcePath":"components/overlays/InfoBanner.jsx"},{"name":"Modal","sourcePath":"components/overlays/Modal.jsx"},{"name":"Toast","sourcePath":"components/overlays/Toast.jsx"},{"name":"BirthdayManager","sourcePath":"ui_kits/calendar/BirthdayManager.jsx"},{"name":"CalendarApp","sourcePath":"ui_kits/calendar/CalendarApp.jsx"},{"name":"DayModal","sourcePath":"ui_kits/calendar/DayModal.jsx"},{"name":"LoginScreen","sourcePath":"ui_kits/calendar/LoginScreen.jsx"},{"name":"MonthYearPicker","sourcePath":"ui_kits/calendar/MonthYearPicker.jsx"},{"name":"THEMES","sourcePath":"ui_kits/calendar/TopBar.jsx"},{"name":"TopBar","sourcePath":"ui_kits/calendar/TopBar.jsx"}],"sourceHashes":{"app_update/js/app.js":"6ecc8cd45d01","app_update/js/sukkiri.js":"d9f678f417e7","components/calendar/CalendarCell.jsx":"70cf5de2310d","components/calendar/CalendarGrid.jsx":"4efc4e60b4c7","components/calendar/MonthHeader.jsx":"be162e83992c","components/calendar/StatsBar.jsx":"d98f9b75daac","components/core/Button.jsx":"ea0f7ba76821","components/core/IconButton.jsx":"3596b67f3469","components/core/PillButton.jsx":"74fa05e1df32","components/forms/Checkbox.jsx":"66f999a981d1","components/forms/ColorDotPicker.jsx":"040ffa681763","components/forms/MoodPicker.jsx":"cf3cc0eb81a2","components/forms/TextArea.jsx":"a029d89d6846","components/forms/TextInput.jsx":"326013e072d5","components/overlays/Dropdown.jsx":"2f8856b3578b","components/overlays/InfoBanner.jsx":"44a977b4bbc3","components/overlays/Modal.jsx":"302733300179","components/overlays/Toast.jsx":"48d9e91ae08e","doc-page.js":"f52ae9c02fca","ui_kits/calendar/BirthdayManager.jsx":"a3628f479798","ui_kits/calendar/CalendarApp.jsx":"06e5f363b4a7","ui_kits/calendar/DayModal.jsx":"17957f8e82a8","ui_kits/calendar/LoginScreen.jsx":"dac380b9b7a1","ui_kits/calendar/MonthYearPicker.jsx":"a3e29e385e47","ui_kits/calendar/TopBar.jsx":"57e6eeaf1083"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MyCalendarDesignSystem_4b2620 = window.MyCalendarDesignSystem_4b2620 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// app_update/js/app.js
try { (() => {
/* ═══════════════ SUPABASE ═══════════════ */
const sb = window.supabase.createClient('https://wylxvmkcrexwfpjpbhyy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bHh2bWtjcmV4d2ZwanBiaHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzkxMDYsImV4cCI6MjA4NDIxNTEwNn0.6Bxo42hx4jwlJGWnfjiTpiDUsYfc1QLTN3YtrU1efak');

/* UID is now dynamic — set after login */
let UID = null;

/* ── Guest / preview mode: no account, local-only, all cloud calls no-op ── */
let GUEST = false;
const _sbFrom = sb.from.bind(sb);
function _sbStub() {
  const res = {
    data: null,
    error: null
  };
  const ch = new Proxy({}, {
    get(_, p) {
      if (p === 'then') return r => Promise.resolve(res).then(r);
      if (p === 'catch' || p === 'finally') return () => ch;
      return () => ch;
    }
  });
  return ch;
}
sb.from = t => GUEST ? _sbStub() : _sbFrom(t);
async function enterGuest() {
  GUEST = true;
  UID = 'guest';
  hideLoginScreen();
  await bootApp();
  if (typeof flashToast === 'function') flashToast('👤 Preview mode — saved on this device only');
}

/* ═══════════════ AUTH ═══════════════ */
let loginTab = 'signin';
function switchTab(tab) {
  loginTab = tab;
  document.getElementById('tab-signin').classList.toggle('act', tab === 'signin');
  document.getElementById('tab-signup').classList.toggle('act', tab === 'signup');
  document.getElementById('login-btn').textContent = tab === 'signin' ? 'Sign In' : 'Create Account';
  document.getElementById('login-subtitle').textContent = tab === 'signin' ? 'Sign in to your calendar' : 'Create your calendar account';
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-error').className = 'login-error';
}
async function handleAuth() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errEl.textContent = '';
  errEl.className = 'login-error';
  if (!email || !password) {
    errEl.textContent = 'Please enter your email and password';
    errEl.className = 'login-error err';
    return;
  }
  btn.disabled = true;
  btn.textContent = '...';
  try {
    let result;
    if (loginTab === 'signin') {
      result = await sb.auth.signInWithPassword({
        email,
        password
      });
    } else {
      result = await sb.auth.signUp({
        email,
        password
      });
      if (!result.error && result.data?.user && !result.data?.session) {
        errEl.textContent = '✓ Check your email to confirm your account!';
        errEl.className = 'login-error ok';
        btn.disabled = false;
        btn.textContent = 'Create Account';
        return;
      }
    }
    if (result.error) throw result.error;
    // onAuthStateChange will handle the rest
  } catch (e) {
    errEl.textContent = e.message;
    errEl.className = 'login-error err';
    btn.disabled = false;
    btn.textContent = loginTab === 'signin' ? 'Sign In' : 'Create Account';
  }
}
async function signInWithGoogle() {
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  errEl.className = 'login-error';
  try {
    const {
      error
    } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href
      }
    });
    if (error) throw error;
  } catch (e) {
    errEl.textContent = e.message;
    errEl.className = 'login-error err';
  }
}
async function signOut() {
  await sb.auth.signOut();
}
function showLoginScreen() {
  document.getElementById('login-screen').style.display = 'flex';
}
function hideLoginScreen() {
  document.getElementById('login-screen').style.display = 'none';
}

/* ═══════════════ CONSTANTS ═══════════════ */
const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MC = {
  red: '#d63031',
  pink: '#e84393',
  teal: '#00b894',
  cyan: '#00cec9',
  orange: '#e17055',
  purple: '#6c5ce7',
  yellow: '#fdcb6e'
};
const TH = [{
  name: 'Newsprint',
  emoji: '📰'
}, {
  name: 'Linen',
  emoji: '🪷'
}, {
  name: 'Terminal Green',
  emoji: '🟢'
}, {
  name: 'Botanical Sketch',
  emoji: '🌾'
}, {
  name: 'Concrete',
  emoji: '🧱'
}, {
  name: 'Plum Velvet',
  emoji: '🍷'
}, {
  name: 'Solar Flare',
  emoji: '🌞'
}, {
  name: 'Parchment Journal',
  emoji: '📜'
}, {
  name: 'Midnight Tokyo',
  emoji: '🌃'
}, {
  name: 'Forest Morning',
  emoji: '🌿'
}, {
  name: 'Ocean Breeze',
  emoji: '🌊'
}, {
  name: 'Sunset Amber',
  emoji: '🌅'
}, {
  name: 'Lavender Dusk',
  emoji: '🪻'
}, {
  name: 'Carbon Night',
  emoji: '🖤'
}, {
  name: 'Paper White',
  emoji: '⬜'
}];
let curYear = new Date().getFullYear(),
  curMonth = new Date().getMonth();
let calData = {},
  modalKey = null,
  modalColor = 'red',
  manualTheme = -1,
  wxMode = false;
let birthdays = [];
let diaryMood = 'good';
let diaryLineMoods = [];
let holidays = {};
let weatherData = {};
function $(id) {
  return document.getElementById(id);
}

/* ═══════════════ JAPAN HOLIDAYS ═══════════════ */
const JP_HOLIDAYS_STATIC = {
  '2025-01-01': 'New Year',
  '2025-01-13': 'Coming of Age',
  '2025-02-11': 'Foundation Day',
  '2025-02-23': 'Emperor\'s Birthday',
  '2025-02-24': 'Holiday (observed)',
  '2025-03-20': 'Vernal Equinox',
  '2025-04-29': 'Shōwa Day',
  '2025-05-03': 'Constitution Day',
  '2025-05-04': 'Greenery Day',
  '2025-05-05': 'Children\'s Day',
  '2025-05-06': 'Holiday (observed)',
  '2025-07-21': 'Marine Day',
  '2025-08-11': 'Mountain Day',
  '2025-09-15': 'Respect for Aged',
  '2025-09-23': 'Autumnal Equinox',
  '2025-10-13': 'Sports Day',
  '2025-11-03': 'Culture Day',
  '2025-11-23': 'Labor Thanksgiving',
  '2025-11-24': 'Holiday (observed)',
  '2026-01-01': 'New Year',
  '2026-01-12': 'Coming of Age',
  '2026-02-11': 'Foundation Day',
  '2026-02-23': 'Emperor\'s Birthday',
  '2026-03-20': 'Vernal Equinox',
  '2026-04-29': 'Shōwa Day',
  '2026-05-03': 'Constitution Day',
  '2026-05-04': 'Greenery Day',
  '2026-05-05': 'Children\'s Day',
  '2026-05-06': 'Holiday (observed)',
  '2026-07-20': 'Marine Day',
  '2026-08-11': 'Mountain Day',
  '2026-09-21': 'Respect for Aged',
  '2026-09-23': 'Autumnal Equinox',
  '2026-10-12': 'Sports Day',
  '2026-11-03': 'Culture Day',
  '2026-11-23': 'Labor Thanksgiving'
};
Object.assign(holidays, JP_HOLIDAYS_STATIC);
async function refreshHolidays() {
  try {
    const year = new Date().getFullYear();
    for (const y of [year, year + 1]) {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${y}/JP`);
      if (!res.ok) continue;
      const data = await res.json();
      data.forEach(h => {
        holidays[h.date] = h.localName || h.name;
      });
    }
  } catch (e) {
    console.warn('Holiday API failed, using static:', e.message);
  }
}
function getHoliday(dateStr) {
  return holidays[dateStr] || null;
}

/* ═══════════════ WEATHER ═══════════════ */
const WX_ICONS = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};
async function loadWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.79&longitude=140.06&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=7');
    if (!res.ok) return;
    const d = await res.json();
    const days = d.daily;
    for (let i = 0; i < days.time.length; i++) {
      const code = days.weathercode[i];
      const tMax = days.temperature_2m_max[i];
      const tMin = days.temperature_2m_min[i];
      let icon = WX_ICONS[code] || '🌤️';
      if (tMin <= 0) icon = '🥶';
      weatherData[days.time[i]] = {
        icon,
        tMax: Math.round(tMax),
        tMin: Math.round(tMin),
        code
      };
    }
  } catch (e) {
    console.warn('Weather failed:', e.message);
  }
}

/* ═══════════════ BIRTHDAYS ═══════════════ */
async function loadBirthdays() {
  try {
    const {
      data
    } = await sb.from('calendar_app_birthdays').select('*').eq('user_id', UID);
    birthdays = data || [];
  } catch (e) {
    console.warn('Bday load failed:', e);
    birthdays = [];
  }
}
function getBdaysForDate(month, day) {
  return birthdays.filter(b => {
    const d = new Date(b.birth_date + 'T00:00:00');
    return d.getMonth() === month && d.getDate() === day;
  });
}
function calcAge(birthDate, onDate) {
  let age = onDate.getFullYear() - birthDate.getFullYear();
  const m = onDate.getMonth() - birthDate.getMonth();
  if (m < 0 || m === 0 && onDate.getDate() < birthDate.getDate()) age--;
  return age;
}
function yearKnown(b) {
  return new Date(b.birth_date + 'T00:00:00').getFullYear() !== 1900;
}
function openBdayManager() {
  $('bday-ov').classList.remove('hidden');
  renderBdayList();
}
function closeBdayManager() {
  $('bday-ov').classList.add('hidden');
  cancelEdit();
}
function renderBdayList() {
  const list = $('bday-list');
  if (birthdays.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--txt2);padding:20px;font-size:14px">No birthdays yet — add one below!</div>';
    return;
  }
  const sorted = [...birthdays].sort((a, b) => {
    const da = new Date(a.birth_date + 'T00:00:00'),
      db = new Date(b.birth_date + 'T00:00:00');
    return da.getMonth() * 100 + da.getDate() - (db.getMonth() * 100 + db.getDate());
  });
  list.innerHTML = sorted.map(b => {
    const d = new Date(b.birth_date + 'T00:00:00');
    const yk = yearKnown(b);
    const age = yk ? calcAge(d, new Date()) : null;
    const dateStr = `${d.getDate()} ${MO[d.getMonth()]}` + (yk ? ` ${d.getFullYear()} · Age ${age}` : '');
    return `<div class="bday-row">
      <div class="bday-row-info">
        <span class="bday-row-name">🎂 ${esc(b.person_name)}</span>
        <span class="bday-row-date">${dateStr}</span>
      </div>
      <div class="bday-row-actions">
        <button onclick="editBday('${b.id}')" title="Edit">✏️</button>
        <button onclick="deleteBday('${b.id}')" title="Delete">🗑️</button>
      </div>
    </div>`;
  }).join('');
}
let editingBdayId = null;
function editBday(id) {
  const b = birthdays.find(x => x.id === id);
  if (!b) return;
  const d = new Date(b.birth_date + 'T00:00:00');
  $('bday-name').value = b.person_name;
  $('bday-day').value = d.getDate();
  $('bday-month').value = d.getMonth() + 1;
  $('bday-year').value = yearKnown(b) ? d.getFullYear() : '';
  editingBdayId = id;
  $('bday-add-btn').textContent = 'Save';
  $('bday-msg').textContent = 'Editing — change fields and hit Save';
  $('bday-msg').style.color = 'var(--goal)';
}
function cancelEdit() {
  editingBdayId = null;
  $('bday-name').value = '';
  $('bday-day').value = '';
  $('bday-month').value = '';
  $('bday-year').value = '';
  $('bday-add-btn').textContent = 'Add';
  $('bday-msg').textContent = '';
}
async function addBday() {
  const name = $('bday-name').value.trim();
  const day = $('bday-day').value;
  const month = $('bday-month').value;
  const year = $('bday-year').value.trim();
  $('bday-msg').textContent = '';
  $('bday-msg').style.color = 'var(--accent)';
  if (!name || !day || !month) return $('bday-msg').textContent = 'Fill in name, day, and month';
  const y = year ? parseInt(year) : 1900;
  const m = String(parseInt(month)).padStart(2, '0');
  const d = String(parseInt(day)).padStart(2, '0');
  const date = `${y}-${m}-${d}`;
  if (editingBdayId) {
    try {
      const {
        data,
        error
      } = await sb.from('calendar_app_birthdays').update({
        person_name: name,
        birth_date: date
      }).eq('id', editingBdayId).select();
      if (error) throw error;
      const idx = birthdays.findIndex(b => b.id === editingBdayId);
      if (idx >= 0) birthdays[idx] = data[0];
      cancelEdit();
      renderBdayList();
      renderCal();
    } catch (e) {
      $('bday-msg').textContent = e.message;
    }
  } else {
    try {
      const {
        data,
        error
      } = await sb.from('calendar_app_birthdays').insert({
        user_id: UID,
        person_name: name,
        birth_date: date
      }).select();
      if (error) throw error;
      birthdays.push(data[0]);
      cancelEdit();
      renderBdayList();
      renderCal();
    } catch (e) {
      $('bday-msg').textContent = e.message;
    }
  }
}
async function deleteBday(id) {
  try {
    await sb.from('calendar_app_birthdays').delete().eq('id', id);
    birthdays = birthdays.filter(b => b.id !== id);
    renderBdayList();
    renderCal();
  } catch (e) {
    console.error('Delete bday:', e);
  }
}

/* ═══════════════ WEATHER VIEW ═══════════════ */
function toggleWxView() {
  wxMode = !wxMode;
  document.body.classList.toggle('wx-mode', wxMode);
  $('wx-toggle').classList.toggle('wx-view-active', wxMode);
  $('wx-toggle').title = wxMode ? 'Normal View' : 'Weather View';
  renderCal();
}

/* ═══════════════ THEMES ═══════════════ */
function autoTheme() {
  const n = new Date(),
    s = new Date(n.getFullYear(), 0, 0);
  return Math.floor((n - s) / 864e5) % TH.length;
}
function activeTheme() {
  return manualTheme === -1 ? autoTheme() : manualTheme;
}
function applyTheme(i) {
  document.body.setAttribute('data-theme', i);
  $('t-emoji').textContent = TH[i].emoji;
  $('t-name').textContent = TH[i].name;
}
function buildThemeDD() {
  const dd = $('theme-dd');
  dd.innerHTML = '';
  let b = document.createElement('button');
  b.className = 'dd-opt' + (manualTheme === -1 ? ' active' : '');
  b.textContent = '🔄 Auto (daily rotation)';
  b.onclick = () => {
    manualTheme = -1;
    applyTheme(activeTheme());
    buildThemeDD();
    saveThemePref();
    closeAllDD();
  };
  dd.appendChild(b);
  dd.appendChild(Object.assign(document.createElement('div'), {
    className: 'dd-div'
  }));
  TH.forEach((t, i) => {
    let b = document.createElement('button');
    b.className = 'dd-opt' + (manualTheme === i ? ' active' : '');
    b.textContent = t.emoji + ' ' + t.name;
    b.onclick = () => {
      manualTheme = i;
      applyTheme(i);
      buildThemeDD();
      saveThemePref();
      closeAllDD();
    };
    dd.appendChild(b);
  });
}
async function saveThemePref() {
  await sb.from('calendar_app_preferences').upsert({
    user_id: UID,
    theme_pref: manualTheme
  }, {
    onConflict: 'user_id'
  });
}
async function loadThemePref() {
  const {
    data
  } = await sb.from('calendar_app_preferences').select('theme_pref').eq('user_id', UID).single();
  manualTheme = data?.theme_pref ?? -1;
  buildThemeDD();
}

/* ═══════════════ DROPDOWN ═══════════════ */
function toggleDD(id, e) {
  e.stopPropagation();
  const el = $(id),
    was = el.classList.contains('hidden');
  closeAllDD();
  if (was) el.classList.remove('hidden');
}
function closeAllDD() {
  document.querySelectorAll('.dd-panel').forEach(p => p.classList.add('hidden'));
}
document.addEventListener('click', closeAllDD);

/* ═══════════════ CALENDAR RENDERING ═══════════════ */
function daysIn(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDay(y, m) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

/* ═══════════════ MONTHLY PRINTOUT ═══════════════ */
const PO_KEY = 'calapp_print_opts';
function getPrintOpts() {
  let o = {
    holidays: 1,
    weather: 1,
    notes: 1,
    diary: 1,
    goals: 1,
    marks: 1,
    bdays: 1,
    tasks: 1,
    sukkiri: 1,
    fs: 8,
    ch: .85
  };
  try {
    Object.assign(o, JSON.parse(localStorage.getItem(PO_KEY) || '{}'));
  } catch (e) {}
  return o;
}
function togglePrintOpts() {
  const p = $('pr-opts');
  if (p.classList.toggle('open')) {
    const o = getPrintOpts();
    p.querySelectorAll('input[data-po]').forEach(i => {
      i.checked = !!o[i.dataset.po];
    });
    $('pr-fs').value = o.fs;
    $('pr-fs-v').textContent = o.fs + 'px';
    $('pr-ch').value = o.ch;
    $('pr-ch-v').textContent = o.ch + 'in';
    $('pr-fs').oninput = e => {
      $('pr-fs-v').textContent = e.target.value + 'px';
    };
    $('pr-ch').oninput = e => {
      $('pr-ch-v').textContent = e.target.value + 'in';
    };
  }
}
function doPrint() {
  const o = {};
  $('pr-opts').querySelectorAll('input[data-po]').forEach(i => {
    o[i.dataset.po] = i.checked ? 1 : 0;
  });
  o.fs = parseFloat($('pr-fs').value);
  o.ch = parseFloat($('pr-ch').value);
  localStorage.setItem(PO_KEY, JSON.stringify(o));
  $('pr-opts').classList.remove('open');
  printMonth(o);
}
function printMonth(o) {
  o = o || getPrintOpts();
  const dim = daysIn(curYear, curMonth),
    fd = firstDay(curYear, curMonth),
    pDim = daysIn(curYear, curMonth === 0 ? 11 : curMonth - 1);
  let h = '<div class="pr-h"><div class="pr-mo">' + MO[curMonth] + '</div><div class="pr-yr">' + curYear + '</div></div><div class="pr-cal">';
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => {
    h += '<div class="pr-hdr' + (i >= 5 ? ' wk' : '') + '">' + d + '</div>';
  });
  for (let i = 0; i < 42; i++) {
    let day, cur;
    if (i < fd) {
      day = pDim - fd + i + 1;
      cur = false;
    } else if (i < fd + dim) {
      day = i - fd + 1;
      cur = true;
    } else {
      day = i - fd - dim + 1;
      cur = false;
    }
    const we = i % 7 >= 5;
    const key = cur ? curYear + '-' + String(curMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0') : null;
    const hol = key ? getHoliday(key) : null;
    const dd = key ? calData[key] : null,
      wx = key ? weatherData[key] : null,
      bdays = cur ? getBdaysForDate(curMonth, day) : [];
    const skf = cur && o.sukkiri && typeof skCellFlags === 'function' ? skCellFlags(key) : null;
    let inner = '<span class="pr-d">' + day + '</span>';
    if (cur) {
      if (o.sukkiri && typeof skPrintCell === 'function') inner += skPrintCell(key);
      if (o.weather && wx) inner += '<span class="pr-wx">' + wx.icon + '</span>';
      if (o.marks && dd && dd.marked) inner += '<svg class="pr-x" viewBox="0 0 40 40" preserveAspectRatio="none"><line x1="7" y1="7" x2="33" y2="33" stroke="' + (MC[dd.markColor] || MC.red) + '"/><line x1="33" y1="7" x2="7" y2="33" stroke="' + (MC[dd.markColor] || MC.red) + '"/></svg>';
      let lines = '';
      if (o.goals && dd && dd.isGoal) lines += '<div class="pr-goal">★ GOAL</div>';
      if (o.notes && dd && dd.note) lines += '<div class="pr-note">' + esc(dd.note) + '</div>';
      if (o.tasks) tasksOn(key).forEach(t => {
        lines += '<div class="pr-task' + (t.done ? ' done' : '') + '">▢ ' + (t.urg ? '⚑ ' : '') + esc(t.text) + (t.time ? ' · ' + t.time : '') + '</div>';
      });
      if (o.diary && dd && dd.diary) {
        const dec = decodeDiary(dd.diary);
        const prev = dec.text.split('\n').filter(l => l.trim()).join(' · ');
        if (prev) lines += '<div class="pr-diary">📖 ' + esc(prev) + '</div>';
      }
      if (o.bdays) bdays.forEach(b => {
        lines += '<div class="pr-bday">🎂 ' + esc(b.person_name) + '</div>';
      });
      if (o.sukkiri) lines += skPrintLines(key);
      if (lines) inner += '<div class="pr-body">' + lines + '</div>';
      if (o.holidays && hol) inner += '<span class="pr-hol">🎌 ' + esc(hol) + '</span>';
    }
    h += '<div class="pr-cell' + (we ? ' we' : '') + (cur ? '' : ' om') + (hol ? ' hol' : '') + (skf ? ' sk-clean' + (skf.clash ? ' sk-clash' : '') + (skf.urg ? ' sk-urgclash' : '') : '') + '"' + (skf ? ' style="--sk-c:' + skf.color + '"' : '') + '>' + inner + '</div>';
  }
  const ps = document.getElementById('print-sheet');
  ps.style.setProperty('--pr-fs', (o.fs || 8) + 'px');
  ps.style.setProperty('--pr-cellmin', (o.ch || .85) + 'in');
  ps.innerHTML = h + '</div>';
  window.print();
}
function isToday(d) {
  const t = new Date();
  return d === t.getDate() && curMonth === t.getMonth() && curYear === t.getFullYear();
}
function dk(d) {
  return `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
function xSvg(c) {
  return `<svg class="xm" width="28" height="28" viewBox="0 0 40 40"><line x1="7" y1="7" x2="33" y2="33" stroke="${c}" stroke-width="4" stroke-linecap="round"/><line x1="33" y1="7" x2="7" y2="33" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`;
}
function renderCal() {
  const c = $('cells'),
    dim = daysIn(curYear, curMonth),
    fd = firstDay(curYear, curMonth),
    pDim = daysIn(curYear, curMonth === 0 ? 11 : curMonth - 1);
  const total = Math.ceil((fd + dim) / 7) * 7,
    rows = Math.ceil(total / 7);
  skOccCache.from = '';
  $('m-name').textContent = MO[curMonth];
  $('y-label').textContent = curYear;
  let h = '';
  for (let i = 0; i < total; i++) {
    let day, cur;
    if (i < fd) {
      day = pDim - fd + i + 1;
      cur = false;
    } else if (i < fd + dim) {
      day = i - fd + 1;
      cur = true;
    } else {
      day = i - fd - dim + 1;
      cur = false;
    }
    const we = i % 7 >= 5,
      lr = Math.floor(i / 7) === rows - 1;
    const key = cur ? dk(day) : null,
      dd = key ? calData[key] : null;
    const hol = cur ? getHoliday(key) : null;
    const bdays = cur ? getBdaysForDate(curMonth, day) : [];
    const wx = cur ? weatherData[key] : null;
    const today = isToday(day) && cur;
    let cls = 'cell';
    if (cur) cls += ' cur';else cls += ' om';
    if (we && cur) cls += ' we';
    if (lr) cls += ' lr';
    if (hol && cur) cls += ' holiday';
    if (bdays.length > 0 && cur) cls += ' birthday';
    const skf = cur && typeof skCellFlags === 'function' ? skCellFlags(key) : null;
    if (skf) cls += ' sk-clean' + (skf.clash ? ' sk-clash' : '') + (skf.urg ? ' sk-urgclash' : '');
    let dcls = 'dnum';
    h += `<div class="${cls}" ${skf ? `style="--sk-c:${skf.color}"` : ''} ${cur ? `data-k="${key}"` : ''}>`;
    if (today) h += '<div class="today-dot"></div>';
    if (wx && cur && bdays.length === 0) h += `<span class="wx-icon">${wx.icon}</span>`;
    if (bdays.length > 0 && cur) h += '<span class="bday-icon">🎂</span>';
    if (cur) h += skCellHtml(key);
    h += `<div class="${dcls}">${day}</div>`;
    if (cur && dd) {
      if (dd.marked) h += xSvg(MC[dd.markColor] || MC.red);
      if (dd.isGoal) h += '<div class="gb">★ GOAL</div>';
      if (dd.note) h += `<div class="np">${esc(dd.note)}</div>`;
      if (dd.diary) {
        const dm = diaryOverallMood(dd.diary);
        const dcls = dm === 'mixed' ? 'di-mixed' : dm === 'good' ? 'di-good' : dm === 'bad' ? 'di-bad' : '';
        const pcls = dm === 'mixed' ? 'dp-mixed' : dm === 'good' ? 'dp-good' : dm === 'bad' ? 'dp-bad' : 'dp-neutral';
        const decoded = decodeDiary(dd.diary);
        const preview = decoded.text.split('\n').filter(l => l.trim()).join(' · ');
        h += `<div class="dp ${pcls}">${esc(preview)}</div>`;
        h += `<div class="di ${dcls}">📖</div>`;
      }
    }
    if (cur && tkStyle.show) {
      tasksOn(key).forEach(t => {
        h += `<div class="tk${t.done ? ' done' : ''}${t.urg ? ' urg' : ''}"><span class="tkd"></span><span>${esc(t.text)}${t.time ? ' · ' + t.time : ''}</span></div>`;
      });
    }
    if (cur) h += skCellBodyHtml(key);
    if (bdays.length > 0 && cur) {
      const bname = bdays.map(b => b.person_name).join(', ');
      h += `<span class="bday-name">${esc(bname)}</span>`;
    }
    if (hol && cur && bdays.length === 0) h += `<span class="holiday-tag">🎌 ${esc(hol)}</span>`;
    if (cur && wx) h += `<div class="wx-big"><span class="wx-big-icon">${wx.icon}</span><div class="wx-temps"><span class="wx-hi">${wx.tMax}°</span><span class="wx-lo">${wx.tMin}°</span></div></div>`;else if (cur && !wx) h += '<div class="wx-big"><span class="wx-none">—</span></div>';
    h += '</div>';
  }
  c.innerHTML = h;
  c.querySelectorAll('.cell.cur').forEach(el => {
    el.addEventListener('click', () => {
      if (bulkMode) bulkToggleCell(el.dataset.k);else openModal(el.dataset.k, calData[el.dataset.k]);
    });
  });
  const g = $('cal-grid');
  g.style.animation = 'none';
  g.offsetHeight;
  g.style.animation = 'slideIn .35s ease';
  updateStats();
}
function updateStats() {
  if (wxMode) {
    const keys = Object.keys(weatherData);
    if (keys.length > 0) {
      const temps = Object.values(weatherData);
      const hi = Math.max(...temps.map(w => w.tMax)),
        lo = Math.min(...temps.map(w => w.tMin));
      const hasRain = temps.some(w => [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82].includes(w.code));
      const hasSnow = temps.some(w => [71, 73, 75, 77, 85, 86].includes(w.code));
      let summary = `<span>🌡️ Week: <b style="color:#e74c3c">${hi}°C</b> / <b style="color:#3498db">${lo}°C</b></span>`;
      if (hasRain) summary += '<span>🌧️ Rain expected</span>';
      if (hasSnow) summary += '<span>❄️ Snow expected</span>';
      if (lo <= 0) summary += '<span>🥶 Below freezing</span>';
      $('stats').innerHTML = summary;
    } else {
      $('stats').innerHTML = '<span>No weather data — only shows 7 days from today</span>';
    }
    return;
  }
  const ent = Object.values(calData),
    m = ent.filter(e => e.marked).length,
    g = ent.filter(e => e.isGoal).length,
    d = ent.filter(e => e.diary).length;
  $('stats').innerHTML = m + g + d === 0 ? 'Tap any day to start tracking' : `<span>✕ ${m} marked</span><span>⭐ ${g} goals</span><span>📖 ${d} diary entries</span>`;
}

/* ═══════════════ NAVIGATION ═══════════════ */
function prevMonth() {
  if (curMonth === 0) {
    curMonth = 11;
    curYear--;
  } else curMonth--;
  loadAndRender();
}
function nextMonth() {
  if (curMonth === 11) {
    curMonth = 0;
    curYear++;
  } else curMonth++;
  loadAndRender();
}
function goToday() {
  const t = new Date();
  curYear = t.getFullYear();
  curMonth = t.getMonth();
  loadAndRender();
}

/* ═══════════════ MONTH/YEAR PICKER ═══════════════ */
function openPicker() {
  const ov = $('picker-ov');
  let h = '<div class="picker"><div class="picker-col" style="flex:1"><div class="picker-col-label">Month</div><div class="picker-months">';
  MO.forEach((m, i) => {
    h += `<button class="picker-mo${i === curMonth ? ' act' : ''}" data-m="${i}">${m.slice(0, 3)}</button>`;
  });
  h += '</div></div><div class="picker-col"><div class="picker-col-label">Year</div><div class="picker-years" id="picker-yrs">';
  const curYr = new Date().getFullYear();
  for (let y = curYr + 5; y >= 2020; y--) {
    h += `<button class="picker-yr${y === curYear ? ' act' : ''}" data-y="${y}">${y}</button>`;
  }
  h += '</div></div></div>';
  ov.innerHTML = h;
  ov.classList.remove('hidden');
  ov.querySelectorAll('.picker-mo').forEach(b => {
    b.onclick = () => {
      curMonth = parseInt(b.dataset.m);
      ov.querySelectorAll('.picker-mo').forEach(x => x.classList.remove('act'));
      b.classList.add('act');
      $('m-name').textContent = MO[curMonth];
    };
  });
  ov.querySelectorAll('.picker-yr').forEach(b => {
    b.onclick = () => {
      curYear = parseInt(b.dataset.y);
      ov.querySelectorAll('.picker-yr').forEach(x => x.classList.remove('act'));
      b.classList.add('act');
      $('y-label').textContent = curYear;
    };
  });
  setTimeout(() => {
    const actY = ov.querySelector('.picker-yr.act');
    if (actY) actY.scrollIntoView({
      block: 'center',
      behavior: 'instant'
    });
  }, 50);
}
function closePicker() {
  $('picker-ov').classList.add('hidden');
  loadAndRender();
}

/* ═══════════════ BULK MARK MODE ═══════════════ */
let bulkMode = false,
  bulkColor = 'red';
function toggleBulkMode() {
  bulkMode = !bulkMode;
  $('bulk-toggle').classList.toggle('bulk-active', bulkMode);
  $('bulk-bar').classList.toggle('hidden', !bulkMode);
  if (bulkMode) buildBulkDots();
  renderCal();
}
function buildBulkDots() {
  const el = $('bulk-dots');
  el.innerHTML = '';
  Object.entries(MC).forEach(([n, c]) => {
    const b = document.createElement('button');
    b.className = 'bulk-dot' + (bulkColor === n ? ' act' : '');
    b.style.background = c;
    b.onclick = () => {
      bulkColor = n;
      buildBulkDots();
    };
    el.appendChild(b);
  });
}
async function bulkToggleCell(key) {
  const existing = calData[key];
  if (existing && existing.marked) {
    existing.marked = false;
    existing.markColor = 'red';
    const empty = !existing.marked && !existing.isGoal && !existing.note && !existing.diary;
    if (empty) delete calData[key];
    try {
      if (empty) await sb.from('calendar_app_entries').delete().eq('user_id', UID).eq('entry_date', key);else await sb.from('calendar_app_entries').upsert({
        user_id: UID,
        entry_date: key,
        is_marked: false,
        mark_color: 'red',
        is_goal: existing.isGoal || false,
        note: existing.note || null
      }, {
        onConflict: 'user_id,entry_date'
      });
    } catch (e) {
      console.error('Bulk:', e);
    }
  } else {
    if (!calData[key]) calData[key] = {
      marked: false,
      markColor: 'red',
      isGoal: false,
      note: '',
      diary: ''
    };
    calData[key].marked = true;
    calData[key].markColor = bulkColor;
    try {
      await sb.from('calendar_app_entries').upsert({
        user_id: UID,
        entry_date: key,
        is_marked: true,
        mark_color: bulkColor,
        is_goal: calData[key].isGoal || false,
        note: calData[key].note || null
      }, {
        onConflict: 'user_id,entry_date'
      });
    } catch (e) {
      console.error('Bulk:', e);
    }
  }
  renderCal();
}
document.addEventListener('keydown', e => {
  if (!$('modal-ov').classList.contains('hidden') || !$('bday-ov').classList.contains('hidden') || !$('picker-ov').classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') prevMonth();
  if (e.key === 'ArrowRight') nextMonth();
});

/* ═══════════════ LOAD DATA ═══════════════ */
async function loadAndRender() {
  $('toast').classList.remove('hidden');
  const s = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-01`,
    last = daysIn(curYear, curMonth),
    e = `${curYear}-${String(curMonth + 1).padStart(2, '0')}-${last}`;
  calData = {};
  try {
    const {
      data: cal
    } = await sb.from('calendar_app_entries').select('entry_date,is_marked,mark_color,is_goal,note').eq('user_id', UID).gte('entry_date', s).lte('entry_date', e);
    const {
      data: diary
    } = await sb.from('calendar_app_diary').select('entry_date,content').eq('user_id', UID).gte('entry_date', s).lte('entry_date', e);
    (cal || []).forEach(r => {
      calData[r.entry_date] = {
        marked: r.is_marked,
        markColor: r.mark_color || 'red',
        isGoal: r.is_goal,
        note: r.note || '',
        diary: ''
      };
    });
    (diary || []).forEach(r => {
      if (!calData[r.entry_date]) calData[r.entry_date] = {
        marked: false,
        markColor: 'red',
        isGoal: false,
        note: '',
        diary: ''
      };
      calData[r.entry_date].diary = r.content || '';
    });
  } catch (err) {
    console.error('Load:', err);
  }
  $('toast').classList.add('hidden');
  renderCal();
}

/* ═══════════════ DAY MODAL ═══════════════ */
function buildCP() {
  const cpk = $('cpk');
  cpk.innerHTML = '';
  Object.entries(MC).forEach(([n, c]) => {
    const b = document.createElement('button');
    b.className = 'cdot' + (modalColor === n ? ' act' : '');
    b.style.background = c;
    b.onclick = () => {
      modalColor = n;
      buildCP();
    };
    cpk.appendChild(b);
  });
}
function toggleCP() {
  $('cpk').classList.toggle('hidden', !$('chk-mark').checked);
}
function setDiaryMood(m) {
  diaryMood = m;
  document.querySelectorAll('.diary-mood').forEach(b => b.classList.remove('act'));
  $('dm-' + m).classList.add('act');
  const ta = $('inp-diary');
  const pos = ta.selectionStart;
  let lineIdx = ta.value.substring(0, pos).split('\n').length - 1;
  while (diaryLineMoods.length <= lineIdx) diaryLineMoods.push({
    mood: 'neutral'
  });
  diaryLineMoods[lineIdx].mood = m;
  diaryPreviewUpdate();
}
function diaryPreviewUpdate() {
  const raw = $('inp-diary').value;
  const prev = $('diary-preview');
  if (!raw.trim()) {
    prev.innerHTML = '';
    return;
  }
  const lines = raw.split('\n');
  while (diaryLineMoods.length < lines.length) diaryLineMoods.push({
    mood: diaryMood
  });
  diaryLineMoods.length = lines.length;
  const ta = $('inp-diary');
  const curLine = ta.value.substring(0, ta.selectionStart).split('\n').length - 1;
  diaryLineMoods[curLine].mood = diaryMood;
  prev.innerHTML = lines.map((l, i) => {
    if (!l.trim()) return '';
    const m = diaryLineMoods[i]?.mood || 'neutral';
    const cls = 'dl-' + m;
    const dotColor = m === 'good' ? '#27ae60' : m === 'bad' ? '#e74c3c' : '#999';
    return `<div class="${cls}"><span class="dl-dot" style="background:${dotColor}"></span>${esc(l)}</div>`;
  }).join('');
}
function encodeDiary() {
  const raw = $('inp-diary').value;
  if (!raw.trim()) return '';
  return raw.split('\n').map((l, i) => {
    if (!l.trim()) return '';
    const m = diaryLineMoods[i]?.mood || 'neutral';
    if (m === 'good') return '+' + l;
    if (m === 'bad') return '-' + l;
    return '~' + l;
  }).filter(l => l).join('\n');
}
function decodeDiary(encoded) {
  if (!encoded) return {
    text: '',
    moods: []
  };
  const lines = encoded.split('\n');
  const text = [],
    moods = [];
  lines.forEach(l => {
    if (l.startsWith('+')) {
      moods.push({
        mood: 'good'
      });
      text.push(l.slice(1));
    } else if (l.startsWith('-')) {
      moods.push({
        mood: 'bad'
      });
      text.push(l.slice(1));
    } else if (l.startsWith('~')) {
      moods.push({
        mood: 'neutral'
      });
      text.push(l.slice(1));
    } else {
      moods.push({
        mood: 'neutral'
      });
      text.push(l);
    }
  });
  return {
    text: text.join('\n'),
    moods
  };
}
function diaryOverallMood(encoded) {
  if (!encoded) return null;
  const lines = encoded.split('\n');
  let g = 0,
    b = 0;
  lines.forEach(l => {
    if (l.startsWith('+')) g++;else if (l.startsWith('-')) b++;
  });
  if (g > 0 && b > 0) return 'mixed';
  if (g > 0) return 'good';
  if (b > 0) return 'bad';
  return null;
}
function openModal(key, data) {
  modalKey = key;
  const d = new Date(key + 'T00:00:00');
  $('m-title').textContent = `${d.getDate()} ${MO[d.getMonth()]}`;
  $('m-day').textContent = `${DN[d.getDay()]}, ${d.getFullYear()}`;
  const bdays = getBdaysForDate(d.getMonth(), d.getDate());
  if (bdays.length > 0) {
    const infos = bdays.map(b => {
      const bd = new Date(b.birth_date + 'T00:00:00');
      const yk = yearKnown(b);
      if (yk) {
        const age = calcAge(bd, d);
        return `🎂 <b>${esc(b.person_name)}</b> turns <b>${age}</b>`;
      }
      return `🎂 <b>${esc(b.person_name)}</b>'s birthday`;
    }).join('<br>');
    $('modal-bday-info').innerHTML = `<div class="bday-info" style="margin-bottom:12px">${infos}</div>`;
  } else {
    $('modal-bday-info').innerHTML = '';
  }
  const hol = getHoliday(key);
  if (hol) {
    $('modal-holiday-info').innerHTML = `<div class="bday-info" style="margin-bottom:12px;border-color:rgba(192,57,43,.25);background:linear-gradient(135deg,rgba(231,76,60,.08),rgba(241,196,15,.08))">🎌 <b>${esc(hol)}</b></div>`;
  } else {
    $('modal-holiday-info').innerHTML = '';
  }
  const wx = weatherData[key];
  if (wx) {
    $('modal-wx-info').innerHTML = `<div class="bday-info" style="margin-bottom:12px;border-color:rgba(52,152,219,.25);background:linear-gradient(135deg,rgba(52,152,219,.08),rgba(46,204,113,.08))">${wx.icon} <b>${wx.tMax}°C</b> / ${wx.tMin}°C</div>`;
  } else {
    $('modal-wx-info').innerHTML = '';
  }
  renderModalTasks(key);
  renderModalSukkiri(key);
  const dd = data || {};
  $('chk-mark').checked = dd.marked || false;
  $('chk-goal').checked = dd.isGoal || false;
  $('inp-note').value = dd.note || '';
  modalColor = dd.markColor || 'red';
  const decoded = decodeDiary(dd.diary || '');
  $('inp-diary').value = decoded.text;
  diaryLineMoods = decoded.moods;
  diaryMood = 'good';
  setDiaryMood('good');
  diaryPreviewUpdate();
  buildCP();
  toggleCP();
  $('modal-ov').classList.remove('hidden');
}
function closeModal() {
  $('modal-ov').classList.add('hidden');
  modalKey = null;
}
async function saveModal() {
  if (!modalKey) return;
  const key = modalKey;
  const encodedDiary = encodeDiary();
  const data = {
    marked: $('chk-mark').checked,
    markColor: modalColor,
    isGoal: $('chk-goal').checked,
    note: $('inp-note').value.trim(),
    diary: encodedDiary
  };
  const empty = !data.marked && !data.isGoal && !data.note && !data.diary;
  if (empty) delete calData[key];else calData[key] = data;
  closeModal();
  renderCal();
  try {
    if (data.marked || data.isGoal || data.note) {
      await sb.from('calendar_app_entries').upsert({
        user_id: UID,
        entry_date: key,
        is_marked: data.marked,
        mark_color: data.markColor,
        is_goal: data.isGoal,
        note: data.note || null
      }, {
        onConflict: 'user_id,entry_date'
      });
    } else {
      await sb.from('calendar_app_entries').delete().eq('user_id', UID).eq('entry_date', key);
    }
    if (data.diary) {
      await sb.from('calendar_app_diary').upsert({
        user_id: UID,
        entry_date: key,
        content: data.diary
      }, {
        onConflict: 'user_id,entry_date'
      });
    } else {
      await sb.from('calendar_app_diary').delete().eq('user_id', UID).eq('entry_date', key);
    }
  } catch (err) {
    console.error('Save:', err);
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeBdayManager();
    closePicker();
    closeSukkiri();
  }
});

/* ═══════════════ WEEKLY FOCUS TASKS ═══════════════ */
const TKS_KEY = 'calapp_task_style';
let tkStyle = {
  show: true,
  font: '',
  size: 9,
  cell: 9,
  weight: 400
};
try {
  Object.assign(tkStyle, JSON.parse(localStorage.getItem(TKS_KEY) || '{}'));
} catch (e) {}
const TK_FONTS = ['', 'Work Sans', 'Inter', 'DM Sans', 'Nunito', 'Source Sans 3', 'Chakra Petch', 'IBM Plex Mono', 'PT Serif', 'Caveat'];
function applyTkStyle() {
  document.body.style.setProperty('--tk-font', tkStyle.font ? `'${tkStyle.font}',sans-serif` : 'var(--b-font)');
  document.body.style.setProperty('--tk-size', tkStyle.size + 'px');
  document.body.style.setProperty('--tk-weight', tkStyle.weight);
  document.body.style.setProperty('--cell-fs', tkStyle.cell + 'px');
  document.body.style.setProperty('--cell-fs-sm', Math.max(4, tkStyle.cell - 1) + 'px');
}
function saveTkStyle() {
  try {
    localStorage.setItem(TKS_KEY, JSON.stringify(tkStyle));
  } catch (e) {}
  applyTkStyle();
}
let wfRows = {}; /* 'board||item_key' -> payload */
let wfNames = {}; /* item id -> name */
let wfTasks = [];
function wfLegacyId(t) {
  let s = String(t || ''),
    h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33 ^ s.charCodeAt(i)) >>> 0;
  }
  return 'l_' + h.toString(36);
}
async function loadWfTasks() {
  try {
    const {
      data: inv
    } = await sb.from('weekly_focus_inventory').select('apps,study,office').eq('user_id', UID);
    wfNames = {};
    (inv || []).forEach(r => ['apps', 'study', 'office'].forEach(k => (r[k] || []).forEach(it => {
      if (it && it.id) wfNames[it.id] = it.name || it.id;
    })));
    const {
      data: rows
    } = await sb.from('weekly_focus_entries').select('board_id,item_key,payload').eq('user_id', UID);
    wfRows = {};
    wfTasks = [];
    (rows || []).forEach(r => {
      wfRows[r.board_id + '||' + r.item_key] = r.payload || {};
      const p = r.payload || {};
      if (r.item_key === '__board') return;
      if (r.item_key === '__timeline') {
        (Array.isArray(p.notes) ? p.notes : []).forEach(n => {
          if (!n || !n.t) return;
          wfTasks.push({
            kind: 'note',
            board: r.board_id,
            itemKey: r.item_key,
            sid: n.id,
            text: n.t,
            date: (n.ts || '').slice(0, 10),
            time: (n.ts || '').length > 10 ? n.ts.slice(11, 16) : '',
            done: !!n.done,
            src: 'Note' + (n.loc ? ' · ' + n.loc : ''),
            urg: false
          });
        });
        return;
      }
      if (r.item_key === '__inbox') {
        (Array.isArray(p.items) ? p.items : []).forEach(n => {
          if (!n || !n.t) return;
          wfTasks.push({
            kind: 'inbox',
            board: r.board_id,
            itemKey: r.item_key,
            sid: n.id,
            text: n.t,
            date: (n.day || '').slice(0, 10),
            time: '',
            done: !!n.done,
            src: 'Inbox' + (n.loc ? ' · ' + n.loc : ''),
            urg: false
          });
        });
        return;
      }
      const active = p.active === true;
      (Array.isArray(p.subtasks) ? p.subtasks : []).forEach(s => {
        if (!s || s.del || !s.t) return;
        const when = s.when || '';
        if (!when && !active) return; /* undated tasks only from active items */
        wfTasks.push({
          kind: 'sub',
          board: r.board_id,
          itemKey: r.item_key,
          sid: s.id || wfLegacyId(s.t),
          text: s.t,
          date: when.slice(0, 10),
          time: when.length > 10 ? when.slice(11, 16) : '',
          done: !!s.done,
          src: (wfNames[r.item_key] || r.item_key.replace(/^(app|study|office):/, '')) + (s.loc ? ' · ' + s.loc : ''),
          urg: !!s.urg
        });
      });
    });
  } catch (e) {
    console.warn('WF tasks load failed:', e);
  }
}
function tasksOn(key) {
  return wfTasks.filter(t => t.date === key);
}
function tasksUndated() {
  return wfTasks.filter(t => !t.date);
}
function tkRow(t) {
  const a = s => esc(String(s == null ? '' : s)).replace(/"/g, '&quot;');
  return `<div class="tk-row${t.done ? ' done' : ''}"><button class="tk-chk${t.done ? ' on' : ''}" data-tk-kind="${a(t.kind)}" data-tk-board="${a(t.board)}" data-tk-item="${a(t.itemKey)}" data-tk-sid="${a(t.sid)}">${t.done ? '✓' : ''}</button><span class="tk-t">${t.urg ? '<span class="tk-urgflag">⚑ </span>' : ''}${esc(t.text)}${t.time ? ' <b>· ' + t.time + '</b>' : ''}</span><span class="tk-src">${esc(t.src)}</span></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('.tk-chk');
  if (!b || b.dataset.tkSid === undefined) return;
  e.stopPropagation();
  e.preventDefault();
  toggleWfTask(b.dataset.tkKind, b.dataset.tkBoard, b.dataset.tkItem, b.dataset.tkSid);
}, true);
async function toggleWfTask(kind, board, itemKey, sid) {
  const t = wfTasks.find(x => x.kind === kind && x.board === board && x.itemKey === itemKey && x.sid === sid);
  if (!t) return;
  t.done = !t.done;
  const rk = board + '||' + itemKey,
    p = Object.assign({}, wfRows[rk]);
  if (kind === 'sub') p.subtasks = (p.subtasks || []).map(x => {
    if (!x) return x;
    const xid = x.id || wfLegacyId(x.t);
    return xid === sid ? Object.assign({}, x, {
      done: t.done,
      u: Date.now()
    }) : x;
  });else if (kind === 'note') p.notes = (p.notes || []).map(x => x && x.id === sid ? Object.assign({}, x, {
    done: t.done
  }) : x);else p.items = (p.items || []).map(x => x && x.id === sid ? Object.assign({}, x, {
    done: t.done
  }) : x);
  wfRows[rk] = p;
  renderCal();
  renderNoDate();
  if (modalKey) renderModalTasks(modalKey);
  try {
    await sb.from('weekly_focus_entries').upsert({
      user_id: UID,
      board_id: board,
      item_key: itemKey,
      payload: p,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,board_id,item_key'
    });
  } catch (e) {
    console.error('Task sync:', e);
    flashToast('⚠️ Sync failed');
  }
}
function renderModalTasks(key) {
  const el = $('modal-tasks');
  if (!el) return;
  const tks = tasksOn(key);
  el.innerHTML = tks.length ? `<div class="msec"><span class="msec-t">📋 Weekly Focus tasks</span>${tks.map(tkRow).join('')}</div>` : '';
}
function renderNoDate() {
  const el = $('nd-panel');
  if (!el) return;
  const list = tasksUndated();
  if (!tkStyle.show || !list.length) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  const open = list.filter(t => !t.done),
    done = list.filter(t => t.done);
  el.innerHTML = `<h3>📋 No date yet</h3><div class="nd-sub">Undated tasks from Weekly Focus — give them a date there, or tick them off here.</div><div class="nd-list">${open.concat(done).map(tkRow).join('')}</div>`;
}
function flashToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => {
    t.classList.add('hidden');
    t.textContent = 'Loading...';
  }, 1400);
}
function buildTaskDD() {
  const dd = $('task-dd');
  if (!dd) return;
  dd.innerHTML = `<button class="dd-opt" id="tk-show">${tkStyle.show ? '✅' : '⬜'} Show tasks on calendar</button>
<button class="dd-opt" id="tk-refresh">↻ Refresh from Weekly Focus</button>
<div class="dd-div"></div>
<div style="padding:6px 12px 2px;font-size:11px;color:var(--txt2);font-weight:700;letter-spacing:.5px">TASK TEXT</div>
<div style="padding:4px 12px"><select id="tk-font" style="width:100%;padding:6px;border:1.5px solid var(--border);border-radius:8px;background:var(--input-bg);color:var(--txt);font-family:var(--b-font)">${TK_FONTS.map(f => `<option value="${f}"${tkStyle.font === f ? ' selected' : ''}>${f || 'Theme font'}</option>`).join('')}</select></div>
<div style="display:flex;align-items:center;gap:8px;padding:4px 12px;font-size:12px;color:var(--txt)"><span>Size</span><input type="range" id="tk-size" min="4" max="16" step="0.5" value="${tkStyle.size}" style="flex:1;accent-color:var(--accent)"><b id="tk-size-v" style="min-width:38px;text-align:right">${tkStyle.size}px</b></div>
<div style="display:flex;gap:4px;padding:4px 12px 8px">${[[400, 'Regular'], [600, 'Semibold'], [700, 'Bold']].map(w => `<button class="dd-opt" data-tkw="${w[0]}" style="flex:1;justify-content:center;padding:5px;${tkStyle.weight == w[0] ? 'background:rgba(128,128,128,.18);font-weight:700' : ''}">${w[1]}</button>`).join('')}</div>
<div class="dd-div"></div>
<div style="padding:6px 12px 2px;font-size:11px;color:var(--txt2);font-weight:700;letter-spacing:.5px">NOTE / DIARY / BIRTHDAY TEXT</div>
<div style="display:flex;align-items:center;gap:8px;padding:4px 12px 8px;font-size:12px;color:var(--txt)"><span>Size</span><input type="range" id="tk-cell" min="4" max="14" step="0.5" value="${tkStyle.cell}" style="flex:1;accent-color:var(--accent)"><b id="tk-cell-v" style="min-width:38px;text-align:right">${tkStyle.cell}px</b></div>`;
  $('tk-show').onclick = () => {
    tkStyle.show = !tkStyle.show;
    saveTkStyle();
    renderCal();
    renderNoDate();
    buildTaskDD();
  };
  $('tk-refresh').onclick = async () => {
    await loadWfTasks();
    renderCal();
    renderNoDate();
    flashToast('Tasks refreshed');
  };
  $('tk-font').onchange = e => {
    tkStyle.font = e.target.value;
    saveTkStyle();
  };
  $('tk-size').oninput = e => {
    tkStyle.size = +e.target.value;
    $('tk-size-v').textContent = tkStyle.size + 'px';
    saveTkStyle();
  };
  $('tk-cell').oninput = e => {
    tkStyle.cell = +e.target.value;
    $('tk-cell-v').textContent = tkStyle.cell + 'px';
    saveTkStyle();
  };
  dd.querySelectorAll('[data-tkw]').forEach(b => b.onclick = () => {
    tkStyle.weight = +b.dataset.tkw;
    saveTkStyle();
    buildTaskDD();
  });
}
function printTaskSheet() {
  $('pr-opts').classList.remove('open');
  const pref = curYear + '-' + String(curMonth + 1).padStart(2, '0');
  const days = {};
  wfTasks.forEach(t => {
    if (t.date && t.date.startsWith(pref)) (days[t.date] = days[t.date] || []).push(t);
  });
  const und = tasksUndated();
  let h = '<div class="ts-h"><div class="ts-mo">' + MO[curMonth] + ' ' + curYear + ' — Tasks</div><div class="ts-sub">Weekly Focus · printed ' + new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + '</div></div>';
  const keys = Object.keys(days).sort();
  if (!keys.length && !und.length) h += '<div style="font-size:13px;color:#666">No tasks this month.</div>';
  h += '<div class="ts-cols">';
  keys.forEach(k => {
    const d = new Date(k + 'T00:00:00');
    h += '<div class="ts-daywrap"><div class="ts-day">' + d.getDate() + ' ' + MO[d.getMonth()].slice(0, 3) + ' <span class="ts-dw">' + DN[d.getDay()].slice(0, 3) + '</span></div>';
    days[k].sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0) || (a.time || '').localeCompare(b.time || ''));
    days[k].forEach(t => {
      h += '<div class="ts-row' + (t.done ? ' done' : '') + '"><span class="ts-box"></span><span>' + (t.urg ? '⚑ ' : '') + esc(t.text) + (t.time ? ' · ' + t.time : '') + '</span><span class="ts-meta">' + esc(t.src) + '</span></div>';
    });
    h += '</div>';
  });
  h += '</div>';
  if (und.length) h += '<div class="ts-nd"><div class="ts-day">No date yet</div><div class="ts-cols">' + und.map(t => '<div class="ts-row' + (t.done ? ' done' : '') + '"><span class="ts-box"></span><span>' + esc(t.text) + '</span><span class="ts-meta">' + esc(t.src) + '</span></div>').join('') + '</div></div>';
  const ps = $('print-sheet');
  ps.classList.add('tsheet');
  ps.innerHTML = h;
  const prevTheme = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', '14');
  window.print();
  document.body.setAttribute('data-theme', prevTheme);
  ps.classList.remove('tsheet');
}

/* ═══════════════ BOOT ═══════════════ */
async function bootApp() {
  await Promise.allSettled([loadThemePref(), loadBirthdays(), loadWeather(), refreshHolidays(), loadWfTasks(), loadSukkiri()]);
  skOccCache.from = '';
  applyTheme(activeTheme());
  buildTaskDD();
  await loadAndRender();
  renderNoDate();
  console.log('✅ Calendar ready — user:', UID);
}
document.addEventListener('DOMContentLoaded', async () => {
  // Populate day/month dropdowns
  const daySel = $('bday-day'),
    monSel = $('bday-month');
  for (let i = 1; i <= 31; i++) {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = i;
    daySel.appendChild(o);
  }
  MO.forEach((m, i) => {
    const o = document.createElement('option');
    o.value = i + 1;
    o.textContent = m;
    monSel.appendChild(o);
  });

  // Apply default theme immediately (looks nice on login screen too)
  applyTheme(autoTheme());
  applyTkStyle();

  // Check if already logged in
  const {
    data: {
      session
    }
  } = await sb.auth.getSession();
  if (session) {
    UID = session.user.id;
    hideLoginScreen();
    await bootApp();
  } else {
    showLoginScreen();
  }

  // Listen for future auth changes (login / logout)
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      UID = session.user.id;
      hideLoginScreen();
      await bootApp();
    } else if (event === 'SIGNED_OUT') {
      UID = null;
      calData = {};
      birthdays = {};
      showLoginScreen();
    }
  });
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app_update/js/app.js", error: String((e && e.message) || e) }); }

// app_update/js/sukkiri.js
try { (() => {
/* ═══════════════ SUKKIRI — garbage days + cleaning cycles ═══════════════
   Sukkiri owns the ideal rules (shiyakusho garbage categories, cleaning intervals).
   The calendar owns the practical data (urgent tasks, away days) and applies them. */
const SK_KEY = 'calapp_sukkiri';
const SK_WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SK_COLORS = ['#c0392b', '#e67e22', '#2980b9', '#27ae60', '#8e44ad', '#16a085', '#7f8c8d'];
/* Monochrome glyphs — tinted with each category's colour, drawn as the cell watermark. */
const SK_ICONS = {
  flame: '<path d="M12 2c3.2 4.2 6 6.3 6 10.2A6 6 0 1 1 6 12.2c0-2 .9-3.3 2.2-4.5 0 2 .8 3.1 1.8 3.1s1.5-1 1.5-3.1S10.6 4.2 12 2z"/>',
  recycle: '<g><path d="M12 2.6l3.2 5.5H8.8L12 2.6z"/><path d="M5.2 21.4l-3.2-5.5 5.5-3.2 3.2 5.5-5.5 3.2z" opacity=".85"/><path d="M18.8 21.4l-5.5-3.2 3.2-5.5 5.5 3.2-3.2 5.5z" opacity=".7"/></g>',
  bottle: '<path d="M10 2h4v2.6l1.9 3.1a3 3 0 0 1 .4 1.5V20a2 2 0 0 1-2 2h-4.6a2 2 0 0 1-2-2V9.2c0-.5.1-1 .4-1.5L10 4.6V2zm-.4 8.6h4.8v2.2H9.6v-2.2z"/>',
  can: '<path d="M7 5.2c0-1.2 2.2-2.2 5-2.2s5 1 5 2.2v13.6c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2V5.2zm1.6 2.4v2h6.8v-2H8.6z"/>',
  paper: '<path d="M6 2h7l5 5v15H6V2zm7 1.6V7h3.4L13 3.6zM8.4 10.4h7.2V12H8.4v-1.6zm0 3.4h7.2v1.6H8.4v-1.6zm0 3.4h4.8V19H8.4v-1.8z"/>',
  trash: '<path d="M9 2.6h6v2h4.4v2H4.6v-2H9v-2zM6 8.6h12l-1.1 12.2a1.4 1.4 0 0 1-1.4 1.2H8.5a1.4 1.4 0 0 1-1.4-1.2L6 8.6z"/>',
  leaf: '<path d="M21 3c-9.4 0-17 4.4-17 11.6 0 1.3.3 2.4.9 3.3L14 8.8l-8.4 10.6c.9.7 2 1 3.3 1C16.4 20.4 21 12.6 21 3z"/>',
  box: '<path d="M12 2.2l9 4.3v11l-9 4.3-9-4.3v-11l9-4.3zm0 2.3L5.6 7.5 12 10.5l6.4-3L12 4.5z"/>',
  battery: '<path d="M9 2h6v2.2h2.6V22H6.4V4.2H9V2zm-.6 6.4v2h7.2v-2H8.4z"/>',
  glass: '<path d="M5 2.6h14L17 11l-4 3.4V19h3v2.4H8V19h3v-4.6L7 11 5 2.6zm2.6 2.4l.8 3.4h7.2l.8-3.4H7.6z"/>'
};
const SK_ICON_IDS = Object.keys(SK_ICONS);
function skIconSvg(id, color, extra) {
  const p = SK_ICONS[id];
  if (!p) return '';
  return `<svg viewBox="0 0 24 24" ${extra || ''} style="fill:${color || 'currentColor'}">${p}</svg>`;
}
function skDefaults() {
  const anchor = skNextDow(0);
  return {
    show: true,
    wm: true,
    block: {
      urg: true,
      any: false,
      away: true,
      hol: false
    },
    garbage: [{
      id: 'g1',
      label: 'Burnable',
      short: '燃 BURN',
      icon: 'flame',
      days: [1, 4],
      weeks: [],
      color: '#c0392b'
    }, {
      id: 'g2',
      label: 'Plastic',
      short: 'プラ PLA',
      icon: 'recycle',
      days: [2],
      weeks: [],
      color: '#e67e22'
    }, {
      id: 'g3',
      label: 'Cans · Bottles · PET',
      short: '缶 びん PET',
      icon: 'can',
      days: [3],
      weeks: [],
      color: '#2980b9'
    }, {
      id: 'g4',
      label: 'Paper',
      short: '紙 PAPER',
      icon: 'paper',
      days: [5],
      weeks: [2, 4],
      color: '#27ae60'
    }, {
      id: 'g5',
      label: 'Non-burnable',
      short: '不燃 NON',
      icon: 'trash',
      days: [5],
      weeks: [1, 3],
      color: '#7f8c8d'
    }],
    cycles: [{
      id: 'c1',
      name: 'Bathroom deep clean',
      every: 14,
      anchor,
      color: '#8e44ad'
    }, {
      id: 'c2',
      name: 'Fridge & kitchen',
      every: 28,
      anchor,
      color: '#16a085'
    }],
    overrides: {},
    done: {},
    away: []
  };
}
function skNextDow(dow) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + (dow - d.getDay() + 7) % 7);
  return skKey(d);
}
function skKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function skDate(k) {
  return new Date(k + 'T00:00:00');
}
function skAdd(k, n) {
  const d = skDate(k);
  d.setDate(d.getDate() + n);
  return skKey(d);
}
function skId() {
  return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
let sk = skDefaults();
/* Older saved data has no icon/colour — infer a mark from the label so watermarks stay iconographic. */
function skMigrate() {
  const guess = s => {
    s = (s || '').toLowerCase();
    if (/burn|燃|combust/.test(s) && !/non|不/.test(s)) return 'flame';
    if (/non.?burn|不燃/.test(s)) return 'trash';
    if (/plastic|プラ|recycl/.test(s)) return 'recycle';
    if (/can|缶|bottle|pet|びん/.test(s)) return 'can';
    if (/paper|紙|card/.test(s)) return 'paper';
    if (/glass|ガラス/.test(s)) return 'glass';
    if (/batter|電池|small metal/.test(s)) return 'battery';
    if (/garden|leaf|green|草/.test(s)) return 'leaf';
    if (/large|bulky|粗大/.test(s)) return 'box';
    return 'bottle';
  };
  (sk.garbage || []).forEach(g => {
    if (!g.icon || !SK_ICONS[g.icon]) g.icon = guess(g.label || g.short);
  });
  (sk.cycles || []).forEach((c, i) => {
    if (!c.color) c.color = SK_COLORS[(i + 4) % SK_COLORS.length];
  });
}
try {
  const s = JSON.parse(localStorage.getItem(SK_KEY) || 'null');
  if (s) sk = Object.assign(skDefaults(), s);
} catch (e) {}
skMigrate();
async function loadSukkiri() {
  try {
    const {
      data
    } = await sb.from('calendar_app_sukkiri').select('payload').eq('user_id', UID).maybeSingle();
    if (data && data.payload) {
      sk = Object.assign(skDefaults(), data.payload);
      skMigrate();
      localStorage.setItem(SK_KEY, JSON.stringify(sk));
    }
  } catch (e) {/* table optional — localStorage is the fallback */}
}
async function saveSukkiri() {
  try {
    localStorage.setItem(SK_KEY, JSON.stringify(sk));
  } catch (e) {}
  if (typeof renderCal === 'function') renderCal();
  try {
    await sb.from('calendar_app_sukkiri').upsert({
      user_id: UID,
      payload: sk,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });
  } catch (e) {}
}

/* ── garbage ── */
function skGarbageOn(key) {
  const d = skDate(key),
    dow = d.getDay(),
    nth = Math.ceil(d.getDate() / 7);
  return sk.garbage.filter(g => g.days.includes(dow) && (!g.weeks.length || g.weeks.includes(nth)));
}

/* ── blocked days (the practical data) ── */
function skIsAway(key) {
  return sk.away.includes(key);
}
function skBlockedReason(key) {
  const r = [];
  if (sk.block.away && skIsAway(key)) r.push('away');
  const tks = typeof tasksOn === 'function' ? tasksOn(key) : [];
  if (sk.block.urg && tks.some(t => t.urg && !t.done)) r.push('urgent task');else if (sk.block.any && tks.some(t => !t.done)) r.push('task');
  if (sk.block.hol && typeof getHoliday === 'function' && getHoliday(key)) r.push('holiday');
  return r.join(' + ');
}

/* ── cleaning occurrences ──
   due = ideal date from the cycle. If blocked and no manual choice → auto 1 week EARLIER.
   Manual options (kept): due / earlier / later / skip. */
function skOccurrences(fromKey, toKey) {
  const out = [];
  sk.cycles.forEach(c => {
    if (!c.anchor || !c.every) return;
    let due = c.anchor;
    /* rewind so we start before the window */
    while (skAdd(due, 0) > fromKey) due = skAdd(due, -c.every);
    for (let i = 0; i < 200 && due <= toKey; i++, due = skAdd(due, c.every)) {
      const ok = c.id + '|' + due,
        ov = sk.overrides[ok];
      let at = due,
        mode = 'due',
        reason = skBlockedReason(due);
      if (ov === 'skip') {
        mode = 'skip';
      } else if (ov === 'before') {
        at = skAdd(due, -7);
        mode = 'before';
      } else if (ov === 'after') {
        at = skAdd(due, 7);
        mode = 'after';
      } else if (ov === 'due') {
        mode = 'due';
      } else if (reason) {
        at = skAdd(due, -7);
        mode = 'auto';
      }
      out.push({
        cycle: c,
        due,
        at,
        mode,
        reason,
        key: ok,
        done: !!sk.done[ok],
        manual: !!ov
      });
    }
  });
  return out;
}
let skOccCache = {
  from: '',
  to: '',
  list: []
};
function skOccFor(key) {
  const mk = key.slice(0, 7);
  if (skOccCache.from !== mk) {
    const from = skAdd(mk + '-01', -21),
      to = skAdd(mk + '-28', +35);
    skOccCache = {
      from: mk,
      list: skOccurrences(from, to)
    };
  }
  return skOccCache.list.filter(o => o.mode !== 'skip' && o.at === key);
}
function skGhostFor(key) {
  return skOccCache.list.filter(o => o.mode !== 'due' && o.mode !== 'skip' && o.due === key);
}

/* ── cell rendering (called from renderCal) ── */
function skCellHtml(key) {
  if (!sk.show) return '';
  let h = '';
  const gs = skGarbageOn(key);
  if (sk.wm && gs.length) {
    h += `<div class="sk-wm${gs.length > 1 ? ' multi' : ''}" aria-hidden="true" title="${esc(gs.map(g => g.label).join(' · '))}">${gs.map(g => g.icon && SK_ICONS[g.icon] ? skIconSvg(g.icon, g.color) : `<span style="color:${g.color}">${esc(g.short || g.label)}</span>`).join('')}</div>`;
  }
  if (skIsAway(key)) h += '<span class="sk-away" title="Away — cleaning phases avoid this day">✈</span>';
  return h;
}
/* ── clash detection: an open task sitting on a day a cleaning phase lands on ── */
function skClashTasks(key) {
  const t = typeof tasksOn === 'function' ? tasksOn(key) : [];
  return t.filter(x => !x.done);
}
/* flags for the calendar cell (colour-code + clash ring) */
function skCellFlags(key) {
  if (!sk.show) return null;
  const occ = skOccFor(key);
  if (!occ.length) return null;
  const pend = occ.filter(o => !o.done);
  const tks = pend.length ? skClashTasks(key) : [];
  return {
    color: occ[0].cycle.color || '#8e44ad',
    clash: tks.length > 0,
    urg: tks.some(t => t.urg),
    tasks: tks,
    names: pend.map(o => o.cycle.name)
  };
}
function skCellBodyHtml(key) {
  if (!sk.show) return '';
  skOccFor(key); /* warms cache */
  let h = '';
  const clash = skClashTasks(key);
  skOccFor(key).forEach(o => {
    const c = o.cycle.color || '#8e44ad';
    const cl = !o.done && clash.length;
    const tag = o.mode === 'due' ? '' : `<b class="sk-shift">${o.mode === 'after' ? '+1w' : '−1w'}</b>`;
    const ttl = `${o.cycle.name} · every ${o.cycle.every} days${o.reason ? ' · blocked on ' + o.due + ' (' + o.reason + ')' : ''}${cl ? ' — CLASHES with ' + clash.length + ' open task' + (clash.length > 1 ? 's' : '') + ': ' + clash.map(t => t.text).join(', ') : ''}`;
    h += `<div class="sk-cy${o.done ? ' done' : ''}${o.mode !== 'due' ? ' moved' : ''}${cl ? ' clash' : ''}" style="--sk-c:${c}" title="${esc(ttl)}">${cl ? '<b class="sk-cw">⚠</b>' : '<i class="sk-dot"></i>'}<span>${esc(o.cycle.name)}</span>${tag}</div>`;
  });
  skGhostFor(key).forEach(o => {
    h += `<div class="sk-ghost" style="--sk-c:${o.cycle.color || '#8e44ad'}" title="Originally due here — moved (${esc(o.reason || 'manual')})"><span>${esc(o.cycle.name)}</span></div>`;
  });
  return h;
}

/* ── day modal section ── */
function renderModalSukkiri(key) {
  const el = $('modal-sukkiri');
  if (!el) return;
  const gs = skGarbageOn(key),
    occ = skOccFor(key),
    ghost = skGhostFor(key),
    away = skIsAway(key),
    reason = skBlockedReason(key);
  let h = '<div class="msec sk-sec"><span class="msec-t">🧹 Sukkiri</span>';
  h += `<div class="sk-line">🗑 ${gs.length ? gs.map(g => `<span class="sk-gtag" style="border-color:${g.color};color:${g.color}">${esc(g.label)}</span>`).join('') : '<span class="sk-dim">No collection today</span>'}</div>`;
  h += `<label class="cbl sk-awaycb"><input type="checkbox" id="sk-away-chk"${away ? ' checked' : ''}><span>✈️ I'm away / not in the city</span></label>`;
  if (reason) h += `<div class="sk-warn">⚠ Blocked day (${esc(reason)}) — cleaning due here moves 1 week earlier unless you choose otherwise.</div>`;
  const clash = occ.filter(o => !o.done).length ? skClashTasks(key) : [];
  if (clash.length) h += `<div class="sk-clashbox${clash.some(t => t.urg) ? ' urg' : ''}"><div class="sk-clashbox-h">⚠ Clash — cleaning lands on a day with ${clash.length} open task${clash.length > 1 ? 's' : ''}</div><div class="sk-clashbox-l">${clash.map(t => `<span class="sk-ctag${t.urg ? ' urg' : ''}">${t.urg ? '⚑ ' : ''}${esc(t.text)}${t.time ? ' · ' + esc(t.time) : ''}</span>`).join('')}</div><div class="sk-clashbox-f">Move the phase below so you don't miss it.</div></div>`;
  occ.concat(ghost.filter(g => g.at !== key)).forEach(o => {
    const here = o.at === key;
    h += `<div class="sk-occ${o.done ? ' done' : ''}"><div class="sk-occ-h"><b>${esc(o.cycle.name)}</b><span class="sk-dim">every ${o.cycle.every}d · due ${o.due.slice(5)}${o.mode === 'auto' ? ' · auto-moved earlier (' + esc(o.reason) + ')' : o.mode === 'before' ? ' · moved earlier' : o.mode === 'after' ? ' · moved later' : ''}${here ? '' : ' · now on ' + o.at.slice(5)}</span></div>
<div class="sk-occ-b">
<button class="sk-b${o.done ? ' on' : ''}" data-sk-done="${o.key}">${o.done ? '✓ Done' : 'Mark done'}</button>
<button class="sk-b${o.mode === 'before' || o.mode === 'auto' ? ' on' : ''}" data-sk-ov="${o.key}" data-v="before">← 1 week earlier</button>
<button class="sk-b${o.mode === 'due' ? ' on' : ''}" data-sk-ov="${o.key}" data-v="due">Keep due date</button>
<button class="sk-b${o.mode === 'after' ? ' on' : ''}" data-sk-ov="${o.key}" data-v="after">1 week later →</button>
<button class="sk-b sk-skip" data-sk-ov="${o.key}" data-v="skip">Skip once</button>
</div></div>`;
  });
  h += '</div>';
  el.innerHTML = h;
  $('sk-away-chk').onchange = e => {
    if (e.target.checked) {
      if (!sk.away.includes(key)) sk.away.push(key);
    } else sk.away = sk.away.filter(k => k !== key);
    skOccCache.from = '';
    saveSukkiri();
    renderModalSukkiri(key);
  };
  el.querySelectorAll('[data-sk-done]').forEach(b => b.onclick = () => {
    const k = b.dataset.skDone;
    if (sk.done[k]) delete sk.done[k];else sk.done[k] = true;
    skOccCache.from = '';
    saveSukkiri();
    renderModalSukkiri(key);
  });
  el.querySelectorAll('[data-sk-ov]').forEach(b => b.onclick = () => {
    const k = b.dataset.skOv,
      v = b.dataset.v;
    if (v === 'skip' && !confirm('Skip this cleaning phase once?')) return;
    sk.overrides[k] = v;
    skOccCache.from = '';
    saveSukkiri();
    renderModalSukkiri(key);
  });
}

/* ── settings overlay ── */
function openSukkiri() {
  $('sk-ov').classList.remove('hidden');
  renderSukkiriSettings();
}
function closeSukkiri() {
  const o = $('sk-ov');
  if (o) o.classList.add('hidden');
}
function renderSukkiriSettings() {
  const ov = $('sk-ov');
  const wdBtns = g => [1, 2, 3, 4, 5, 6, 0].map(d => `<button class="sk-chip${g.days.includes(d) ? ' on' : ''}" data-gd="${g.id}" data-d="${d}">${SK_WD[d]}</button>`).join('');
  const wkBtns = g => [1, 2, 3, 4, 5].map(w => `<button class="sk-chip sm${g.weeks.includes(w) ? ' on' : ''}" data-gw="${g.id}" data-w="${w}">${w}</button>`).join('');
  let h = `<div class="modal sk-modal" onclick="event.stopPropagation()"><button class="modal-x" onclick="closeSukkiri()">✕</button>
<h2>🧹 Sukkiri</h2><p>Shiyakusho garbage rules + ideal cleaning cycles. The calendar applies your real week to them.</p>
<div class="sk-row"><label class="cbl"><input type="checkbox" id="sk-show"${sk.show ? ' checked' : ''}><span>Show on calendar</span></label><label class="cbl"><input type="checkbox" id="sk-wm"${sk.wm ? ' checked' : ''}><span>Garbage watermark</span></label></div>
<div class="msec"><span class="msec-t">🗑 Garbage collection</span><div class="sk-dim" style="margin-bottom:8px">Pick weekdays. Leave week numbers empty for every week, or choose e.g. 2 + 4 for 2nd & 4th.</div>`;
  const icBtns = g => SK_ICON_IDS.map(i => `<button class="sk-ic${g.icon === i ? ' on' : ''}" data-gi="${g.id}" data-i="${i}" title="${i}">${skIconSvg(i, g.icon === i ? g.color : 'currentColor')}</button>`).join('');
  sk.garbage.forEach(g => {
    h += `<div class="sk-g"><div class="sk-g-h"><input class="sk-in" data-gl="${g.id}" value="${esc(g.label)}" placeholder="Category"><input type="color" data-gc="${g.id}" value="${g.color}" title="Colour"><button class="sk-del" data-gx="${g.id}" title="Remove">✕</button></div><div class="sk-chips sk-ics"><span class="sk-dim" style="margin-right:4px">mark</span>${icBtns(g)}</div><div class="sk-chips">${wdBtns(g)}</div><div class="sk-chips"><span class="sk-dim" style="margin-right:4px">week</span>${wkBtns(g)}</div></div>`;
  });
  h += `<button class="sk-add" id="sk-gadd">+ Add category</button></div>
<div class="msec"><span class="msec-t">🧹 Cleaning cycles</span><div class="sk-dim" style="margin-bottom:8px">Anchor = the day the cycle starts counting from. Blocked days auto-move the phase one week earlier.</div>`;
  sk.cycles.forEach(c => {
    h += `<div class="sk-c"><input type="color" data-cc="${c.id}" value="${c.color || '#8e44ad'}" title="Colour"><input class="sk-in" data-cn="${c.id}" value="${esc(c.name)}" placeholder="What to clean"><span class="sk-dim">every</span><input class="sk-in sk-in-n" type="number" min="1" max="365" data-ce="${c.id}" value="${c.every}"><span class="sk-dim">days from</span><input class="sk-in" type="date" data-ca="${c.id}" value="${c.anchor}"><button class="sk-del" data-cx="${c.id}" title="Remove">✕</button></div>`;
  });
  h += `<button class="sk-add" id="sk-cadd">+ Add cycle</button></div>
<div class="msec"><span class="msec-t">⚠ What counts as a blocked day</span><div class="sk-row sk-wrap">
<label class="cbl"><input type="checkbox" data-bk="urg"${sk.block.urg ? ' checked' : ''}><span>⚑ Urgent task</span></label>
<label class="cbl"><input type="checkbox" data-bk="any"${sk.block.any ? ' checked' : ''}><span>Any open task</span></label>
<label class="cbl"><input type="checkbox" data-bk="away"${sk.block.away ? ' checked' : ''}><span>✈️ Away day</span></label>
<label class="cbl"><input type="checkbox" data-bk="hol"${sk.block.hol ? ' checked' : ''}><span>🎌 Holiday</span></label></div></div>
<button class="btn-save" onclick="closeSukkiri()">Done</button></div>`;
  ov.innerHTML = h;
  const commit = () => {
    skOccCache.from = '';
    saveSukkiri();
  };
  $('sk-show').onchange = e => {
    sk.show = e.target.checked;
    commit();
  };
  $('sk-wm').onchange = e => {
    sk.wm = e.target.checked;
    commit();
  };
  ov.querySelectorAll('[data-bk]').forEach(i => i.onchange = () => {
    sk.block[i.dataset.bk] = i.checked;
    commit();
  });
  const gById = id => sk.garbage.find(g => g.id === id),
    cById = id => sk.cycles.find(c => c.id === id);
  ov.querySelectorAll('[data-gl]').forEach(i => i.oninput = () => {
    gById(i.dataset.gl).label = i.value;
    commit();
  });
  ov.querySelectorAll('[data-gc]').forEach(i => i.oninput = () => {
    gById(i.dataset.gc).color = i.value;
    commit();
  });
  ov.querySelectorAll('[data-cc]').forEach(i => i.oninput = () => {
    cById(i.dataset.cc).color = i.value;
    commit();
  });
  ov.querySelectorAll('[data-gi]').forEach(b => b.onclick = () => {
    const g = gById(b.dataset.gi);
    g.icon = g.icon === b.dataset.i ? '' : b.dataset.i;
    commit();
    renderSukkiriSettings();
  });
  ov.querySelectorAll('[data-gd]').forEach(b => b.onclick = () => {
    const g = gById(b.dataset.gd),
      d = +b.dataset.d;
    g.days = g.days.includes(d) ? g.days.filter(x => x !== d) : g.days.concat(d);
    commit();
    renderSukkiriSettings();
  });
  ov.querySelectorAll('[data-gw]').forEach(b => b.onclick = () => {
    const g = gById(b.dataset.gw),
      w = +b.dataset.w;
    g.weeks = g.weeks.includes(w) ? g.weeks.filter(x => x !== w) : g.weeks.concat(w).sort();
    commit();
    renderSukkiriSettings();
  });
  ov.querySelectorAll('[data-gx]').forEach(b => b.onclick = () => {
    sk.garbage = sk.garbage.filter(g => g.id !== b.dataset.gx);
    commit();
    renderSukkiriSettings();
  });
  $('sk-gadd').onclick = () => {
    sk.garbage.push({
      id: skId(),
      label: '',
      short: '',
      icon: SK_ICON_IDS[sk.garbage.length % SK_ICON_IDS.length],
      days: [],
      weeks: [],
      color: SK_COLORS[sk.garbage.length % SK_COLORS.length]
    });
    commit();
    renderSukkiriSettings();
    const last = ov.querySelectorAll('[data-gl]');
    last[last.length - 1].focus();
  };
  ov.querySelectorAll('[data-cn]').forEach(i => i.oninput = () => {
    cById(i.dataset.cn).name = i.value;
    commit();
  });
  ov.querySelectorAll('[data-ce]').forEach(i => i.onchange = () => {
    cById(i.dataset.ce).every = Math.max(1, +i.value || 1);
    commit();
  });
  ov.querySelectorAll('[data-ca]').forEach(i => i.onchange = () => {
    cById(i.dataset.ca).anchor = i.value;
    commit();
  });
  ov.querySelectorAll('[data-cx]').forEach(b => b.onclick = () => {
    sk.cycles = sk.cycles.filter(c => c.id !== b.dataset.cx);
    commit();
    renderSukkiriSettings();
  });
  $('sk-cadd').onclick = () => {
    sk.cycles.push({
      id: skId(),
      name: '',
      every: 14,
      anchor: skNextDow(0),
      color: SK_COLORS[(sk.cycles.length + 4) % SK_COLORS.length]
    });
    commit();
    renderSukkiriSettings();
    const last = ov.querySelectorAll('[data-cn]');
    last[last.length - 1].focus();
  };
}

/* ── print ── */
/* cell-level: watermark icons + garbage caption (goes outside .pr-body) */
function skPrintCell(key) {
  if (!sk.show) return '';
  const gs = skGarbageOn(key);
  if (!gs.length) return '';
  let h = `<div class="pr-sk-wm${gs.length > 1 ? ' multi' : ''}">${gs.map(g => g.icon && SK_ICONS[g.icon] ? skIconSvg(g.icon, g.color) : `<span style="color:${g.color}">${esc(g.short || g.label)}</span>`).join('')}</div>`;
  h += '<div class="pr-sk-g">' + gs.map(g => `<span style="color:${g.color}">${esc(g.short || g.label)}</span>`).join('<i>·</i>') + '</div>';
  return h;
}
/* body-level: cleaning phases as chips */
function skPrintLines(key) {
  if (!sk.show) return '';
  let l = '';
  const cl = skClashTasks(key).length;
  skOccFor(key).forEach(o => {
    const c = o.cycle.color || '#8e44ad',
      clash = !o.done && cl;
    l += `<div class="pr-sk-c${o.done ? ' done' : ''}${clash ? ' clash' : ''}" style="--sk-c:${c}">${clash ? '<b class="w">⚠</b>' : '<i class="d"></i>'}<span>${esc(o.cycle.name)}</span>${o.mode !== 'due' ? `<b class="s">${o.mode === 'after' ? '+1w' : '−1w'}</b>` : ''}</div>`;
  });
  skGhostFor(key).forEach(o => {
    l += `<div class="pr-sk-ghost" style="--sk-c:${o.cycle.color || '#8e44ad'}"><span>${esc(o.cycle.name)}</span></div>`;
  });
  return l;
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "app_update/js/sukkiri.js", error: String((e && e.message) || e) }); }

// components/calendar/CalendarGrid.jsx
try { (() => {
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function CalendarGrid({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 840,
      background: "var(--card-bg)",
      borderRadius: 16,
      border: "2px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow)",
      position: "relative",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      borderBottom: "2px solid var(--border)"
    }
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      textAlign: "center",
      padding: "10px 0",
      fontSize: "clamp(11px,2.6vw,16px)",
      fontWeight: 700,
      color: i >= 5 ? "var(--wknd)" : "var(--txt)",
      fontFamily: "var(--h-font)",
      borderRight: i < 6 ? "1px solid color-mix(in srgb,var(--border) 30%,transparent)" : "none"
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)"
    }
  }, children));
}
Object.assign(__ds_scope, { CalendarGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/CalendarGrid.jsx", error: String((e && e.message) || e) }); }

// components/calendar/MonthHeader.jsx
try { (() => {
function MonthHeader({
  month,
  year,
  onPrev,
  onNext,
  onTitleClick
}) {
  const arrow = (glyph, fn) => /*#__PURE__*/React.createElement("button", {
    onClick: fn,
    style: {
      background: "none",
      border: "none",
      fontSize: 42,
      cursor: "pointer",
      color: "var(--txt2)",
      padding: "0 12px",
      lineHeight: 1,
      transition: "color .15s,transform .12s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = "var(--accent)";
      e.currentTarget.style.transform = "scale(1.15)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = "var(--txt2)";
      e.currentTarget.style.transform = "scale(1)";
    }
  }, glyph);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 840,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, arrow("‹", onPrev), /*#__PURE__*/React.createElement("div", {
    onClick: onTitleClick,
    style: {
      textAlign: "center",
      cursor: onTitleClick ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "clamp(36px,9vw,66px)",
      fontFamily: "var(--h-font)",
      fontWeight: 900,
      color: "var(--txt)",
      letterSpacing: -1,
      lineHeight: 1.05
    }
  }, month, onTitleClick && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "clamp(14px,2.5vw,20px)",
      color: "var(--txt2)",
      fontFamily: "var(--b-font)"
    }
  }, " \u25BE")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "clamp(15px,3.5vw,22px)",
      color: "var(--txt2)",
      fontFamily: "var(--h-font)",
      fontWeight: 700
    }
  }, year)), arrow("›", onNext));
}
Object.assign(__ds_scope, { MonthHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/MonthHeader.jsx", error: String((e && e.message) || e) }); }

// components/calendar/StatsBar.jsx
try { (() => {
function StatsBar({
  items = [],
  empty = "Tap any day to start tracking"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 840,
      marginTop: 10,
      display: "flex",
      flexWrap: "wrap",
      gap: 18,
      justifyContent: "center",
      fontSize: 14,
      color: "var(--txt2)",
      fontFamily: "var(--b-font)"
    }
  }, items.length === 0 ? empty : items.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, s)));
}
Object.assign(__ds_scope, { StatsBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/StatsBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = "primary",
  children,
  disabled,
  style,
  ...rest
}) {
  const variants = {
    primary: {
      background: "var(--btn)",
      color: "#fff",
      boxShadow: "0 4px 15px var(--btn-sh)",
      border: "none"
    },
    google: {
      background: "#fff",
      color: "#3c4043",
      border: "1.5px solid #dadce0",
      boxShadow: "0 2px 8px rgba(0,0,0,.12)"
    },
    outline: {
      background: "transparent",
      color: "var(--accent)",
      border: "1.5px solid var(--accent)",
      boxShadow: "none"
    }
  };
  const base = {
    width: "100%",
    padding: variant === "outline" ? "4px 14px" : "11px 0",
    borderRadius: 12,
    fontSize: variant === "outline" ? 12 : 18,
    fontFamily: "var(--b-font)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    transition: "transform .12s,opacity .15s",
    opacity: disabled ? .6 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...variants[variant],
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: base,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(1.02)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(.98)";
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(1.02)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  children,
  active,
  title,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    title: title,
    style: {
      background: "var(--card-bg)",
      border: "1.5px solid var(--border)",
      borderRadius: "50%",
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 16,
      color: "var(--txt)",
      boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      transition: "transform .12s",
      outline: active ? "2px solid var(--accent)" : "none",
      outlineOffset: -2,
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "scale(1.1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/PillButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PillButton({
  variant = "card",
  children,
  style,
  ...rest
}) {
  const v = variant === "accent" ? {
    background: "color-mix(in srgb,var(--accent) 10%,transparent)",
    border: "1.5px solid color-mix(in srgb,var(--accent) 28%,transparent)",
    borderRadius: 20,
    color: "var(--accent)",
    fontWeight: 600,
    boxShadow: "none"
  } : {
    background: "var(--card-bg)",
    border: "1.5px solid var(--border)",
    borderRadius: 22,
    color: "var(--txt)",
    fontWeight: 400,
    boxShadow: "0 2px 8px rgba(0,0,0,.08)"
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      padding: variant === "accent" ? "5px 15px" : "5px 12px",
      fontSize: 13,
      fontFamily: "var(--b-font)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      whiteSpace: "nowrap",
      transition: "transform .12s",
      ...v,
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = variant === "accent" ? "scale(1.05)" : "scale(1.03)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { PillButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PillButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  accentColor,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontSize: 17,
      color: "var(--txt)",
      fontFamily: "var(--b-font)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      width: 18,
      height: 18,
      accentColor: accentColor || "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/ColorDotPicker.jsx
try { (() => {
const MARK_COLORS = {
  red: "#d63031",
  pink: "#e84393",
  teal: "#00b894",
  cyan: "#00cec9",
  orange: "#e17055",
  purple: "#6c5ce7",
  yellow: "#fdcb6e"
};
function ColorDotPicker({
  value,
  onChange,
  size = 24
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, Object.entries(MARK_COLORS).map(([n, c]) => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => onChange && onChange(n),
    "aria-label": n,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: c,
      border: value === n ? "2px solid var(--txt)" : "2px solid transparent",
      cursor: "pointer",
      transition: "transform .12s",
      transform: value === n ? "scale(1.25)" : "scale(1)",
      padding: 0
    },
    onMouseEnter: e => {
      if (value !== n) e.currentTarget.style.transform = "scale(1.15)";
    },
    onMouseLeave: e => {
      if (value !== n) e.currentTarget.style.transform = "scale(1)";
    }
  })));
}
Object.assign(__ds_scope, { MARK_COLORS, ColorDotPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ColorDotPicker.jsx", error: String((e && e.message) || e) }); }

// components/calendar/CalendarCell.jsx
try { (() => {
const MOOD_INK = {
  good: "#27ae60",
  bad: "#e74c3c",
  mixed: "var(--diary)",
  neutral: "var(--diary)"
};
const MOOD_ICON = {
  good: "#27ae60",
  bad: "#e74c3c",
  mixed: "#ffd93d",
  neutral: "var(--txt2)"
};
function CalendarCell({
  day,
  outMonth,
  weekend,
  today,
  marked,
  markColor = "red",
  goal,
  note,
  diary,
  diaryMood = "neutral",
  birthday,
  holiday,
  weather,
  lastRow,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const cellStyle = {
    minHeight: "clamp(64px,12vw,106px)",
    padding: "4px 5px",
    position: "relative",
    overflow: "hidden",
    borderRight: "1px solid color-mix(in srgb,var(--border) 30%,transparent)",
    borderBottom: lastRow ? "none" : "1px solid color-mix(in srgb,var(--border) 30%,transparent)",
    cursor: outMonth ? "default" : "pointer",
    opacity: outMonth ? .22 : 1,
    pointerEvents: outMonth ? "none" : "auto",
    background: birthday ? "linear-gradient(135deg,rgba(255,182,193,.12),rgba(255,215,0,.12))" : hover ? "var(--cell-hover)" : weekend ? "color-mix(in srgb,var(--wknd) 6%,transparent)" : "transparent",
    transition: "transform .12s,background .12s",
    transform: hover ? "scale(1.03)" : "scale(1)",
    zIndex: hover ? 2 : 1,
    fontFamily: "var(--b-font)"
  };
  if (birthday) Object.assign(cellStyle, {
    borderWidth: 2,
    borderStyle: "solid",
    borderImage: "linear-gradient(135deg,#ff6b6b,#feca57,#48dbfb,#ff9ff3,#54a0ff,#5f27cd) 1"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: cellStyle,
    onClick: onClick,
    onMouseEnter: () => !outMonth && setHover(true),
    onMouseLeave: () => setHover(false)
  }, today && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 4,
      left: 4,
      width: 8,
      height: 8,
      background: "#2ecc71",
      borderRadius: "50%",
      zIndex: 6,
      boxShadow: "0 0 6px rgba(46,204,113,.6)",
      animation: "livePulse 1.8s ease-in-out infinite"
    }
  }), weather && !birthday && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 3,
      fontSize: "clamp(16px,3vw,22px)",
      zIndex: 4,
      lineHeight: 1,
      filter: "drop-shadow(0 1px 2px rgba(0,0,0,.15))"
    }
  }, weather), birthday && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 1,
      right: 2,
      fontSize: 12,
      zIndex: 5
    }
  }, "\uD83C\uDF82"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(13px,3vw,22px)",
      fontWeight: 700,
      fontFamily: "var(--h-font)",
      color: holiday || weekend && !outMonth ? "var(--wknd)" : "var(--txt)",
      lineHeight: 1,
      position: "relative",
      zIndex: 3,
      width: "fit-content"
    }
  }, day), marked && /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 40 40",
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      opacity: .75,
      pointerEvents: "none",
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "7",
    x2: "33",
    y2: "33",
    stroke: __ds_scope.MARK_COLORS[markColor] || __ds_scope.MARK_COLORS.red,
    strokeWidth: "4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "33",
    y1: "7",
    x2: "7",
    y2: "33",
    stroke: __ds_scope.MARK_COLORS[markColor] || __ds_scope.MARK_COLORS.red,
    strokeWidth: "4",
    strokeLinecap: "round"
  })), goal && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 2,
      right: 3,
      fontSize: 8,
      background: "var(--goal)",
      color: "#fff",
      borderRadius: 5,
      padding: "1px 5px",
      fontWeight: 700,
      zIndex: 4,
      lineHeight: "12px"
    }
  }, "\u2605 GOAL"), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(8px,1.5vw,11px)",
      color: "var(--note)",
      lineHeight: 1.15,
      marginTop: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      zIndex: 3,
      fontWeight: 600
    }
  }, note), diary && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(7px,1.3vw,10px)",
      color: MOOD_INK[diaryMood],
      lineHeight: 1.15,
      marginTop: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      zIndex: 3,
      fontWeight: 500,
      opacity: .85
    }
  }, diary), diary && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 2,
      right: 3,
      fontSize: 10,
      zIndex: 3,
      color: MOOD_ICON[diaryMood]
    }
  }, "\uD83D\uDCD6"), birthday && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 1,
      left: 2,
      fontSize: "clamp(6px,1.2vw,9px)",
      color: "#e84393",
      fontWeight: 700,
      maxWidth: "85%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      zIndex: 5
    }
  }, birthday), holiday && !birthday && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 1,
      left: 2,
      fontSize: 7,
      color: "var(--wknd)",
      fontWeight: 700,
      opacity: .8,
      maxWidth: "90%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      zIndex: 4
    }
  }, "\uD83C\uDF8C ", holiday));
}
Object.assign(__ds_scope, { CalendarCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/calendar/CalendarCell.jsx", error: String((e && e.message) || e) }); }

// components/forms/MoodPicker.jsx
try { (() => {
const MOODS = [["good", "😊", "rgba(107,203,119,.2)"], ["neutral", "😐", "rgba(128,128,128,.2)"], ["bad", "😟", "rgba(255,107,107,.2)"]];
function MoodPicker({
  value = "good",
  onChange,
  label = "Ink color:"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--txt2)",
      marginRight: 2,
      fontFamily: "var(--b-font)"
    }
  }, label), MOODS.map(([m, e, bg]) => /*#__PURE__*/React.createElement("button", {
    key: m,
    title: m,
    onClick: () => onChange && onChange(m),
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      border: value === m ? "2.5px solid var(--txt)" : "2.5px solid transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      background: bg,
      transition: "transform .12s,border-color .15s",
      transform: value === m ? "scale(1.2)" : "scale(1)",
      padding: 0
    },
    onMouseEnter: ev => {
      if (value !== m) ev.currentTarget.style.transform = "scale(1.15)";
    },
    onMouseLeave: ev => {
      if (value !== m) ev.currentTarget.style.transform = "scale(1)";
    }
  }, e)));
}
Object.assign(__ds_scope, { MoodPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MoodPicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextArea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function TextArea({
  label,
  inkColor,
  rows = 2,
  style,
  ...rest
}) {
  const [f, setF] = useState(false);
  const ta = /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      borderRadius: 10,
      border: `1.5px solid ${f ? "var(--accent)" : "var(--border)"}`,
      background: "var(--input-bg)",
      color: inkColor || "var(--txt)",
      fontSize: 15,
      fontFamily: "var(--b-font)",
      outline: "none",
      resize: "vertical",
      transition: "border-color .15s",
      ...style
    },
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }, rest));
  if (!label) return ta;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 16,
      display: "block",
      marginBottom: 5,
      color: "var(--txt)",
      fontWeight: 600,
      fontFamily: "var(--b-font)"
    }
  }, label), ta);
}
Object.assign(__ds_scope, { TextArea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextArea.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function TextInput({
  label,
  style,
  ...rest
}) {
  const [f, setF] = useState(false);
  const input = /*#__PURE__*/React.createElement("input", _extends({
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      borderRadius: 10,
      border: `1.5px solid ${f ? "var(--accent)" : "var(--border)"}`,
      background: "var(--input-bg)",
      color: "var(--txt)",
      fontSize: 15,
      fontFamily: "var(--b-font)",
      outline: "none",
      transition: "border-color .15s",
      ...style
    },
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }, rest));
  if (!label) return input;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 16,
      display: "block",
      marginBottom: 5,
      color: "var(--txt)",
      fontWeight: 600,
      fontFamily: "var(--b-font)"
    }
  }, label), input);
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Dropdown.jsx
try { (() => {
const {
  useState,
  useEffect,
  useRef
} = React;
function Dropdown({
  trigger,
  options = [],
  align = "right"
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PillButton, {
    onClick: () => setOpen(o => !o)
  }, trigger, " \u25BE"), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "115%",
      [align]: 0,
      background: "var(--card-bg)",
      border: "1.5px solid var(--border)",
      borderRadius: 14,
      padding: 5,
      minWidth: 200,
      zIndex: 100,
      boxShadow: "0 12px 40px rgba(0,0,0,.25)"
    }
  }, options.map((o, i) => o === "divider" ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 1,
      background: "var(--border)",
      margin: "3px 0"
    }
  }) : /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      setOpen(false);
      o.onSelect && o.onSelect();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      width: "100%",
      padding: "8px 12px",
      border: "none",
      background: o.active ? "rgba(128,128,128,.15)" : "transparent",
      borderRadius: 9,
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "var(--b-font)",
      color: "var(--txt)",
      textAlign: "left",
      transition: "background .1s"
    },
    onMouseEnter: e => {
      if (!o.active) e.currentTarget.style.background = "rgba(128,128,128,.12)";
    },
    onMouseLeave: e => {
      if (!o.active) e.currentTarget.style.background = "transparent";
    }
  }, o.label))));
}
Object.assign(__ds_scope, { Dropdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Dropdown.jsx", error: String((e && e.message) || e) }); }

// components/overlays/InfoBanner.jsx
try { (() => {
const KINDS = {
  birthday: {
    background: "linear-gradient(135deg,rgba(255,182,193,.15),rgba(255,215,0,.15))",
    borderColor: "rgba(255,107,107,.25)"
  },
  holiday: {
    background: "linear-gradient(135deg,rgba(231,76,60,.08),rgba(241,196,15,.08))",
    borderColor: "rgba(192,57,43,.25)"
  },
  weather: {
    background: "linear-gradient(135deg,rgba(52,152,219,.08),rgba(46,204,113,.08))",
    borderColor: "rgba(52,152,219,.25)"
  }
};
function InfoBanner({
  kind = "birthday",
  children,
  style
}) {
  const k = KINDS[kind] || KINDS.birthday;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: k.background,
      border: `1.5px solid ${k.borderColor}`,
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 14,
      color: "var(--txt)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--b-font)",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { InfoBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/InfoBanner.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Modal.jsx
try { (() => {
function Modal({
  open = true,
  onClose,
  title,
  subtitle,
  maxWidth = 480,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(6px)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--card-bg)",
      borderRadius: 18,
      padding: "28px 26px 22px",
      width: "92%",
      maxWidth,
      maxHeight: "85vh",
      overflowY: "auto",
      boxShadow: "var(--shadow)",
      fontFamily: "var(--b-font)",
      border: "2px solid var(--border)",
      position: "relative",
      color: "var(--txt)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: "absolute",
      top: 10,
      right: 14,
      background: "none",
      border: "none",
      fontSize: 24,
      cursor: "pointer",
      color: "var(--txt2)"
    }
  }, "\u2715"), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 2px",
      fontSize: 28,
      color: "var(--txt)",
      fontFamily: "var(--h-font)",
      fontWeight: 900
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 18px",
      fontSize: 16,
      color: "var(--txt2)"
    }
  }, subtitle), children));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Modal.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Toast.jsx
try { (() => {
function Toast({
  visible = true,
  children
}) {
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--txt)",
      color: "var(--card-bg)",
      padding: "7px 18px",
      borderRadius: 20,
      fontSize: 13,
      zIndex: 50,
      fontFamily: "var(--b-font)"
    }
  }, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Toast.jsx", error: String((e && e.message) || e) }); }

// doc-page.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <doc-page> — paged-document shell for printable HTML.
 *
 * FIRST, decide how the document paginates — up front, before building:
 *
 * - FLOWING document (the default): write the whole document as one
 *   normal HTML flow inside <doc-page>; the browser's print engine
 *   splits it onto pages at export. Use for long-form documents with a
 *   single text flow: reports, memos, letters, essays.
 * - EXPLICIT pagination: a fixed set of pre-paginated pages, one
 *   <section class="page"> child per page. Use when the user asks for a
 *   specific page count, or the design implies one: a one-page resume, a
 *   two-sided flier, a poster, a certificate, a brochure — any richly
 *   laid-out document without a single text flow.
 * - If in doubt, ask the user as part of the build.
 *
 * PAGE SIZING — paper differs by country (letter vs A4), so the printed
 * sheet is not one fixed truth:
 * - FLOWING documents pin NO paper size: the print engine paginates
 *   onto the user's real paper, and the content reflows to it.
 * - EXPLICITLY PAGINATED documents print each page at a FIXED page box
 *   with overflow hidden — letter by default, size="a4" for a clearly
 *   metric user, the user's chosen paper when they export. Design each
 *   page to FILL that box, fitting letter and A4 alike without overlap.
 * - width/height pin an explicit fixed size, ONLY when the user gives
 *   one.
 * Never write your own @page rule or hard-code paper dimensions in the
 * content.
 *
 * Sizing modes (attributes):
 *   (none)                      — portrait: flowing docs use the user's
 *           paper; explicitly paginated pages use the named size box
 *           (letter unless size="a4")
 *   orientation="landscape"     — the same, landscape
 *   width / height              — explicit fixed size, ONLY when the user
 *           gives one (e.g. width="22in" height="30in" for a 22×30
 *           poster): the page IS the design's size, printed at true
 *           dimensions (or scaled onto the user's paper at print time).
 *           Any absolute CSS length: px/in/mm/cm/pt/pc.
 * The component announces the chosen mode to the host app at runtime (a
 * meta tag it injects), so the print path can inject the user's true
 * paper size.
 *
 * On screen the document renders on a desk background: a flowing
 * document as one tall scrolling sheet (Google Docs' pageless view);
 * explicitly paginated documents as one card per page.
 *
 * EXPLICIT pagination usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page>
 *     <section class="page" id="p1">…one page's design…</section>
 *     <section class="page" id="p2">…</section>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * How the page box works, concretely: each .page prints as ONE full-bleed
 * sheet at a FIXED physical size — letter by default (set size="a4" for
 * a clearly metric user), the user's chosen paper when they export —
 * with overflow hidden. Nothing scrolls and nothing reflows onto a next
 * sheet: content that misses the box is CLIPPED. Design each page to
 * FILL that page box, and to fit it — letter and A4 alike — without
 * overlap. Each page is a size container; don't size anything in
 * viewport units (they track the window, not the page), and never set
 * width or height on the .page section itself (the component sizes the
 * page box; an authored height like 100% is meaningless at print and is
 * overridden). The component owns the page box, the screen card chrome,
 * and the page breaks (never add your own break-before/after). Don't mix
 * .page sections with flowing content or header/footer slots in the same
 * document.
 *
 * FLOWING usage:
 *   <style>doc-page:not(:defined){visibility:hidden}</style>
 *   <doc-page margin="0.75in">
 *     <h1>Title</h1>
 *     <p>…body…</p>
 *   </doc-page>
 *   <script src="doc-page.js"></script>
 * There is no manual page-splitting — the browser's print engine
 * paginates at export. Standard break-hygiene rules (`break-inside:
 * avoid` on figures, code blocks, images and table rows; `orphans/
 * widows: 3`) are applied so paragraphs and groups split cleanly. On
 * screen and at print, headings default to `text-wrap: balance` and
 * body text to `text-wrap: pretty`; the defaults have zero specificity,
 * so any text-wrap you declare wins.
 *
 * Other attributes:
 *   size    — letter | a4 | legal (default letter). Flowing documents:
 *           preview proportion only — it does NOT pin their printed
 *           paper (the print dialog's paper governs); leave it alone
 *           there. Explicitly paginated documents: it sets the page box
 *           the cards and the pinned @page share (the export dialog's
 *           choice overrides both at print) — set size="a4" for a
 *           clearly metric user. Scaled-fit: names the sheet the fit is
 *           computed against, same a4-for-metric-users advice.
 *   content-width / content-height — the design's own fixed dimensions
 *           (CSS lengths), for scaling a fixed-size design ONTO the
 *           named sheet: content lays out at exactly this size, and the
 *           component scales it to fit that sheet's printable area
 *           (centered horizontally, top-aligned; the export dialog
 *           re-fits to the user's actual paper choice where available).
 *           Both must be set; they do not change the page box. For pages
 *           WITHOUT running header/footer slots.
 *   margin  — printable inset on every page of a FLOWING document
 *           (default 0.75in); margin="0" makes pages full-bleed.
 *           Explicitly paginated pages are always full-bleed.
 *
 * Running header/footer (flowing documents only): give an element
 * `slot="header"` or `slot="footer"` and it repeats on every printed
 * page via `position: fixed`. To keep body text from sliding under it,
 * the component prints inside a single-cell table whose <thead>/<tfoot>
 * are spacers sized to the header/footer height — browsers repeat
 * thead/tfoot on every page, so each sheet's content starts below the
 * header and ends above the footer. On screen the header/footer render
 * once at the top/bottom of the sheet.
 *
 * At print the component injects `@page { margin: 0 }` (which leaves
 * Chrome no margin box to draw its date/URL/page-count header in) and
 * moves the visual margin onto the sheet's own padding. It also marks
 * the document as owning its print CSS (a
 * `meta[name="omelette-owns-print"]` it injects at runtime), so the
 * PDF export never injects page-geometry CSS of its own on top.
 *
 * Print best practices for the content you author:
 * - Multi-column text: use CSS columns (`column-count` +
 *   `column-gap`), never side-by-side flex/grid columns — only real
 *   CSS columns flow and break across pages. `column-span: all` lets
 *   a heading span the columns; `hyphens: auto` (needs `lang` on
 *   the html element) keeps narrow columns readable.
 * - Page breaks in flowing documents: `break-before: page` on an
 *   element that must start a new page (a chapter, an appendix). Add
 *   your own kept-together blocks (callouts, stat tiles, cards) to a
 *   `break-inside: avoid` rule, and keep each one shorter than a page.
 * - Extend `orphans: 3; widows: 3` to any custom text blocks you add
 *   (p and li are covered by default).
 * - Give long tables a <thead> — browsers repeat it on every printed
 *   page.
 * - No `position: fixed`/`sticky` and no viewport units in content:
 *   fixed elements stamp every printed page (running headers/footers go
 *   in the component's slots) and `100vh` mis-sizes at print.
 *
 * Author content as static HTML so the user can click-to-edit any text
 * directly. Do not set width/padding/background on the document body —
 * the component owns the sheet box.
 */
/* END USAGE */

(() => {
  const PAPER = {
    letter: ['8.5in', '11in'],
    a4: ['210mm', '297mm'],
    legal: ['8.5in', '14in']
  };
  const CSS_LENGTH = /^\d+(\.\d+)?(px|in|mm|cm|pt|pc)$/;
  // Unitless "0" is a valid CSS length and the natural way to write
  // margin="0"; normalise it to 0px so max()/calc() (which reject a bare
  // number) keep working.
  const safeLen = (v, fb) => {
    v = (v || '').trim();
    return v === '0' ? '0px' : CSS_LENGTH.test(v) ? v : fb;
  };
  // WebKit (Safari and every iOS browser shell) never repeats a table's
  // thead/tfoot on printed pages (WebKit bug 17205), so the spacer-borne
  // vertical margins of a FLOWING document reach only the first page
  // there. Engine check, not browser check: vendor is 'Apple Computer,
  // Inc.' exactly for WebKit and 'Google Inc.' for Blink.
  const WK_PRINT = /apple/i.test(navigator.vendor || '');
  // CSS length → px number (CSS absolute units are exact: 1in = 96px).
  // Returns NaN for anything safeLen would reject — callers gate on it.
  const PX_PER = {
    px: 1,
    in: 96,
    mm: 96 / 25.4,
    cm: 96 / 2.54,
    pt: 96 / 72,
    pc: 16
  };
  const toPx = v => {
    const m = /^(\d+(?:\.\d+)?)(px|in|mm|cm|pt|pc)$/.exec((v || '').trim());
    return m ? parseFloat(m[1]) * PX_PER[m[2]] : NaN;
  };
  const stylesheet = `
    :host {
      position: relative;
      display: block;
      /* When the viewport is narrower than the page, grow to wrap the
       * sheet (plus this padding) instead of staying viewport-width, so
       * the desk background and right margin reach the sheet's far edge
       * in the horizontal scroll. */
      min-width: max-content;
      min-height: 100vh;
      background: #f5f5f4;
      padding: 48px 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      --doc-page-w: 8.5in;
      --doc-page-h: 11in;
      --doc-page-margin: 0.75in;
      --doc-hdr-h: 0px;
      --doc-ftr-h: 0px;
      --doc-hdr-pad: 0px;
      --doc-ftr-pad: 0px;
    }
    .sheet {
      width: var(--doc-page-w);
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 2px 10px rgba(20, 20, 19, 0.12);
      border-radius: 7px;
      box-sizing: border-box;
      padding: var(--doc-page-margin);
    }
    .frame { width: 100%; border-collapse: collapse; }
    /* Scaled-fit mode (content-width/content-height): the inner .fit box
     * lays the content out at its authored fixed size and scales it onto
     * the printable area; .fit-box reserves the scaled footprint in flow
     * (transforms don't affect layout) and centers it. Without the mode,
     * both divs are unstyled block pass-throughs. */
    /* Explicit pagination: direct .page children are the pages. The sheet
     * becomes a transparent stack and each page carries the card look on
     * screen; at print each page is exactly one full-bleed sheet. The
     * ::slotted defaults are deliberately weak (document CSS wins), so
     * authored page styling can override any of this. */
    .sheet.paginated {
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
    .paginated ::slotted(.page) {
      position: relative;
      display: block;
      width: 100%;
      aspect-ratio: var(--doc-page-ar);
      container-type: size;
      overflow: hidden;
      box-sizing: border-box;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
      break-inside: avoid;
    }
    .paginated ::slotted(.page:not(:first-child)) { margin-top: 1rem; }
    @media print {
      .sheet.paginated { padding: 0; }
      /* The flowing-document vertical inset lives on the repeating
       * thead/tfoot spacers, not the sheet padding — they must go too,
       * or each full-sheet .page is pushed ~margin down and spills onto
       * a second sheet. Paginated pages are full-bleed by definition
       * (content owns its insets). */
      .sheet.paginated .hdr-space,
      .sheet.paginated .ftr-space { height: 0; }
      .paginated ::slotted(.page) {
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        /* Physical page-box sizing, no viewport units: Safari resolves
         * 100vh against the window, not the page box, so a vh-sized card
         * paginates wrong there. --doc-page-w/h are the named size by
         * default and are overridden to the user's chosen paper by the
         * export path, so every card is exactly one sheet either way.
         * Width + height (same source values as @page size) rather than
         * width + aspect-ratio: the ratio is a 6-decimal rounding of the
         * same division, and a few millionths of overflow would spill a
         * blank sheet after every page. The screen-only aspect-ratio
         * (preview proportions) must not leak into print. cqh typography
         * tracks the same box.
         *
         * Every declaration is !important: per CSS Scoping, unimportant
         * shadow ::slotted rules LOSE to the document context, so a page
         * section's authored inline style would silently beat this print
         * geometry. A model-authored height:100% did exactly that — the
         * percentage resolves as auto in the all-auto print ancestry, the
         * base rule's size containment turns auto into ZERO, and
         * overflow:hidden then paints nothing: a blank PDF with perfect
         * page boxes. At print the component's geometry is the design's
         * whole contract, so it must win over any authored sizing. */
        aspect-ratio: auto !important;
        width: var(--doc-page-w) !important;
        height: var(--doc-page-h) !important;
        overflow: hidden !important;
      }
      .paginated ::slotted(.page:not(:first-child)) {
        break-before: page !important;
        margin-top: 0 !important;
      }
    }
    .fit-mode .fit-box {
      width: calc(var(--doc-fit-w) * var(--doc-fit-scale));
      height: calc(var(--doc-fit-h) * var(--doc-fit-scale));
      margin: 0 auto;
      break-inside: avoid;
    }
    /* Monolithic at print: Blink slices a transform-scaled child at
     * fragmentainer boundaries mapped in UNSCALED layout coordinates
     * (transforms are paint-time), so the .fit box (authored size, e.g.
     * 1400x990) gets cut at the page's free block space and spills onto
     * a second sheet even though its SCALED footprint fits the page by
     * construction. overflow:hidden makes .fit-box a scroll container —
     * monolithic under fragmentation (css-break-3) — so the scaled
     * content prints atomically on one sheet. No clipping for content
     * within the authored box: .fit-box is calc-sized to exactly the
     * scaled footprint. (Content that bleeds past content-width/height
     * is clipped at the footprint — fit mode's contract; it previously
     * painted beyond it at print.) Print-only, so the screen rendering
     * keeps visible overflow for editor affordances.
     * The export path injects the same rule into frozen copies
     * (print-eval.ts om-print-fit-contain). The .fit-mode scope is
     * load-bearing: .fit-box wraps slotted content in EVERY mode, and an
     * unscoped overflow:hidden would make whole flowing documents
     * monolithic (one truncated sheet). overflow:hidden, never clip —
     * clip is not a scroll container, so not monolithic. */
    @media print {
      .fit-mode .fit-box { overflow: hidden; }
    }
    .fit-mode .fit {
      width: var(--doc-fit-w);
      height: var(--doc-fit-h);
      transform: scale(var(--doc-fit-scale));
      transform-origin: top left;
    }
    .frame td, .frame th { padding: 0; text-align: left; font-weight: inherit; }
    .hdr-space { height: var(--doc-hdr-h); }
    .ftr-space { height: var(--doc-ftr-h); }
    ::slotted([slot="header"]),
    ::slotted([slot="footer"]) { display: block; box-sizing: border-box; }
    @media print {
      :host { background: none; padding: 0; min-width: 0; min-height: 0; }
      .sheet {
        width: auto; margin: 0; box-shadow: none; border-radius: 0;
        padding: 0 var(--doc-page-margin);
      }
      /* The thead/tfoot spacers repeat on every page, so they carry the
       * vertical page margin (which the sheet's own padding cannot, since
       * that padding is consumed once on the first/last page). The running
       * header/footer are fixed inside that band. */
      /* The 0.35in is breathing room between a running header/footer and
       * the body; without one the spacer is exactly the page margin, so a
       * margin="0" full-bleed document gets truly full-bleed pages. */
      .hdr-space { height: max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))); }
      .ftr-space { height: max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))); }
      /* WebKit flowing documents: @page carries the vertical margin (see
       * _syncPrintPageRule), so the spacers keep only whatever a running
       * header/footer needs BEYOND it — page 1 would otherwise double its
       * top inset. Paginated sheets already zero their spacers above. */
      .sheet.wk-print:not(.paginated) .hdr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-hdr-h) + var(--doc-hdr-pad))) - var(--doc-page-margin))); }
      .sheet.wk-print:not(.paginated) .ftr-space { height: max(0px, calc(max(var(--doc-page-margin), calc(var(--doc-ftr-h) + var(--doc-ftr-pad))) - var(--doc-page-margin))); }
      ::slotted([slot="header"]) {
        position: fixed; top: 0; left: 0; right: 0; margin: 0;
        padding: calc(var(--doc-page-margin) * 0.45) var(--doc-page-margin) 0;
      }
      ::slotted([slot="footer"]) {
        position: fixed; bottom: 0; left: 0; right: 0; margin: 0;
        padding: 0 var(--doc-page-margin) calc(var(--doc-page-margin) * 0.45);
      }
    }
  `;
  class DocPage extends HTMLElement {
    static get observedAttributes() {
      return ['size', 'width', 'height', 'margin', 'orientation', 'content-width', 'content-height'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._mo = typeof MutationObserver === 'function' ? new MutationObserver(() => this._scheduleMeasure()) : null;
    }

    /** The named paper's [w, h], swapped when orientation="landscape".
     *  Only the named size swaps — explicit width/height are exact values
     *  the author already oriented. */
    _paperSize() {
      const named = PAPER[(this.getAttribute('size') || '').toLowerCase()] || PAPER.letter;
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? [named[1], named[0]] : named;
    }
    get pageWidth() {
      return safeLen(this.getAttribute('width'), this._paperSize()[0]);
    }
    get pageHeight() {
      return safeLen(this.getAttribute('height'), this._paperSize()[1]);
    }
    get pageMargin() {
      return safeLen(this.getAttribute('margin'), '0.75in');
    }

    /** Scaled-fit mode's content box [w, h] as CSS lengths, or null when
     *  the mode is off (either attribute missing/invalid/zero — a partial
     *  declaration falls back to normal flow rather than guessing). */
    _contentFit() {
      const w = safeLen(this.getAttribute('content-width'), null);
      const h = safeLen(this.getAttribute('content-height'), null);
      if (!w || !h) return null;
      const wPx = toPx(w),
        hPx = toPx(h);
      return wPx > 0 && hPx > 0 ? [w, h, wPx, hPx] : null;
    }
    connectedCallback() {
      if (!this._sheet) this._render();
      this._syncSize();
      this._syncPrintPageRule();
      this._ensureTextWrapDefaults();
      this._ensureOwnsPrintMeta();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      if (this._mo) this._mo.observe(this, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
      this._onResize = () => this._scheduleMeasure();
      window.addEventListener('resize', this._onResize);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this._scheduleMeasure());
      }
      this._scheduleMeasure();
    }
    disconnectedCallback() {
      window.removeEventListener('resize', this._onResize);
      if (this._mo) this._mo.disconnect();
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
      // Drop the head rules when the last doc-page leaves, so a deleted
      // document's @page geometry and text-wrap defaults can't apply to
      // whatever replaces it.
      const survivor = document.querySelector('doc-page');
      if (!survivor) {
        ['doc-page-print', 'doc-page-text-wrap', 'doc-page-owns-print', 'doc-page-fixed-size', 'doc-page-print-sizing'].forEach(id => {
          const tag = document.getElementById(id);
          if (tag) tag.remove();
        });
        // A live deck-stage deferred its own print-sizing meta to ours —
        // hand the page-global meta over so the deck isn't left unmarked.
        const deck = document.querySelector('deck-stage');
        if (deck && typeof deck._ensurePrintSizingMeta === 'function') {
          deck._ensurePrintSizingMeta();
        }
      } else {
        // A departed owner hands each page-global meta to whatever
        // doc-page remains (or it's removed).
        if (typeof survivor._syncFixedSizeMeta === 'function') {
          survivor._syncFixedSizeMeta();
        }
        if (typeof survivor._syncPrintSizingMeta === 'function') {
          survivor._syncPrintSizingMeta();
        }
      }
    }
    attributeChangedCallback() {
      if (!this._sheet) return;
      this._syncSize();
      this._syncPrintPageRule();
      this._syncFixedSizeMeta();
      this._syncPrintSizingMeta();
      this._scheduleMeasure();
    }
    _render() {
      this._root.innerHTML = `
        <style>${stylesheet}</style>
        <style id="vars"></style>
        <div class="sheet" data-screen-label="Document">
          <table class="frame" role="presentation">
            <thead><tr><th><div class="hdr-space"><slot name="header"></slot></div></th></tr></thead>
            <tbody><tr><td class="body"><div class="fit-box"><div class="fit"><slot></slot></div></div></td></tr></tbody>
            <tfoot><tr><td><div class="ftr-space"><slot name="footer"></slot></div></td></tr></tfoot>
          </table>
        </div>`;
      this._sheet = this._root.querySelector('.sheet');
      this._vars = this._root.getElementById('vars');
    }

    /** Runtime sizing lives in a shadow <style> :host rule, never on the
     *  light-DOM host element, so serialize-persist can't write it back. */
    _syncSize(hdrH, ftrH) {
      // Scaled-fit mode: content at its authored size, scaled onto the
      // printable area (page minus margins on both axes). The factor is a
      // plain number var so calc(length * number) stays valid; 4 decimals
      // keeps the shadow style stable across re-measures. Upscaling is
      // allowed — print transforms are vector, so text and CSS stay crisp
      // (raster images soften, which the catalog bullet warns about).
      const fit = this._contentFit();
      let fitVars = '';
      if (fit) {
        const marginPx = toPx(this.pageMargin) || 0;
        const availW = toPx(this.pageWidth) - 2 * marginPx;
        const availH = toPx(this.pageHeight) - 2 * marginPx;
        const scale = Math.min(availW / fit[2], availH / fit[3]);
        if (scale > 0 && Number.isFinite(scale)) {
          fitVars = '--doc-fit-w:' + fit[0] + ';' + '--doc-fit-h:' + fit[1] + ';' + '--doc-fit-scale:' + scale.toFixed(4) + ';';
        }
      }
      this._sheet.classList.toggle('fit-mode', !!fitVars);
      // Numeric w/h ratio for the paginated page cards' aspect-ratio —
      // aspect-ratio takes a number, not a length ratio, so compute it
      // here (CSS length division isn't portable). 6 decimals keeps the
      // shadow style stable across re-syncs.
      const arW = toPx(this.pageWidth);
      const arH = toPx(this.pageHeight);
      const ar = arW > 0 && arH > 0 ? (arW / arH).toFixed(6) : '0.772727';
      this._vars.textContent = ':host{' + fitVars + '--doc-page-ar:' + ar + ';' + '--doc-page-w:' + this.pageWidth + ';' + '--doc-page-h:' + this.pageHeight + ';' + '--doc-page-margin:' + this.pageMargin + ';' + '--doc-hdr-h:' + (hdrH || 0) + 'px;' + '--doc-ftr-h:' + (ftrH || 0) + 'px;' + '--doc-hdr-pad:' + (hdrH ? '0.35in' : '0px') + ';' + '--doc-ftr-pad:' + (ftrH ? '0.35in' : '0px') + '}';
    }

    /** @page is a no-op inside shadow DOM, so the rule lives in <head>.
     *  Re-appended on every sync so it stays last in source order — the
     *  @page cascade is source-order per descriptor, so this rule wins
     *  over any other @page rule in the document.
     *
     *  The @page SIZE is pinned where the page box IS part of the design:
     *  explicit-fixed-size mode (width + height authored), scaled-fit
     *  mode (the named sheet the fit targets), and explicit pagination
     *  (the named size the cards share — so card and sheet agree on
     *  every print path, and the export path's chosen paper overrides
     *  BOTH with one later rule). For FLOWING documents no paper size is
     *  emitted at all — the true size comes from the user's preference,
     *  injected by the export path or chosen in the print dialog — so a
     *  flowing document never fights the paper it lands on.
     *  margin: 0 is emitted in every mode: it leaves Chrome no margin box
     *  to draw its date/URL/page-count header in, and the visual margin
     *  lives on the sheet's own padding. */
    _syncPrintPageRule() {
      const id = 'doc-page-print';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
      }
      document.head.appendChild(tag);
      // Three print-geometry regimes:
      // - true-size: the page IS the design — pin its exact size.
      // - scaled-fit (content-width/height): the fit factor is computed
      //   against the NAMED paper's printable area, so that paper must
      //   stay pinned or the scaled content overflows a smaller sheet
      //   (the export path re-fits and re-pins at print time on top).
      // - default modes: no paper size — but landscape still needs the
      //   paper-agnostic 'size: landscape' keyword, because the size
      //   descriptor is what carries orientation; without it a landscape
      //   document prints portrait whenever nothing injects a size.
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      // Explicit pagination pins the page box to the SAME values that
      // size the cards (the named size by default, the export path's
      // chosen paper when its later rule overrides both) — card and
      // sheet agree on every print path, and a mismatched real paper
      // shrinks-to-fit in the dialog instead of clipping a Letter card
      // on A4. Declared before the paginated read below so both derive
      // from one check.
      const paginatedNow = this.querySelector(':scope > .page') !== null;
      const sizeDescriptor = this._trueSizePx() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : this._contentFit() ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : paginatedNow ? 'size: ' + this.pageWidth + ' ' + this.pageHeight + '; ' : landscape ? 'size: landscape; ' : '';
      // WebKit never repeats the thead/tfoot spacers that carry a flowing
      // document's vertical page margins (see WK_PRINT above), so pages
      // after the first print edge-to-edge there. Carry the VERTICAL
      // margins on @page for WebKit instead, and the shadow print CSS
      // trims the first-page spacers by the same amount (.sheet.wk-print
      // rules). Horizontal inset stays on the sheet's own padding in
      // every engine. Blink keeps margin: 0 (a nonzero margin there
      // re-opens the box Chrome draws its header furniture in). One cost,
      // learned in testing: Safari's own date/URL headers are a USER
      // dialog setting ("Print headers and footers") that renders in the
      // margin area when room exists — margin: 0 only suppressed it by
      // leaving no room, and no CSS controls it. The export dialog's
      // Safari guide teaches turning the setting off for flowing
      // documents. Explicitly paginated and fixed-size documents keep
      // margin: 0 everywhere: their pages ARE the sheet.
      const wkFlowing = WK_PRINT && !paginatedNow && !this._trueSizePx() && !this._contentFit();
      const marginDescriptor = wkFlowing ? 'margin: ' + this.pageMargin + ' 0; ' : 'margin: 0; ';
      // Shadow-internal marker (never serialized), kept in lockstep with
      // the @page decision above: the print CSS trims the first-page
      // spacers ONLY while @page actually carries the margins — a
      // true-size or scaled-fit sheet keeps margin: 0 and must keep its
      // spacers too. Re-synced here so attribute changes and pagination
      // flips move both together.
      if (this._sheet) this._sheet.classList.toggle('wk-print', wkFlowing);
      tag.textContent = '@page { ' + sizeDescriptor + marginDescriptor + '} ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; height: auto !important; overflow: visible !important; } ' + 'h1,h2,h3,h4,h5,h6 { break-after: avoid; } ' + 'figure,pre,blockquote,img,svg,tr { break-inside: avoid; } ' + 'p,li { orphans: 3; widows: 3; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; ' + 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } ' + '*, *::before, *::after { animation-delay: -99s !important; animation-duration: .001s !important; ' + 'animation-iteration-count: 1 !important; animation-fill-mode: both !important; ' + 'animation-play-state: running !important; transition-duration: 0s !important; } }';
    }

    /** Typographic defaults for document text: balance headings, avoid
     *  widowed/orphaned words in body copy (browsers without text-wrap
     *  support drop the declarations). Zero-specificity via :where() so
     *  any text-wrap authored on those elements wins; document-level so the
     *  rules reach the slotted (light DOM) content — shadow styles can't.
     *  data-omelette-injected marks the tag for the host editor to strip
     *  at serialize, so it is never written back as authored source. */
    _ensureTextWrapDefaults() {
      if (document.getElementById('doc-page-text-wrap')) return;
      const tag = document.createElement('style');
      tag.id = 'doc-page-text-wrap';
      tag.setAttribute('data-omelette-injected', '');
      tag.textContent = ':where(h1,h2,h3,h4,h5,h6){text-wrap:balance}' + ':where(p,li,blockquote,figcaption){text-wrap:pretty}';
      document.head.appendChild(tag);
    }

    /** Declares that this document owns its print CSS. The instant-PDF
     *  export checks for the meta by NAME PRESENCE alone (content is
     *  ignored) and skips its automatic print-CSS injections, so the
     *  component's @page geometry is never overridden by a heuristic.
     *  data-omelette-injected keeps it out of serialized source. */
    _ensureOwnsPrintMeta() {
      if (document.getElementById('doc-page-owns-print')) return;
      const tag = document.createElement('meta');
      tag.id = 'doc-page-owns-print';
      tag.name = 'omelette-owns-print';
      tag.content = 'true';
      tag.setAttribute('data-omelette-injected', '');
      document.head.appendChild(tag);
    }

    /** This page's valid true-size page box (explicit width AND height)
     *  as [w, h] px ints, or null when the mode is off. */
    _trueSizePx() {
      if (!safeLen(this.getAttribute('width'), null) || !safeLen(this.getAttribute('height'), null)) return null;
      const w = Math.round(toPx(this.pageWidth));
      const h = Math.round(toPx(this.pageHeight));
      return w > 0 && h > 0 ? [w, h] : null;
    }

    /** True-size pages (explicit width AND height) also declare the page
     *  box as the preview size: the in-app preview reads
     *  meta[name="omelette-fixed-size"] (content "W,H" in px ints) and
     *  scales the sheet into view — without it an 18in poster previews at
     *  true size with scrollbars. Never overrides an author-set meta
     *  (only the component's own id is managed). The meta is page-global
     *  while doc-page instances are not, so every sync recomputes the
     *  page-wide owner — the first connected true-size doc-page — and a
     *  non-true-size sibling's sync can never delete the owner's meta.
     *  Removed when no true-size page remains (the owner's disconnect
     *  re-syncs via any survivor) or when an author-set meta exists. */
    _syncFixedSizeMeta() {
      const id = 'doc-page-fixed-size';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-fixed-size"]:not([data-omelette-injected])');
      // The page-wide owner, not this instance: an upgraded true-size page
      // anywhere in the document keeps the meta alive and sized.
      let box = null;
      for (const el of document.querySelectorAll('doc-page')) {
        box = typeof el._trueSizePx === 'function' ? el._trueSizePx() : null;
        if (box) break;
      }
      if (!box || authored) {
        if (own) own.remove();
        return;
      }
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-fixed-size';
      tag.content = box[0] + ',' + box[1];
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }

    /** This page's print-sizing mode: 'fixed' when an explicit width AND
     *  height are authored (the page is the design's own size), else the
     *  default paper in the authored orientation. */
    _printSizingMode() {
      if (this._trueSizePx()) return 'fixed';
      const landscape = (this.getAttribute('orientation') || '').trim().toLowerCase() === 'landscape';
      return landscape ? 'default-landscape' : 'default-portrait';
    }

    /** Announces the print-sizing mode to the host app:
     *  meta[name="omelette-print-sizing"] with content 'default-portrait',
     *  'default-landscape', or 'fixed' (fixed pages also carry the
     *  omelette-fixed-size meta with the page box in px). The export path
     *  probes it to decide what true paper size to inject at print time —
     *  in the default modes the component emits no paper size of its own.
     *  Same page-global ownership rules as the fixed-size meta above:
     *  first connected doc-page owns it, an authored meta is never
     *  overridden, removed when no doc-page remains. */
    _syncPrintSizingMeta() {
      const id = 'doc-page-print-sizing';
      const own = document.getElementById(id);
      const authored = document.querySelector('meta[name="omelette-print-sizing"]:not([data-omelette-injected])');
      // A fixed page wins outright (mirroring the fixed-size loop above,
      // so the two metas can never contradict each other in a mixed
      // multi-page document); otherwise the first page's mode holds.
      let mode = null;
      for (const el of document.querySelectorAll('doc-page')) {
        if (typeof el._printSizingMode !== 'function') continue;
        const m = el._printSizingMode();
        if (m === 'fixed') {
          mode = m;
          break;
        }
        if (mode === null) mode = m;
      }
      if (!mode || authored) {
        if (own) own.remove();
        return;
      }
      // A deck-stage that connected first injected its own meta and
      // defers to any existing one — take it over, or the document ends
      // up with two conflicting injected metas (a doc-page page is the
      // document; the deck re-ensures its meta if every doc-page leaves).
      const deckMeta = document.getElementById('deck-stage-print-sizing');
      if (deckMeta) deckMeta.remove();
      const tag = own || document.createElement('meta');
      tag.id = id;
      tag.name = 'omelette-print-sizing';
      tag.content = mode;
      tag.setAttribute('data-omelette-injected', '');
      if (!own) document.head.appendChild(tag);
    }
    _scheduleMeasure() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = null;
        this._measure();
      });
    }

    /** Slot heights feed the print spacers (--doc-hdr-h / --doc-ftr-h), so
     *  they re-measure on content mutation, resize, and font load. The
     *  same pass detects explicit pagination (direct .page children) and
     *  toggles the sheet between the flowing-document card and the
     *  page-per-card stack — content edits can add or remove pages at any
     *  time, so this tracks the same mutations the measurement does. */
    _measure() {
      const hdr = this.querySelector(':scope > [slot="header"]');
      const ftr = this.querySelector(':scope > [slot="footer"]');
      const wasPaginated = this._sheet.classList.contains('paginated');
      this._sheet.classList.toggle('paginated', this.querySelector(':scope > .page') !== null);
      // The WebKit @page margin is flowing-only, so a pagination flip
      // must re-emit the rule (content edits can add or remove .page
      // sections at any time).
      if (this._sheet.classList.contains('paginated') !== wasPaginated) {
        this._syncPrintPageRule();
      }
      this._syncSize(hdr ? hdr.offsetHeight : 0, ftr ? ftr.offsetHeight : 0);
    }
  }
  if (!customElements.get('doc-page')) {
    customElements.define('doc-page', DocPage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "doc-page.js", error: String((e && e.message) || e) }); }

// ui_kits/calendar/BirthdayManager.jsx
try { (() => {
const {
  useState
} = React;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function BirthdayManager({
  birthdays,
  onAdd,
  onDelete,
  onClose
}) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [msg, setMsg] = useState("");
  const selStyle = {
    padding: "8px 10px",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    background: "var(--input-bg)",
    fontSize: 14,
    fontFamily: "var(--b-font)",
    outline: "none",
    color: "var(--txt)",
    minWidth: 70
  };
  const add = () => {
    if (!name.trim() || !day || !month) {
      setMsg("Fill in name, day, and month");
      return;
    }
    onAdd({
      name: name.trim(),
      day: +day,
      month: +month - 1,
      year: year ? +year : null
    });
    setName("");
    setDay("");
    setMonth("");
    setYear("");
    setMsg("");
  };
  return /*#__PURE__*/React.createElement(__ds_scope.Modal, {
    onClose: onClose,
    title: "\uD83C\uDF82 Birthdays",
    subtitle: "Manage birthdays \u2014 they show every year with age",
    maxWidth: 500
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 300,
      overflowY: "auto",
      margin: "12px 0"
    }
  }, birthdays.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "var(--txt2)",
      padding: 20,
      fontSize: 14
    }
  }, "No birthdays yet \u2014 add one below!"), birthdays.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 10px",
      borderRadius: 10,
      marginBottom: 4,
      background: "rgba(128,128,128,.06)",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "\uD83C\uDF82 ", b.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--txt2)"
    }
  }, b.day, " ", MONTHS[b.month], b.year ? ` ${b.year} · Age ${2026 - b.year}` : "")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(i),
    title: "Delete",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      padding: "2px 5px",
      borderRadius: 6
    }
  }, "\uD83D\uDDD1\uFE0F")))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--border)",
      margin: "3px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TextInput, {
    placeholder: "Person's name",
    value: name,
    onChange: e => setName(e.target.value),
    style: {
      flex: 1,
      minWidth: 120,
      padding: "8px 10px",
      fontSize: 14,
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: day,
    onChange: e => setDay(e.target.value),
    style: selStyle
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Day"), Array.from({
    length: 31
  }, (_, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i + 1
  }, i + 1))), /*#__PURE__*/React.createElement("select", {
    value: month,
    onChange: e => setMonth(e.target.value),
    style: selStyle
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Month"), MONTHS.map((m, i) => /*#__PURE__*/React.createElement("option", {
    key: m,
    value: i + 1
  }, m))), /*#__PURE__*/React.createElement(__ds_scope.TextInput, {
    type: "number",
    placeholder: "Year (optional)",
    value: year,
    onChange: e => setYear(e.target.value),
    style: {
      width: 110,
      padding: "8px 10px",
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      padding: "8px 16px",
      border: "none",
      borderRadius: 10,
      background: "var(--btn)",
      color: "#fff",
      fontSize: 14,
      fontFamily: "var(--b-font)",
      cursor: "pointer",
      fontWeight: 700,
      whiteSpace: "nowrap"
    }
  }, "Add")), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 13,
      color: "var(--accent)"
    }
  }, msg));
}
Object.assign(__ds_scope, { BirthdayManager });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/BirthdayManager.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calendar/DayModal.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const INK = {
  good: "#27ae60",
  bad: "#e74c3c",
  neutral: "var(--txt2)"
};
function DayModal({
  dateKey,
  data,
  bday,
  holiday,
  weather,
  onSave,
  onClose
}) {
  const [marked, setMarked] = useState(false);
  const [markColor, setMarkColor] = useState("red");
  const [goal, setGoal] = useState(false);
  const [note, setNote] = useState("");
  const [diary, setDiary] = useState("");
  const [mood, setMood] = useState("good");
  useEffect(() => {
    const d = data || {};
    setMarked(!!d.marked);
    setMarkColor(d.markColor || "red");
    setGoal(!!d.goal);
    setNote(d.note || "");
    setDiary(d.diary || "");
    setMood("good");
  }, [dateKey]);
  if (!dateKey) return null;
  const d = new Date(dateKey + "T00:00:00");
  const lines = diary.split("\n").filter(l => l.trim());
  return /*#__PURE__*/React.createElement(__ds_scope.Modal, {
    onClose: onClose,
    title: d.getDate() + " " + MONTHS[d.getMonth()],
    subtitle: DN[d.getDay()] + ", " + d.getFullYear()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8,
      marginBottom: 12
    }
  }, bday && /*#__PURE__*/React.createElement(__ds_scope.InfoBanner, {
    kind: "birthday"
  }, "\uD83C\uDF82 ", /*#__PURE__*/React.createElement("b", null, bday.name), bday.age != null ? /*#__PURE__*/React.createElement("span", null, " turns ", /*#__PURE__*/React.createElement("b", null, bday.age)) : /*#__PURE__*/React.createElement("span", null, "'s birthday")), holiday && /*#__PURE__*/React.createElement(__ds_scope.InfoBanner, {
    kind: "holiday"
  }, "\uD83C\uDF8C ", /*#__PURE__*/React.createElement("b", null, holiday)), weather && /*#__PURE__*/React.createElement(__ds_scope.InfoBanner, {
    kind: "weather"
  }, weather.icon, " ", /*#__PURE__*/React.createElement("b", null, weather.hi, "\xB0C"), " / ", weather.lo, "\xB0C")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: marked,
    onChange: setMarked
  }, "\u2715 Mark this day"), marked && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      marginLeft: 28
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ColorDotPicker, {
    value: markColor,
    onChange: setMarkColor
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: goal,
    onChange: setGoal,
    accentColor: "var(--goal)"
  }, "\u2B50 Goal achieved")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.TextArea, {
    label: "\uD83D\uDCDD Note",
    inkColor: "var(--note)",
    rows: 2,
    placeholder: "Quick note...",
    value: note,
    onChange: e => setNote(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 16,
      display: "block",
      marginBottom: 5,
      fontWeight: 600
    }
  }, "\uD83D\uDCD6 Personal Diary"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.MoodPicker, {
    value: mood,
    onChange: setMood
  })), /*#__PURE__*/React.createElement(__ds_scope.TextArea, {
    inkColor: "var(--diary)",
    rows: 4,
    placeholder: "Type a line... switch ink color for the next line",
    value: diary,
    onChange: e => setDiary(e.target.value)
  }), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      lineHeight: 1.7,
      background: "color-mix(in srgb,var(--input-bg) 80%,transparent)",
      border: "1px solid color-mix(in srgb,var(--border) 50%,transparent)"
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: INK[mood]
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      marginRight: 6,
      verticalAlign: "middle",
      background: mood === "good" ? "#27ae60" : mood === "bad" ? "#e74c3c" : "#999"
    }
  }), l)))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    style: {
      marginTop: 6
    },
    onClick: () => onSave({
      marked,
      markColor,
      goal,
      note,
      diary,
      diaryMood: mood
    })
  }, "Save Entry"));
}
Object.assign(__ds_scope, { DayModal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/DayModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calendar/LoginScreen.jsx
try { (() => {
const {
  useState
} = React;
function LoginScreen({
  onSignIn
}) {
  const [tab, setTab] = useState("signin");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--card-bg)",
      border: "2px solid var(--border)",
      borderRadius: 20,
      padding: "36px 30px 28px",
      width: "90%",
      maxWidth: 380,
      boxShadow: "var(--shadow)",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      fontFamily: "var(--b-font)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      textAlign: "center",
      lineHeight: 1
    }
  }, "\uD83D\uDCC5"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 26,
      color: "var(--txt)",
      fontFamily: "var(--h-font)",
      fontWeight: 900,
      textAlign: "center"
    }
  }, "My Calendar"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 4px",
      fontSize: 13,
      color: "var(--txt2)",
      textAlign: "center"
    }
  }, tab === "signin" ? "Sign in to your calendar" : "Create your calendar account"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      background: "rgba(128,128,128,.1)",
      borderRadius: 10,
      padding: 4
    }
  }, [["signin", "Sign In"], ["signup", "Sign Up"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      flex: 1,
      padding: 7,
      border: "none",
      borderRadius: 7,
      background: tab === k ? "var(--card-bg)" : "transparent",
      color: tab === k ? "var(--txt)" : "var(--txt2)",
      fontSize: 13,
      cursor: "pointer",
      fontFamily: "var(--b-font)",
      fontWeight: 600,
      boxShadow: tab === k ? "0 2px 8px rgba(0,0,0,.2)" : "none",
      transition: "all .15s"
    }
  }, l))), /*#__PURE__*/React.createElement(__ds_scope.TextInput, {
    type: "email",
    placeholder: "Email address",
    style: {
      padding: "11px 14px"
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.TextInput, {
    type: "password",
    placeholder: "Password",
    style: {
      padding: "11px 14px"
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    style: {
      padding: 12,
      fontSize: 16
    },
    onClick: onSignIn
  }, tab === "signin" ? "Sign In" : "Create Account"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--txt2)",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--border)"
    }
  }), "or", /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--border)"
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "google",
    style: {
      padding: 12,
      fontSize: 16,
      fontWeight: 600
    },
    onClick: onSignIn
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/google-g.svg",
    width: "18",
    alt: ""
  }), " Continue with Google")));
}
Object.assign(__ds_scope, { LoginScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calendar/MonthYearPicker.jsx
try { (() => {
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function MonthYearPicker({
  month,
  year,
  onMonth,
  onYear,
  onClose
}) {
  const cellBase = {
    padding: "8px 6px",
    border: "1.5px solid transparent",
    borderRadius: 9,
    background: "rgba(128,128,128,.08)",
    color: "var(--txt)",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--b-font)",
    fontWeight: 600,
    textAlign: "center",
    transition: "all .12s"
  };
  const act = {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)"
  };
  const years = [];
  for (let y = 2031; y >= 2020; y--) years.push(y);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      backdropFilter: "blur(4px)"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--card-bg)",
      border: "2px solid var(--border)",
      borderRadius: 18,
      padding: 22,
      display: "flex",
      gap: 16,
      boxShadow: "var(--shadow)",
      maxWidth: 380,
      width: "90%",
      fontFamily: "var(--b-font)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--txt2)",
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Month"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 4
    }
  }, MONTHS.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => onMonth(i),
    style: {
      ...cellBase,
      ...(i === month ? act : {})
    }
  }, m.slice(0, 3))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--txt2)",
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Year"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
      maxHeight: 240,
      overflowY: "auto",
      paddingRight: 4,
      minWidth: 70
    }
  }, years.map(y => /*#__PURE__*/React.createElement("button", {
    key: y,
    onClick: () => onYear(y),
    style: {
      ...cellBase,
      padding: "6px 14px",
      ...(y === year ? act : {})
    }
  }, y))))));
}
Object.assign(__ds_scope, { MonthYearPicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/MonthYearPicker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calendar/TopBar.jsx
try { (() => {
const THEMES = [["Newsprint", "📰"], ["Linen", "🪷"], ["Terminal Green", "🟢"], ["Botanical Sketch", "🌾"], ["Concrete", "🧱"], ["Plum Velvet", "🍷"], ["Solar Flare", "🌞"], ["Parchment Journal", "📜"], ["Midnight Tokyo", "🌃"], ["Forest Morning", "🌿"], ["Ocean Breeze", "🌊"], ["Sunset Amber", "🌅"], ["Lavender Dusk", "🪻"], ["Carbon Night", "🖤"]];
function TopBar({
  onToday,
  bulkMode,
  onBulk,
  wxMode,
  onWx,
  onBdays,
  theme,
  onTheme,
  onSignOut
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 840,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
      position: "relative",
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PillButton, {
    variant: "accent",
    onClick: onToday
  }, "\u25CF Today"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    title: "Bulk Mark Mode",
    active: bulkMode,
    onClick: onBulk
  }, "\u2715"), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    title: "Weather View",
    active: wxMode,
    onClick: onWx
  }, "\uD83C\uDF24\uFE0F"), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    title: "Birthday Manager",
    onClick: onBdays
  }, "\uD83C\uDF82"), /*#__PURE__*/React.createElement(__ds_scope.Dropdown, {
    trigger: THEMES[theme][1] + " " + THEMES[theme][0],
    options: THEMES.map(([n, e], i) => ({
      label: e + " " + n,
      active: i === theme,
      onSelect: () => onTheme(i)
    }))
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    title: "Sign Out",
    onClick: onSignOut
  }, "\uD83D\uDEAA")));
}
Object.assign(__ds_scope, { THEMES, TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/calendar/CalendarApp.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HOLIDAYS = {
  "2026-08-11": "Mountain Day",
  "2026-09-21": "Respect for Aged",
  "2026-09-23": "Autumnal Equinox",
  "2026-10-12": "Sports Day",
  "2026-11-03": "Culture Day",
  "2026-11-23": "Labor Thanksgiving",
  "2026-07-20": "Marine Day"
};
const WEATHER = {
  "2026-08-25": {
    icon: "☀️",
    hi: 33,
    lo: 25
  },
  "2026-08-26": {
    icon: "⛅",
    hi: 31,
    lo: 24
  },
  "2026-08-27": {
    icon: "🌧️",
    hi: 28,
    lo: 23
  },
  "2026-08-28": {
    icon: "⛈️",
    hi: 27,
    lo: 22
  },
  "2026-08-29": {
    icon: "🌤️",
    hi: 30,
    lo: 23
  },
  "2026-08-30": {
    icon: "☀️",
    hi: 32,
    lo: 24
  },
  "2026-08-31": {
    icon: "⛅",
    hi: 31,
    lo: 24
  }
};
const SAMPLE = {
  "2026-08-03": {
    marked: true,
    markColor: "teal",
    note: "Gym 7am"
  },
  "2026-08-05": {
    marked: true,
    markColor: "teal"
  },
  "2026-08-07": {
    marked: true,
    markColor: "red",
    note: "Deadline!"
  },
  "2026-08-10": {
    goal: true,
    note: "Shipped v2"
  },
  "2026-08-12": {
    marked: true,
    markColor: "purple",
    diary: "Quiet day at home",
    diaryMood: "neutral"
  },
  "2026-08-14": {
    diary: "Great ramen with K · Long walk",
    diaryMood: "good"
  },
  "2026-08-17": {
    marked: true,
    markColor: "teal"
  },
  "2026-08-19": {
    marked: true,
    markColor: "orange",
    note: "Dentist 15:00"
  },
  "2026-08-21": {
    goal: true,
    marked: true,
    markColor: "teal",
    diary: "Ran 10k!",
    diaryMood: "good"
  },
  "2026-08-24": {
    diary: "Rough meeting · slept badly",
    diaryMood: "bad"
  }
};
function daysIn(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDay(y, m) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function CalendarApp() {
  const [signedIn, setSignedIn] = useState(false);
  const [theme, setTheme] = useState(0);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7);
  const [calData, setCalData] = useState(SAMPLE);
  const [birthdays, setBirthdays] = useState([{
    name: "Yuki",
    day: 30,
    month: 7,
    year: 1996
  }, {
    name: "Mom",
    day: 14,
    month: 9,
    year: null
  }]);
  const [modalKey, setModalKey] = useState(null);
  const [showBdays, setShowBdays] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkColor, setBulkColor] = useState("red");
  const [wxMode, setWxMode] = useState(false);
  const dk = d => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const bdayFor = (m, d) => {
    const b = birthdays.find(x => x.month === m && x.day === d);
    return b ? {
      name: b.name,
      age: b.year ? 2026 - b.year : null
    } : null;
  };
  const today = new Date(2026, 7, 25);
  const dim = daysIn(year, month),
    fd = firstDay(year, month),
    pDim = daysIn(year, month === 0 ? 11 : month - 1);
  const total = Math.ceil((fd + dim) / 7) * 7,
    rows = total / 7;
  const cells = [];
  for (let i = 0; i < total; i++) {
    let day, cur;
    if (i < fd) {
      day = pDim - fd + i + 1;
      cur = false;
    } else if (i < fd + dim) {
      day = i - fd + 1;
      cur = true;
    } else {
      day = i - fd - dim + 1;
      cur = false;
    }
    const key = cur ? dk(day) : null,
      dd = key ? calData[key] : null;
    const bday = cur ? bdayFor(month, day) : null;
    const wx = key ? WEATHER[key] : null;
    const p = {
      day,
      outMonth: !cur,
      weekend: i % 7 >= 5,
      lastRow: Math.floor(i / 7) === rows - 1,
      today: cur && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    };
    if (cur && !wxMode && dd) Object.assign(p, {
      marked: dd.marked,
      markColor: dd.markColor,
      goal: dd.goal,
      note: dd.note,
      diary: dd.diary,
      diaryMood: dd.diaryMood
    });
    if (cur) Object.assign(p, {
      birthday: wxMode ? undefined : bday ? bday.name : undefined,
      holiday: wxMode ? undefined : HOLIDAYS[key],
      weather: wx ? wx.icon : undefined
    });
    p.onClick = cur ? () => {
      if (bulkMode) {
        setCalData(c => {
          const n = {
            ...c
          };
          const e = n[key];
          if (e && e.marked) {
            n[key] = {
              ...e,
              marked: false
            };
          } else {
            n[key] = {
              ...(e || {}),
              marked: true,
              markColor: bulkColor
            };
          }
          return n;
        });
      } else setModalKey(key);
    } : undefined;
    cells.push(/*#__PURE__*/React.createElement(__ds_scope.CalendarCell, _extends({
      key: i
    }, p)));
  }
  const ent = Object.values(calData);
  const stats = wxMode ? ["🌡️ Week: 33°C / 22°C", "🌧️ Rain expected"] : [`✕ ${ent.filter(e => e.marked).length} marked`, `⭐ ${ent.filter(e => e.goal).length} goals`, `📖 ${ent.filter(e => e.diary).length} diary entries`];
  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else setMonth(m => m + 1);
  };
  const mk = modalKey ? new Date(modalKey + "T00:00:00") : null;
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": theme,
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "var(--b-font)",
      color: "var(--txt)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "14px 10px 36px",
      transition: "background .5s ease",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "var(--pattern)",
      pointerEvents: "none",
      zIndex: 0
    }
  }), !signedIn && /*#__PURE__*/React.createElement(__ds_scope.LoginScreen, {
    onSignIn: () => setSignedIn(true)
  }), /*#__PURE__*/React.createElement(__ds_scope.TopBar, {
    onToday: () => {
      setYear(2026);
      setMonth(7);
    },
    bulkMode: bulkMode,
    onBulk: () => setBulkMode(b => !b),
    wxMode: wxMode,
    onWx: () => setWxMode(w => !w),
    onBdays: () => setShowBdays(true),
    theme: theme,
    onTheme: setTheme,
    onSignOut: () => setSignedIn(false)
  }), bulkMode && /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 840,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "8px 14px",
      background: "var(--card-bg)",
      border: "1.5px solid var(--accent)",
      borderRadius: 14,
      marginBottom: 8,
      zIndex: 10,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--accent)",
      fontWeight: 700
    }
  }, "\u2715 Bulk Mark Mode"), /*#__PURE__*/React.createElement(__ds_scope.ColorDotPicker, {
    value: bulkColor,
    onChange: setBulkColor,
    size: 22
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    style: {
      width: "auto"
    },
    onClick: () => setBulkMode(false)
  }, "Done")), /*#__PURE__*/React.createElement(__ds_scope.MonthHeader, {
    month: MONTHS[month],
    year: year,
    onPrev: prev,
    onNext: next,
    onTitleClick: () => setShowPicker(true)
  }), /*#__PURE__*/React.createElement(__ds_scope.CalendarGrid, null, cells), /*#__PURE__*/React.createElement(__ds_scope.StatsBar, {
    items: stats
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontSize: 12,
      color: "var(--txt2)",
      opacity: .6
    }
  }, "Click month name to jump \xB7 \u2715 bulk mark \xB7 \uD83C\uDF82 birthdays \xB7 \uD83C\uDF24\uFE0F weather view"), modalKey && /*#__PURE__*/React.createElement(__ds_scope.DayModal, {
    dateKey: modalKey,
    data: calData[modalKey],
    bday: mk ? bdayFor(mk.getMonth(), mk.getDate()) : null,
    holiday: HOLIDAYS[modalKey],
    weather: WEATHER[modalKey],
    onClose: () => setModalKey(null),
    onSave: d => {
      setCalData(c => ({
        ...c,
        [modalKey]: d
      }));
      setModalKey(null);
    }
  }), showBdays && /*#__PURE__*/React.createElement(__ds_scope.BirthdayManager, {
    birthdays: birthdays,
    onAdd: b => setBirthdays(bs => [...bs, b]),
    onDelete: i => setBirthdays(bs => bs.filter((_, j) => j !== i)),
    onClose: () => setShowBdays(false)
  }), showPicker && /*#__PURE__*/React.createElement(__ds_scope.MonthYearPicker, {
    month: month,
    year: year,
    onMonth: setMonth,
    onYear: setYear,
    onClose: () => setShowPicker(false)
  }));
}
Object.assign(__ds_scope, { CalendarApp });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/calendar/CalendarApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CalendarCell = __ds_scope.CalendarCell;

__ds_ns.CalendarGrid = __ds_scope.CalendarGrid;

__ds_ns.MonthHeader = __ds_scope.MonthHeader;

__ds_ns.StatsBar = __ds_scope.StatsBar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PillButton = __ds_scope.PillButton;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.MARK_COLORS = __ds_scope.MARK_COLORS;

__ds_ns.ColorDotPicker = __ds_scope.ColorDotPicker;

__ds_ns.MoodPicker = __ds_scope.MoodPicker;

__ds_ns.TextArea = __ds_scope.TextArea;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Dropdown = __ds_scope.Dropdown;

__ds_ns.InfoBanner = __ds_scope.InfoBanner;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.BirthdayManager = __ds_scope.BirthdayManager;

__ds_ns.CalendarApp = __ds_scope.CalendarApp;

__ds_ns.DayModal = __ds_scope.DayModal;

__ds_ns.LoginScreen = __ds_scope.LoginScreen;

__ds_ns.MonthYearPicker = __ds_scope.MonthYearPicker;

__ds_ns.THEMES = __ds_scope.THEMES;

__ds_ns.TopBar = __ds_scope.TopBar;

})();
