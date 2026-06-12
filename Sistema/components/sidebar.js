import { store } from '../store.js';
import { theme } from '../theme.js';

// Mapa de rotas reais do sistema
const NAV_ITEMS = [
    {
        href: '#/',
        icon: 'layout-dashboard',
        label: 'Home',
        match: (p) => p === '/',
    },
    {
        href: '#/forms',
        icon: 'file-text',
        label: 'Formulários',
        match: (p) => p === '/forms' || p.startsWith('/forms/edit/') || p.startsWith('/forms/responses/') || p.startsWith('/forms/ai/'),
    },
    {
        href: '#/questions',
        icon: 'library',
        label: 'Banco de Questões',
        match: (p) => p === '/questions',
    },
    {
        href: '#/forms',
        icon: 'sparkles',
        label: 'Forms AI',
        match: (p) => p.startsWith('/forms/ai/'),
        // Navega para /forms pois Forms AI é contextual a um formulário específico
        note: 'contextual',
    },
    {
        href: '#/forms',
        icon: 'bar-chart-2',
        label: 'Respostas',
        match: (p) => p.startsWith('/forms/responses/') || p.startsWith('/response/'),
        note: 'contextual',
    },
];

export const renderSidebar = (container, currentPath) => {
    const isExpanded = localStorage.getItem('sidebar_expanded') === 'true';
    const user = store.getUser();

    // Gera os itens do rail (ícones) e do menu de forma sincronizada
    const navHTML = NAV_ITEMS.map((item, i) => {
        const isActive = item.match(currentPath);
        const railIcon = isActive
            ? `<div class="rail-icon rail-icon--active" data-href="${item.href}" data-tip="${item.label}">
                   <i data-lucide="${item.icon}" style="width:20px;height:20px;color:#010101;stroke-width:2px;"></i>
               </div>`
            : `<div class="rail-icon" data-href="${item.href}" data-tip="${item.label}">
                   <i data-lucide="${item.icon}" style="width:20px;height:20px;color:#010101;stroke-width:2px;"></i>
               </div>`;

        const menuItem = isActive
            ? `<a href="${item.href}" class="nav-item nav-item--active">
                   <i data-lucide="${item.icon}" style="width:20px;height:20px;color:#F0F0F2;stroke-width:2px;flex-shrink:0;"></i>
                   <span>${item.label}</span>
                   ${item.note === 'contextual' ? `<span class="nav-item__tag">via Formulários</span>` : ''}
               </a>`
            : `<a href="${item.href}" class="nav-item">
                   <i data-lucide="${item.icon}" style="width:20px;height:20px;color:#010101;stroke-width:2px;flex-shrink:0;"></i>
                   <span>${item.label}</span>
               </a>`;

        return { railIcon, menuItem };
    });

    const railIconsHTML  = navHTML.map(n => n.railIcon).join('');
    const menuItemsHTML  = navHTML.map(n => n.menuItem).join('');
    const userInitial    = user ? user.name.charAt(0).toUpperCase() : '?';
    const userName       = user ? user.name.split(' ')[0] : 'Visitante';

    container.innerHTML = `
        <!-- Overlay: fecha o menu ao clicar fora -->
        <div id="sidebar-overlay" style="
            display: ${isExpanded ? 'block' : 'none'};
            position: fixed; inset: 0; z-index: 99;
            background: transparent;
        "></div>

        <div id="sidebar-wrapper" style="
            position: fixed; top: 0; left: 0; z-index: 100;
            display: flex;
            height: calc(100vh - 32px);
            margin: 16px 0 16px 16px;
            border-radius: 16px;
            border: 1px solid rgba(1,1,1,0.08);
            overflow: hidden;
            background-color: #DFDFE3;
            transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            width: ${isExpanded ? '304px' : '64px'};
        ">
            <!-- ───────────── LAYER 1: ICON RAIL (64px fixo) ───────────── -->
            <div style="
                width: 64px; flex-shrink: 0;
                background-color: #DFDFE3;
                border-right: 1px solid rgba(1,1,1,0.08);
                display: flex; flex-direction: column; align-items: center;
                padding: 20px 0;
            ">
                <!-- Logo / toggle -->
                <button id="sidebar-toggle" title="Expandir menu" style="
                    background: none; border: none; cursor: pointer;
                    font-size: 22px; color: #010101; line-height: 1;
                    padding: 0; display: flex; align-items: center; justify-content: center;
                    width: 36px; height: 36px; border-radius: 10px;
                    transition: background 0.15s;
                ">✦</button>

                <!-- Ícones de navegação -->
                <div style="margin-top: 28px; display: flex; flex-direction: column; gap: 4px; width: 100%; align-items: center;">
                    ${railIconsHTML}
                </div>

                <!-- Rodapé do rail: configurações + sair -->
                <div style="margin-top: auto; display: flex; flex-direction: column; gap: 4px; width: 100%; align-items: center;">
                    <div style="width: 32px; border-top: 1px solid rgba(1,1,1,0.10); margin-bottom: 4px;"></div>

                    <a href="#/settings" class="rail-icon ${currentPath === '/settings' ? 'rail-icon--active' : ''}" data-tip="Configurações">
                        <i data-lucide="settings" style="width:20px;height:20px;color:#010101;stroke-width:2px;"></i>
                    </a>

                    <button id="btn-theme-toggle" class="rail-icon" data-tip="${theme.get() === 'dark' ? 'Modo claro' : 'Modo escuro'}" style="background:none;border:none;cursor:pointer;">
                        <i data-lucide="${theme.get() === 'dark' ? 'sun' : 'moon'}" style="width:20px;height:20px;color:#010101;stroke-width:2px;"></i>
                    </button>

                    <button id="btn-logout" class="rail-icon" data-tip="Sair" style="background:none;border:none;cursor:pointer;">
                        <i data-lucide="log-out" style="width:20px;height:20px;color:#010101;stroke-width:2px;"></i>
                    </button>
                </div>
            </div>

            <!-- ───────────── LAYER 2: MENU EXPANDIDO (240px) ───────────── -->
            <div style="
                width: 240px; flex-shrink: 0;
                background-color: #F0F0F2;
                display: flex; flex-direction: column;
                overflow: hidden;
                opacity: ${isExpanded ? '1' : '0'};
                transition: opacity 0.2s ease ${isExpanded ? '0.08s' : '0s'};
                pointer-events: ${isExpanded ? 'auto' : 'none'};
            ">
                <!-- Cabeçalho do menu -->
                <div style="padding: 20px 20px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(1,1,1,0.06);">
                    <div style="font-size: 15px; color: #010101; line-height: 1;">✦</div>
                    <span style="font-size: 16px; font-weight: 700; color: #010101; letter-spacing: -0.01em;">5K9 Forms</span>
                </div>

                <!-- Itens de navegação -->
                <nav style="padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto;">
                    <div style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: rgba(1,1,1,0.35); padding: 0 10px; margin-bottom: 4px;">
                        Navegação
                    </div>
                    ${menuItemsHTML}
                </nav>

                <!-- Rodapé do menu: perfil do usuário -->
                <div style="padding: 12px 10px; border-top: 1px solid rgba(1,1,1,0.06);">
                    <a href="#/settings" style="
                        display: flex; align-items: center; gap: 10px;
                        padding: 8px 10px; border-radius: 12px;
                        text-decoration: none; color: #010101;
                        transition: background 0.15s;
                    " class="nav-footer-profile">
                        <div style="
                            width: 30px; height: 30px; border-radius: 50%;
                            background-color: #010101; color: #F0F0F2;
                            font-size: 12px; font-weight: 700;
                            display: flex; align-items: center; justify-content: center;
                            flex-shrink: 0;
                        ">${userInitial}</div>
                        <div style="display: flex; flex-direction: column; line-height: 1.3;">
                            <span style="font-size: 13px; font-weight: 600; color: #010101;">${userName}</span>
                            <span style="font-size: 11px; color: rgba(1,1,1,0.45);">Admin · 5K9 Studio</span>
                        </div>
                        <i data-lucide="settings" style="width:14px;height:14px;color:rgba(1,1,1,0.35);margin-left:auto;stroke-width:2px;"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    // ─── Injetar estilos (uma única vez) ──────────────────────────────────
    if (!document.getElementById('sidebar-styles')) {
        const style = document.createElement('style');
        style.id = 'sidebar-styles';
        style.textContent = `
            .rail-icon {
                width: 36px; height: 36px;
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; opacity: 0.55;
                transition: opacity 0.12s, background 0.12s;
                text-decoration: none;
                position: relative;
            }
            .rail-icon:hover { opacity: 1; background: rgba(1,1,1,0.06); }
            .rail-icon--active {
                background-color: #F0F0F2;
                border: 1px solid rgba(1,1,1,0.10);
                opacity: 1;
            }
            /* Tooltip instantâneo (substitui o title nativo lento) */
            .rail-icon[data-tip]::after {
                content: attr(data-tip);
                position: absolute;
                left: calc(100% + 10px);
                top: 50%;
                transform: translateY(-50%) translateX(-4px);
                background: #010101;
                color: #F0F0F2;
                font-size: 12px;
                font-weight: 500;
                font-family: 'Instrument Sans', sans-serif;
                padding: 5px 10px;
                border-radius: 8px;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.12s ease, transform 0.12s ease;
                z-index: 200;
            }
            .rail-icon[data-tip]:hover::after {
                opacity: 1;
                transform: translateY(-50%) translateX(0);
            }
            .nav-item {
                display: flex; align-items: center; gap: 12px;
                padding: 0 12px; height: 40px; border-radius: 12px;
                text-decoration: none; color: #010101;
                font-size: 14px; font-weight: 400;
                transition: background 0.15s;
                white-space: nowrap;
            }
            .nav-item:hover { background-color: #DFDFE3; }
            .nav-item--active {
                background-color: #010101;
                color: #F0F0F2;
                font-weight: 600;
            }
            .nav-item--active:hover { background-color: #010101; }
            .nav-item__tag {
                margin-left: auto;
                font-size: 10px; font-weight: 500;
                color: rgba(240,240,242,0.5);
                background: rgba(255,255,255,0.10);
                padding: 2px 6px; border-radius: 4px;
                white-space: nowrap;
            }
            .nav-footer-profile:hover { background: rgba(1,1,1,0.05); }
            #sidebar-toggle:hover { background: rgba(1,1,1,0.06); }
        `;
        document.head.appendChild(style);
    }

    // ─── Eventos ──────────────────────────────────────────────────────────

    // Abrir/fechar via botão ✦
    const toggleBtn = container.querySelector('#sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const current = localStorage.getItem('sidebar_expanded') === 'true';
            localStorage.setItem('sidebar_expanded', String(!current));
            renderSidebar(container, currentPath);
            setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
        });
    }

    // Fechar ao clicar no overlay (fora da sidebar)
    const overlay = container.querySelector('#sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            localStorage.setItem('sidebar_expanded', 'false');
            renderSidebar(container, currentPath);
            setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
        });
    }

    // Ícones do rail navigam e fecham o menu
    container.querySelectorAll('.rail-icon[data-href]').forEach(el => {
        el.addEventListener('click', () => {
            localStorage.setItem('sidebar_expanded', 'false');
            window.location.hash = el.dataset.href.replace('#', '') || '/';
        });
    });

    // Logout
    const logoutBtn = container.querySelector('#btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            store.logout();
            window.location.hash = '/login';
        });
    }

    // Toggle de tema (claro/escuro)
    const themeBtn = container.querySelector('#btn-theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            theme.toggle();
            renderSidebar(container, currentPath);
            setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
        });
    }

    // Fechar menu ao clicar em qualquer item de navegação do menu expandido
    container.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
            localStorage.setItem('sidebar_expanded', 'false');
        });
    });

    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
};
