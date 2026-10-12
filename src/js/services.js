/**
 * services.js
 * Accordion Gallery (Desktop) & ScrollStack (Mobile) — adaptado de React Bits
 * https://www.reactbits.dev/components/accordion-gallery
 * https://www.reactbits.dev/components/scroll-stack
 *
 * Desktop (> 768px): Accordion horizontal ativado por hover, foco ou clique.
 * Mobile (≤ 768px): ScrollStack com position:sticky — cards empilham ao scrollar,
 *   anteriores encolhem e escurecem progressivamente (sem GSAP).
 */

const CONFIG = {
  // Desktop
  defaultIndex: 2,
  expandRatio: 0.52,
  height: 460,
  gap: 10,
  tilt: 8,
  parallax: 0.5,
  grayscale: true,

  // Mobile — ScrollStack (sticky)
  scaleStep: 0.05,    // quanto cada card anterior encolhe por nível de profundidade
  baseScale: 0.82,    // escala mínima
  dimStep: 0.2,       // escurecimento por nível
  dimMax: 0.65,       // escurecimento máximo
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─────────────────────────────────────────────────────────────
   MOBILE (≤ 768px): ScrollStack com position:sticky
   Cada card é position:sticky. O scroll natural faz o próximo
   card subir e cobrir o anterior. Um IntersectionObserver +
   scroll listener calcula a profundidade de cada card coberto
   e aplica scale + shade.
   ───────────────────────────────────────────────────────────── */
function setupMobileScrollStack(root, panels) {
  const count = panels.length;
  const reduced = prefersReducedMotion();

  // Reset: garante que cada card tem z-index crescente
  panels.forEach((panel, i) => {
    panel.style.zIndex = String(i + 1);
    panel.style.setProperty('--ag-shade', '0');
    panel.style.transform = '';
    panel.classList.toggle('ag-panel--active', i === count - 1);
    panel.setAttribute('aria-current', i === count - 1 ? 'true' : 'false');
  });

  if (reduced) {
    return () => {
      panels.forEach((p) => { p.style.cssText = ''; });
    };
  }

  // Calcula qual card é o "topo" visível e a profundidade dos anteriores
  function updateStack() {
    // Lê a posição de cada card
    const stickyTop = panels[0] ? panels[0].getBoundingClientRect().top : 0;

    // Encontra o card ativo (o último card que está "stuck" ou o card mais recente que passou do topo)
    let activeIdx = 0;

    // Para cada card, verificamos se ele já "chegou" na posição sticky
    // Um card está "stuck" quando seu top === stickyTop (dentro de tolerância)
    const positions = panels.map((panel) => {
      const rect = panel.getBoundingClientRect();
      return rect.top;
    });

    // O card ativo é o último card cuja posição top é próxima da posição sticky
    // (ou seja, já está grudado no topo)
    for (let i = 0; i < count; i++) {
      // Se a diferença entre a posição deste card e o próximo é pequena,
      // ambos estão "stuck" — o de cima (maior index) é o ativo
      if (i < count - 1) {
        const diff = positions[i + 1] - positions[i];
        // Se o próximo card já está muito perto (ou no mesmo lugar), este card está "coberto"
        if (diff < 5) {
          activeIdx = i + 1;
        } else {
          // O próximo card ainda não chegou — este card ou o anterior é o ativo
          break;
        }
      }
    }

    // Calcula a transição suave entre o card ativo e o próximo
    let transitionProgress = 0;
    if (activeIdx < count - 1) {
      // Quanto do próximo card já subiu
      const nextTop = positions[activeIdx + 1];
      const currentTop = positions[activeIdx];
      const cardHeight = panels[activeIdx].offsetHeight;
      const margin = 80; // margin-bottom do card

      if (nextTop < currentTop + cardHeight + margin) {
        // O próximo card está subindo — calcular progresso
        const totalDistance = cardHeight + margin;
        const covered = (currentTop + totalDistance) - nextTop;
        transitionProgress = clamp(covered / totalDistance, 0, 1);
      }
    }

    panels.forEach((panel, i) => {
      if (i > activeIdx) {
        // Cards abaixo: ainda não chegaram no topo
        panel.style.transform = '';
        panel.style.setProperty('--ag-shade', '0');
        panel.classList.remove('ag-panel--active');
        panel.setAttribute('aria-current', 'false');
      } else if (i === activeIdx) {
        // Card ativo atual — pode estar sendo parcialmente coberto
        const scale = 1 - transitionProgress * CONFIG.scaleStep;
        const shade = transitionProgress * CONFIG.dimStep;

        panel.style.transform = scale < 0.999 ? `scale(${scale.toFixed(4)})` : '';
        panel.style.setProperty('--ag-shade', shade.toFixed(3));

        const isTopCard = transitionProgress < 0.5;
        panel.classList.toggle('ag-panel--active', isTopCard);
        panel.setAttribute('aria-current', isTopCard ? 'true' : 'false');
      } else {
        // Cards anteriores (cobertos) — profundidade = activeIdx - i
        const depth = activeIdx - i;
        // Adiciona a transição parcial do card ativo sendo coberto
        const effectiveDepth = depth + transitionProgress;

        const targetScale = Math.max(1 - effectiveDepth * CONFIG.scaleStep, CONFIG.baseScale);
        const targetShade = Math.min(effectiveDepth * CONFIG.dimStep, CONFIG.dimMax);

        panel.style.transform = `scale(${targetScale.toFixed(4)})`;
        panel.style.setProperty('--ag-shade', targetShade.toFixed(3));
        panel.classList.remove('ag-panel--active');
        panel.setAttribute('aria-current', 'false');
      }
    });
  }

  // Throttle com rAF para performance
  let rafId = 0;
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      updateStack();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once immediately
  updateStack();

  // Teardown
  return () => {
    window.removeEventListener('scroll', onScroll);
    if (rafId) cancelAnimationFrame(rafId);
    panels.forEach((panel) => {
      panel.style.transform = '';
      panel.style.zIndex = '';
      panel.style.removeProperty('--ag-shade');
      panel.classList.remove('ag-panel--active');
    });
  };
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP (> 768px): Accordion Horizontal (React Bits)
   ───────────────────────────────────────────────────────────── */
function setupDesktopAccordion(root, panels) {
  const count = panels.length;
  let active = clamp(CONFIG.defaultIndex, 0, count - 1);
  let mediaSize = 320;
  let firstRun = true;

  const r = clamp(CONFIG.expandRatio, 0.2, 0.9);
  const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

  function measureDesktop() {
    const rect = root.getBoundingClientRect();
    const usable = Math.max(rect.width - CONFIG.gap * (count - 1), 120);
    mediaSize = Math.max(140, usable * r * 1.22);
    root.style.setProperty('--ag-media-size', `${mediaSize}px`);
    root.style.height = `${CONFIG.height}px`;
    applyLayout(!firstRun);
  }

  function applyLayout(animate) {
    const reduced = prefersReducedMotion() || !animate;

    panels.forEach((panel, i) => {
      const isActive = i === active;
      const media = panel.querySelector('.ag-panel__media');
      const overlay = panel.querySelector('.ag-panel__overlay');

      panel.classList.toggle('ag-panel--active', isActive);
      panel.setAttribute('aria-current', isActive ? 'true' : 'false');

      panel.style.transition = reduced ? 'none' : '';
      if (media) media.style.transition = reduced ? 'none' : '';

      const rot = isActive ? 0 : i < active ? CONFIG.tilt : -CONFIG.tilt;
      panel.style.flexGrow = String(isActive ? grow : 1);
      panel.style.transform = `rotateY(${rot}deg)`;

      if (media) {
        const gray = CONFIG.grayscale ? (isActive ? 0 : 1) : 0;
        const dim = isActive ? 0 : 0.35;
        media.style.setProperty('--ag-gray', String(gray));
        media.style.setProperty('--ag-dim', String(dim));

        const drift = clamp(active - i, -1.5, 1.5);
        const shift = isActive ? 0 : drift * CONFIG.parallax * mediaSize * 0.06;
        media.style.transform = `translate(calc(-50% + ${shift}px), -50%)`;
      }

      if (overlay) {
        overlay.style.setProperty('--ag-dim', isActive ? '0' : '0.35');
      }
    });

    firstRun = false;
  }

  function setActive(index) {
    if (index === active) return;
    active = index;
    applyLayout(true);
  }

  const listeners = [];

  panels.forEach((panel, i) => {
    const onEnter = () => setActive(i);
    const onFocus = () => setActive(i);
    const onClick = (e) => {
      if (i !== active) {
        e.preventDefault();
        setActive(i);
      }
    };
    const onKeyDown = (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (i + 1) % count;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (i - 1 + count) % count;
      }
      if (next === null) return;
      e.preventDefault();
      setActive(next);
      panels[next].focus();
    };

    panel.addEventListener('mouseenter', onEnter);
    panel.addEventListener('focus', onFocus);
    panel.addEventListener('click', onClick);
    panel.addEventListener('keydown', onKeyDown);

    listeners.push({ panel, onEnter, onFocus, onClick, onKeyDown });
  });

  measureDesktop();

  const ro = new ResizeObserver(() => measureDesktop());
  ro.observe(root);

  // Teardown ao sair da viewport desktop
  return () => {
    ro.disconnect();
    listeners.forEach(({ panel, onEnter, onFocus, onClick, onKeyDown }) => {
      panel.removeEventListener('mouseenter', onEnter);
      panel.removeEventListener('focus', onFocus);
      panel.removeEventListener('click', onClick);
      panel.removeEventListener('keydown', onKeyDown);
    });
    panels.forEach((panel) => {
      panel.style.flexGrow = '';
      panel.style.transform = '';
      panel.style.transition = '';
      const media = panel.querySelector('.ag-panel__media');
      if (media) {
        media.style.transform = '';
        media.style.transition = '';
      }
    });
    root.style.height = '';
  };
}

/* ─────────────────────────────────────────────────────────────
   PONTO DE ENTRADA
   ───────────────────────────────────────────────────────────── */
export function initServices() {
  const root = document.getElementById('services-gallery');
  if (!root) return;

  const panels = Array.from(root.querySelectorAll('.ag-panel'));
  if (!panels.length) return;

  let mobileCleanup = null;
  let desktopCleanup = null;

  function setup() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      // Limpa desktop se existir
      if (desktopCleanup) {
        desktopCleanup();
        desktopCleanup = null;
      }
      // Inicia mobile se ainda não está ativo
      if (!mobileCleanup) {
        mobileCleanup = setupMobileScrollStack(root, panels);
      }
    } else {
      // Limpa mobile se existir
      if (mobileCleanup) {
        mobileCleanup();
        mobileCleanup = null;
      }
      // Inicia desktop se ainda não está ativo
      if (!desktopCleanup) {
        desktopCleanup = setupDesktopAccordion(root, panels);
      }
    }
  }

  // Se GSAP estiver disponível, usa matchMedia do GSAP para consistency
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(max-width: 768px)', () => {
      return setupMobileScrollStack(root, panels);
    });

    mm.add('(min-width: 769px)', () => {
      return setupDesktopAccordion(root, panels);
    });

    return mm;
  } else {
    // Fallback sem GSAP
    setup();

    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = () => {
      // Limpa tudo e reinicia
      if (mobileCleanup) { mobileCleanup(); mobileCleanup = null; }
      if (desktopCleanup) { desktopCleanup(); desktopCleanup = null; }
      setup();
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
    } else {
      mq.addListener(onChange);
    }
  }
}