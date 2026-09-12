document.addEventListener('DOMContentLoaded', () => {
  const processItems = document.querySelectorAll('.process-item');

  if (window.innerWidth <= 768) {
    processItems.forEach(item => {
    item.addEventListener('click', () => {
      // Se o item já estiver ativo, fecha ele; caso contrário, abre o clicado e fecha os outros
      const isActive = item.classList.contains('process-item--active');
      
      processItems.forEach(el => el.classList.remove('process-item--active'));

      if (!isActive) {
        item.classList.add('process-item--active');
      }
    });
  });
  }
  
});