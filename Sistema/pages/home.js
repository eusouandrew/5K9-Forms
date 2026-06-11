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
                
                <div class="page-content flex-col gap-6" style="padding: 2rem;">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 style="font-size: 1.85rem; font-weight: 700; color: var(--color-contrast);">Olá, ${user.name.split(' ')[0]} 👋</h2>
                            <p style="font-size: 0.95rem; margin-top: 2px;">Bem-vindo ao painel administrativo do 5K9 Forms.</p>
                        </div>
                        <a href="#/forms/edit/new" class="btn primary" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">
                            <i data-lucide="plus" style="width: 18px; height: 18px;"></i> Criar Novo Formulário
                        </a>
                    </div>
                    
                    <!-- Stats Section -->
                    <div class="flex gap-4">
                        <div class="floating-card flex-1" style="padding: 1.5rem; justify-content: space-between;">
                            <div class="flex items-center gap-2 mb-4" style="color: #6e6e73;">
                                <i data-lucide="file-text" style="width: 18px;"></i>
                                <span style="font-size: 0.85rem; font-weight: 600;">Formulários Criados</span>
                            </div>
                            <span style="font-size: 2.25rem; font-weight: 700; color: var(--color-contrast); line-height: 1;">${store.getForms().length}</span>
                        </div>

                        <div class="floating-card flex-1" style="padding: 1.5rem; justify-content: space-between;">
                            <div class="flex items-center gap-2 mb-4" style="color: #6e6e73;">
                                <i data-lucide="message-square" style="width: 18px;"></i>
                                <span style="font-size: 0.85rem; font-weight: 600;">Respostas Recebidas</span>
                            </div>
                            <span style="font-size: 2.25rem; font-weight: 700; color: var(--color-contrast); line-height: 1;">0</span>
                        </div>

                        <!-- Black Card style for Active Users as requested -->
                        <div class="floating-card flex-1" style="padding: 1.5rem; justify-content: space-between; background-color: var(--color-contrast); color: #fff; border-color: var(--color-contrast);">
                            <div class="flex items-center gap-2 mb-4" style="color: #a1a1a6;">
                                <i data-lucide="users" style="width: 18px;"></i>
                                <span style="font-size: 0.85rem; font-weight: 600;">Colaboradores Ativos</span>
                            </div>
                            <div class="flex justify-between items-end">
                                <span style="font-size: 2.25rem; font-weight: 700; color: #fff; line-height: 1;">3</span>
                                <span style="font-size: 0.75rem; color: #a1a1a6; font-weight: 500;">Você e mais 2 online</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Forms Section -->
                    <div class="floating-card flex-col gap-4" style="padding: 2rem;">
                        <div class="flex justify-between items-center mb-2">
                            <h3 style="font-size: 1.25rem; font-weight: 700;">Atividades Recentes</h3>
                            <a href="#/forms" class="btn outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Ver Todos</a>
                        </div>
                        <div id="recent-forms" class="flex flex-col gap-3">
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
    const forms = store.getForms().slice(0, 4); // top 4
    
    if (forms.length === 0) {
        recentFormsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8" style="border: 1.5px dashed var(--color-sub); border-radius: var(--border-radius-md); color: #888;">
                <p style="margin: 0; font-size: 0.9rem;">Nenhum formulário ativo encontrado.</p>
                <a href="#/forms/edit/new" style="margin-top: 8px; font-size: 0.85rem; color: var(--color-highlight); font-weight: 600; text-decoration: none;">Criar o primeiro agora</a>
            </div>
        `;
    } else {
        recentFormsContainer.innerHTML = forms.map(f => `
            <div class="flex justify-between items-center p-4" style="border: 1px solid var(--color-sub); border-radius: var(--border-radius-md); transition: background-color 0.2s; background: #fff;">
                <div class="flex items-center gap-4">
                    <div style="width: 44px; height: 44px; border-radius: var(--border-radius-md); background-color: var(--color-main); display: flex; align-items: center; justify-content: center; color: var(--color-contrast);">
                        <i data-lucide="file-text" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1rem; color: var(--color-contrast);">${f.title || 'Formulário Sem Título'}</h4>
                        <p style="font-size: 0.8rem; margin-top: 1px; color: #888;">Modificado em ${new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <a href="#/forms/edit/${f.id}" class="btn outline" style="padding: 0.5rem;" title="Editar"><i data-lucide="edit-2" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/forms/ai/${f.id}" class="btn outline" style="padding: 0.5rem;" title="Forms AI"><i data-lucide="brain" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/f/${f.id}" target="_blank" class="btn primary" style="padding: 0.5rem;" title="Visualizar Live"><i data-lucide="external-link" style="width: 16px; height: 16px;"></i></a>
                </div>
            </div>
        `).join('');
    }
};
