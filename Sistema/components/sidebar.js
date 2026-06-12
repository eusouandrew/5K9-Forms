import { store } from '../store.js';

export const renderSidebar = (container, currentPath) => {
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.classList.toggle('sidebar-collapsed', isCollapsed);
    }

    container.innerHTML = `
        <div class="sidebar ${isCollapsed ? 'collapsed' : ''}">
            <div class="logo-container">
                <img src="Logo.svg" alt="5K9" style="height: 32px; width: 32px; flex-shrink: 0;">
                <button id="toggle-sidebar" class="btn-icon">
                    <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-left'}"></i>
                </button>
            </div>
            
            <nav class="flex flex-col gap-2 w-full">
                <a href="#/" class="menu-item ${currentPath === '/' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i> <span>Dashboard</span>
                </a>
                <a href="#/forms" class="menu-item ${currentPath === '/forms' ? 'active' : ''}">
                    <i data-lucide="file-text"></i> <span>Formulários</span>
                </a>
                <a href="#/questions" class="menu-item ${currentPath === '/questions' ? 'active' : ''}">
                    <i data-lucide="help-circle"></i> <span>Questões</span>
                </a>
                <a href="#/workspaces" class="menu-item ${currentPath === '/workspaces' ? 'active' : ''}">
                    <i data-lucide="layers"></i> <span>Workspaces</span>
                </a>
            </nav>

            <div class="w-full mt-auto">
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
