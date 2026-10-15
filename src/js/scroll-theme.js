/**
 * scroll-theme.js
 * Troca o tema (claro/escuro) automaticamente conforme a seção que está
 * no centro da tela.
 *
 * Como funciona:
 *  - O tema escolhido pelo visitante (botão .theme-toggle, salvo no
 *    localStorage) é o tema BASE.
 *  - Seções marcadas com data-tone="invert" mostram o tema oposto ao base.
 *  - O resultado é aplicado em <html data-theme="...">, então todos os tokens
 *    de config.css continuam funcionando sem nenhum CSS extra por seção.
 *
 * Desempenho:
 *  - A troca de atributo é instantânea (1 recálculo de estilo, sem transições
 *    por elemento).
 *  - O efeito suave é um crossfade da página inteira feito pela GPU
 *    (View Transitions API). Sem suporte do navegador, a troca é instantânea.
 *
 * Uso no HTML:  <section class="faq-section" data-tone="invert"> ... </section>
 */

const root = document.documentElement;

const TRIGGER = 0.5;       // linha de gatilho: 0.5 = centro da tela
const THEME_COLOR = { dark: '#050505', light: '#f7f8fa' };

let base = 'dark';         // preferência do visitante
let tone = 'base';         // tom da seção atual: 'base' | 'invert'
let firstApply = true;

try {
    base = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
} catch (e) { /* storage indisponível */ }

const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canTransition = () =>
    typeof document.startViewTransition === 'function' && !reducedMotion();

function effectiveTheme() {
    if (tone !== 'invert') return base;
    return base === 'light' ? 'dark' : 'light';
}

/** Escreve o tema no DOM (síncrono e barato). */
function commit() {
    const next = effectiveTheme();
    if (root.dataset.theme === next) return;

    root.dataset.theme = next;

    // Barra do navegador no mobile acompanha o tema
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[next]);

    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
}

/* Velocidade do scroll (px/ms). O crossfade usa uma "foto" congelada do tema
   antigo por cima da página viva; se a página estiver rolando rápido, essa
   foto parece deslizar. Então só animamos quando o scroll está lento/parado. */
const SLOW_SCROLL = 0.5;
let lastY = window.scrollY;
let lastT = performance.now();
let speed = 0;

window.addEventListener('scroll', () => {
    const t = performance.now();
    const y = window.scrollY;
    const dt = t - lastT;
    if (dt > 0) speed = Math.abs(y - lastY) / dt;
    lastY = y;
    lastT = t;
}, { passive: true });

const scrollSpeed = () => (performance.now() - lastT > 120 ? 0 : speed);

function apply(animate) {
    if (root.dataset.theme === effectiveTheme()) return;

    if (animate && canTransition() && scrollSpeed() < SLOW_SCROLL) {
        try {
            document.startViewTransition(commit);
            return;
        } catch (e) { /* cai no modo instantâneo */ }
    }
    commit();
}

export function getBaseTheme() {
    return base;
}

/** Chamado pelo botão de tema: troca a preferência base (e inverte o padrão todo). */
export function setBaseTheme(next) {
    base = next === 'light' ? 'light' : 'dark';
    try { localStorage.setItem('theme', base); } catch (e) { /* ignore */ }
    apply(true);
}

export function initScrollTheme() {
    const blocks = document.querySelectorAll('body > section, main > section, body > footer');
    if (!blocks.length || !('IntersectionObserver' in window)) return;

    // Linha de gatilho de altura zero na posição TRIGGER da viewport
    const top = Math.round(TRIGGER * 100);
    const observer = new IntersectionObserver(
        (entries) => {
            // Se vieram várias entradas de uma vez (salto por âncora), vale a última
            let last = null;
            entries.forEach((entry) => { if (entry.isIntersecting) last = entry; });
            if (!last) return;

            tone = last.target.dataset.tone === 'invert' ? 'invert' : 'base';
            apply(!firstApply); // primeira aplicação (load) sem animar
            firstApply = false;
        },
        { rootMargin: `-${top}% 0px -${100 - top}% 0px`, threshold: 0 }
    );

    blocks.forEach((b) => observer.observe(b));
}