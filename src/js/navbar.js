/* ── Alternância de tema (claro/escuro) ──
   O tema inicial é aplicado por um script inline no <head> (evita flash).
   Aqui só ligamos os botões .theme-toggle (desktop e drawer mobile). */
   function initThemeToggle() {
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.theme-toggle');
    if (!buttons.length) return;

    const sync = () => {
        const isLight = root.dataset.theme === 'light';
        buttons.forEach(b => b.setAttribute('aria-pressed', String(isLight)));
    };

    sync();

    buttons.forEach(b =>
        b.addEventListener('click', () => {
            const next = root.dataset.theme === 'light' ? 'dark' : 'light';
            root.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (e) { /* storage indisponível */ }
            sync();
        })
    );
}

export function initNavbar() {
    /* Antes do guard: o tema funciona mesmo se a navbar não existir na página */
    initThemeToggle();

    const wrapper = document.getElementById('navbar');
    const hamburger = document.getElementById('navbar-hamburger');
    const mobileMenu = document.getElementById('navbar-mobile-menu');

    if (!wrapper || !hamburger || !mobileMenu) return;

    /* ── Scroll: visibilidade e estado .scrolled em listener unificado ── */
    const heroSection = document.getElementById('hero');
    const updateNavbarScroll = () => {
        const scrollY = window.scrollY;
        if (heroSection) {
            const halfHero = heroSection.offsetHeight * 0.5;
            wrapper.classList.toggle('visible', scrollY > halfHero);
        }
        wrapper.classList.toggle('scrolled', scrollY > 30);
    };
    window.addEventListener('scroll', updateNavbarScroll, { passive: true });
    updateNavbarScroll();


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

    /* ── Fechar ao clicar fora / Esc ── */
    document.addEventListener('click', (e) => {
        if (wrapper.classList.contains('menu-open') && !wrapper.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    /* ── Active link via IntersectionObserver ── */
    // Adicionamos 'footer' à lista de elementos observados
    const sections = document.querySelectorAll('#hero, #impact, #portfolio, #processo, #faq, #depoimentos, #contato, #servicos, #sobre, #sobre-mim, footer, #footer');
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