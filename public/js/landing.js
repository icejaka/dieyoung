function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(str) {
  return escapeHTML(str);
}

// ---------- site config: brand, headline copy, discord DM link ----------
async function loadSite() {
  try {
    const res = await fetch('/api/site');
    const site = await res.json();

    if (site.brand) {
      document.title = `${site.brand} — invite only`;
      document.querySelectorAll('.brand, #foot-brand').forEach((el) => {
        el.textContent = site.brand;
      });
    }

    if (Array.isArray(site.headline) && site.headline.length) {
      const lines = document.querySelectorAll('.headline .line');
      site.headline.forEach((text, i) => {
        if (!lines[i]) return;
        const isLast = i === site.headline.length - 1;
        lines[i].innerHTML = escapeHTML(text) + (isLast ? '<span class="cursor-blink" aria-hidden="true">_</span>' : '');
      });
    }

    if (site.subhead) {
      document.getElementById('sub').textContent = site.subhead;
    }

    const dm = document.getElementById('dm-link');
    if (dm) {
      dm.textContent = site.discordHandle ? `dm ${site.discordHandle} on discord` : 'dm on discord';
      if (site.discordUrl) dm.href = site.discordUrl;
    }
  } catch (e) {
    /* non-fatal — the HTML already has sensible fallback copy */
  }
}

// ---------- member ledger ----------
async function loadMembers() {
  const countEl = document.getElementById('ledger-count');
  try {
    const res = await fetch('/api/members');
    const members = await res.json();
    renderLedger(Array.isArray(members) ? members : []);
  } catch (e) {
    countEl.textContent = '';
  }
}

function renderLedger(members) {
  const rows = document.getElementById('ledger-rows');
  const count = document.getElementById('ledger-count');

  count.textContent = members.length ? `${members.length} member${members.length === 1 ? '' : 's'}` : '';

  rows.innerHTML = members
    .map((m) => {
      const isExternal = /^https?:\/\//i.test(m.url || '');
      const attrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `
        <a class="ledger-row" href="${escapeAttr(m.url || '#')}" ${attrs}>
          <span class="ledger-uid">#${escapeHTML(m.uid ?? '')}</span>
          <span class="ledger-handle">${escapeHTML(m.handle ?? '')}</span>
          <span class="ledger-arrow" aria-hidden="true">&#8599;</span>
        </a>
      `;
    })
    .join('');

  revealRows();
}

function revealRows() {
  const rows = document.querySelectorAll('.ledger-row');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    rows.forEach((r) => r.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), i * 45);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  rows.forEach((r) => io.observe(r));
}

// ---------- invite prompt ----------
function initInviteForm() {
  const form = document.getElementById('invite-form');
  const input = document.getElementById('invite-input');
  const msg = document.getElementById('terminal-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;

    form.classList.remove('shake');
    msg.className = 'terminal-msg';
    msg.textContent = 'checking…';

    try {
      const res = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.valid) {
        msg.textContent = 'access granted — redirecting…';
        msg.classList.add('ok');
        sessionStorage.setItem('glass_invite_ok', '1');
        setTimeout(() => {
          window.location.href = '/profile.html';
        }, 650);
      } else {
        msg.textContent = 'wrong code. try again, or ask for one.';
        msg.classList.add('err');
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 400);
      }
    } catch (err) {
      msg.textContent = 'something broke on our end — try again in a sec.';
      msg.classList.add('err');
    }
  });
}

// ---------- ambient cursor glow (matches the profile card's world) ----------
function initAmbient() {
  const glow = document.getElementById('bg-glow');
  window.addEventListener('pointermove', (e) => {
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;
    glow.style.setProperty('--gx', xPct + '%');
    glow.style.setProperty('--gy', yPct + '%');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSite();
  loadMembers();
  initInviteForm();
  initAmbient();
});
