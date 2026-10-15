import { getBaseTheme, setBaseTheme } from './scroll-theme.js';

/* ── Alternância de tema (claro/escuro) ──
   O tema inicial é aplicado por um script inline no <head> (evita flash).
   O botão altera o tema BASE (scroll-theme.js), e as seções com
   data-tone="invert" continuam mostrando o oposto dele.
   O aria-pressed acompanha o tema efetivo, que muda também ao rolar. */
function initThemeToggle() {
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.theme-toggle');
    if (!buttons.length) return;

    const sync = () => {
        const isLight = root.dataset.theme === 'light';
        buttons.forEach(b => b.setAttribute('aria-pressed', String(isLight)));
    };

    sync();
    document.addEventListener('themechange', sync);

    buttons.forEach(b =>
        b.addEventListener('click', () =>
            setBaseTheme(getBaseTheme() === 'light' ? 'dark' : 'light')
        )
    );
}

export function initNavbar() {
    /* Antes do guard: o tema funciona mesmo se a navbar não existir na página */
    initThemeToggle();

    const wrapper = document.getElementById('navbar');
    const hamburger = document.getElementById('navbar-hamburger');
    const mobileMenu = document.getElementById('navbar-mobile-menu');

    if (!wrapper || !hamburger || !mobileMenu) return;

    /* ── Scroll: visibilidade, estado .scrolled e "esconde ao rolar" ──
       Desktop (> 900px), depois do hero:
         • rolar para baixo → navbar sai para cima; fica só o burger (#navbar-fab)
         • rolar para cima  → navbar volta completa
         • clicar no burger → navbar volta completa (fecha com clique fora, Esc,
                              clique num link ou rolando ~200px para baixo)
       Mobile (≤ 900px): comportamento original (botão burger sempre visível). */
    const heroSection = document.getElementById('hero');
    const fab = document.getElementById('navbar-fab');
    const desktopMQ = window.matchMedia('(min-width: 901px)');

    const SCROLL_DELTA = 8;   // ignora micro-movimentos do scroll (px)
    const PIN_RELEASE = 200;  // px rolados p/ baixo até fechar a navbar aberta pelo burger
    const LINK_LOCK_MS = 800; // após clicar num link, ignora a direção do scroll (evita piscar)

    let lastY = window.scrollY;
    let wasPast = false;      // já estava depois do hero no último cálculo?
    let collapsed = false;    // navbar recolhida (só o burger visível)
    let pinned = false;       // navbar aberta manualmente pelo burger
    let pinY = 0;
    let lockUntil = 0;
    let ticking = false;

    function setCollapsed(value) {
        collapsed = value;
        const isDesktop = desktopMQ.matches;
        wrapper.classList.toggle('nav-hidden', isDesktop && value);
        if (fab) fab.classList.toggle('show', isDesktop && value);
    }

    function updateNavbarScroll() {
        ticking = false;
        const y = Math.max(window.scrollY, 0);
        const pastHero = heroSection ? y > heroSection.offsetHeight * 0.5 : false;

        if (heroSection) wrapper.classList.toggle('visible', pastHero);
        wrapper.classList.toggle('scrolled', y > 30);

        // Mobile: só visibilidade/scrolled, como antes
        if (!desktopMQ.matches) {
            lastY = y;
            wasPast = pastHero;
            return;
        }

        if (!pastHero) {
            // Dentro do hero: nada aparece
            pinned = false;
            if (collapsed) setCollapsed(false);
            lastY = y;
        } else if (!wasPast || performance.now() < lockUntil) {
            // Acabou de passar do hero (rolando p/ baixo) → já entra recolhida, só o burger
            if (!wasPast) setCollapsed(true);
            lastY = y;
        } else {
            const delta = y - lastY;
            if (Math.abs(delta) >= SCROLL_DELTA) {
                if (delta < 0) {
                    // Rolando para cima → mostra a navbar completa
                    pinned = false;
                    if (collapsed) setCollapsed(false);
                } else if (!pinned) {
                    // Rolando para baixo → recolhe (animação de saída para cima)
                    if (!collapsed) setCollapsed(true);
                } else if (y - pinY > PIN_RELEASE) {
                    // Aberta pelo burger: fecha depois de rolar um pouco
                    pinned = false;
                    setCollapsed(true);
                }
                lastY = y;
            }
        }
        wasPast = pastHero;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateNavbarScroll);
    }, { passive: true });
    updateNavbarScroll();

    /* Troca de breakpoint: limpa o estado recolhido e recalcula */
    const onBreakpointChange = () => {
        pinned = false;
        wasPast = false;
        setCollapsed(false);
        updateNavbarScroll();
    };
    if (desktopMQ.addEventListener) {
        desktopMQ.addEventListener('change', onBreakpointChange);
    } else {
        desktopMQ.addListener(onBreakpointChange);
    }

    /* ── Burger flutuante: reabre a navbar completa ── */
    if (fab) {
        fab.addEventListener('click', (e) => {
            pinned = true;
            pinY = window.scrollY;
            setCollapsed(false);
            // Acionado por teclado: leva o foco para o primeiro link
            if (e.detail === 0) {
                requestAnimationFrame(() => {
                    const first = wrapper.querySelector('.navbar__nav .navbar__nav-link');
                    if (first) first.focus({ preventScroll: true });
                });
            }
        });
    }

    /* Aberta pelo burger: fecha ao clicar fora */
    document.addEventListener('click', (e) => {
        if (!pinned) return;
        if (wrapper.contains(e.target) || (fab && fab.contains(e.target))) return;
        pinned = false;
        setCollapsed(true);
    });

    /* Clicar num link da navbar recolhe o menu (e trava a direção do scroll
       por um instante para não reabrir quando a página rolar para cima) */
    wrapper.addEventListener('click', (e) => {
        if (!desktopMQ.matches || !e.target.closest('a')) return;
        lockUntil = performance.now() + LINK_LOCK_MS;
        pinned = false;
        setCollapsed(true);
    });

    /* Esc fecha a navbar aberta pelo burger */
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !pinned) return;
        pinned = false;
        setCollapsed(true);
        if (fab) fab.focus({ preventScroll: true });
    });


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