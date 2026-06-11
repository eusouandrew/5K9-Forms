import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

export const renderHome = (container) => {
    const user = store.getUser();
    
    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div id="header-container"></div>
                
                <div class="page-content flex-col gap-8">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2>Olá, ${user.name} 👋</h2>
                            <p>Bem-vindo ao dashboard do 5K9 Forms.</p>
                        </div>
                        <a href="#/forms/edit/new" class="btn primary">
                            <i data-lucide="plus"></i> Criar Novo Formulário
                        </a>
                    </div>
                    
                    <div class="flex gap-4">
                        <div class="floating-card flex-1">
                            <h3 class="flex items-center gap-2 mb-2"><i data-lucide="file-text"></i> Formulários Ativos</h3>
                            <p style="font-size: 2rem; font-weight: 700; color: var(--color-highlight);">${store.getForms().length}</p>
                        </div>
                        <div class="floating-card flex-1">
                            <h3 class="flex items-center gap-2 mb-2"><i data-lucide="message-square"></i> Respostas (Total)</h3>
                            <p style="font-size: 2rem; font-weight: 700; color: var(--color-highlight);">0</p>
                        </div>
                        <div class="floating-card flex-1" style="background-color: var(--color-highlight); color: white;">
                            <h3 style="color: white; font-weight: 600;" class="flex items-center gap-2 mb-2"><i data-lucide="users"></i> Usuários Online</h3>
                            <p style="font-size: 2rem; font-weight: 700;">1</p>
                            <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">${user.name} (Você)</p>
                        </div>
                    </div>

                    <div class="floating-card">
                        <div class="flex justify-between items-center mb-4">
                            <h3>Formulários Recentes</h3>
                            <a href="#/forms" class="btn outline" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Ver Todos</a>
                        </div>
                        <div id="recent-forms" class="flex flex-col gap-2">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/');
    renderHeader(document.getElementById('header-container'), 'Dashboard');

    const recentFormsContainer = document.getElementById('recent-forms');
    const forms = store.getForms().slice(0, 5); // top 5
    
    if (forms.length === 0) {
        recentFormsContainer.innerHTML = '<p style="color: #888; padding: 1rem 0;">Nenhum formulário criado ainda.</p>';
    } else {
        recentFormsContainer.innerHTML = forms.map(f => `
            <div class="flex justify-between items-center p-4" style="border: 1px solid var(--color-sub); border-radius: 8px;">
                <div class="flex items-center gap-4">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: var(--color-sub); display: flex; align-items: center; justify-content: center; color: var(--color-highlight);">
                        <i data-lucide="file-text"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; color: var(--color-contrast);">${f.title || 'Formulário Sem Título'}</h4>
                        <p style="font-size: 0.8rem; margin: 0; color: #666;">Criado em ${new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <a href="#/forms/edit/${f.id}" class="btn outline" style="padding: 0.5rem;" title="Editar"><i data-lucide="edit-2" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/forms/ai/${f.id}" class="btn outline" style="padding: 0.5rem;" title="Forms AI"><i data-lucide="brain" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/f/${f.id}" target="_blank" class="btn outline" style="padding: 0.5rem;" title="Visualizar Live"><i data-lucide="external-link" style="width: 16px; height: 16px;"></i></a>
                </div>
            </div>
        `).join('');
    }
};
