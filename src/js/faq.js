document.addEventListener('DOMContentLoaded', () => {
  const carouselWrapper = document.querySelector('.faq-carousel-wrapper');
  const carousel = document.getElementById('faqCarousel');
  const cards = document.querySelectorAll('.faq-card');
  const prevBtn = document.getElementById('faqPrev');
  const nextBtn = document.getElementById('faqNext');

  let currentIndex = 0;
  let autoplayTimer = null;
  const intervalTime = 5000; // Tempo de troca (5 segundos)

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 24; // Largura do card + gap
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
  }

  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Volta para o primeiro quando chega ao fim
    }
    updateCarousel();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, intervalTime);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }

  // Eventos de clique nos botões
  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
    startAutoplay(); // Reinicia a contagem
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      startAutoplay(); // Reinicia a contagem
    }
  });

  // Clique direto no card
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
      startAutoplay(); // Reinicia a contagem
    });
  });

  // Pausa o autoplay ao passar o mouse por cima
  carouselWrapper.addEventListener('mouseenter', stopAutoplay);
  carouselWrapper.addEventListener('mouseleave', startAutoplay);

  // Inicia
  updateCarousel();
  startAutoplay();
});