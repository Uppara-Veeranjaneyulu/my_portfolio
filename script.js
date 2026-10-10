'use strict';

// -----------------------------------------------------------------------------
// Route Configuration & Mapping
// -----------------------------------------------------------------------------
const routeTitles = {
    landing: "Uppara Veeranjaneyulu",
    home: "Uppara Veeranjaneyulu",
    about: "About",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    gallery: "Gallery",
    resume: "Resume",
    contact: "Contact"
};

function getRouteFromLocation() {
    // 1. URL search parameter: ?route=projects
    const urlParams = new URLSearchParams(window.location.search);
    let paramRoute = (urlParams.get('route') || '').toLowerCase();
    if (paramRoute) {
        if (paramRoute === 'home') paramRoute = 'landing';
        if (paramRoute === 'profile') paramRoute = 'about';
        if (paramRoute === 'project') paramRoute = 'projects';
        if (routeTitles[paramRoute]) return paramRoute;
    }

    // 2. Hash: #projects
    let hash = window.location.hash.replace(/^#\/?/g, '').toLowerCase();
    if (hash) {
        if (hash === 'home') hash = 'landing';
        if (hash === 'profile') hash = 'about';
        if (hash === 'project') hash = 'projects';
        if (routeTitles[hash]) return hash;
    }

    // 3. Pathname: /projects
    if (window.location.protocol !== 'file:') {
        let path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
        if (path.endsWith('.html')) path = path.replace(/\.html$/, '');
        if (path === 'home') path = 'landing';
        if (path === 'profile') path = 'about';
        if (path === 'project') path = 'projects';
        if (path && routeTitles[path]) return path;
    }

    return 'landing';
}

function navigateTo(route, updateHistory = true) {
    let cleanRoute = String(route || '').toLowerCase().trim();
    if (cleanRoute === 'home') cleanRoute = 'landing';
    if (cleanRoute === 'profile') cleanRoute = 'about';
    if (cleanRoute === 'project') cleanRoute = 'projects';
    if (!cleanRoute || !routeTitles[cleanRoute]) cleanRoute = 'landing';

    // Toggle view elements
    document.querySelectorAll('.portfolio-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });

    const targetView = document.getElementById(`view-${cleanRoute}`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }

    // Update active state in sidebar
    document.querySelectorAll('.nav-link-item').forEach(link => {
        const linkRoute = link.getAttribute('data-route');
        if (linkRoute === cleanRoute || (cleanRoute === 'landing' && linkRoute === 'home')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update browser title
    document.title = routeTitles[cleanRoute] || "Uppara Veeranjaneyulu";

    // Scroll back to top of window
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update history URL
    if (updateHistory) {
        if (window.location.protocol === 'file:') {
            const targetHash = cleanRoute === 'landing' ? '' : `#${cleanRoute}`;
            if (window.location.hash !== targetHash) {
                try {
                    history.replaceState({ route: cleanRoute }, '', targetHash || window.location.pathname);
                } catch (e) {
                    window.location.hash = targetHash;
                }
            }
        } else {
            const path = cleanRoute === 'landing' ? '/' : `/${cleanRoute}`;
            if (window.location.pathname !== path) {
                try {
                    history.replaceState({ route: cleanRoute }, '', path);
                } catch (e) {
                    const targetHash = cleanRoute === 'landing' ? '' : `#${cleanRoute}`;
                    if (window.location.hash !== targetHash) {
                        window.location.hash = targetHash;
                    }
                }
            }
        }
    }
}

// Global click handler for data-route links
document.addEventListener('click', (e) => {
    const routeLink = e.target.closest('[data-route]');
    if (routeLink) {
        e.preventDefault();
        const route = routeLink.getAttribute('data-route');
        navigateTo(route);
    }
});

// History navigation events
window.addEventListener('popstate', (e) => {
    let route = (e.state && e.state.route) || getRouteFromLocation();
    navigateTo(route, false);
});

window.addEventListener('hashchange', () => {
    navigateTo(getRouteFromLocation(), false);
});

// -----------------------------------------------------------------------------
// Real Unique Visitor Counter (Persistent & Unique per Device)
// -----------------------------------------------------------------------------
async function initVisitorCounter() {
    const counterEl = document.getElementById('visitorCounter');
    if (!counterEl) return;

    const counterKey = 'veeranji_portfolio_unique_visitors_2026';
    const visitedFlagKey = 'has_visited_veeranji_portfolio';
    const cachedCountKey = 'cached_unique_visitor_count';

    // Show cached unique count immediately to eliminate layout shift / flicker
    let currentCount = parseInt(localStorage.getItem(cachedCountKey) || '0', 10);
    if (currentCount > 0) {
        counterEl.textContent = String(currentCount).padStart(7, '0');
    }

    try {
        const hasVisited = localStorage.getItem(visitedFlagKey);
        // Only increment (/hit) if this device/browser has never visited before.
        // If returning visitor or reloading/navigating, simply retrieve (/get) current count.
        const endpoint = hasVisited
            ? `https://countapi.mileshilliard.com/api/v1/get/${counterKey}`
            : `https://countapi.mileshilliard.com/api/v1/hit/${counterKey}`;

        const res = await fetch(endpoint, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data.value === 'number') {
                const count = data.value;
                localStorage.setItem(visitedFlagKey, 'true');
                localStorage.setItem(cachedCountKey, String(count));
                counterEl.textContent = String(count).padStart(7, '0');
                return;
            }
        }
    } catch (e) {
        // Fallback gracefully on local / offline environments
    }

    // Default starting point if API is unreachable
    if (!currentCount) {
        currentCount = 1;
        counterEl.textContent = String(currentCount).padStart(7, '0');
    }
}

// -----------------------------------------------------------------------------
// EmailJS Contact Form Integration
// -----------------------------------------------------------------------------
(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init('m9PQkiFvTy8n3N7aV');
        } catch (e) {
            console.warn('EmailJS initialization note:', e);
        }
    }
})();

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formMsg = document.getElementById('formMessage');
        const originalHTML = submitBtn.innerHTML;

        // 1. Honeypot check for spam bots
        const gotcha = document.getElementById('_gotcha');
        if (gotcha && gotcha.value.trim() !== '') {
            // Silently pretend success to avoid giving hints to bots
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            setTimeout(() => {
                formMsg.textContent = 'Message sent successfully!';
                formMsg.className = 'form-msg success';
                formMsg.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }, 600);
            return;
        }

        // 2. Client-side Rate Limiting (1 message every 60 seconds)
        const now = Date.now();
        const lastSent = parseInt(sessionStorage.getItem('last_msg_sent_ts') || '0', 10);
        const cooldown = 60000;
        if (now - lastSent < cooldown) {
            const remaining = Math.ceil((cooldown - (now - lastSent)) / 1000);
            formMsg.textContent = `Security Notice: Please wait ${remaining}s before sending another message.`;
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            return;
        }

        // 3. Email format validation
        const emailInput = document.getElementById('email');
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            formMsg.textContent = 'Please enter a valid email address.';
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';

        if (typeof emailjs === 'undefined') {
            formMsg.textContent = 'Email service is unavailable. Please email directly to uupparaveeranji@gmail.com';
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return;
        }

        emailjs.sendForm('service_ww7vtcm', 'template_f2lfego', this)
            .then(() => {
                sessionStorage.setItem('last_msg_sent_ts', String(Date.now()));
                formMsg.textContent = 'Message sent successfully! Thank you for contacting me.';
                formMsg.className = 'form-msg success';
                formMsg.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                setTimeout(() => {
                    formMsg.style.display = 'none';
                }, 6000);
            }, (err) => {
                formMsg.textContent = 'Failed to deliver message. Please reach out directly to uupparaveeranji@gmail.com';
                formMsg.className = 'form-msg error';
                formMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    });
}

// -----------------------------------------------------------------------------
// Interactive Retro Window Controls (Min/Max/Close Buttons)
// -----------------------------------------------------------------------------
function initWindowControls() {
    document.querySelectorAll('.win-btn.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.retro-panel');
            if (panel) {
                // If closing a panel on the main page, offer quick minimize
                panel.style.display = 'none';
                setTimeout(() => {
                    panel.style.display = 'flex';
                }, 4000); // Automatically restore after 4s
            }
        });
    });
}

// -----------------------------------------------------------------------------
// Interactive Certificate Gallery Modal
// -----------------------------------------------------------------------------
function initGalleryModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalCertTitle');
    const modalImg = document.getElementById('modalCertImg');
    const modalLink = document.getElementById('modalCertLink');
    const closeBtn1 = document.getElementById('closeCertModal');
    const closeBtn2 = document.getElementById('closeCertModalBtn');

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    document.querySelectorAll('.gallery-img-wrap').forEach(wrap => {
        wrap.addEventListener('click', () => {
            const imgSrc = wrap.getAttribute('data-img');
            const title = wrap.getAttribute('data-title');
            const link = wrap.getAttribute('data-link');

            if (modalImg) modalImg.src = imgSrc;
            if (modalTitle) modalTitle.textContent = title || 'Certificate Viewer';
            if (modalLink) {
                modalLink.href = link || imgSrc;
                modalLink.innerHTML = `<i class="fas fa-external-link-alt"></i> ${link && link.endsWith('.pdf') ? 'Open Original PDF' : 'Open Full Resolution'}`;
            }
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });
}

// -----------------------------------------------------------------------------
// Prevent Image Dragging (Cross-Browser)
// -----------------------------------------------------------------------------
function disableImageDrag() {
    document.addEventListener('dragstart', (e) => {
        if (e.target && (e.target.tagName === 'IMG' || e.target.closest('img'))) {
            e.preventDefault();
            return false;
        }
    });

    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
    });
}

// -----------------------------------------------------------------------------
// Disable Right-Click Context Menu & Developer Shortcuts
// -----------------------------------------------------------------------------
function disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', (e) => {
        // Block F12 (Inspect)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
            e.preventDefault();
            return false;
        }
        // Block Ctrl+U (View Source)
        if ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key)) {
            e.preventDefault();
            return false;
        }
    });
}

// -----------------------------------------------------------------------------
// DOM Ready
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    disableRightClick();
    disableImageDrag();
    initVisitorCounter();
    initContactForm();
    initWindowControls();
    initGalleryModal();
    navigateTo(getRouteFromLocation(), false);
});

