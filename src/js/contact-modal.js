/**
 * contact-modal.js – Contact Modal Manager
 * Simples, direto, sem excessos
 */

export function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('contact-modal-close');
    const form = document.getElementById('contact-form');
    const overlay = document.querySelector('.contact-modal__overlay');

    if (!modal || !form) return;

    // Seu WhatsApp
    const WHATSAPP_NUMBER = '5514933009075';

    /**
     * Abre o modal
     */
    function openModal() {
        modal.classList.add('open');
        
        // Bloqueia scroll do body
        const scrollY = window.scrollY;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
        
        // Foca no primeiro input
        setTimeout(() => {
            const firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 200);
    }

    /**
     * Fecha o modal
     */
    function closeModal() {
        modal.classList.remove('open');
        
        // Restaura scroll
        const scrollY = document.body.style.top;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    /**
     * Formata a mensagem para WhatsApp
     */
    function formatMessage(data) {
        const { name, phone, project, message } = data;
        
        let msg = `Olá! 👋\n\n`;
        msg += `*Nome:* ${name || 'Não informado'}\n`;
        msg += `*WhatsApp:* ${phone || 'Não informado'}\n`;
        msg += `*Projeto:* ${getProjectLabel(project)}\n`;
        
        if (message?.trim()) {
            msg += `\n*Detalhes:*\n${message}\n`;
        }

        return msg;
    }

    /**
     * Label do tipo de projeto
     */
    function getProjectLabel(value) {
        const labels = {
            'landing-page': 'Landing Page',
            'site-institucional': 'Site Institucional',
            'loja-virtual': 'Loja Virtual',
            'redesign': 'Redesign de Site',
            'nao-sei': 'Não sei ainda'
        };
        return labels[value] || 'Não especificado';
    }

    /**
     * Abre WhatsApp
     */
    function openWhatsApp(message) {
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    }

    /**
     * Valida o formulário
     */
    function validateForm(data) {
        const { name, phone, project } = data;

        if (!name || name.trim().length < 2) {
            alert('Digite seu nome completo');
            return false;
        }

        const phoneClean = phone.replace(/\D/g, '');
        if (phoneClean.length < 10) {
            alert('WhatsApp inválido');
            return false;
        }

        if (!project) {
            alert('Selecione um tipo de projeto');
            return false;
        }

        return true;
    }

    /**
     * Submit do formulário
     */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form));
        
        if (!validateForm(formData)) return;

        const btn = form.querySelector('.contact-form__submit');
        const originalHTML = btn.innerHTML;

        // Feedback
        btn.disabled = true;
        btn.innerHTML = '⏳ Abrindo...';

        setTimeout(() => {
            openWhatsApp(formatMessage(formData));
            
            btn.innerHTML = '✓ Pronto!';
            
            setTimeout(() => {
                form.reset();
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                closeModal();
            }, 1500);
        }, 300);
    });

    /**
     * Event Listeners
     */

    // Abrir modal
    document.querySelectorAll('a[href="#contato"], button[data-contact]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Fechar modal
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // ESC para fechar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Previne submit duplicado
    let isSubmitting = false;
    form.addEventListener('submit', () => {
        if (isSubmitting) return;
        isSubmitting = true;
        setTimeout(() => { isSubmitting = false; }, 3000);
    });

    return { open: openModal, close: closeModal };
}

// Inicializa
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactModal);
} else {
    initContactModal();
}

window.contactModal = initContactModal;