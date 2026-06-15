import { store } from '../store.js';
import { theme } from '../theme.js';

// Mapa de rotas reais do sistema
const NAV_ITEMS = [
    { href: '#/',          icon: 'layout-dashboard', label: 'Home',              match: (p) => p === '/' },
    { href: '#/forms',     icon: 'file-text',        label: 'Formulários',       match: (p) => p === '/forms' || p.startsWith('/forms/edit/') },
    { href: '#/questions', icon: 'library',          label: 'Banco de Questões', match: (p) => p === '/questions' },
    { href: '#/forms',     icon: 'sparkles',         label: 'Forms AI',          match: (p) => p.startsWith('/forms/ai/') },
    { href: '#/forms',     icon: 'bar-chart-2',      label: 'Respostas',         match: (p) => p.startsWith('/forms/responses/') || p.startsWith('/response/') },
];

const FOOTER_ITEMS = [
    { id: 'nav-settings', href: '#/settings', icon: 'settings', label: 'Configurações', match: (p) => p === '/settings' },
];

export const renderSidebar = (container, currentPath) => {
    const isExpanded = localStorage.getItem('sidebar_expanded') === 'true';
    const user = store.getUser();
    const userInitial = user ? user.name.charAt(0).toUpperCase() : '?';
    const userName    = user ? user.name.split(' ')[0] : 'Visitante';

    // Item único: ícone sempre, label só quando expandido
    const renderItem = (item, isActive) => `
        <a href="${item.href}" class="sb-item ${isActive ? 'sb-item--active' : ''}" data-tip="${item.label}" data-nav>
            <span class="sb-item__icon"><i data-lucide="${item.icon}"></i></span>
            <span class="sb-item__label">${item.label}</span>
            ${item.note === 'contextual' && isExpanded ? `<span class="sb-item__tag">via Forms</span>` : ''}
        </a>`;

    const navHTML    = NAV_ITEMS.map(it => renderItem(it, it.match(currentPath))).join('');
    const footerHTML = FOOTER_ITEMS.map(it => renderItem(it, it.match(currentPath))).join('');

    container.innerHTML = `
        <div id="sidebar-overlay" style="display:${isExpanded ? 'block' : 'none'}; position:fixed; inset:0; z-index:99; background:transparent;"></div>

        <aside id="sidebar-wrapper" class="${isExpanded ? 'is-expanded' : 'is-collapsed'}">

            <!-- Cabeçalho: logo + toggle -->
            <div class="sb-header">
                <button id="sidebar-toggle" class="sb-logo" aria-label="Alternar menu">
                    <span class="sb-logo__mark">✦</span>
                    <span class="sb-logo__text">5K9 Forms</span>
                </button>
            </div>

            <!-- Navegação principal -->
            <nav class="sb-nav">
                <div class="sb-section-label">Navegação</div>
                ${navHTML}
            </nav>

            <!-- Rodapé -->
            <div class="sb-footer">
                ${footerHTML}
                <button id="btn-theme-toggle" class="sb-item" data-tip="${theme.get() === 'dark' ? 'Modo claro' : 'Modo escuro'}">
                    <span class="sb-item__icon"><i data-lucide="${theme.get() === 'dark' ? 'sun' : 'moon'}"></i></span>
                    <span class="sb-item__label">${theme.get() === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
                </button>
                <button id="btn-logout" class="sb-item" data-tip="Sair">
                    <span class="sb-item__icon"><i data-lucide="log-out"></i></span>
                    <span class="sb-item__label">Sair</span>
                </button>

                <div class="sb-divider"></div>

                <a href="#/settings" class="sb-profile" data-tip="${user ? user.name : 'Perfil'}">
                    <span class="sb-profile__avatar">${userInitial}</span>
                    <span class="sb-profile__info">
                        <span class="sb-profile__name">${userName}</span>
                        <span class="sb-profile__role">5K9 Studio</span>
                    </span>
                </a>
            </div>
        </aside>

        <!-- Tooltip flutuante (fora do sidebar, escapa do overflow) -->
        <div id="sb-tooltip" class="sb-tooltip"></div>
    `;

    injectStyles();
    attachEvents(container, currentPath, isExpanded);
    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
};

// ─────────────────────────────────────────────────────────────────────────
function injectStyles() {
    if (document.getElementById('sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = `
        #sidebar-wrapper {
            position: fixed; top: 16px; left: 16px; z-index: 100;
            height: calc(100vh - 32px);
            display: flex; flex-direction: column;
            background-color: var(--sb-bg, #DFDFE3);
            border: 1px solid var(--sb-border, rgba(1,1,1,0.08));
            border-radius: 18px;
            padding: 12px;
            overflow: visible;
            transition: width 0.26s cubic-bezier(0.4,0,0.2,1);
        }
        #sidebar-wrapper.is-collapsed { width: 68px; }
        #sidebar-wrapper.is-expanded  { width: 248px; }

        .sb-header { padding: 0 0 12px; }
        .sb-logo {
            display: flex; align-items: center; gap: 12px;
            background: none; border: none; cursor: pointer;
            width: 100%; height: 44px; padding: 0 10px; border-radius: 11px;
            transition: background 0.15s;
        }
        .sb-logo:hover { background: var(--sb-hover, rgba(1,1,1,0.05)); }
        .sb-logo__mark { font-size: 20px; color: var(--sb-fg, #010101); line-height: 1; flex-shrink: 0; width: 24px; text-align: center; display: flex; align-items: center; justify-content: center; }
        .sb-logo__text { font-size: 16px; font-weight: 700; color: var(--sb-fg, #010101); letter-spacing: -0.01em; white-space: nowrap; }

        .sb-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0; margin: 0; }
        .sb-section-label {
            font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
            color: var(--sb-muted, rgba(1,1,1,0.35)); padding: 4px 10px; white-space: nowrap;
        }

        .sb-footer { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
        .sb-divider { height: 1px; background: var(--sb-border, rgba(1,1,1,0.10)); margin: 8px 10px; }

        .sb-item {
            display: flex; align-items: center; gap: 12px;
            height: 44px; padding: 0 10px; border-radius: 11px;
            text-decoration: none; color: var(--sb-fg, #010101);
            font-size: 14px; font-weight: 500;
            background: none; border: none; cursor: pointer; width: 100%;
            font-family: 'Instrument Sans', sans-serif;
            transition: background 0.15s, color 0.15s;
            white-space: nowrap; overflow: hidden;
        }
        .sb-item__icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sb-item__icon i,
        .sb-item__icon svg { width: 20px !important; height: 20px !important; stroke-width: 2px; flex-shrink: 0; }
        .sb-item__label { opacity: 1; transition: opacity 0.18s; }
        .sb-item:hover { background: var(--sb-hover, rgba(1,1,1,0.06)); }
        .sb-item--active { background: var(--sb-active-bg, #010101); color: var(--sb-active-fg, #F0F0F2); font-weight: 600; }
        .sb-item--active:hover { background: var(--sb-active-bg, #010101); }
        .sb-item__tag {
            margin-left: auto; font-size: 10px; font-weight: 500;
            color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.12);
            padding: 2px 6px; border-radius: 4px;
        }

        .sb-profile {
            display: flex; align-items: center; gap: 10px;
            padding: 7px 8px; border-radius: 11px;
            text-decoration: none; transition: background 0.15s;
            overflow: hidden; white-space: nowrap;
        }
        .sb-profile:hover { background: var(--sb-hover, rgba(1,1,1,0.05)); }
        .sb-profile__avatar {
            width: 30px; height: 30px; border-radius: 50%;
            background: var(--sb-active-bg, #010101); color: var(--sb-active-fg, #F0F0F2);
            font-size: 12px; font-weight: 700; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
        }
        .sb-profile__info { display: flex; flex-direction: column; line-height: 1.3; }
        .sb-profile__name { font-size: 13px; font-weight: 600; color: var(--sb-fg, #010101); }
        .sb-profile__role { font-size: 11px; color: var(--sb-muted, rgba(1,1,1,0.45)); }

        /* Colapsada: esconde textos. Os ícones mantêm o MESMO padding-left
           do estado expandido, então não há salto de posição ao abrir/fechar. */
        #sidebar-wrapper.is-collapsed .sb-logo__text,
        #sidebar-wrapper.is-collapsed .sb-item__label,
        #sidebar-wrapper.is-collapsed .sb-item__tag,
        #sidebar-wrapper.is-collapsed .sb-section-label,
        #sidebar-wrapper.is-collapsed .sb-profile__info {
            display: none;
        }
        #sidebar-wrapper.is-collapsed .sb-section-label { display: none; }

        /* ALINHAMENTO COLAPSADO: todos os elementos mantêm width:100% e padding:0 10px.
           O item ativo mantém seu fundo arredondado naturalmente.
           A estrela (.sb-logo__mark) recebe o mesmo width/display do .sb-item__icon
           para garantir que o centro fique idêntico ao dos ícones SVG. */
        #sidebar-wrapper.is-collapsed .sb-logo__mark {
            width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Tooltip flutuante (fixed → escapa do sidebar) */
        .sb-tooltip {
            position: fixed; z-index: 9999; pointer-events: none;
            background: #010101; color: #F0F0F2;
            font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 500;
            padding: 6px 11px; border-radius: 8px; white-space: nowrap;
            opacity: 0; transform: translateX(-4px);
            transition: opacity 0.12s ease, transform 0.12s ease;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }
        .sb-tooltip.visible { opacity: 1; transform: translateX(0); }

        /* ===== DARK MODE da sidebar (alta legibilidade) ===== */
        html[data-theme="dark"] #sidebar-wrapper {
            --sb-bg: #1E1E22;
            --sb-border: rgba(255,255,255,0.08);
            --sb-fg: #E8E8EC;
            --sb-muted: rgba(232,232,236,0.45);
            --sb-hover: rgba(255,255,255,0.07);
            --sb-active-bg: #F0F0F2;
            --sb-active-fg: #121214;
        }
        html[data-theme="dark"] #sidebar-wrapper .sb-item__icon i,
        html[data-theme="dark"] #sidebar-wrapper .sb-item__icon svg { color: #E8E8EC; }
        html[data-theme="dark"] #sidebar-wrapper .sb-item--active .sb-item__icon i,
        html[data-theme="dark"] #sidebar-wrapper .sb-item--active .sb-item__icon svg { color: #121214; }
    `;
    document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────
function attachEvents(container, currentPath, isExpanded) {
    const reRender = () => {
        renderSidebar(container, currentPath);
        setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 0);
    };

    // Toggle abrir/fechar
    const toggleBtn = container.querySelector('#sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem('sidebar_expanded', String(!isExpanded));
        reRender();
    });

    // Overlay fecha
    const overlay = container.querySelector('#sidebar-overlay');
    if (overlay) overlay.addEventListener('click', () => {
        localStorage.setItem('sidebar_expanded', 'false');
        reRender();
    });

    // Navegar fecha o menu
    container.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', () => localStorage.setItem('sidebar_expanded', 'false'));
    });

    // Logout
    const logoutBtn = container.querySelector('#btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        store.logout();
        window.location.hash = '/login';
    });

    // Theme toggle
    const themeBtn = container.querySelector('#btn-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        theme.toggle();
        reRender();
    });

    // ─── Tooltips flutuantes (só quando colapsado) ───
    const tooltip = container.querySelector('#sb-tooltip');
    if (tooltip) {
        const collapsed = !isExpanded;
        container.querySelectorAll('[data-tip]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (!collapsed) return; // expandido já mostra o label
                const rect = el.getBoundingClientRect();
                tooltip.textContent = el.dataset.tip;
                tooltip.style.top = `${rect.top + rect.height / 2 - 14}px`;
                tooltip.style.left = `${rect.right + 12}px`;
                tooltip.classList.add('visible');
            });
            el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
        });
    }
}
