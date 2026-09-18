/**
 * portfolio.js – vitrine interativa (Web / App)
 */

const ICONS = {
    home: '<path d="M4 11L12 4l8 7"/><path d="M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9"/>',
    users: '<circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.3"/><path d="M15 14.5c2.6.4 4.5 2.2 4.5 5.5"/>',
    chart: '<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3v-3zM19.5 14v3M14 19.5h2M19.5 19.5h1.5"/>',
    paw: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M12 12c-3.6 0-6.3 2.1-6.3 4.7S8.4 21 12 21s6.3-1.7 6.3-4.3S15.6 12 12 12z"/>',
    phone: '<path d="M6.5 3h3l1.3 3.6-1.9 1.5a11.5 11.5 0 005.9 5.9l1.5-1.9 3.6 1.3v3a2 2 0 01-2.2 2C10.5 17.5 6.5 13.5 4.5 5.6A2 2 0 016.5 3z"/>',
    sync: '<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M20 10a8 8 0 00-14.9-3.2M4 14a8 8 0 0014.9 3.2"/>',
    tag: '<path d="M20.6 12.3L12.7 4.4a2 2 0 00-1.4-.6H5a1 1 0 00-1 1v6.3c0 .5.2 1 .6 1.4l7.9 7.9c.8.8 2 .8 2.8 0l5.3-5.3c.8-.8.8-2.1 0-2.8z"/><circle cx="8" cy="8.5" r="1.2"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    bell: '<path d="M9 18a3 3 0 006 0"/><path d="M6 10a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10.5h18"/><path d="M7 15h4"/>'
};

const IMG = {
    web1: './src/assets/projects/garra-web-01.png',
    web2: './src/assets/projects/garra-web-02.png',
    web3: './src/assets/projects/garra-web-03.png',
    web4: './src/assets/projects/garra-web-04.png',
    web5: './src/assets/projects/garra-web-05.png',
    web6: './src/assets/projects/garra-web-06.png',
    app1: './src/assets/projects/garra-app-01.png',
    app2: './src/assets/projects/garra-app-02.png',
    app3: './src/assets/projects/garra-app-03.png',
    app4: './src/assets/projects/garra-app-4.png',
    app5: './src/assets/projects/garra-app-05.png',
    app6: './src/assets/projects/garra-app-06.png'
};

function imageScreen(src, alt) {
    return `<img src="${src}" alt="${alt || ''}" loading="lazy" decoding="async">`;
}

function tableScreen(title, items, cta) {
    const rows = items.map(it => `
    <div class="row-item">
      <div class="row-icon" style="background:${it.color}22;">${it.emoji}</div>
      <div class="row-text">
        <div class="row-title">${it.name}</div>
        <div class="row-meta">${it.meta}</div>
      </div>
      <div class="row-val ${it.pos ? 'positive' : ''} ${it.neg ? 'negative' : ''}">${it.val}</div>
    </div>
  `).join('');
    return `
    <div class="mock-pad">
      <div class="tabs"><span class="tab-active">Todos</span><span>Desconhecidos</span></div>
      <div class="content-sub" style="margin-top:-8px;margin-bottom:14px;">${title}</div>
      ${rows}
      ${cta ? `<div class="pill-btn">+ ${cta}</div>` : ''}
    </div>
  `;
}

function goalScreen() {
    return `
    <div class="mock-pad">
      <div class="content-title">Metas financeiras</div>
      <div class="content-sub">Acompanhe o quanto falta para chegar lá.</div>
      <div class="goal-ring"><div class="goal-ring-inner"><strong>70%</strong><span>concluído</span></div></div>
      <div class="row-item"><div class="row-icon" style="background:#3b82f622;">✈️</div>
        <div class="row-text"><div class="row-title">Viagem para o Chile</div><div class="row-meta">R$ 4.200 de R$ 6.000</div></div>
      </div>
      <div class="row-item"><div class="row-icon" style="background:#34d39922;">🛟</div>
        <div class="row-text"><div class="row-title">Reserva de emergência</div><div class="row-meta">R$ 2.100 de R$ 5.000</div></div>
      </div>
    </div>
  `;
}

function chartScreen() {
    const heights = [30, 55, 40, 70, 50, 85, 60];
    const bars = heights.map(h => `<div class="bar ${h > 75 ? 'hi' : ''}" style="height:${h}%"></div>`).join('');
    return `
    <div class="mock-pad">
      <div class="content-title">Gastos da semana</div>
      <div class="content-sub">Segunda a domingo</div>
      <div class="bars">${bars}</div>
      <div class="row-item" style="margin-top:16px;">
        <div class="row-icon" style="background:#3b82f622;">📊</div>
        <div class="row-text"><div class="row-title">Total gasto</div><div class="row-meta">Últimos 7 dias</div></div>
        <div class="row-val negative">-R$ 1.038,20</div>
      </div>
    </div>
  `;
}

const PROJECTS = [
    {
        id: 'garra',
        name: 'Site Oficial da ONG GARRA',
        desc: 'Site institucional real, focado em doações, voluntariado e adoção responsável.',
        url: 'https://garramarilia.vercel.app',
        pages: [
            {
                id: 'home', side: 'left', icon: 'home', name: 'Início',
                web: () => imageScreen(IMG.web1, 'GARRA — página inicial no desktop'),
                app: () => imageScreen(IMG.app1, 'GARRA — página inicial no celular')
            },
            {
                id: 'volunteer', side: 'left', icon: 'users', name: 'Voluntariado',
                web: () => imageScreen(IMG.web2, 'GARRA — voluntariado no desktop'),
                app: () => imageScreen(IMG.app2, 'GARRA — voluntariado no celular')
            },
            {
                id: 'transparency', side: 'left', icon: 'chart', name: 'Transparência',
                web: () => imageScreen(IMG.web3, 'GARRA — transparência no desktop'),
                app: () => imageScreen(IMG.app3, 'GARRA — transparência no celular')
            },
            {
                id: 'donation', side: 'right', icon: 'qr', name: 'Doação PIX',
                web: () => imageScreen(IMG.web4, 'GARRA — doação via PIX no desktop'),
                app: () => imageScreen(IMG.app4, 'GARRA — doação via PIX no celular')
            },
            {
                id: 'adoption', side: 'right', icon: 'paw', name: 'Adoção',
                web: () => imageScreen(IMG.web5, 'GARRA — animais para adoção no desktop'),
                app: () => imageScreen(IMG.app5, 'GARRA — animais para adoção no celular')
            },
            {
                id: 'contact', side: 'right', icon: 'phone', name: 'Contato',
                web: () => imageScreen(IMG.web6, 'GARRA — contato e abrigo no desktop'),
                app: () => imageScreen(IMG.app6, 'GARRA — contato e abrigo no celular')
            }
        ]
    },
    {
        id: 'nova',
        name: 'NOVA Finance — App de Controle Financeiro',
        desc: 'Projeto de exemplo com telas geradas em HTML/CSS, ilustrando outro tipo de produto na vitrine.',
        url: null,
        pages: [
            {
                id: 'nova-sync', side: 'left', icon: 'sync', name: 'Sincronização',
                web: () => tableScreen('Contas conectadas', [
                    { emoji: '💳', color: '#f4c025', name: 'Nubank', meta: 'Sincronizado há 2 min', val: 'Ativo', pos: true },
                    { emoji: '🏦', color: '#ff7a45', name: 'Santander', meta: 'Sincronizado há 1h', val: 'Ativo', pos: true },
                    { emoji: '🅲', color: '#5b8def', name: 'Banco C6', meta: 'Sincronizado ontem', val: 'Ativo', pos: true }
                ], 'Adicionar conta'),
                app: () => tableScreen('Contas conectadas', [
                    { emoji: '💳', color: '#f4c025', name: 'Nubank', meta: 'Sincronizado há 2 min', val: 'Ativo', pos: true },
                    { emoji: '🏦', color: '#ff7a45', name: 'Santander', meta: 'Sincronizado há 1h', val: 'Ativo', pos: true },
                    { emoji: '🅲', color: '#5b8def', name: 'Banco C6', meta: 'Sincronizado ontem', val: 'Ativo', pos: true }
                ], 'Sincronizar')
            },
            {
                id: 'nova-cat', side: 'left', icon: 'tag', name: 'Categorização',
                web: () => tableScreen('Últimas transações', [
                    { emoji: '🍔', color: '#f97316', name: 'iFood', meta: 'Alimentação', val: '-R$ 38,90', neg: true },
                    { emoji: '🚕', color: '#3b82f6', name: 'Uber', meta: 'Transporte', val: '-R$ 22,40', neg: true },
                    { emoji: '🎬', color: '#a855f7', name: 'Netflix', meta: 'Assinaturas', val: '-R$ 39,90', neg: true }
                ]),
                app: () => tableScreen('Últimas transações', [
                    { emoji: '🍔', color: '#f97316', name: 'iFood', meta: 'Alimentação', val: '-R$ 38,90', neg: true },
                    { emoji: '🚕', color: '#3b82f6', name: 'Uber', meta: 'Transporte', val: '-R$ 22,40', neg: true },
                    { emoji: '🎬', color: '#a855f7', name: 'Netflix', meta: 'Assinaturas', val: '-R$ 39,90', neg: true }
                ])
            },
            {
                id: 'nova-goal', side: 'left', icon: 'target', name: 'Metas',
                web: () => goalScreen(), app: () => goalScreen()
            },
            {
                id: 'nova-alert', side: 'right', icon: 'bell', name: 'Alertas',
                web: () => tableScreen('Alertas recentes', [
                    { emoji: '⚠️', color: '#f87171', name: 'Gasto acima da média', meta: 'Alimentação · hoje', val: 'Ver' },
                    { emoji: '📅', color: '#3b82f6', name: 'Fatura vence em 3 dias', meta: 'Cartão C6', val: 'Ver' },
                    { emoji: '📈', color: '#34d399', name: 'Meta 80% concluída', meta: 'Viagem', val: 'Ver' }
                ]),
                app: () => tableScreen('Alertas recentes', [
                    { emoji: '⚠️', color: '#f87171', name: 'Gasto acima da média', meta: 'Alimentação · hoje', val: 'Ver' },
                    { emoji: '📅', color: '#3b82f6', name: 'Fatura vence em 3 dias', meta: 'Cartão C6', val: 'Ver' },
                    { emoji: '📈', color: '#34d399', name: 'Meta 80% concluída', meta: 'Viagem', val: 'Ver' }
                ])
            },
            {
                id: 'nova-report', side: 'right', icon: 'chart', name: 'Relatórios',
                web: () => chartScreen(), app: () => chartScreen()
            },
            {
                id: 'nova-card', side: 'right', icon: 'card', name: 'Cartões',
                web: () => tableScreen('Faturas em aberto', [
                    { emoji: '🅲', color: '#5b8def', name: 'Cartão C6', meta: 'Vence 18/09', val: 'R$ 842,10' },
                    { emoji: '💳', color: '#f4c025', name: 'Cartão Nubank', meta: 'Vence 25/09', val: 'R$ 1.204,55' },
                    { emoji: '🏦', color: '#ff7a45', name: 'Cartão Santander', meta: 'Vence 30/09', val: 'R$ 312,00' }
                ], 'Pagar faturas'),
                app: () => tableScreen('Faturas em aberto', [
                    { emoji: '🅲', color: '#5b8def', name: 'Cartão C6', meta: 'Vence 18/09', val: 'R$ 842,10' },
                    { emoji: '💳', color: '#f4c025', name: 'Cartão Nubank', meta: 'Vence 25/09', val: 'R$ 1.204,55' },
                    { emoji: '🏦', color: '#ff7a45', name: 'Cartão Santander', meta: 'Vence 30/09', val: 'R$ 312,00' }
                ], 'Pagar faturas')
            }
        ]
    }
];

export function initPortfolio() {
    const root = document.getElementById('portfolio');
    if (!root) return;

    const colLeft = document.getElementById('portfolio-col-left');
    const colRight = document.getElementById('portfolio-col-right');
    const screenContent = document.getElementById('portfolio-screen-content');
    const appHeaderTitle = document.getElementById('portfolio-app-title');
    const svg = document.getElementById('portfolio-connectors');
    const carName = document.getElementById('portfolio-car-name');
    const carDesc = document.getElementById('portfolio-car-desc');
    const carLink = document.getElementById('portfolio-car-link');
    const carPrev = document.getElementById('portfolio-car-prev');
    const carNext = document.getElementById('portfolio-car-next');
    const carDots = document.getElementById('portfolio-dots');
    const toggle = document.getElementById('portfolio-device-toggle');
    const labelWeb = document.getElementById('portfolio-label-web');
    const labelApp = document.getElementById('portfolio-label-app');
    const stage = root.querySelector('.portfolio__stage');
    const frame = root.querySelector('.portfolio__frame');

    if (!colLeft || !colRight || !screenContent || !toggle || !stage || !frame) return;

    let projectIndex = 0;
    let pageId = PROJECTS[0].pages[0].id;
    let device = window.innerWidth <= 768 ? 'app' : 'web';

    function currentProject() {
        return PROJECTS[projectIndex];
    }

    function currentPage() {
        return currentProject().pages.find(p => p.id === pageId);
    }

    function buildButtons() {
        colLeft.innerHTML = '';
        colRight.innerHTML = '';
        currentProject().pages.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn--secondary portfolio__feat-btn' + (p.id === pageId ? ' is-active' : '');
            btn.setAttribute('aria-label', p.name);
            btn.dataset.id = p.id;
            btn.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[p.icon]}</svg>`;
            btn.addEventListener('click', () => setPage(p.id));
            (p.side === 'left' ? colLeft : colRight).appendChild(btn);
        });
    }

    function renderScreen() {
        const p = currentPage();
        if (!p) return;
        if (appHeaderTitle) appHeaderTitle.textContent = p.name;
        screenContent.innerHTML = `<div class="portfolio__fade-in">${device === 'web' ? p.web() : p.app()}</div>`;
    }

    function renderCarousel() {
        const proj = currentProject();
        carName.textContent = proj.name;
        carDesc.textContent = proj.desc;
        if (proj.url) {
            carLink.href = proj.url;
            carLink.classList.remove('is-disabled');
            carLink.innerHTML = `Acessar Site <svg viewBox="0 0 24 24"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>`;
        } else {
            carLink.removeAttribute('href');
            carLink.classList.add('is-disabled');
            carLink.innerHTML = `Projeto de exemplo`;
        }
        carDots.querySelectorAll('.portfolio__dot').forEach((d, i) => {
            d.classList.toggle('is-active', i === projectIndex);
        });
    }

    function buildDots() {
        carDots.innerHTML = '';
        PROJECTS.forEach((proj, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'btn btn--secondary portfolio__dot' + (i === projectIndex ? ' is-active' : '');
            dot.setAttribute('aria-label', proj.name);
            dot.addEventListener('click', () => setProject(i));
            carDots.appendChild(dot);
        });
    }

    function setPage(id) {
        pageId = id;
        root.querySelectorAll('.portfolio__feat-btn').forEach(b => {
            b.classList.toggle('is-active', b.dataset.id === id);
        });
        renderScreen();
        drawConnectors();
    }

    function setProject(idx) {
        projectIndex = (idx + PROJECTS.length) % PROJECTS.length;
        pageId = currentProject().pages[0].id;
        buildButtons();
        renderScreen();
        renderCarousel();
        setTimeout(drawConnectors, 260);
    }

    function drawConnectors() {
        const rect = stage.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        svg.innerHTML = '';

        const frameRect = frame.getBoundingClientRect();
        const frameLeft = frameRect.left - rect.left;
        const frameRight = frameRect.right - rect.left;
        const frameTop = frameRect.top - rect.top;
        const frameHeight = frameRect.height;

        root.querySelectorAll('.portfolio__feat-btn').forEach(btn => {
            const bRect = btn.getBoundingClientRect();
            const isLeft = btn.parentElement.id === 'portfolio-col-left';
            const startX = isLeft ? (bRect.right - rect.left) : (bRect.left - rect.left);
            const startY = bRect.top - rect.top + bRect.height / 2;
            const endX = isLeft ? frameLeft : frameRight;

            const idx = Array.from(btn.parentElement.children).indexOf(btn);
            const ratio = (idx + 1) / (btn.parentElement.children.length + 1);
            const endY = frameTop + frameHeight * ratio;

            const midX = (startX + endX) / 2;
            const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            if (btn.dataset.id === pageId) path.classList.add('is-active');
            svg.appendChild(path);
        });
    }

    carPrev.addEventListener('click', () => setProject(projectIndex - 1));
    carNext.addEventListener('click', () => setProject(projectIndex + 1));

    toggle.addEventListener('click', () => {
        device = device === 'web' ? 'app' : 'web';
        root.setAttribute('data-device', device);
        labelWeb.classList.toggle('is-active', device === 'web');
        labelApp.classList.toggle('is-active', device === 'app');
        toggle.setAttribute('aria-pressed', String(device === 'app'));
        renderScreen();
        setTimeout(drawConnectors, 420);
    });

    function setInitialDeviceState() {
        root.setAttribute('data-device', device);
        labelWeb.classList.toggle('is-active', device === 'web');
        labelApp.classList.toggle('is-active', device === 'app');
        toggle.setAttribute('aria-pressed', String(device === 'app'));
    }

    setInitialDeviceState();
    buildButtons();
    buildDots();
    renderScreen();
    renderCarousel();

    window.addEventListener('resize', drawConnectors);
    window.addEventListener('load', drawConnectors);
    setTimeout(drawConnectors, 60);
}''
