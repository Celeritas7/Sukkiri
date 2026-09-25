/* Sukkiri — weather + drying score.
   Loaded as a classic script; exposes window.SUKKIRI_WX.

   Shared location lives in localStorage under `app_location` — a neutral key a future
   "home profile" app will own. While `locked` is false Sukkiri may edit it; once the
   owner app sets locked:true, Sukkiri reads it and shows the fields read-only.

     { label, lat, lon, tz, ward, owner, locked, updatedAt }

   Drying model (decided with the user):
   - The SCORE IS THE OUTDOOR SCORE — "how well will things dry on the line today".
     Indoor is a separate rain fallback that never outranks it; it only gets named when
     outdoors is genuinely poor. Indoor is punished by HUMIDITY, not rain.
   - A high precipitation PROBABILITY with no actual precipitation is forecast noise
     (94% chance of a passing shower on a 10h-sun day), so the probability penalty is
     gated on real rain in the total.
   - Futons need real SUN, not merely an absence of rain. */
(function () {
  const KEY = 'app_location';
  const CACHE = 'sukkiri_wx';
  const DEFAULT = {
    label: 'Saitama-shi, Minami-ku', lat: 35.8617, lon: 139.6455,
    tz: 'Asia/Tokyo', ward: 'Minami-ku', owner: 'sukkiri', locked: false
  };

  // WMO weather codes -> the calendar app's emoji set, so both apps read alike
  const ICON = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️', 56: '🌦️', 57: '🌦️',
    61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️',
    80: '🌦️', 81: '🌧️', 82: '🌧️', 85: '❄️', 86: '❄️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  const WORD = {
    0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
  };

  function readLoc() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw.lat === 'number' && typeof raw.lon === 'number') return Object.assign({}, DEFAULT, raw);
    } catch (e) {}
    return Object.assign({}, DEFAULT);
  }

  function writeLoc(patch) {
    const cur = readLoc();
    if (cur.locked && cur.owner && cur.owner !== 'sukkiri') return cur; // owner app has it
    const next = Object.assign({}, cur, patch, { updatedAt: new Date().toISOString() });
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
    return next;
  }

  const clamp = n => Math.max(0, Math.min(100, Math.round(n)));

  /* One day's drying verdict. All inputs may be undefined — an unknown day scores null
     rather than pretending, so the calendar simply shows no verdict. */
  function score(d) {
    if (!d || d.tmax === undefined || d.tmax === null) return null;
    const prob = d.prob == null ? (d.precip > 0 ? 70 : 10) : d.prob;
    const rain = d.precip || 0;
    const rh = d.rh == null ? 60 : d.rh;
    const sun = d.sun || 0;             // hours
    const wind = d.wind || 0;           // km/h

    const wet = rain >= 0.2;
    let out = 100;
    // real rain in the total is what ruins a line-dry; bare probability is discounted
    out -= wet ? Math.min(58, 18 + (prob / 100) * 26 + rain * 9) : (prob / 100) * 12;
    // sunshine cuts BOTH ways — a sunless day is a slow day, not a neutral one
    out += Math.min(12, (sun - 2) * 1.6);
    if (sun < 1) out -= 8;
    if (rh > 60) out -= (rh - 60) * 1.1;
    if (rh > 70) out -= (rh - 70) * 1.6;   // muggy air stalls drying outright
    if (d.tmax < 12) out -= (12 - d.tmax) * 2.5;
    if (!wet) out += Math.min(6, wind * 0.3);  // a breeze only helps a day that isn't raining
    // a day the forecast calls drizzle must never read "good"
    if (wet && prob >= 50) out = Math.min(out, 62);
    out = clamp(out);

    // indoors: rain is irrelevant, damp air is the enemy. A fallback, never the headline.
    let ind = 88;
    if (rh > 55) ind -= (rh - 55) * 1.6;
    if (d.tmax < 14) ind -= (14 - d.tmax) * 1.8;
    ind = clamp(ind);

    /* The reported score is the OUTDOOR one, so the number always answers the same
       question and days rank by real drying. Indoors is only named as a rescue.
       Mark and copy come off the SAME thresholds so they can never disagree. */
    const verdict = out >= 70 ? 'good' : out >= 45 ? 'ok' : 'bad';
    const use = out >= 70 ? 'outside'
      : (wet && prob >= 50 && ind >= 55) ? 'inside'
      : out >= 45 ? 'outside'
      : ind >= 55 ? 'inside' : 'hold';
    const futon = sun >= 3 && rain < 0.5 && rh <= 70 && d.tmax >= 12;

    return {
      out, in: ind, best: out, use, verdict, futon,
      mark: verdict === 'good' ? '☀' : verdict === 'ok' ? '⚠' : '✕',
      color: verdict === 'good' ? '#2f7d4f' : verdict === 'ok' ? '#9a6c1c' : '#b03a4a',
      bg: verdict === 'good' ? '#e6f2e7' : verdict === 'ok' ? '#f7edd8' : '#fbe9f0',
      why: futon
        ? sun + 'h of sun — futon and laundry both dry outside'
        : use === 'outside' ? (verdict === 'good' ? 'Fine for laundry outside' : 'Slow outside — give it the full day')
        : use === 'inside' ? (wet ? 'Rain about — dry it indoors' : 'Damp air outside — indoors is better')
        : (rh > 75 ? 'Damp everywhere — even indoors it will stay wet' : 'Wet day — hold the wash')
    };
  }

  function dayKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* Fetch Open-Meteo (no key) and shape it into { 'YYYY-MM-DD': {...day, dry} }.
     Cached for 3 hours, keyed by coordinates. */
  async function load(force) {
    const loc = readLoc();
    try {
      const c = JSON.parse(localStorage.getItem(CACHE) || 'null');
      if (!force && c && c.v === 3 && c.lat === loc.lat && c.lon === loc.lon && Date.now() - c.at < 3 * 3600e3) return c.days;
    } catch (e) {}

    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + loc.lat + '&longitude=' + loc.lon
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunshine_duration'
      + '&hourly=relative_humidity_2m'
      + '&timezone=' + encodeURIComponent(loc.tz || 'Asia/Tokyo')
      + '&past_days=7&forecast_days=16';

    const res = await fetch(url);
    if (!res.ok) throw new Error('weather ' + res.status);
    const j = await res.json();

    // daytime (9:00–17:00) mean humidity per day — the window that actually dries things
    const rhBy = {};
    const H = j.hourly || {};
    (H.time || []).forEach((t, i) => {
      const hr = parseInt(t.slice(11, 13), 10);
      if (hr < 9 || hr > 17) return;
      const k = t.slice(0, 10);
      (rhBy[k] = rhBy[k] || []).push(H.relative_humidity_2m[i]);
    });

    const days = {};
    const Dd = j.daily || {};
    (Dd.time || []).forEach((k, i) => {
      const rhArr = rhBy[k] || [];
      const day = {
        key: k,
        code: Dd.weather_code[i],
        icon: ICON[Dd.weather_code[i]] || '☁️',
        word: WORD[Dd.weather_code[i]] || '',
        sunWord: '',
        tmax: Math.round(Dd.temperature_2m_max[i]),
        tmin: Math.round(Dd.temperature_2m_min[i]),
        precip: Dd.precipitation_sum[i] || 0,
        prob: Dd.precipitation_probability_max ? Dd.precipitation_probability_max[i] : null,
        wind: Math.round(Dd.wind_speed_10m_max[i] || 0),
        sun: Math.round(((Dd.sunshine_duration ? Dd.sunshine_duration[i] : 0) || 0) / 360) / 10,
        rh: rhArr.length ? Math.round(rhArr.reduce((a, b) => a + b, 0) / rhArr.length) : null
      };
      if (day.sun >= 6 && day.precip < 0.5) { day.word = 'Sunny'; day.icon = '☀️'; }
      else if (day.sun >= 3 && day.precip < 0.5 && /overcast|cloudy/i.test(day.word)) { day.word = 'Sun through cloud'; day.icon = '🌤️'; }
      day.dry = score(day);
      days[k] = day;
    });

    try { localStorage.setItem(CACHE, JSON.stringify({ v: 3, at: Date.now(), lat: loc.lat, lon: loc.lon, days })); } catch (e) {}
    return days;
  }

  /* Best drying day in the next `span` days, for a nudge like
     "Saturday is the best drying day this week". */
  function bestDay(days, span, futonOnly) {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    let best = null;
    for (let i = 0; i < (span || 7); i++) {
      const k = dayKey(new Date(t0.getTime() + i * 86400000));
      const d = days[k];
      if (!d || !d.dry) continue;
      if (futonOnly && !d.dry.futon) continue;
      const v = d.dry.out;
      if (!best || v > best.v) best = { key: k, v, day: d, offset: i };
    }
    return best;
  }

  window.SUKKIRI_WX = { KEY, DEFAULT, readLoc, writeLoc, load, score, bestDay, dayKey, ICON, WORD };
})();
