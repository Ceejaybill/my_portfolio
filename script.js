/* -------------------------
   Minimal JS interactions
   ------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

// Safe, working preloader
(function() {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  function hidePreloader() {
    pre.classList.add('hidden');
    document.body.style.overflow = ''; // unlock scroll
    // remove preloader from DOM after fade
    pre.addEventListener('transitionend', () => pre.remove());
  }

  // Check if the page is already loaded
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    // Run on load
    window.addEventListener('load', hidePreloader);
  }

  // Safety fallback: hide after 5s even if load fails
  setTimeout(() => {
    if (!pre.classList.contains('hidden')) hidePreloader();
  }, 5000);
})();


// Rotating taglines
(function () {
  const phrases = ['Full-Stack Engineer', 'Building scalable web apps', 'Next.js | Node | TypeScript'];
  let i = 0;
  const el = document.getElementById('rotatingTag');
  if (!el) return;
  function rotate() { el.textContent = phrases[i]; i = (i + 1) % phrases.length; }
  rotate();
  setInterval(rotate, 3000);
})();

// Smooth scroll 'Scroll' button
document.getElementById('scrollDown')?.addEventListener('click', () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
});

// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
const htmlEl = document.documentElement;
darkToggle?.addEventListener('click', () => {
  const on = htmlEl.classList.toggle('dark');
  darkToggle.setAttribute('aria-pressed', on);
  try { localStorage.setItem('theme', on ? 'dark' : 'light'); } catch {}
});
// restore preference
(function () {
  try { if (localStorage.getItem('theme') === 'dark') htmlEl.classList.add('dark'); } catch {}
})();

/* =====================================================
   MOBILE NAV — FIXED PROPERLY (NO JS CRASH)
   ===================================================== */
const hamBtn = document.getElementById('hambtn');
const mobileNav = document.getElementById('mobileOverlay');

function closeMobileNav() {
  mobileNav.classList.remove('show');
  hamBtn?.setAttribute('aria-expanded', 'false');
  mobileNav?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (hamBtn && mobileNav) {
  // force closed on load
  closeMobileNav();

  hamBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('show');
    hamBtn.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMobileNav)
  );
}

// Bottom bar
function adaptBottomBar() {
  const bar = document.querySelector('.bottom-bar');
  const ham = document.querySelector('.hamburger');
  const contact = document.querySelector('nav.primary a[href="#contact"]');
  if (!bar || !ham) return;

  if (window.innerWidth <= 640) {
    bar.style.display = 'flex';
    ham.style.display = 'block';
    if (contact) contact.style.display = 'none';
  } else {
    bar.style.display = 'none';
    ham.style.display = 'none';
    if (contact) contact.style.display = '';
    closeMobileNav();
  }
}
adaptBottomBar();
window.addEventListener('resize', adaptBottomBar);

/* =====================================================
   PROJECT FILTERS, MODALS, CURSOR, INTERACTIONS
   ===================================================== */

// Project filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.type === f) ? '' : 'none';
    });
  });
});

// Experience expand/collapse
function toggleExp(el) {
  el.classList.toggle('expanded');
  el.setAttribute('aria-expanded', el.classList.contains('expanded'));
}
window.toggleExp = toggleExp;

// Cursor ring
const cursor = document.getElementById('cursorRing');
if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => cursor.classList.add('active'));
  document.addEventListener('mouseup', () => cursor.classList.remove('active'));
} else { cursor?.style.display = 'none'; }

// Project modal
const projectData = { /* ... your projectData object ... */ };

function openProject(id) {
  const modal = document.getElementById('projectModal');
  const data = projectData[id];
  if (!data) return;

  document.getElementById('projTitle').textContent = data.title;
  document.querySelector('#projectModal .muted-small').textContent = `${data.year} · ${data.role} · ${data.stack}`;
  document.getElementById('projLive').href = data.live;
  document.getElementById('projGit').href = data.git;
  document.getElementById('projShot').querySelector('img').src = data.img;
  document.getElementById('projShot').querySelector('img').alt = `${data.title} showcase`;

  const contentDiv = modal.querySelector('.sheet > div:nth-child(3) > div');
  contentDiv.innerHTML = `
    <h4 style="margin:0;font-family:var(--font-heading)">Problem</h4>
    <p class="muted" style="margin-top:8px">${data.problem}</p>
    <h4 style="margin-top:12px;font-family:var(--font-heading)">Solution</h4>
    <p class="muted" style="margin-top:8px">${data.solution}</p>
    <h4 style="margin-top:12px;font-family:var(--font-heading)">Results</h4>
    <ul class="muted" style="margin-top:8px">${data.results.map(r => `<li>${r}</li>`).join('')}</ul>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

window.openProject = openProject;
window.closeProject = closeProject;

document.getElementById('projectModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeProject();
});

// Contact form placeholder
function handleContact(e) {
  e.preventDefault();
  const name = e.target.name.value;
  alert('Thanks ' + name + '! I received your message. (Demo)');
  e.target.reset();
}
window.handleContact = handleContact;

// Email copy button
document.getElementById('copyMail')?.addEventListener('click', async function () {
  const text = this.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    this.textContent = 'Copied ✓';
    setTimeout(() => this.textContent = text, 1800);
  } catch {
    alert('Copy this email: ' + text);
  }
});

// Simple IntersectionObserver animations
const io = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.style.opacity = 1;
      ent.target.style.transform = 'none';
      io.unobserve(ent.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('section, .card, .project-card').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(12px)';
  io.observe(el);
});

// Accessibility: close modal with Esc
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProject(); });
