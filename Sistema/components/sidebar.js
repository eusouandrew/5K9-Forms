import { store } from '../store.js';

export const renderSidebar = (container, currentPath) => {
    container.innerHTML = `
        <div class="sidebar">
            <div class="flex items-center gap-2 mb-8" style="padding: 0 1rem;">
                <img src="Logo.svg" alt="5K9" style="height: 24px;">
                <h3 style="margin: 0; color: var(--color-contrast);">5K9 Forms</h3>
            </div>
            
            <nav class="flex flex-col gap-2">
                <a href="#/" class="menu-item ${currentPath === '/' ? 'active' : ''}">
                    <i data-lucide="layout-dashboard"></i> Dashboard
                </a>
                <a href="#/forms" class="menu-item ${currentPath === '/forms' ? 'active' : ''}">
                    <i data-lucide="file-text"></i> Formulários
                </a>
                <a href="#/questions" class="menu-item ${currentPath === '/questions' ? 'active' : ''}">
                    <i data-lucide="database"></i> Banco de Questões
                </a>
                <a href="#/settings" class="menu-item ${currentPath === '/settings' ? 'active' : ''}">
                    <i data-lucide="settings"></i> Configurações
                </a>
            </nav>

            <div style="margin-top: auto;">
                <a href="#" id="logout-btn" class="menu-item" style="color: #d32f2f;">
                    <i data-lucide="log-out"></i> Sair
                </a>
            </div>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        store.logout();
        window.location.hash = '/login';
    });
};
