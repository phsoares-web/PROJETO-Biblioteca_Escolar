const loaderElement = document.getElementById('site-loader');
const loaderTextElement = loaderElement?.querySelector('.site-loader__text');

function showLoader(message = 'Carregando...') {
  if (!loaderElement) return;
  if (loaderTextElement) loaderTextElement.textContent = message;
  loaderElement.classList.remove('hidden');
  requestAnimationFrame(() => loaderElement.classList.add('visible'));
}

function hideLoader() {
  if (!loaderElement) return;
  loaderElement.classList.remove('visible');
  loaderElement.addEventListener('transitionend', function onHide() {
    loaderElement.classList.add('hidden');
    loaderElement.removeEventListener('transitionend', onHide);
  });
}

window.showLoader = showLoader;
window.hideLoader = hideLoader;

window.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', () => {
      showLoader('Enviando...');
    });
  });
});

// Esconde o loader quando a página terminou de carregar todos os recursos
window.addEventListener('load', () => {
  // pequenas proteções caso o elemento ainda não exista
  try {
    hideLoader();
  } catch (e) {
    // silencioso
  }
});
