// Particle network background
const c = document.getElementById('bg'), ctx = c.getContext('2d');
const glow = document.getElementById('glow');
let W, H, P = [], m = { x: -999, y: -999 };

function init() {
  W = c.width = innerWidth; H = c.height = innerHeight;
  P = Array.from({ length: Math.min(90, (W / 16) | 0) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
  }));
}
init();
addEventListener('resize', init);
addEventListener('mousemove', e => {
  m.x = e.clientX; m.y = e.clientY;
  glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
});

(function draw() {
  ctx.clearRect(0, 0, W, H);
  P.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = 'rgba(0,229,160,.7)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 7); ctx.fill();
    for (let j = i + 1; j < P.length; j++) {
      const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(61,139,255,${.18 * (1 - d / 130)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
    const dm = Math.hypot(p.x - m.x, p.y - m.y);
    if (dm < 160) {
      ctx.strokeStyle = `rgba(0,229,160,${.4 * (1 - dm / 160)})`;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(m.x, m.y); ctx.stroke();
    }
  });
  requestAnimationFrame(draw);
})();

// Typing effect
const roles = ['SOC Analyst', 'Incident Responder', 'Network Defender'];
const typed = document.getElementById('typed');
let r = 0, ch = 0, del = false;
(function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, del ? --ch : ++ch);
  let t = del ? 40 : 90;
  if (!del && ch === word.length) { t = 1600; del = true; }
  else if (del && ch === 0) { del = false; r = (r + 1) % roles.length; t = 400; }
  setTimeout(type, t);
})();

// Scroll reveal + count-up
const counted = new WeakSet();
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('show');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function countUp(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const end = +el.dataset.count, start = performance.now(), dur = 1600;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

// Card spotlight follows cursor
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const b = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - b.left + 'px');
    card.style.setProperty('--my', e.clientY - b.top + 'px');
  });
});

// Scroll progress bar + footer year
addEventListener('scroll', () => {
  const h = document.documentElement;
  document.getElementById('progress').style.width =
    (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
});
document.getElementById('year').textContent = new Date().getFullYear();

// Visitor counter (talks to api service)
fetch('http://localhost:3000/visits')
  .then(res => res.json())
  .then(data => {
    const el = document.createElement('div');
    el.textContent = `👁 Visitors: ${data.visitors}`;
    el.style.cssText = 'position:fixed;bottom:16px;right:16px;background:rgba(16,24,38,.8);border:1px solid rgba(120,180,255,.2);padding:8px 14px;border-radius:8px;font-family:JetBrains Mono,monospace;font-size:.8rem;color:#00e5a0;z-index:99';
    document.body.appendChild(el);
  })
  .catch(() => {}); // fails silently if api isn't running