// --- Interactivity Demonstration ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('Revision Showcase Loaded');

    // Smooth Scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple Form Submission Simulation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted successfully! Check console for data.');
            const data = new FormData(form);
            console.log('Form Data:', Object.fromEntries(data));
        });
    }

    // Scroll reveal logic (Simple)
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});
