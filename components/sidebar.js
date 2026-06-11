import { store } from '../store.js';

export const renderSidebar = (container, currentPath) => {
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.classList.toggle('sidebar-collapsed', isCollapsed);
    }

    container.innerHTML = `
        <div class="sidebar ${isCollapsed ? 'collapsed' : ''}">
            <div class="flex items-center justify-between mb-8 logo-container" style="padding: 0 0.5rem;">
                <img src="Logo.svg" alt="5K9" style="height: 32px; width: 32px;">
                <button id="toggle-sidebar" class="btn-icon">
                    <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-left'}" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
            
            <nav class="flex flex-col gap-2">
                <a href="#/" class="menu-item ${currentPath === '/' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
                </a>
                <a href="#/forms" class="menu-item ${currentPath === '/forms' ? 'active' : ''}">
                    <i data-lucide="file-text"></i> <span>Formulários</span>
                </a>
                <a href="#/questions" class="menu-item ${currentPath === '/questions' ? 'active' : ''}">
                    <i data-lucide="database"></i> <span>Questões</span>
                </a>
            </nav>

            <div style="margin-top: auto;">
                <a href="#" id="logout-btn" class="menu-item" style="color: #d32f2f;">
                    <i data-lucide="log-out"></i> <span>Sair</span>
                </a>
            </div>
        </div>
    `;

    document.getElementById('toggle-sidebar').addEventListener('click', () => {
        const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
        localStorage.setItem('sidebar_collapsed', !collapsed);
        renderSidebar(container, currentPath);
        if (window.lucide) lucide.createIcons();
    });

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        store.logout();
        window.location.hash = '/login';
    });
};
