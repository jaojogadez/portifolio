/**
 * services.js
 * Accordion Gallery — adaptado de React Bits
 * https://www.reactbits.dev/components/accordion-gallery
 */

const CONFIG = {
  defaultIndex: 2,
  expandRatio: 0.52,
  height: 460,
  gap: 10,
  tilt: 8,
  parallax: 0.5,
  grayscale: true,
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileLayout(root) {
  return window.matchMedia('(max-width: 520px)').matches || root.offsetWidth < 520;
}

export function initServices() {
  const root = document.getElementById('services-gallery');
  if (!root) return;

  const panels = Array.from(root.querySelectorAll('.ag-panel'));
  if (!panels.length) return;

  const count = panels.length;
  let active = Math.min(Math.max(CONFIG.defaultIndex, 0), count - 1);
  let mediaSize = 320;
  let firstRun = true;

  const r = Math.min(Math.max(CONFIG.expandRatio, 0.2), 0.9);
  const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

  function measure() {
    const rect = root.getBoundingClientRect();
    const mobile = isMobileLayout(root);
    const total = mobile ? rect.height : rect.width;
    const usable = Math.max(total - CONFIG.gap * (count - 1), 120);
    mediaSize = Math.max(140, usable * r * 1.22);
    root.style.setProperty('--ag-media-size', `${mediaSize}px`);

    if (!mobile) {
      root.style.height = `${CONFIG.height}px`;
    } else {
      root.style.height = 'auto';
    }

    applyLayout(!firstRun);
  }

  function applyLayout(animate) {
    const mobile = isMobileLayout(root);
    const reduced = prefersReducedMotion() || !animate;

    panels.forEach((panel, i) => {
      const isActive = i === active;
      const media = panel.querySelector('.ag-panel__media');
      const overlay = panel.querySelector('.ag-panel__overlay');

      panel.classList.toggle('ag-panel--active', isActive);
      panel.setAttribute('aria-current', isActive ? 'true' : 'false');

      if (reduced) {
        panel.style.transition = 'none';
        if (media) media.style.transition = 'none';
      } else {
        panel.style.transition = '';
        if (media) media.style.transition = '';
      }

      if (mobile) {
        panel.style.flexGrow = '';
        panel.style.transform = 'none';
      } else {
        const rot = isActive ? 0 : i < active ? CONFIG.tilt : -CONFIG.tilt;
        panel.style.flexGrow = String(isActive ? grow : 1);
        panel.style.transform = `rotateY(${rot}deg)`;
      }

      if (media) {
        const gray = CONFIG.grayscale ? (isActive ? 0 : 1) : 0;
        const dim = isActive ? 0 : 0.35;
        media.style.setProperty('--ag-gray', String(gray));
        media.style.setProperty('--ag-dim', String(dim));

        if (mobile) {
          media.style.transform = 'translate(-50%, -50%)';
        } else {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = isActive ? 0 : drift * CONFIG.parallax * mediaSize * 0.06;
          media.style.transform = `translate(calc(-50% + ${shift}px), -50%)`;
        }
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

  panels.forEach((panel, i) => {
    panel.addEventListener('mouseenter', () => {
      if (!isMobileLayout(root)) setActive(i);
    });

    panel.addEventListener('focus', () => setActive(i));

    panel.addEventListener('click', (e) => {
      if (i !== active) {
        e.preventDefault();
        setActive(i);
      }
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i + 1) % count);
        panels[(i + 1) % count].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i - 1 + count) % count);
        panels[(i - 1 + count) % count].focus();
      }
    });
  });

  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(root);
}
