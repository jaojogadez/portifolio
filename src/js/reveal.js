/**
 * reveal.js
 * Inicia o IntersectionObserver para elementos com a classe .reveal
 * Criando o efeito de Fade-Up em componentes quando entram na tela.
 */

export function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-phones');

    if (!reveals.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

