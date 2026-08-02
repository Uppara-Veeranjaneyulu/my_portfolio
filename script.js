'use strict';


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

document.addEventListener("copy", e => {
    e.preventDefault();
});

document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());
document.addEventListener("dragstart", e => {
    e.preventDefault();
});


// 1. Loader Fade Out
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    }
});

// 2. Header Blur on Scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// 3. Reveal Animations on Scroll
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

// 4. Mobile Navigation
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
    });
}

window.closeMobileMenu = function () {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
};

// 5. Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// 6. Active Nav Link Update
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// 7. EmailJS Form Handling
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
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting...';

        if (typeof emailjs === 'undefined') {
            formMsg.textContent = 'Service unavailable. Please email directly.';
            formMsg.className = 'form-msg error';
            formMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        emailjs.sendForm('service_ww7vtcm', 'template_f2lfego', this)
            .then(() => {
                formMsg.textContent = 'Message transmitted successfully.';
                formMsg.className = 'form-msg success';
                formMsg.style.display = 'block';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                setTimeout(() => formMsg.style.display = 'none', 5000);
            }, (err) => {
                formMsg.textContent = 'Transmission failed. Please email directly.';
                formMsg.className = 'form-msg error';
                formMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                console.error(err);
            });
    });
}

// 8. Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Initialize icon based on current theme
if (themeIcon) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    themeIcon.className = currentTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme') || 'dark';
        const newTheme = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// 10. View More Projects Button
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewMoreContainer = document.getElementById('viewMoreContainer');
if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
        const hiddenProjects = document.querySelectorAll('.hidden-project');
        hiddenProjects.forEach(proj => {
            proj.style.display = 'block';
            // Slight delay to allow CSS to register the display change before animating opacity
            setTimeout(() => {
                proj.classList.add('visible');
            }, 50);
        });
        if (viewMoreContainer) {
            viewMoreContainer.style.display = 'none'; // Hide the entire container
        } else {
            viewMoreBtn.style.display = 'none';
        }

        // Re-trigger observer for newly visible items if necessary
        hiddenProjects.forEach(el => observer.observe(el));
    });
}