'use strict';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

document.addEventListener("keydown", (e) => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
    ) {
        e.preventDefault();
    }
});

document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("cut", (e) => e.preventDefault());
document.addEventListener("paste", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => e.preventDefault());

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    }
});

const routeTitles = {
    landing: 'Uppara Veeranjaneyulu',
    about: 'About me',
    projects: 'Projects',
    contact: 'Contact me',
    resume: 'Resume'
};

function getRouteFromLocation() {
    const urlParams = new URLSearchParams(window.location.search);
    let paramRoute = (urlParams.get('route') || '').toLowerCase();
    if (paramRoute) {
        if (paramRoute === 'profile') paramRoute = 'about';
        if (paramRoute === 'project') paramRoute = 'projects';
        if (paramRoute === 'home') paramRoute = 'landing';
        if (['landing', 'about', 'projects', 'contact', 'resume'].includes(paramRoute)) {
            return paramRoute;
        }
    }

    let hash = window.location.hash.replace(/^#\/?/g, '').toLowerCase();
    if (hash) {
        if (hash === 'profile') hash = 'about';
        if (hash === 'project') hash = 'projects';
        if (hash === 'home') hash = 'landing';
        if (['landing', 'about', 'projects', 'contact', 'resume'].includes(hash)) {
            return hash;
        }
    }

    if (window.location.protocol !== 'file:') {
        let path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
        if (path.endsWith('.html')) {
            path = path.replace(/\.html$/, '');
        }
        if (path === 'profile') path = 'about';
        if (path === 'project') path = 'projects';
        if (path === 'home') path = 'landing';
        if (path && ['landing', 'about', 'projects', 'contact', 'resume'].includes(path)) {
            return path;
        }
    }

    return 'landing';
}

function navigateTo(route, updateHistory = true) {
    let cleanRoute = String(route || '')
        .replace(/^#\/?|^\/+/g, '')
        .split('?')[0]
        .toLowerCase();

    if (cleanRoute.endsWith('index.html') || cleanRoute.endsWith('.html')) cleanRoute = '';
    if (cleanRoute === 'profile') cleanRoute = 'about';
    if (cleanRoute === 'project') cleanRoute = 'projects';
    if (!cleanRoute || cleanRoute === 'home') cleanRoute = 'landing';

    const validRoutes = ['landing', 'about', 'projects', 'contact', 'resume'];
    if (!validRoutes.includes(cleanRoute)) cleanRoute = 'landing';

    document.querySelectorAll('.portfolio-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });

    const targetView = document.getElementById(`view-${cleanRoute}`) ||
        (cleanRoute === 'about' ? document.getElementById('view-profile') : null);

    if (targetView) {
        targetView.classList.add('active');
        targetView.style.display = 'block';

        if (cleanRoute === 'landing') {
            document.body.classList.add('landing-mode');
            document.body.classList.remove('contact-mode');
        } else if (cleanRoute === 'contact') {
            document.body.classList.remove('landing-mode');
            document.body.classList.add('contact-mode');
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            document.body.classList.remove('landing-mode');
            document.body.classList.remove('contact-mode');
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    document.title = routeTitles[cleanRoute] || 'Uppara Veeranjaneyulu | Portfolio';

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
                    history.pushState({ route: cleanRoute }, '', path);
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

document.addEventListener('click', (e) => {
    const routeLink = e.target.closest('[data-route]');
    if (routeLink) {
        e.preventDefault();
        e.stopPropagation();
        const route = routeLink.getAttribute('data-route');
        navigateTo(route);
    }
});

window.addEventListener('popstate', (e) => {
    let route = (e.state && e.state.route) || getRouteFromLocation();
    navigateTo(route, false);
});

window.addEventListener('hashchange', () => {
    navigateTo(getRouteFromLocation(), false);
});

document.addEventListener('DOMContentLoaded', () => {
    navigateTo(getRouteFromLocation(), false);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});

(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('m9PQkiFvTy8n3N7aV');
    }
})();

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formMsg = document.getElementById('formMessage');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin" style="margin-left: 0.4rem;"></i>';

        if (typeof emailjs === 'undefined') {
            formMsg.textContent = 'Service unavailable. Please email directly.';
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return;
        }

        emailjs.sendForm('service_ww7vtcm', 'template_f2lfego', this)
            .then(() => {
                formMsg.textContent = 'Message sent successfully!';
                formMsg.className = 'form-msg success';
                formMsg.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                setTimeout(() => formMsg.style.display = 'none', 5000);
            }, (err) => {
                formMsg.textContent = 'Failed to send message. Please email directly.';
                formMsg.className = 'form-msg error';
                formMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                console.error(err);
            });
    });
}

(function initDayNightTheme() {
    function getDayNightTheme() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }

    function applyDayNightTheme() {
        const theme = getDayNightTheme();
        document.documentElement.setAttribute('data-theme', theme);
    }

    applyDayNightTheme();
    setInterval(applyDayNightTheme, 60000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            applyDayNightTheme();
        }
    });
    window.addEventListener('focus', applyDayNightTheme);
})();

const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewMoreContainer = document.getElementById('viewMoreContainer');
if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
        const hiddenProjects = document.querySelectorAll('.hidden-project');
        hiddenProjects.forEach(proj => {
            proj.style.display = 'block';
            setTimeout(() => {
                proj.classList.add('visible');
            }, 50);
        });
        if (viewMoreContainer) {
            viewMoreContainer.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'none';
        }
        hiddenProjects.forEach(el => revealObserver.observe(el));
    });
}
