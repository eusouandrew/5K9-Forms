import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderHome = (container) => {
    const user = store.getUser();
    
    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div class="page-content flex-col gap-6" style="padding: 2.5rem 3rem;">
                    
                    <!-- Top Bar -->
                    <div class="flex justify-between items-center mb-2">
                        <div>
                            <h2 style="font-size: 22px; font-weight: 500; color: var(--color-contrast);">Olá, ${user.name.split(' ')[0]} 👋</h2>
                            <p style="font-size: 14px; margin-top: 4px; color: var(--color-muted);">Bem-vindo ao painel administrativo do 5K9 Forms.</p>
                        </div>
                        <a href="#/forms/edit/new" class="btn primary" style="font-size: 14px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                            ＋ Criar Novo Formulário
                        </a>
                    </div>
                    
                    <!-- Stats Section -->
                    <div class="flex gap-4">
                        <div style="flex: 1; background-color: var(--color-card-bg); border: 1px solid var(--color-sub); border-radius: 16px; padding: 20px; display: flex; flex-direction: column;">
                            <i data-lucide="file-text" style="width: 20px; height: 20px; color: var(--color-contrast); margin-bottom: 12px; stroke-width: 2px;"></i>
                            <span style="font-size: 12px; color: var(--color-muted); margin-bottom: 8px;">Formulários Criados</span>
                            <span style="font-size: 32px; font-weight: 500; color: var(--color-contrast); line-height: 1;">${store.getForms().length}</span>
                        </div>

                        <div style="flex: 1; background-color: var(--color-card-bg); border: 1px solid var(--color-sub); border-radius: 16px; padding: 20px; display: flex; flex-direction: column;">
                            <i data-lucide="message-square" style="width: 20px; height: 20px; color: var(--color-contrast); margin-bottom: 12px; stroke-width: 2px;"></i>
                            <span style="font-size: 12px; color: var(--color-muted); margin-bottom: 8px;">Respostas Recebidas</span>
                            <span style="font-size: 32px; font-weight: 500; color: var(--color-contrast); line-height: 1;">0</span>
                        </div>

                        <!-- Black Card for Active Users -->
                        <div style="flex: 1; background-color: var(--color-contrast); border: 1px solid var(--color-contrast); border-radius: 16px; padding: 20px; display: flex; flex-direction: column;">
                            <i data-lucide="users" style="width: 20px; height: 20px; color: #ffffff; margin-bottom: 12px; stroke-width: 2px;"></i>
                            <span style="font-size: 12px; color: #a1a1a1; margin-bottom: 8px;">Colaboradores Ativos</span>
                            <div class="flex justify-between items-end">
                                <span style="font-size: 32px; font-weight: 500; color: #ffffff; line-height: 1;">3</span>
                                <span style="font-size: 12px; color: #a1a1a1;">Você e mais 2 online</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Forms Section -->
                    <div style="background-color: var(--color-card-bg); border: 1px solid var(--color-sub); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 1.5rem; margin-top: 0.5rem;">
                        <div class="flex justify-between items-center">
                            <h3 style="font-size: 16px; font-weight: 500;">Atividades Recentes</h3>
                            <a href="#/forms" style="font-size: 14px; color: var(--color-contrast); border: 1px solid var(--color-sub); border-radius: 8px; padding: 0.5rem 1rem; text-decoration: none; font-weight: 500; transition: background-color 0.2s;">Ver Todos</a>
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

    const recentFormsContainer = document.getElementById('recent-forms');
    const forms = store.getForms().slice(0, 4); // top 4
    
    if (forms.length === 0) {
        recentFormsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center" style="padding: 3rem 1rem; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: var(--color-muted);">Nenhum formulário ativo encontrado.</p>
                <a href="#/forms/edit/new" style="margin-top: 8px; font-size: 14px; color: #9b51e0; text-decoration: underline; font-weight: 500;">Criar o primeiro agora</a>
            </div>
        `;
    } else {
        recentFormsContainer.innerHTML = forms.map(f => `
            <div class="flex justify-between items-center p-4" style="border: 1px solid var(--color-sub); border-radius: 12px; background: var(--color-card-bg);">
                <div class="flex items-center gap-4">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: var(--color-main); display: flex; align-items: center; justify-content: center; color: var(--color-contrast);">
                        <i data-lucide="file-text" style="width: 18px; height: 18px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 500; color: var(--color-contrast);">${f.title || 'Formulário Sem Título'}</h4>
                        <p style="font-size: 12px; margin-top: 2px; color: var(--color-muted);">Modificado em ${new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <a href="#/forms/edit/${f.id}" class="btn outline" style="padding: 0.4rem 0.5rem;" title="Editar"><i data-lucide="edit-2" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/forms/ai/${f.id}" class="btn outline" style="padding: 0.4rem 0.5rem;" title="Forms AI"><i data-lucide="brain" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/f/${f.id}" target="_blank" class="btn outline" style="padding: 0.4rem 0.5rem;" title="Visualizar Live"><i data-lucide="external-link" style="width: 16px; height: 16px;"></i></a>
                </div>
            </div>
        `).join('');
    }
    
    // Add hover effect dynamically to the Ver Todos button
    const verTodosBtn = container.querySelector('h3 + a');
    if (verTodosBtn) {
        verTodosBtn.addEventListener('mouseenter', () => verTodosBtn.style.backgroundColor = 'var(--color-main)');
        verTodosBtn.addEventListener('mouseleave', () => verTodosBtn.style.backgroundColor = 'transparent');
    }
};
