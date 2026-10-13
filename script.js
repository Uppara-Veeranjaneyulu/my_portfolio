'use strict';

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

function normalizeRoute(route) {
    const r = String(route || '').toLowerCase().trim();
    if (r === 'home') return 'landing';
    if (r === 'profile') return 'about';
    if (r === 'project') return 'projects';
    return r;
}

function getRouteFromLocation() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRoute = normalizeRoute(urlParams.get('route') || '');
    if (paramRoute && routeTitles[paramRoute]) return paramRoute;

    const hash = normalizeRoute(window.location.hash.replace(/^#\/?/g, ''));
    if (hash && routeTitles[hash]) return hash;

    if (window.location.protocol !== 'file:') {
        const path = normalizeRoute(window.location.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, ''));
        if (path && routeTitles[path]) return path;
    }

    return 'landing';
}

function navigateTo(route, updateHistory = true) {
    const cleanRoute = normalizeRoute(route) || 'landing';
    const finalRoute = routeTitles[cleanRoute] ? cleanRoute : 'landing';

    document.querySelectorAll('.portfolio-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });

    const targetView = document.getElementById(`view-${finalRoute}`);
    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';
    }

    document.querySelectorAll('.nav-link-item').forEach(link => {
        const linkRoute = link.getAttribute('data-route');
        link.classList.toggle('active', linkRoute === finalRoute || (finalRoute === 'landing' && linkRoute === 'home'));
    });

    document.title = routeTitles[finalRoute] || "Uppara Veeranjaneyulu";
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (updateHistory) {
        if (window.location.protocol === 'file:') {
            const targetHash = finalRoute === 'landing' ? '' : `#${finalRoute}`;
            if (window.location.hash !== targetHash) {
                try {
                    history.replaceState({ route: finalRoute }, '', targetHash || window.location.pathname);
                } catch {
                    window.location.hash = targetHash;
                }
            }
        } else {
            const path = finalRoute === 'landing' ? '/' : `/${finalRoute}`;
            if (window.location.pathname !== path) {
                try {
                    history.replaceState({ route: finalRoute }, '', path);
                } catch {
                    const targetHash = finalRoute === 'landing' ? '' : `#${finalRoute}`;
                    if (window.location.hash !== targetHash) window.location.hash = targetHash;
                }
            }
        }
    }
}

document.addEventListener('click', (e) => {
    const routeLink = e.target.closest('[data-route]');
    if (routeLink) {
        e.preventDefault();
        navigateTo(routeLink.getAttribute('data-route'));
    }
});

window.addEventListener('popstate', (e) => {
    navigateTo((e.state && e.state.route) || getRouteFromLocation(), false);
});

window.addEventListener('hashchange', () => {
    navigateTo(getRouteFromLocation(), false);
});

async function initVisitorCounter() {
    const counterEl = document.getElementById('visitorCounter');
    if (!counterEl) return;

    const counterKey = 'veeranji_portfolio_unique_visitors_2026';
    const visitedFlagKey = 'has_visited_veeranji_portfolio';
    const cachedCountKey = 'cached_unique_visitor_count';

    let currentCount = parseInt(localStorage.getItem(cachedCountKey) || '0', 10);
    if (currentCount > 0) {
        counterEl.textContent = String(currentCount).padStart(7, '0');
    }

    try {
        const hasVisited = localStorage.getItem(visitedFlagKey);
        const endpoint = hasVisited
            ? `https://countapi.mileshilliard.com/api/v1/get/${counterKey}`
            : `https://countapi.mileshilliard.com/api/v1/hit/${counterKey}`;

        const res = await fetch(endpoint, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data && typeof data.value === 'number') {
                localStorage.setItem(visitedFlagKey, 'true');
                localStorage.setItem(cachedCountKey, String(data.value));
                counterEl.textContent = String(data.value).padStart(7, '0');
                return;
            }
        }
    } catch {
        // Fallback gracefully on local/offline environments
    }

    if (!currentCount) {
        counterEl.textContent = '0000001';
    }
}

(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init('m9PQkiFvTy8n3N7aV');
        } catch (e) {
            console.warn('EmailJS init:', e);
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

        const gotcha = document.getElementById('_gotcha');
        if (gotcha && gotcha.value.trim() !== '') {
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

        const now = Date.now();
        const lastSent = parseInt(sessionStorage.getItem('last_msg_sent_ts') || '0', 10);
        const cooldown = 60000;
        if (now - lastSent < cooldown) {
            const remaining = Math.ceil((cooldown - (now - lastSent)) / 1000);
            formMsg.textContent = `Please wait ${remaining}s before sending another message.`;
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            return;
        }

        const emailInput = document.getElementById('email');
        const emailVal = emailInput ? emailInput.value.trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            formMsg.textContent = 'Please enter a valid email address.';
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';

        if (typeof emailjs === 'undefined') {
            formMsg.textContent = 'Email service unavailable. Please email uupparaveeranji@gmail.com directly.';
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
                setTimeout(() => { formMsg.style.display = 'none'; }, 6000);
            }, () => {
                formMsg.textContent = 'Failed to send. Please reach out directly to uupparaveeranji@gmail.com';
                formMsg.className = 'form-msg error';
                formMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            });
    });
}

function initWindowControls() {
    document.querySelectorAll('.win-btn.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.retro-panel');
            if (panel) {
                panel.style.display = 'none';
                setTimeout(() => { panel.style.display = 'flex'; }, 4000);
            }
        });
    });
}

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
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
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

function disableImageDrag() {
    document.addEventListener('dragstart', (e) => {
        if (e.target && (e.target.tagName === 'IMG' || e.target.closest('img'))) {
            e.preventDefault();
        }
    });
    document.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
}

function disableRightClick() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') { e.preventDefault(); return; }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
            e.preventDefault(); return;
        }
        if ((e.ctrlKey || e.metaKey) && ['u', 'U'].includes(e.key)) e.preventDefault();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    disableRightClick();
    disableImageDrag();
    initVisitorCounter();
    initContactForm();
    initWindowControls();
    initGalleryModal();
    navigateTo(getRouteFromLocation(), false);
});
