// ---------- icon set (inline SVG, no external icon font needed) ----------
const ICONS = {
  discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A18 18 0 0 0 15.9 3l-.3.6a13 13 0 0 1 3.7 1.4 15 15 0 0 0-13.9 0A13 13 0 0 1 9 3.6L8.8 3a18 18 0 0 0-4.4 1.4C1.6 8.3 1 12.1 1.3 15.8a18 18 0 0 0 5.5 2.8l.9-1.4a12 12 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.4 0l.5.4a12 12 0 0 1-1.9.9l.9 1.4a18 18 0 0 0 5.5-2.8c.4-4.6-.7-8.3-2.9-11.4ZM8.8 13.6c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm6.4 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-7.6 8.7L22 21h-6.9l-5.4-6.6L3.4 21H.4l8.2-9.3L2 3h7l4.9 6Zm-1.2 16h1.7L7.8 5H6Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1-1.5-1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.6 0 0 .9-.3 2.9 1a10 10 0 0 1 5.2 0c2-1.3 2.9-1 2.9-1 .6 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>',
  twitch: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 2 2.5 6v13h5V22l3.5-3H15L21 13V2Zm15 10-3 3h-3.5L10 17.5V15H6V4h13Z"/><rect x="14.5" y="7" width="1.8" height="5" fill="currentColor"/><rect x="10" y="7" width="1.8" height="5" fill="currentColor"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 15 15 9"/><path d="M13.5 6.5 15 5a3.5 3.5 0 0 1 5 5l-1.5 1.5"/><path d="M10.5 17.5 9 19a3.5 3.5 0 0 1-5-5l1.5-1.5"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.4-.4-5a2.8 2.8 0 0 0-2-2C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2C2 8.6 2 12 2 12s0 3.4.4 5a2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2c.4-1.6.4-5 .4-5ZM10 15.5v-7l6 3.5Z"/></svg>',
};

const arrowSvg = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function iconFor(name) {
  return ICONS[name] || ICONS.link;
}

// ---------- fetch + render ----------
async function loadProfile() {
  const res = await fetch('/api/profile');
  const p = await res.json();
  render(p);
  bumpViews();
}

function render(p) {
  document.title = `${p.displayName || p.username} — glass`;

  if (p.accent) document.documentElement.style.setProperty('--accent', p.accent);
  if (p.accent2) document.documentElement.style.setProperty('--accent-2', p.accent2);

  document.getElementById('avatar').src = p.avatar || '';
  document.getElementById('avatar').alt = p.displayName || p.username || '';
  document.getElementById('display-name').textContent = p.displayName || p.username || '';
  document.getElementById('username').textContent = p.username || '';
  document.getElementById('tagline').textContent = p.tagline || '';

  const dot = document.getElementById('status-dot');
  dot.setAttribute('data-status', p.status || 'offline');

  const badgesEl = document.getElementById('badges');
  badgesEl.innerHTML = (p.badges || [])
    .map((b) => `<span class="badge">${escapeHTML(b)}</span>`)
    .join('');

  const socialsEl = document.getElementById('socials');
  socialsEl.innerHTML = (p.socials || [])
    .map(
      (s) =>
        `<a class="social-btn" href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(s.label)}">${iconFor(s.icon)}</a>`
    )
    .join('');

  const linksEl = document.getElementById('links');
  linksEl.innerHTML = (p.links || [])
    .map(
      (l) =>
        `<a class="link-btn" href="${escapeAttr(l.url)}" target="_blank" rel="noopener noreferrer">
          <span class="ico">${iconFor(l.icon)}</span>
          <span>${escapeHTML(l.label)}</span>
          ${arrowSvg}
        </a>`
    )
    .join('');

  // typewriter over the profile's rotating lines
  if (Array.isArray(p.typedLines) && p.typedLines.length) {
    startTypewriter(p.typedLines);
  }

  // background image override, if configured
  if (p.background && p.background.type === 'image' && p.background.value) {
    const canvas = document.getElementById('bg-canvas');
    canvas.style.backgroundImage = `linear-gradient(180deg, rgba(6,5,11,.55), rgba(6,5,11,.85)), url('${p.background.value}')`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
  }

  // audio player
  const player = document.getElementById('player');
  const audioEl = document.getElementById('audio-el');
  if (p.audio && p.audio.enabled && p.audio.url) {
    audioEl.src = p.audio.url;
    document.getElementById('player-title').textContent = p.audio.title || 'audio';
    player.hidden = false;
  }
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}

// ---------- typewriter ----------
let typeTimer = null;
function startTypewriter(lines) {
  const el = document.getElementById('typed-line');
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = lines[lineIndex];
    if (!deleting) {
      charIndex++;
      el.innerHTML = escapeHTML(current.slice(0, charIndex)) + '<span class="caret"></span>';
      if (charIndex === current.length) {
        deleting = true;
        typeTimer = setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.innerHTML = escapeHTML(current.slice(0, charIndex)) + '<span class="caret"></span>';
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }
    typeTimer = setTimeout(tick, deleting ? 28 : 55);
  }
  clearTimeout(typeTimer);
  tick();
}

// ---------- view counter ----------
async function bumpViews() {
  try {
    const res = await fetch('/api/views', { method: 'POST' });
    const data = await res.json();
    document.getElementById('views-count').textContent = data.views.toLocaleString();
  } catch (e) {
    /* non-fatal */
  }
}

// ---------- cursor spotlight + card tilt (spatial UI) ----------
function initSpatial() {
  const glow = document.getElementById('bg-glow');
  const spot = document.getElementById('cursor-spot');
  const card = document.getElementById('card');

  window.addEventListener('pointermove', (e) => {
    document.body.classList.add('pointer-active');
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;
    glow.style.setProperty('--gx', xPct + '%');
    glow.style.setProperty('--gy', yPct + '%');
    spot.style.left = e.clientX + 'px';
    spot.style.top = e.clientY + 'px';

    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    const inside = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
    if (inside) {
      card.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(0)`;
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    } else {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  });

  window.addEventListener('pointerleave', () => {
    document.body.classList.remove('pointer-active');
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

// ---------- audio player controls ----------
function initPlayer() {
  const btn = document.getElementById('player-btn');
  const audioEl = document.getElementById('audio-el');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  btn.addEventListener('click', () => {
    if (!audioEl.src) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  });

  audioEl.addEventListener('play', () => {
    document.body.classList.add('playing');
    iconPlay.hidden = true;
    iconPause.hidden = false;
    btn.setAttribute('aria-pressed', 'true');
  });
  audioEl.addEventListener('pause', () => {
    document.body.classList.remove('playing');
    iconPlay.hidden = false;
    iconPause.hidden = true;
    btn.setAttribute('aria-pressed', 'false');
  });
}

// ---------- entry veil (lets audio autoplay right after a user gesture) ----------
function initVeil() {
  const veil = document.getElementById('enter-veil');
  veil.addEventListener('click', () => {
    veil.classList.add('hidden');
    const audioEl = document.getElementById('audio-el');
    if (audioEl.src) {
      audioEl.play().catch(() => {});
    }
  }, { once: true });
}

// ---------- boot ----------
document.addEventListener('DOMContentLoaded', () => {
  initSpatial();
  initPlayer();
  initVeil();
  loadProfile();
});
