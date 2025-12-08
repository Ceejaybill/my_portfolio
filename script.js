  /* -------------------------
     Minimal JS interactions
     ------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  // Preloader hide
  window.addEventListener('load', () => {
    setTimeout(()=> document.getElementById('preloader').classList.add('hidden'), 350);
  });

  // Rotating taglines
  (function(){
    const phrases = ['Full-Stack Engineer','Building scalable web apps','Next.js | Node | TypeScript'];
    let i=0;
    const el = document.getElementById('rotatingTag');
    function rotate(){ el.textContent = phrases[i]; i=(i+1)%phrases.length; }
    rotate();
    setInterval(rotate,3000);
  })();

  // Smooth scroll 'Scroll' button
  document.getElementById('scrollDown').addEventListener('click', ()=> {
    document.getElementById('about').scrollIntoView({behavior:'smooth'});
  });

  // Dark mode toggle
  const darkToggle = document.getElementById('darkToggle');
  const htmlEl = document.documentElement;
  darkToggle.addEventListener('click', () => {
    const on = htmlEl.classList.toggle('dark');
    darkToggle.setAttribute('aria-pressed', on? 'true':'false');
    // persist preference (simple)
    try{ localStorage.setItem('theme', on ? 'dark' : 'light') }catch(e){}
  });
  // restore preference
  (function(){
    try{
      const t = localStorage.getItem('theme');
      if(t === 'dark') htmlEl.classList.add('dark');
    }catch(e){}
  })();

  // Mobile overlay nav
  const mobilBtn = document.getElementById('hambtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  if(mobilBtn){
    mobilBtn.addEventListener('click', ()=>{
      const open = mobileOverlay.classList.toggle('show');
      mobilBtn.setAttribute('aria-expanded', open?'true':'false');
    });
  }

  // Show bottom bar on small devices
  function adaptBottomBar(){
    if(window.innerWidth <= 640){
      document.querySelector('.bottom-bar').style.display = 'flex';
      document.querySelector('.hamburger').style.display = 'none';
      document.querySelector('nav.primary a[href="#contact"]').style.display = 'none';
    } else {
      document.querySelector('.bottom-bar').style.display = 'none';
      document.querySelector('.hamburger').style.display = 'none';
    }
  }
  adaptBottomBar();
  window.addEventListener('resize', adaptBottomBar);

  // Project filters
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card=>{
        if(f==='all' || card.dataset.type === f) card.style.display = '';
        else card.style.display = 'none';
      });
    });
  });

  // Experience expand/collapse
  function toggleExp(el){
    el.classList.toggle('expanded');
    const expanded = el.classList.contains('expanded');
    el.setAttribute('aria-expanded', expanded?'true':'false');
  }
  window.toggleExp = toggleExp;

  // Cursor ring
  const cursor = document.getElementById('cursorRing');
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', ()=> cursor.classList.add('active'));
    document.addEventListener('mouseup', ()=> cursor.classList.remove('active'));
  } else { cursor.style.display = 'none' }

  // Project modal open/close (example dataset)
  const projectData = {
    atlas: {
      title: 'Atlas Dashboard',
      year: '2025',
      role: 'Lead engineer',
      stack: 'TypeScript • JavaScript • Chart.js',
      live: 'http://localhost:3000',
      git: 'https://github.com/Ceejaybill/atlas-dashboard',
      img: 'images/atlas.png'
    },
    uikit: {
      title: 'UIKit Pro',
      year:'2023', role:'Frontend lead', stack:'React • TypeScript',
      live:'#', git:'#', img:'assets/project-uikit.jpg'
    },
    checkout: {
      title:'Checkout API', year:'2022', role:'Backend', stack:'Node • Redis',
      live:'#', git:'#', img:'assets/project-checkout.jpg'
    }
  };

  function openProject(id){
    const modal = document.getElementById('projectModal');
    const data = projectData[id];
    if(!data) return;
    document.getElementById('projTitle').textContent = data.title + ' · ' + data.year;
    document.getElementById('projShot').querySelector('img').src = data.img;
    document.getElementById('projLive').href = data.live;
    document.getElementById('projGit').href = data.git;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // trap focus simple
    document.body.style.overflow = 'hidden';
  }
  window.openProject = openProject;

  function closeProject(){
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  window.closeProject = closeProject;
  document.getElementById('projectModal').addEventListener('click', (e)=>{
    if(e.target === e.currentTarget) closeProject();
  });

  // Contact form (placeholder)
  function handleContact(e){
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    // In production: post to serverless function or email service
    alert('Thanks ' + name + '! I received your message. (Demo)\n\n' + message);
    e.target.reset();
  }
  window.handleContact = handleContact;

  // Email copy button
  document.getElementById('copyMail').addEventListener('click', async function(){
    const text = this.textContent.trim();
    try{
      await navigator.clipboard.writeText(text);
      this.textContent = 'Copied ✓';
      setTimeout(()=> this.textContent = text, 1800);
    } catch(e){
      alert('Copy this email: ' + text);
    }
  });

  // Simple IntersectionObserver animations (fade-up)
  const io = new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) {
        ent.target.style.opacity = 1;
        ent.target.style.transform = 'none';
        io.unobserve(ent.target);
      }
    });
  }, {threshold: .12});
  document.querySelectorAll('section, .card, .project-card').forEach(el=>{
    el.style.opacity = 0; el.style.transform = 'translateY(12px)';
    io.observe(el);
  });

  // Accessibility: close modal with Esc
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape'){
      closeProject();
    }
  });