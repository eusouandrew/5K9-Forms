import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

export const renderForms = (container) => {
    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div id="header-container"></div>
                
                <div class="page-content flex-col gap-4">
                    <div class="flex justify-between items-center mb-4">
                        <h2>Meus Formulários</h2>
                        <a href="#/forms/edit/new" class="btn primary">
                            <i data-lucide="plus"></i> Novo Formulário
                        </a>
                    </div>
                    
                    <div class="floating-card flex-col gap-4">
                        <div class="flex justify-between items-center gap-4">
                            <div class="flex-1 relative">
                                <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-sub);"></i>
                                <input type="text" id="searchInput" class="input-field" style="padding-left: 2.5rem;" placeholder="Busca inteligente: nome, respondente, conteúdo...">
                            </div>
                            <div class="flex gap-2">
                                <button class="btn outline" title="Visualização em Lista"><i data-lucide="list"></i></button>
                                <button class="btn outline" title="Visualização em Grid"><i data-lucide="grid"></i></button>
                            </div>
                        </div>

                        <div id="forms-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                            <!-- Forms list populated by JS -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/forms');
    renderHeader(document.getElementById('header-container'), 'Repositório de Formulários');

    const renderFormsList = (searchTerm = '') => {
        const formsGrid = document.getElementById('forms-grid');
        const forms = store.getForms().filter(f => 
            (f.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (forms.length === 0) {
            formsGrid.innerHTML = '<p style="color: #888;">Nenhum formulário encontrado.</p>';
            return;
        }

        formsGrid.innerHTML = forms.map(f => `
            <div style="border: 1px solid var(--color-sub); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background-color: #fff; transition: box-shadow 0.2s;">
                <div class="flex justify-between items-start">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background-color: var(--color-sub); display: flex; align-items: center; justify-content: center; color: var(--color-highlight);">
                        <i data-lucide="layout-template"></i>
                    </div>
                    <span style="font-size: 0.75rem; background-color: var(--color-main); padding: 0.25rem 0.5rem; border-radius: 4px; color: var(--color-contrast);">0 Respostas</span>
                </div>
                <div>
                    <h3 style="margin-bottom: 0.25rem; font-size: 1.1rem; color: var(--color-contrast);">${f.title || 'Sem Título'}</h3>
                    <p style="font-size: 0.8rem; color: #888;">Modificado em ${new Date(f.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="flex gap-2 mt-auto" style="border-top: 1px solid var(--color-sub); padding-top: 1rem;">
                    <a href="#/forms/edit/${f.id}" class="btn outline" style="flex: 1; justify-content: center; font-size: 0.85rem;"><i data-lucide="edit-3"></i> Editar</a>
                    <a href="#/f/${f.id}" target="_blank" class="btn primary" style="padding: 0.75rem;"><i data-lucide="external-link"></i></a>
                </div>
            </div>
        `).join('');
        
        if (window.lucide) lucide.createIcons();
    };

    renderFormsList();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderFormsList(e.target.value);
    });
};
