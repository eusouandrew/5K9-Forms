import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderForms = (container) => {
    let currentView = 'list';
    let currentSort = 'desc'; 
    let searchTerm = '';

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                        
                        <!-- Top Bar -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Meus Formulários</h2>
                            <a href="#/forms/edit/new" style="display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 24px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 14px; font-weight: 600; text-decoration: none; transition: opacity 0.2s;">
                                ＋ Novo Formulário
                            </a>
                        </div>

                        <!-- Main Floating Card -->
                        <div style="background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 20px;">
                            
                            <!-- Top Row: Controls -->
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
                                <!-- Smart Search -->
                                <div style="position: relative; width: 280px;">
                                    <i data-lucide="search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                                    <input type="text" id="forms-search" placeholder="Busca inteligente: nome, resposta, data..." value="${searchTerm}" style="width: 100%; height: 44px; border-radius: 12px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 16px 0 40px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none;">
                                </div>
                                
                                <!-- View Toggles & Sort -->
                                <div style="display: flex; gap: 8px;">
                                    <div style="display: flex; gap: 4px;">
                                        <button id="view-list" style="width: 40px; height: 40px; border-radius: 10px; background-color: ${currentView === 'list' ? '#010101' : '#F0F0F2'}; border: 1px solid #DFDFE3; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                            <i data-lucide="list" style="width: 18px; height: 18px; color: ${currentView === 'list' ? '#F0F0F2' : '#010101'};"></i>
                                        </button>
                                        <button id="view-grid" style="width: 40px; height: 40px; border-radius: 10px; background-color: ${currentView === 'grid' ? '#010101' : '#F0F0F2'}; border: 1px solid #DFDFE3; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                            <i data-lucide="grid" style="width: 18px; height: 18px; color: ${currentView === 'grid' ? '#F0F0F2' : '#010101'};"></i>
                                        </button>
                                    </div>
                                    <button id="sort-toggle" style="height: 40px; padding: 0 16px; border-radius: 10px; background-color: transparent; border: 1px solid rgba(1,1,1,0.1); font-size: 13px; color: #010101; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                        Data de criação <span>${currentSort === 'desc' ? '↓' : '↑'}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Content Area -->
                            <div id="forms-content-area" style="min-height: 200px;">
                                <!-- Dynamic Content -->
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .form-row, .form-grid-card {
                    transition: border-color 0.2s;
                }
                .form-row:hover, .form-grid-card:hover { 
                    border-color: rgba(1,1,1,0.2) !important; 
                }
                
                .dropdown-menu {
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 100%;
                    margin-top: 4px;
                    background: #F0F0F2;
                    border: 1px solid rgba(1,1,1,0.1);
                    border-radius: 8px;
                    padding: 4px;
                    z-index: 50;
                    min-width: 120px;
                }
                .dropdown-container.open .dropdown-menu {
                    display: flex;
                    flex-direction: column;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    font-size: 13px;
                    color: #010101;
                    text-decoration: none;
                    border-radius: 6px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                }
                .dropdown-item:hover { background: #DFDFE3; }
                .dropdown-item.danger { color: #d32f2f; }
                .dropdown-item.danger:hover { background: #ffebee; }
                
                #forms-search::placeholder { color: rgba(1,1,1,0.4); }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), '/forms');
        renderContent();
        attachEventListeners();
        if (window.lucide) lucide.createIcons();
    };

    const renderContent = () => {
        const contentArea = document.getElementById('forms-content-area');
        
        // Filtering
        let forms = store.getForms().filter(f => 
            (f.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting
        forms.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return currentSort === 'desc' ? timeB - timeA : timeA - timeB;
        });

        if (forms.length === 0) {
            contentArea.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 16px;">
                    <i data-lucide="inbox" style="width: 40px; height: 40px; color: rgba(1,1,1,0.2);"></i>
                    <span style="font-size: 14px; color: rgba(1,1,1,0.4);">Nenhum formulário encontrado.</span>
                </div>
            `;
            return;
        }

        if (currentView === 'list') {
            contentArea.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${forms.map(f => `
                        <div class="form-row" style="background-color: #F0F0F2; border-radius: 12px; border: 1px solid #DFDFE3; height: 56px; padding: 0 16px; display: flex; align-items: center;">
                            
                            <!-- Icon -->
                            <i data-lucide="layout-template" style="width: 20px; height: 20px; color: #7F00E1; stroke-width: 1.5px; margin-right: 16px;"></i>
                            
                            <!-- Texts -->
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <span style="font-size: 14px; font-weight: 500; color: #010101; line-height: 1;">${f.title || 'Sem Título'}</span>
                                <span style="font-size: 11px; color: rgba(1,1,1,0.4); line-height: 1;">Modificado em ${new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <!-- Spacer -->
                            <div style="flex: 1;"></div>
                            
                            <!-- Badge -->
                            <div style="background-color: #DFDFE3; color: #010101; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; margin-right: 16px;">
                                0 Respostas
                            </div>
                            
                            <!-- Menu -->
                            <div class="dropdown-container" style="position: relative;">
                                <button class="menu-btn" style="background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center;" aria-label="Ações">
                                    <i data-lucide="more-vertical" style="width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <a href="#/forms/responses/${f.id}" class="dropdown-item"><i data-lucide="bar-chart-2" style="width: 14px; height: 14px;"></i> Ver Respostas</a>
                                    <a href="#/forms/ai/${f.id}" class="dropdown-item" style="color: #7F00E1;"><i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> Forms AI</a>
                                    <a href="#/forms/edit/${f.id}" class="dropdown-item"><i data-lucide="edit-2" style="width: 14px; height: 14px;"></i> Editar</a>
                                    <a href="#/f/${f.id}" target="_blank" class="dropdown-item"><i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Abrir Live</a>
                                    <button class="dropdown-item danger delete-form-btn" data-id="${f.id}"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Excluir</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Grid View
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                    ${forms.map(f => `
                        <div class="form-grid-card" style="background-color: #F0F0F2; border-radius: 12px; border: 1px solid #DFDFE3; padding: 16px; display: flex; flex-direction: column; gap: 16px;">
                            
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <i data-lucide="layout-template" style="width: 24px; height: 24px; color: #7F00E1; stroke-width: 1.5px;"></i>
                                <div class="dropdown-container" style="position: relative;">
                                    <button class="menu-btn" style="background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center;" aria-label="Ações">
                                        <i data-lucide="more-vertical" style="width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a href="#/forms/responses/${f.id}" class="dropdown-item"><i data-lucide="bar-chart-2" style="width: 14px; height: 14px;"></i> Ver Respostas</a>
                                        <a href="#/forms/ai/${f.id}" class="dropdown-item" style="color: #7F00E1;"><i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> Forms AI</a>
                                        <a href="#/forms/edit/${f.id}" class="dropdown-item"><i data-lucide="edit-2" style="width: 14px; height: 14px;"></i> Editar</a>
                                        <a href="#/f/${f.id}" target="_blank" class="dropdown-item"><i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Abrir Live</a>
                                        <button class="dropdown-item danger delete-form-btn" data-id="${f.id}"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Excluir</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <span style="font-size: 14px; font-weight: 600; color: #010101; line-height: 1.2;">${f.title || 'Sem Título'}</span>
                                <span style="font-size: 11px; color: rgba(1,1,1,0.4);">Criado em ${new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <div style="display: flex; justify-content: flex-end; margin-top: auto;">
                                <div style="background-color: #DFDFE3; color: #010101; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;">
                                    0 Respostas
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    };

    const attachEventListeners = () => {
        // Toggle view
        document.getElementById('view-list').addEventListener('click', () => {
            if (currentView !== 'list') {
                currentView = 'list';
                renderLayout();
            }
        });

        document.getElementById('view-grid').addEventListener('click', () => {
            if (currentView !== 'grid') {
                currentView = 'grid';
                renderLayout();
            }
        });

        // Toggle sort
        document.getElementById('sort-toggle').addEventListener('click', () => {
            currentSort = currentSort === 'desc' ? 'asc' : 'desc';
            renderLayout();
        });

        // Search
        const searchInput = document.getElementById('forms-search');
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderContent();
            if (window.lucide) lucide.createIcons();
            attachDropdownListeners();
        });

        attachDropdownListeners();
    };

    const attachDropdownListeners = () => {
        const dropContainers = container.querySelectorAll('.dropdown-container');
        
        dropContainers.forEach(drop => {
            const btn = drop.querySelector('.menu-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                dropContainers.forEach(other => {
                    if (other !== drop) other.classList.remove('open');
                });
                drop.classList.toggle('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropContainers.forEach(drop => drop.classList.remove('open'));
        }, { once: false }); // Needs to be attached once ideally, but simple for now

        // Delete forms logic
        const deleteBtns = container.querySelectorAll('.delete-form-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este formulário?')) {
                    store.deleteForm(id);
                    renderLayout();
                }
            });
        });
    };

    // Initial render
    renderLayout();
};
