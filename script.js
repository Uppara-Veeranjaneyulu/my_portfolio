

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Theme toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// EmailJS initialization and form handling
(function () {
    emailjs.init("m9PQkiFvTy8n3N7aV"); // Replace with your EmailJS public key
})();

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const formMessage = document.getElementById('formMessage');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // EmailJS send function
    emailjs.sendForm('service_ww7vtcm', 'template_f2lfego', this)
        .then(function () {
            formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            document.getElementById('contactForm').reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, function (error) {
            formMessage.textContent = 'Failed to send message. Please try again or email me directly.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            console.log('EmailJS error:', error);
        });
});