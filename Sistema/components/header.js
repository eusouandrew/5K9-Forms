import { store } from '../store.js';

export const renderHeader = (container, title) => {
    const user = store.getUser();
    
    container.innerHTML = `
        <div class="navbar">
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">${title}</h2>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-sub); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--color-highlight);">
                        ${user ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span style="font-weight: 500; font-size: 0.9rem;">${user ? user.name : 'Visitante'}</span>
                </div>
            </div>
        </div>
    `;
};
