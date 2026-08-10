'use strict';

// Always start at top on reload — disable browser scroll restoration
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

// 8. 3-Option Theme Dropdown Manager (System / Light / Dark)
(function initThemeManager() {
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownBtn = document.getElementById('themeDropdownBtn');
    const dropdownItems = document.querySelectorAll('.theme-dropdown-item');
    const currentThemeIcon = document.getElementById('currentThemeIcon');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const iconMap = {
        system: 'fas fa-desktop',
        light: 'fas fa-sun',
        dark: 'fas fa-moon',
        matrix: 'fas fa-code'
    };

    function getSavedPreference() {
        return localStorage.getItem('portfolio-theme') || 'system';
    }

    function applyTheme(preference) {
        const root = document.documentElement;
        let effectiveTheme = preference;

        if (preference === 'system') {
            effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        }

        root.setAttribute('data-theme', effectiveTheme);
        localStorage.setItem('portfolio-theme', preference);

        // Update trigger button icon
        if (currentThemeIcon && iconMap[preference]) {
            currentThemeIcon.className = iconMap[preference];
        }

        // Update active UI state on dropdown items
        dropdownItems.forEach(item => {
            if (item.getAttribute('data-theme-val') === preference) {
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');
            } else {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            }
        });
    }

    // Toggle dropdown menu visibility
    if (themeDropdownBtn && themeDropdown) {
        themeDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = themeDropdown.classList.toggle('open');
            themeDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('open');
                themeDropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Initial application of saved/system theme
    const initialPref = getSavedPreference();
    applyTheme(initialPref);

    // Event listeners for theme dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-theme-val');
            if (val) {
                applyTheme(val);
                if (themeDropdown && themeDropdownBtn) {
                    themeDropdown.classList.remove('open');
                    themeDropdownBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Listen for OS system theme changes live when in System mode
    const handleSystemChange = () => {
        if (getSavedPreference() === 'system') {
            applyTheme('system');
        }
    };

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemChange);
    }
})();

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

// 9. Developer CLI Terminal (Developer Mode)
(function initCLITerminal() {
    const cliTriggerBtn = document.getElementById('cliTriggerBtn');
    const cliModal = document.getElementById('cliModal');
    const cliWindow = document.getElementById('cliWindow');
    const cliHeader = document.getElementById('cliHeader');
    const cliCloseBtn = document.getElementById('cliCloseBtn');
    const cliCloseDot = document.getElementById('cliCloseDot');
    const cliMinDot = document.getElementById('cliMinDot');
    const cliMaxDot = document.getElementById('cliMaxDot');
    const cliInput = document.getElementById('cliInput');
    const cliOutput = document.getElementById('cliOutput');
    const cliBody = document.getElementById('cliBody');

    if (!cliModal || !cliInput || !cliOutput) return;

    let commandHistory = [];
    let historyIndex = -1;

    function openTerminal() {
        cliModal.classList.add('open');
        cliModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => cliInput.focus(), 100);
    }

    function closeTerminal() {
        cliModal.classList.remove('open');
        cliModal.setAttribute('aria-hidden', 'true');
    }

    if (cliTriggerBtn) {
        cliTriggerBtn.addEventListener('click', openTerminal);
    }

    if (cliCloseBtn) {
        cliCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTerminal();
        });
    }

    if (cliCloseDot) {
        cliCloseDot.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTerminal();
        });
    }

    // Draggable Window Logic
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialWinLeft = 0;
    let initialWinTop = 0;

    if (cliHeader && cliWindow) {
        cliHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('.dot')) return;

            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const rect = cliWindow.getBoundingClientRect();
            initialWinLeft = rect.left;
            initialWinTop = rect.top;

            cliWindow.style.transform = 'none';
            cliWindow.style.left = `${initialWinLeft}px`;
            cliWindow.style.top = `${initialWinTop}px`;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            cliWindow.style.left = `${Math.max(10, Math.min(window.innerWidth - 100, initialWinLeft + dx))}px`;
            cliWindow.style.top = `${Math.max(10, Math.min(window.innerHeight - 50, initialWinTop + dy))}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Yellow Dot: Reset Position & Size
    if (cliMinDot && cliWindow) {
        cliMinDot.addEventListener('click', () => {
            cliWindow.style.top = '50%';
            cliWindow.style.left = '50%';
            cliWindow.style.transform = 'translate(-50%, -50%)';
            cliWindow.style.width = '680px';
            cliWindow.style.height = '440px';
        });
    }

    // Keyboard Shortcuts: Ctrl + ~ or Esc
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
            e.preventDefault();
            if (cliModal.classList.contains('open')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        } else if (e.key === 'Escape' && cliModal.classList.contains('open')) {
            closeTerminal();
        }
    });

    function appendLine(content, className = '') {
        const line = document.createElement('div');
        line.className = `cli-line ${className}`;
        line.innerHTML = content;
        cliOutput.appendChild(line);
        cliBody.scrollTop = cliBody.scrollHeight;
    }

    function processCommand(cmdRaw) {
        const cmd = cmdRaw.trim();
        if (!cmd) return;

        // Push to history
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        // Echo command line
        appendLine(`<span class="cli-prompt-entry">uv@portfolio:~$</span> <span class="cli-cmd-echo">${escapeHTML(cmd)}</span>`);

        const parts = cmd.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (mainCmd) {
            case 'help':
            case 'commands':
            case '?':
                appendLine(`<span class="highlight">Available Commands:</span>`);
                appendLine(`  <span class="cmd-text">about</span>      - Profile overview & bio`);
                appendLine(`  <span class="cmd-text">projects</span>   - Selected work & repositories`);
                appendLine(`  <span class="cmd-text">skills</span>     - Technical expertise & stack`);
                appendLine(`  <span class="cmd-text">education</span>  - Academic background & scores`);
                appendLine(`  <span class="cmd-text">resume</span>     - Resume details & download link`);
                appendLine(`  <span class="cmd-text">contact</span>    - Email, LinkedIn & GitHub`);
                appendLine(`  <span class="cmd-text">matrix</span>     - Toggle Matrix Rain Mode`);
                appendLine(`  <span class="cmd-text">theme</span>      - Change theme (<span class="cmd-text">light</span>, <span class="cmd-text">dark</span>, <span class="cmd-text">system</span>, <span class="cmd-text">matrix</span>)`);
                appendLine(`  <span class="cmd-text">clear</span>      - Clear terminal screen`);
                appendLine(`  <span class="cmd-text">exit</span>       - Close terminal window`);
                break;

            case 'matrix':
                const currT = document.documentElement.getAttribute('data-theme');
                const nextT = currT === 'matrix' ? 'dark' : 'matrix';
                localStorage.setItem('portfolio-theme', nextT);
                document.documentElement.setAttribute('data-theme', nextT);
                const matIconMap = { system: 'fas fa-desktop', light: 'fas fa-sun', dark: 'fas fa-moon', matrix: 'fas fa-code' };
                const matThemeIcon = document.getElementById('currentThemeIcon');
                if (matThemeIcon && matIconMap[nextT]) {
                    matThemeIcon.className = matIconMap[nextT];
                }
                appendLine(`<span class="cli-success">Matrix Code Rain Mode ${nextT === 'matrix' ? 'ENABLED' : 'DISABLED'}.</span>`);
                break;

            case 'about':
            case 'bio':
            case 'whoami':
                appendLine(`<span class="highlight">Uppara Veeranjaneyulu</span>`);
                appendLine(`Software Engineer & Data Analyst pursuing B.Tech in CSE at Amrita Vishwa Vidyapeetham.`);
                appendLine(`Specializing in full-stack architecture, microservices, federated social web, and machine learning.`);
                break;

            case 'projects':
            case 'work':
                appendLine(`<span class="highlight">Selected Projects:</span>`);
                appendLine(`1. <span class="cmd-text">Polyverse</span> - Federated Social Network (SvelteKit 5, Fedify, Neon Postgres)`);
                appendLine(`   <a href="https://github.com/PiedPipers5/polyverse.git" target="_blank" class="cli-link">GitHub</a> | <a href="https://polyverse-pp.vercel.app" target="_blank" class="cli-link">Live Demo</a>`);
                appendLine(`2. <span class="cmd-text">CraveQuick</span> - High-Performance Food Delivery Ecosystem (React 19, Node, MongoDB, Socket.io)`);
                appendLine(`   <a href="https://github.com/Uppara-Veeranjaneyulu/cravequick" target="_blank" class="cli-link">GitHub</a> | <a href="https://cravequick.vercel.app/" target="_blank" class="cli-link">Live Demo</a>`);
                appendLine(`3. <span class="cmd-text">GeoGuide</span> - Smart Travel Companion with AI insights`);
                break;

            case 'skills':
            case 'tech':
                appendLine(`<span class="highlight">Technical Expertise:</span>`);
                appendLine(`  <span class="cmd-text">Languages:</span> C, C++, Python, Java, JavaScript, TypeScript, SQL, HTML/CSS`);
                appendLine(`  <span class="cmd-text">Full Stack:</span> React, SvelteKit, Node.js, Express, MongoDB, PostgreSQL, TailwindCSS`);
                appendLine(`  <span class="cmd-text">AI & Data:</span> Data Analytics, Pandas, NumPy, Machine Learning, PowerBI`);
                appendLine(`  <span class="cmd-text">Tools & Cloud:</span> Git, GitHub, Docker, Postman, Vercel, Socket.io`);
                break;

            case 'education':
            case 'edu':
                appendLine(`<span class="highlight">Education Timeline:</span>`);
                appendLine(`  • B.Tech CSE @ Amrita Vishwa Vidyapeetham (2023 - 2027) | CGPA: 7.45`);
                appendLine(`  • Class XII @ Narayana Junior College (2021 - 2023) | Score: 98.2%`);
                appendLine(`  • Class X @ Narayana E.M High School (2021) | Score: 100%`);
                break;

            case 'resume':
                appendLine(`<span class="highlight">Resume Highlights:</span>`);
                appendLine(`Full-stack & data analytics engineer. View or download resume below:`);
                appendLine(`<a href="Uppara_Veeranjaneyulu_Resume_update1.pdf" target="_blank" class="cli-link">Download Resume (PDF)</a>`);
                break;

            case 'contact':
            case 'email':
            case 'socials':
                appendLine(`<span class="highlight">Contact & Socials:</span>`);
                appendLine(`  • Email: <a href="mailto:uupparaveeranji@gmail.com" class="cli-link">uupparaveeranji@gmail.com</a>`);
                appendLine(`  • LinkedIn: <a href="https://www.linkedin.com/in/uppara-veeranjaneyulu-44003728b/" target="_blank" class="cli-link">linkedin.com/in/uppara-veeranjaneyulu-44003728b/</a>`);
                appendLine(`  • GitHub: <a href="https://github.com/Uppara-Veeranjaneyulu" target="_blank" class="cli-link">github.com/Uppara-Veeranjaneyulu</a>`);
                appendLine(`  • LeetCode: <a href="https://leetcode.com/u/Veeranji-Uppara/" target="_blank" class="cli-link">leetcode.com/u/Veeranji-Uppara/</a>`);
                break;

            case 'theme':
                if (args[0] && ['light', 'dark', 'system'].includes(args[0].toLowerCase())) {
                    const themeVal = args[0].toLowerCase();
                    localStorage.setItem('portfolio-theme', themeVal);
                    let effectiveTheme = themeVal;
                    if (themeVal === 'system') {
                        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    document.documentElement.setAttribute('data-theme', effectiveTheme);
                    const iconMap = { system: 'fas fa-desktop', light: 'fas fa-sun', dark: 'fas fa-moon' };
                    const currentThemeIcon = document.getElementById('currentThemeIcon');
                    if (currentThemeIcon && iconMap[themeVal]) {
                        currentThemeIcon.className = iconMap[themeVal];
                    }
                    appendLine(`<span class="cli-success">Theme updated to '${themeVal}'.</span>`);
                } else {
                    appendLine(`<span class="cli-error">Usage: theme [light | dark | system]</span>`);
                }
                break;

            case 'clear':
            case 'cls':
                cliOutput.innerHTML = '';
                break;

            case 'exit':
            case 'close':
            case 'quit':
                closeTerminal();
                break;

            default:
                appendLine(`<span class="cli-error">Command not found: '${escapeHTML(cmd)}'. Type <span class="cmd-text">help</span> for available commands.</span>`);
                break;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = cliInput.value;
            cliInput.value = '';
            processCommand(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                cliInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                cliInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                cliInput.value = '';
            }
        }
    });
})();

// 10. Live GitHub Metrics Integration
(function initGitHubMetrics() {
    const username = 'Uppara-Veeranjaneyulu';
    const ghReposCount = document.getElementById('ghReposCount');
    const ghStarsCount = document.getElementById('ghStarsCount');
    const ghFollowersCount = document.getElementById('ghFollowersCount');
    const ghAvatar = document.getElementById('ghAvatar');
    const ghName = document.getElementById('ghName');
    const ghBio = document.getElementById('ghBio');
    const ghLanguagesList = document.getElementById('ghLanguagesList');

    if (!ghReposCount || !ghLanguagesList) return;

    // 1. Fetch Profile Data
    fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json())
        .then(data => {
            if (data.public_repos !== undefined) {
                animateCounter(ghReposCount, data.public_repos);
                animateCounter(ghFollowersCount, data.followers);
                if (data.avatar_url && ghAvatar) ghAvatar.src = data.avatar_url;
                if (data.name && ghName) ghName.textContent = data.name;
                if (data.bio && ghBio) ghBio.textContent = data.bio;
            }
        })
        .catch(err => console.error('GitHub Profile Fetch Error:', err));

    // 2. Fetch Repositories to calculate total stars & top languages
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        .then(res => res.json())
        .then(repos => {
            if (!Array.isArray(repos)) return;

            let totalStars = 0;
            const langMap = {};
            let totalLangCount = 0;

            repos.forEach(repo => {
                totalStars += (repo.stargazers_count || 0);
                if (repo.language) {
                    langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                    totalLangCount++;
                }
            });

            animateCounter(ghStarsCount, totalStars);

            // Sort languages by count
            const sortedLangs = Object.entries(langMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (sortedLangs.length > 0) {
                ghLanguagesList.innerHTML = '';
                sortedLangs.forEach(([lang, count]) => {
                    const percent = Math.round((count / totalLangCount) * 100);
                    const langItem = document.createElement('div');
                    langItem.className = 'lang-item';
                    langItem.innerHTML = `
                        <div class="lang-info">
                            <span class="lang-name">${lang}</span>
                            <span class="lang-percent">${percent}%</span>
                        </div>
                        <div class="lang-bar-bg">
                            <div class="lang-bar-fill" style="width: 0%;"></div>
                        </div>
                    `;
                    ghLanguagesList.appendChild(langItem);
                    setTimeout(() => {
                        const fill = langItem.querySelector('.lang-bar-fill');
                        if (fill) fill.style.width = `${percent}%`;
                    }, 150);
                });
            }
        })
        .catch(err => console.error('GitHub Repos Fetch Error:', err));

    function animateCounter(el, target) {
        if (!el) return;
        let start = 0;
        const duration = 1200;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = Math.max(1, target / steps);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(start);
            }
        }, stepTime);
    }
})();

// 11. Interactive Audio Feedback Synthesizer (SFX Mode)
(function initSFXManager() {
    const sfxToggleBtn = document.getElementById('sfxToggleBtn');
    const sfxIcon = document.getElementById('sfxIcon');
    let audioCtx = null;
    let isSFXEnabled = localStorage.getItem('portfolio-sfx') === 'on';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playKeyClick() {
        if (!isSFXEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            // Synthetic mechanical key click (12ms noise burst with highpass filter)
            const bufferSize = ctx.sampleRate * 0.012;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1800;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start();
        } catch (e) {
            // Ignore web audio exceptions
        }
    }

    function playButtonPop() {
        if (!isSFXEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            // Subtle 25ms sine pop sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.025);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.025);
        } catch (e) {
            // Ignore
        }
    }

    function playChime(enable) {
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';

            if (enable) {
                osc1.frequency.setValueAtTime(523.25, now);
                osc2.frequency.setValueAtTime(659.25, now + 0.08);
            } else {
                osc1.frequency.setValueAtTime(659.25, now);
                osc2.frequency.setValueAtTime(523.25, now + 0.08);
            }

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc1.stop(now + 0.08);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.2);
        } catch (e) {
            // Ignore
        }
    }

    function updateSFXState(enabled, notify = true) {
        isSFXEnabled = enabled;
        localStorage.setItem('portfolio-sfx', enabled ? 'on' : 'off');

        if (sfxToggleBtn && sfxIcon) {
            if (enabled) {
                sfxToggleBtn.classList.add('active');
                sfxIcon.className = 'fas fa-volume-up';
                sfxToggleBtn.setAttribute('title', 'Sound Effects (SFX Mode: ON)');
            } else {
                sfxToggleBtn.classList.remove('active');
                sfxIcon.className = 'fas fa-volume-mute';
                sfxToggleBtn.setAttribute('title', 'Sound Effects (SFX Mode: OFF)');
            }
        }

        if (notify) {
            playChime(enabled);
        }
    }

    // Initial state setup (muted by default)
    updateSFXState(isSFXEnabled, false);

    // Toggle button listener
    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('click', () => {
            updateSFXState(!isSFXEnabled);
        });
    }

    // Key click listener for CLI input
    const cliInput = document.getElementById('cliInput');
    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== 'Escape') {
                playKeyClick();
            }
        });
    }

    // Button click audio feedback for interactive elements
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .theme-dropdown-item, .nav-link, .btn-primary, .btn-secondary');
        if (btn && btn !== sfxToggleBtn) {
            playButtonPop();
        }
    });
})();

// 12. Matrix Code Rain Canvas Engine
(function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&*';
    const alphabet = katakana + latin;

    const fontSize = 16;
    let columns = 0;
    let rainDrops = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        rainDrops = Array(columns).fill(1);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
        // Subtle trailing fade background
        ctx.fillStyle = 'rgba(3, 10, 5, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * fontSize;
            const y = rainDrops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    // Start/stop loop based on data-theme="matrix"
    const observer = new MutationObserver(() => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'matrix') {
            if (!animationFrameId) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                draw();
            }
        } else {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Initial check
    if (document.documentElement.getAttribute('data-theme') === 'matrix') {
        draw();
    }
})();

// 13. "Ask UV-AI" Portfolio Assistant Engine
(function initUVAIAssistant() {
    const aiTriggerBtn = document.getElementById('aiTriggerBtn');
    const aiChatWindow = document.getElementById('aiChatWindow');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiClearBtn = document.getElementById('aiClearBtn');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChatBody = document.getElementById('aiChatBody');
    const chips = document.querySelectorAll('.ai-chip');

    if (!aiChatWindow || !aiInput || !aiChatBody) return;

    function openChat() {
        aiChatWindow.classList.add('open');
        aiChatWindow.setAttribute('aria-hidden', 'false');
        setTimeout(() => aiInput.focus(), 100);
    }

    function closeChat() {
        aiChatWindow.classList.remove('open');
        aiChatWindow.setAttribute('aria-hidden', 'true');
    }

    if (aiTriggerBtn) aiTriggerBtn.addEventListener('click', openChat);
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeChat);

    if (aiClearBtn) {
        aiClearBtn.addEventListener('click', () => {
            aiChatBody.innerHTML = `
                <div class="ai-msg assistant">
                    <div class="msg-bubble">
                        Hi! I'm <strong>UV-AI</strong>, Uppara's portfolio assistant. Ask me anything about his projects, skills, CGPA, or availability!
                    </div>
                </div>
            `;
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                handleUserQuery(prompt);
            }
        });
    });

    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', () => {
            const val = aiInput.value.trim();
            if (val) {
                aiInput.value = '';
                handleUserQuery(val);
            }
        });
    }

    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = aiInput.value.trim();
                if (val) {
                    aiInput.value = '';
                    handleUserQuery(val);
                }
            }
        });
    }

    function handleUserQuery(query) {
        appendMessage(query, 'user');
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = generateAIResponse(query);
            appendMessage(reply, 'assistant');
        }, 400);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
        aiChatBody.appendChild(msgDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-msg assistant typing-msg';
        typingDiv.id = 'aiTypingIndicator';
        typingDiv.innerHTML = `<div class="msg-bubble"><em>UV-AI is thinking...</em></div>`;
        aiChatBody.appendChild(typingDiv);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('aiTypingIndicator');
        if (typingDiv) typingDiv.remove();
    }

    function generateAIResponse(input) {
        const q = input.toLowerCase();

        if (q.includes('cgpa') || q.includes('grade') || q.includes('degree') || q.includes('education') || q.includes('college') || q.includes('marks') || q.includes('score')) {
            return `🎓 <strong>Education & Academic Standing:</strong><br>
            • <strong>B.Tech Computer Science & Engineering</strong> @ Amrita Vishwa Vidyapeetham (2023 - 2027) | <strong>CGPA: 7.45</strong><br>
            • <strong>Class XII (Intermediate)</strong> @ Narayana Junior College | <strong>98.2%</strong><br>
            • <strong>Class X (SSC)</strong> @ Narayana E.M High School | <strong>100%</strong>`;
        }

        if (q.includes('polyverse') || q.includes('social')) {
            return `🌐 <strong>Polyverse</strong> is a federated social network built with SvelteKit 5, Fedify, TypeScript, Neon PostgreSQL, and TailwindCSS.<br>
            Features cross-instance activity pub protocol federation, real-time messaging, and high-performance serverless database queries.<br>
            <a href="https://github.com/PiedPipers5/polyverse.git" target="_blank" style="color:var(--text-primary); text-decoration:underline;">GitHub Repo</a> | <a href="https://polyverse-pp.vercel.app" target="_blank" style="color:var(--text-primary); text-decoration:underline;">Live Demo</a>`;
        }

        if (q.includes('cravequick') || q.includes('food') || q.includes('delivery')) {
            return `🍕 <strong>CraveQuick</strong> is a high-performance food delivery web application engineered with React 19, Node.js, Express, MongoDB, Socket.io, and TailwindCSS.<br>
            Includes multi-role authorization (Customer, Restaurant Manager, Delivery Driver) and real-time order tracking.<br>
            <a href="https://github.com/Uppara-Veeranjaneyulu/cravequick" target="_blank" style="color:var(--text-primary); text-decoration:underline;">GitHub Repo</a> | <a href="https://cravequick.vercel.app/" target="_blank" style="color:var(--text-primary); text-decoration:underline;">Live Demo</a>`;
        }

        if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('app')) {
            return `🚀 <strong>Featured Engineering Projects:</strong><br>
            1. <strong>Polyverse:</strong> Federated Social Network (SvelteKit 5, Fedify, Neon Postgres)<br>
            2. <strong>CraveQuick:</strong> Multi-Role Food Delivery Platform (React 19, Socket.io, MongoDB)<br>
            3. <strong>GeoGuide:</strong> AI Travel Companion with smart routing.<br>
            Scroll to the <a href="#projects" style="color:var(--text-primary); text-decoration:underline;">Selected Work</a> section to explore live demos!`;
        }

        if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('framework')) {
            return `💻 <strong>Core Technical Stack:</strong><br>
            • <strong>Languages:</strong> C, C++, Python, Java, JavaScript (ES6+), TypeScript, SQL<br>
            • <strong>Full Stack:</strong> React, SvelteKit, Node.js, Express, MongoDB, PostgreSQL, TailwindCSS<br>
            • <strong>Data & AI:</strong> Data Analytics, Pandas, NumPy, Machine Learning, PowerBI<br>
            • <strong>DevOps & Tools:</strong> Git, Docker, Postman, Vercel, Socket.io`;
        }

        if (q.includes('intern') || q.includes('hire') || q.includes('available') || q.includes('role') || q.includes('job') || q.includes('work with')) {
            return `💼 <strong>Job & Internship Availability:</strong><br>
            Uppara is <strong>actively open</strong> for Full-Stack Software Engineering, Data Analyst, and AI/ML internship/entry-level positions.<br>
            Send him an email at <a href="mailto:uupparaveeranji@gmail.com" style="color:var(--text-primary); text-decoration:underline;">uupparaveeranji@gmail.com</a>!`;
        }

        if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('phone') || q.includes('linkedin') || q.includes('github')) {
            return `📧 <strong>Get in Touch with Uppara:</strong><br>
            • <strong>Email:</strong> <a href="mailto:uupparaveeranji@gmail.com" style="color:var(--text-primary); text-decoration:underline;">uupparaveeranji@gmail.com</a><br>
            • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/uppara-veeranjaneyulu-44003728b/" target="_blank" style="color:var(--text-primary); text-decoration:underline;">linkedin.com/in/uppara-veeranjaneyulu</a><br>
            • <strong>GitHub:</strong> <a href="https://github.com/Uppara-Veeranjaneyulu" target="_blank" style="color:var(--text-primary); text-decoration:underline;">github.com/Uppara-Veeranjaneyulu</a>`;
        }

        if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) {
            return `📄 <strong>Uppara's Resume:</strong><br>
            You can view or download his official updated resume here:<br>
            <a href="Uppara_Veeranjaneyulu_Resume_update1.pdf" target="_blank" style="color:var(--text-primary); text-decoration:underline; font-weight:600;">Download Official Resume (PDF)</a>`;
        }

        return `🤖 I'm here to help! Try asking me about:<br>
        • <em>"What is Uppara's CGPA?"</em><br>
        • <em>"Tell me about Polyverse or CraveQuick"</em><br>
        •  short prompt chips below!`;
    }
})();
