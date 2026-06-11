import { store } from '../store.js';

export const renderHeader = (container, title) => {
    const user = store.getUser();
    
    // Simulating active users online
    const activeUsers = [
        { name: 'Andrew', color: '#7F00E1' },
        { name: 'Lucas', color: '#010101' },
        { name: 'Mariana', color: '#3b82f6' }
    ];

    container.innerHTML = `
        <div class="navbar">
            <h2 class="header-title">${title}</h2>
            
            <div class="flex items-center gap-4">
                <!-- Search box (Ledgerix style) -->
                <div class="search-bar-header">
                    <i data-lucide="search" style="width: 16px; height: 16px; color: #888;"></i>
                    <input type="text" placeholder="Pesquisar..." class="search-input-header">
                </div>

                <!-- Action icons -->
                <button class="btn-icon-header" title="Notificações">
                    <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
                </button>
                <button class="btn-icon-header" title="Configurações do Sistema">
                    <i data-lucide="settings" style="width: 18px; height: 18px;"></i>
                </button>

                <!-- Users pill (Image 3 inspired) -->
                <div class="users-pill-container" title="Usuários Ativos no Sistema">
                    <div class="avatar-stack">
                        ${activeUsers.map(u => `
                            <div class="avatar-circle" style="background-color: ${u.color};">
                                ${u.name.charAt(0)}
                            </div>
                        `).join('')}
                    </div>
                    <span class="pill-label">Ativos</span>
                </div>

                <!-- User profile -->
                <div class="user-profile-header">
                    <div class="profile-avatar">
                        ${user ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div class="profile-info">
                        <span class="profile-name">${user ? user.name.split(' ')[0] : 'Visitante'}</span>
                        <span class="profile-role">Admin</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};
