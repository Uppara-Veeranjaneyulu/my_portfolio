/* ==========================================
   VEERANJANEYULU PORTFOLIO – ADVANCED JS
   ========================================== */

'use strict';

/* ==========================================
   1. PAGE LOADER
   ========================================== */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Kick off hero animations after load
        initHeroAnimations();
    }, 1800);
});

document.body.style.overflow = 'hidden';

/* ==========================================
   2. CUSTOM CURSOR
   ========================================== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const hoverTargets = 'a, button, .project-card, .skill-category, .s-pill, .edu-card, .filter-btn';
document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
        cursorRing.classList.add('hovered');
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
        cursorRing.classList.remove('hovered');
    }
});

/* ==========================================
   3. ANIMATED CANVAS BACKGROUND
   ========================================== */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];

function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color   = Math.random() > 0.6 ? '#22c55e' : '#4ade80';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create particles
for (let i = 0; i < 90; i++) particles.push(new Particle());

// Draw connecting lines
function drawLines() {
    const MAX_DIST = 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                ctx.save();
                ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.12;
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth   = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ==========================================
   4. SCROLL PROGRESS BAR
   ========================================== */
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ==========================================
   5. HEADER – SCROLLED STATE & ACTIVE NAV
   ========================================== */
const header   = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });

    // Back to top
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 400) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
}, { passive: true });

/* ==========================================
   6. SMOOTH SCROLL – ALL ANCHOR LINKS
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--nav-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Back to top button
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   7. MOBILE MENU
   ========================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}
window.closeMobileMenu = closeMobileMenu;

/* ==========================================
   8. TYPEWRITER EFFECT
   ========================================== */
const roles = [
    'Full Stack Developer',
    'Data Analyst',
    'React Developer',
    'Problem Solver',
    'AI Enthusiast',
    'Open Source Contributor'
];

let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
const typingEl  = document.getElementById('dynamicText');

function typeWriter() {
    if (!typingEl) return;
    const current = roles[roleIndex];
    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === current.length) {
        delay = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        delay       = 400;
    }
    setTimeout(typeWriter, delay);
}

/* ==========================================
   9. HERO ANIMATIONS (post-loader)
   ========================================== */
function initHeroAnimations() {
    // Start typewriter
    setTimeout(typeWriter, 800);
    // Animate stat counters
    animateCounters();
}

/* ==========================================
   10. COUNTER ANIMATION
   ========================================== */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target   = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 1800;
        const step     = target / (duration / 16);
        let current    = 0;

        const tick = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
            } else {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    });
}

/* ==========================================
   11. INTERSECTION OBSERVER – REVEAL
   ========================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay based on sibling index
            const siblings = Array.from(entry.target.parentElement.children);
            const idx      = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 90);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==========================================
   12. SKILL BAR ANIMATION
   ========================================== */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                setTimeout(() => bar.classList.add('animated'), 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ==========================================
   13. PROJECT FILTER
   ========================================== */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cats = card.getAttribute('data-cat') || 'all';

            if (filter === 'all' || cats.includes(filter)) {
                card.classList.remove('hidden');
                // Re-trigger reveal animation
                card.classList.remove('visible');
                setTimeout(() => card.classList.add('visible'), 50);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ==========================================
   14. TILT EFFECT ON PROJECT CARDS
   ========================================== */
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const midX  = rect.width / 2;
        const midY  = rect.height / 2;
        const rotX  = ((y - midY) / midY) * -6;
        const rotY  = ((x - midX) / midX) * 6;

        card.style.transform     = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        card.style.transition    = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform  = 'translateY(0) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.45s ease';
    });
});

/* ==========================================
   15. HERO PROFILE IMAGE PARALLAX (subtle)
   ========================================== */
const profileImg = document.getElementById('profileImg');
if (profileImg) {
    window.addEventListener('mousemove', (e) => {
        const x  = (e.clientX / window.innerWidth  - 0.5) * 10;
        const y  = (e.clientY / window.innerHeight - 0.5) * 10;
        profileImg.style.transform = `scale(1.02) translate(${x}px, ${y}px)`;
    });
}

/* ==========================================
   16. EMAILJS INITIALIZATION & FORM SUBMIT
   ========================================== */
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('m9PQkiFvTy8n3N7aV');
    }
})();

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn   = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');

        // Button loading state
        submitBtn.disabled     = true;
        submitBtn.innerHTML    = '<span>Sending…</span> <i class="fas fa-spinner fa-spin"></i>';

        if (typeof emailjs === 'undefined') {
            showFormMsg(formMessage, 'EmailJS not loaded. Please try again later.', 'error');
            resetBtn(submitBtn);
            return;
        }

        emailjs.sendForm('service_ww7vtcm', 'template_f2lfego', this)
            .then(() => {
                showFormMsg(formMessage, '✅ Message sent! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                resetBtn(submitBtn);
                setTimeout(() => hideFormMsg(formMessage), 6000);
            }, (err) => {
                showFormMsg(formMessage, '❌ Failed to send. Please email me directly.', 'error');
                resetBtn(submitBtn);
                console.error('EmailJS error:', err);
            });
    });
}

function showFormMsg(el, msg, type) {
    el.textContent  = msg;
    el.className    = `form-message ${type}`;
    el.style.display = 'block';
}

function hideFormMsg(el) {
    el.style.display = 'none';
}

function resetBtn(btn) {
    btn.disabled  = false;
    btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
}

/* ==========================================
   17. INPUT FOCUS GLOW EFFECT
   ========================================== */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.005)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

/* ==========================================
   18. SECTION ENTRY ANIMATIONS (Stagger)
   ========================================== */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tag = entry.target.querySelector('.section-tag');
            const ttl = entry.target.querySelector('.section-title');
            const lin = entry.target.querySelector('.section-line');

            [tag, ttl, lin].forEach((el, i) => {
                if (!el) return;
                el.style.opacity   = '0';
                el.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    el.style.opacity    = '1';
                    el.style.transform  = 'translateY(0)';
                }, i * 120);
            });

            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.section-header').forEach(el => sectionObserver.observe(el));

/* ==========================================
   19. FLOATING BADGES MOUSE PARALLAX
   ========================================== */
const floatingBadges = document.querySelectorAll('.floating-badge');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    floatingBadges.forEach((badge, i) => {
        const factor = (i + 1) * 8;
        badge.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});

/* ==========================================
   20. NAV LINK RIPPLE EFFECT
   ========================================== */
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: rgba(34,197,94,0.4);
            left: ${e.offsetX}px; top: ${e.offsetY}px;
            transform: scale(0);
            animation: rippleAnim 0.5s ease forwards;
            pointer-events: none;
        `;
        this.style.position = 'relative';
        this.style.overflow  = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
});

// Inject ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnim {
        to { transform: scale(20); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ==========================================
   21. KEYBOARD NAVIGATION
   ========================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

/* ==========================================
   22. EDUCATION CARD HOVER TRAIL
   ========================================== */
document.querySelectorAll('.edu-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), -4px 0 20px rgba(34,197,94,0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

/* ==========================================
   23. SCROLL-TRIGGERED STAT COUNTERS
       (for when stats re-enter viewport)
   ========================================== */
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

/* ==========================================
   24. THEME TOGGLE (Dark / Light)
   ========================================== */
const themeToggleBtn = document.getElementById('themeToggle');
const themeIconEl    = document.getElementById('themeIcon');
const htmlEl         = document.documentElement;

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
        themeIconEl.className = 'fas fa-sun';
    } else {
        themeIconEl.className = 'fas fa-moon';
    }
}

// Load saved theme on startup
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}
const emailChip = document.querySelector('.social-chip[href^="mailto"]');
if (emailChip) {
    emailChip.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('uupparaveeranji@gmail.com')
            .then(() => {
                const orig = emailChip.innerHTML;
                emailChip.innerHTML = '<i class="fas fa-check"></i> Copied!';
                emailChip.style.color    = '#22c55e';
                emailChip.style.borderColor = '#22c55e';
                setTimeout(() => {
                    emailChip.innerHTML = orig;
                    emailChip.style.color    = '';
                    emailChip.style.borderColor = '';
                }, 2000);
            })
            .catch(() => {
                window.location.href = emailChip.href;
            });
    });
}

/* ==========================================
   25. CANVAS MOUSE INTERACTION
       (particles react to mouse proximity)
   ========================================== */
let canvasMouseX = -999, canvasMouseY = -999;
document.addEventListener('mousemove', (e) => {
    canvasMouseX = e.clientX;
    canvasMouseY = e.clientY;
});

// Override particle update to include mouse repulsion
const origUpdate = Particle.prototype.update;
Particle.prototype.update = function () {
    const dx   = this.x - canvasMouseX;
    const dy   = this.y - canvasMouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
    }
    origUpdate.call(this);
};

/* ==========================================
   26. PERFORMANCE – PAUSE CANVAS WHEN HIDDEN
   ========================================== */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        canvas.style.opacity = '0';
    } else {
        canvas.style.opacity = '0.5';
    }
});

/* ==========================================
   27. SKILL PILL CLICK ANIMATION
   ========================================== */
document.querySelectorAll('.s-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        pill.style.transform = 'scale(0.92)';
        setTimeout(() => {
            pill.style.transform = '';
        }, 150);
    });
});

console.log('%c Veeranjaneyulu Portfolio ', 'background:#22c55e;color:#000;font-size:14px;font-weight:bold;padding:6px 12px;border-radius:4px;');
console.log('%c Built with ❤️  and lots of green ☕', 'color:#4ade80;font-size:12px;');