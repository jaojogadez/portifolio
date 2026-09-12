function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1500; // Duração da animação em milissegundos
  const frameDuration = 1000 / 60; // 60 FPS
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    // Easing outQuad para desacelerar suavemente no final
    const progress = frame / totalFrames;
    const easeProgress = progress * (2 - progress);
    const currentVal = Math.floor(target * easeProgress);

    el.textContent = `${currentVal}${suffix}`;

    if (frame >= totalFrames) {
      el.textContent = `${target}${suffix}`;
      clearInterval(counter);
    }
  }, frameDuration);
}

// Observer para disparar a animação ao rolar a página
document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
});