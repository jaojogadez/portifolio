/**
 * Navbar – Flow Web Sites
 * Módulo: navbar.js
 *
 * Responsabilidades:
 *  - Aparece só após o hero sair do viewport (.visible)
 *  - Efeito de scroll (.scrolled)
 *  - Toggle do menu hamburger (mobile)
 *  - Fechar menu ao clicar em link mobile
 *  - Highlight do link ativo via IntersectionObserver
 */

export function initNavbar() {
    const wrapper    = document.getElementById('navbar');
    const hamburger  = document.getElementById('navbar-hamburger');
    const mobileMenu = document.getElementById('navbar-mobile-menu');

    if (!wrapper || !hamburger || !mobileMenu) return;

    /* ── Visibilidade: aparece na metade do hero ── */
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const checkNavbarVisibility = () => {
            const halfHero = heroSection.offsetHeight * 0.5;
            wrapper.classList.toggle('visible', window.scrollY > halfHero);
        };
        window.addEventListener('scroll', checkNavbarVisibility, { passive: true });
        checkNavbarVisibility(); // checar no load
    }

    /* ── Scroll: adiciona .scrolled após 30px ── */
    window.addEventListener('scroll', () => {
        wrapper.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    /* ── Hamburger toggle ── */
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.classList.toggle('open', isOpen);
        wrapper.classList.toggle('menu-open', isOpen);
    });

    /* ── Fechar menu ao clicar em qualquer link mobile ── */
    mobileMenu.querySelectorAll('.navbar__nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        wrapper.classList.remove('menu-open');
    }

    /* ── Active link via IntersectionObserver ── */
    const sections = document.querySelectorAll('#hero, #impact, #portfolio, #depoimentos, #contato, #servicos, #sobre');
    const allLinks = document.querySelectorAll('.navbar__nav-link');

    if (sections.length && allLinks.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    allLinks.forEach(l => l.classList.remove('active'));
                    document.querySelectorAll(`[href="#${entry.target.id}"]`)
                        .forEach(l => l.classList.add('active'));
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(section => observer.observe(section));
    }
}

