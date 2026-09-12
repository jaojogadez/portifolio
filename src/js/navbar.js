export function initNavbar() {
    const wrapper = document.getElementById('navbar');
    const hamburger = document.getElementById('navbar-hamburger');
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
        checkNavbarVisibility();
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
    // Adicionamos 'footer' à lista de elementos observados
    const sections = document.querySelectorAll('#hero, #impact, #portfolio, #processo, #faq, #depoimentos, #contato, #servicos, #sobre, footer, #footer');
    const allLinks = document.querySelectorAll('.navbar__nav-link');

    if (sections.length && allLinks.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Sempre remove a classe 'active' de todos os links primeiro
                    allLinks.forEach(l => l.classList.remove('active'));

                    const target = entry.target;

                    // Se o elemento visível FOR o footer, não ativa nenhum link
                    if (target.tagName.toLowerCase() === 'footer' || target.id === 'footer') {
                        return;
                    }

                    // Caso seja uma seção normal com ID, ativa o link correspondente
                    if (target.id) {
                        const activeLinks = document.querySelectorAll(`[href="#${target.id}"]`);
                        activeLinks.forEach(l => l.classList.add('active'));
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -35% 0px',
            threshold: 0.1
        });

        sections.forEach(section => observer.observe(section));
    }
}