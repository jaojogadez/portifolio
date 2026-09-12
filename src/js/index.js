/**
 * index.js
 * Ponto de entrada JS (type="module")
 * Importa e inicializa todos os módulos da aplicação.
 */

import { initNavbar } from './navbar.js';
import { initReveal } from './reveal.js';
import { initPortfolio } from './portfolio.js';
import { initContactModal } from './contact-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initReveal();
    initPortfolio();
    initContactModal();
});