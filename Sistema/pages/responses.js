import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderResponses = (container, formId) => {
    const form = store.getForm(formId);

    if (!form) {
        container.innerHTML = `
            <div style="display: flex; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; align-items: center; justify-content: center;">
                <h2>Formulário não encontrado</h2>
            </div>
        `;
        return;
    }

    // Mock data for demonstration purposes
    const mockResponses = [
        { id: '1', respondent: { name: 'João Silva', email: 'joao.silva@email.com', initials: 'JS' }, date: '12 jun 2025 · 14h32', status: 'Completo', completion: 100 },
        { id: '2', respondent: { name: 'Maria Souza', email: 'msouza@corp.com', initials: 'MS' }, date: '12 jun 2025 · 10h15', status: 'Completo', completion: 100 },
        { id: '3', respondent: { name: 'Carlos Almeida', email: 'carlos.almeida@tech.io', initials: 'CA' }, date: '11 jun 2025 · 18h40', status: 'Parcial', completion: 60 },
        { id: '4', respondent: { name: 'Ana Beatriz', email: 'ana.b@studio.net', initials: 'AB' }, date: '11 jun 2025 · 09h10', status: 'Completo', completion: 100 },
        { id: '5', respondent: { name: 'Felipe Costa', email: 'fcosta99@gmail.com', initials: 'FC' }, date: '10 jun 2025 · 16h22', status: 'Parcial', completion: 30 }
    ];

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                        
                        <!-- TOP BAR -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="font-size: 12px; color: rgba(1,1,1,0.35); font-weight: 500;">
                                    <a href="#/forms" style="color: inherit; text-decoration: none;">Formulários</a> / ${form.title || 'Sem Título'}
                                </div>
                                <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Respostas</h2>
                            </div>
                            
                            <div style="display: flex; gap: 8px;">
                                <button class="ghost-btn">
                                    <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                                    Exportar CSV
                                </button>
                                <button class="ghost-btn">
                                    <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                                    Exportar PDF
                                </button>
                            </div>
                        </div>

                        <!-- SUMMARY ROW -->
                        <div style="display: flex; gap: 16px;">
                            
                            <!-- Card 1 -->
                            <div class="summary-card">
                                <i data-lucide="users" style="width: 20px; height: 20px; color: #010101; margin-bottom: 12px;"></i>
                                <div style="font-size: 12px; color: rgba(1,1,1,0.45); font-weight: 500;">Total de Respostas</div>
                                <div style="font-size: 32px; font-weight: 700; color: #010101;">48</div>
                            </div>

                            <!-- Card 2 (Inverted) -->
                            <div class="summary-card inverted">
                                <i data-lucide="bar-chart-2" style="width: 20px; height: 20px; color: #F0F0F2; margin-bottom: 12px;"></i>
                                <div style="font-size: 12px; color: rgba(240,240,242,0.6); font-weight: 500;">Taxa de Conclusão</div>
                                <div style="font-size: 32px; font-weight: 700; color: #F0F0F2;">87%</div>
                            </div>

                            <!-- Card 3 -->
                            <div class="summary-card">
                                <i data-lucide="clock" style="width: 20px; height: 20px; color: #010101; margin-bottom: 12px;"></i>
                                <div style="font-size: 12px; color: rgba(1,1,1,0.45); font-weight: 500;">Última Resposta</div>
                                <div style="font-size: 16px; font-weight: 500; color: #010101; margin-top: 10px;">Hoje, 14h32</div>
                            </div>

                        </div>

                        <!-- FILTER BAR -->
                        <div style="background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                            
                            <div style="position: relative; width: 280px;">
                                <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                                <input type="text" placeholder="Buscar resposta ou respondente..." style="width: 100%; height: 40px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 16px 0 36px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none;">
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <button class="ghost-btn">
                                    Período
                                    <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i>
                                </button>
                                <button class="ghost-btn">
                                    Status
                                    <i data-lucide="chevron-down" style="width: 16px; height: 16px;"></i>
                                </button>
                                <button class="ghost-btn" style="padding: 0 10px;" aria-label="Filtros">
                                    <i data-lucide="sliders" style="width: 16px; height: 16px;"></i>
                                </button>
                            </div>
                        </div>

                        <!-- RESPONSES TABLE -->
                        <div style="background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
                            
                            <!-- Header -->
                            <div style="display: flex; align-items: center; height: 44px; background-color: #F0F0F2; border-bottom: 1px solid #DFDFE3; padding: 0 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">
                                <div style="flex: 2; padding-left: 16px;">Respondente</div>
                                <div style="flex: 1; padding-left: 16px;">Data</div>
                                <div style="flex: 1; padding-left: 16px;">Status</div>
                                <div style="flex: 1; padding-left: 16px;">Conclusão</div>
                                <div style="width: 80px; padding-left: 16px;">Ações</div>
                            </div>

                            <!-- Data Rows -->
                            <div style="display: flex; flex-direction: column;">
                                ${mockResponses.map((r, i) => `
                                    <div class="table-row" style="display: flex; align-items: center; height: 56px; border-bottom: ${i === mockResponses.length - 1 ? 'none' : '1px solid #DFDFE3'}; padding: 0 16px;">
                                        
                                        <!-- Respondente -->
                                        <div style="flex: 2; display: flex; align-items: center; padding-left: 16px; gap: 12px;">
                                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #DFDFE3; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #010101;">
                                                ${r.respondent.initials}
                                            </div>
                                            <div style="display: flex; flex-direction: column; line-height: 1.2;">
                                                <span style="font-size: 14px; font-weight: 500; color: #010101;">${r.respondent.name}</span>
                                                <span style="font-size: 11px; color: rgba(1,1,1,0.4);">${r.respondent.email}</span>
                                            </div>
                                        </div>

                                        <!-- Data -->
                                        <div style="flex: 1; padding-left: 16px; font-size: 13px; color: rgba(1,1,1,0.6);">
                                            ${r.date}
                                        </div>

                                        <!-- Status -->
                                        <div style="flex: 1; padding-left: 16px;">
                                            <span style="display: inline-flex; align-items: center; justify-content: center; height: 24px; padding: 0 10px; border-radius: 100px; font-size: 11px; font-weight: 500; ${r.status === 'Completo' ? 'background-color: #010101; color: #F0F0F2;' : 'background-color: #DFDFE3; color: rgba(1,1,1,0.6);'}">
                                                ${r.status}
                                            </span>
                                        </div>

                                        <!-- Conclusão -->
                                        <div style="flex: 1; padding-left: 16px; display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 80px; height: 4px; border-radius: 100px; background-color: #DFDFE3; overflow: hidden; display: flex;">
                                                <div style="height: 100%; width: ${r.completion}%; background-color: #7F00E1;"></div>
                                            </div>
                                            <span style="font-size: 12px; color: rgba(1,1,1,0.5);">${r.completion}%</span>
                                        </div>

                                        <!-- Ações -->
                                        <div style="width: 80px; padding-left: 16px; display: flex; align-items: center; gap: 8px;">
                                            <a href="#/response/${r.id}" style="background: transparent; border: 1px solid #DFDFE3; border-radius: 8px; height: 28px; padding: 0 10px; font-size: 11px; font-family: 'Instrument Sans'; font-weight: 500; color: #010101; text-decoration: none; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                                Ver
                                            </a>
                                            <button style="background: none; border: none; padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="trash-action">
                                                <i data-lucide="trash-2" style="width: 16px; height: 16px; color: rgba(1,1,1,0.3); transition: color 0.2s;"></i>
                                            </button>
                                        </div>

                                    </div>
                                `).join('')}
                            </div>

                            <!-- Pagination -->
                            <div style="height: 44px; border-top: 1px solid #DFDFE3; background-color: transparent; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
                                <div style="font-size: 12px; color: rgba(1,1,1,0.4);">
                                    Mostrando 1–5 de 48 respostas
                                </div>
                                <div style="display: flex; gap: 4px;">
                                    <button class="page-btn ghost"><i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i></button>
                                    <button class="page-btn active">1</button>
                                    <button class="page-btn ghost">2</button>
                                    <button class="page-btn ghost">3</button>
                                    <button class="page-btn ghost">...</button>
                                    <button class="page-btn ghost">10</button>
                                    <button class="page-btn ghost"><i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i></button>
                                </div>
                            </div>

                        </div>

                        <!-- Spacer for bottom padding -->
                        <div style="height: 32px;"></div>

                    </div>
                </div>
            </div>

            <style>
                .ghost-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    height: 36px;
                    padding: 0 12px;
                    border-radius: 10px;
                    background-color: transparent;
                    border: 1px solid rgba(1,1,1,0.1);
                    color: #010101;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: 'Instrument Sans', sans-serif;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .ghost-btn:hover {
                    background-color: rgba(1,1,1,0.05);
                }

                .summary-card {
                    flex: 1;
                    background-color: #DFDFE3;
                    border-radius: 16px;
                    border: 1px solid rgba(1,1,1,0.08);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }
                .summary-card.inverted {
                    background-color: #010101;
                    border-color: #010101;
                }

                .table-row { transition: background-color 0.2s; }
                .table-row:hover { background-color: #F0F0F2 !important; }

                .trash-action:hover i { color: #010101 !important; }

                .page-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-family: 'Instrument Sans', sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .page-btn.active {
                    background-color: #010101;
                    color: #F0F0F2;
                }
                .page-btn.ghost {
                    background-color: transparent;
                    color: #010101;
                    border: 1px solid rgba(1,1,1,0.1);
                }
                .page-btn.ghost:hover {
                    background-color: rgba(1,1,1,0.05);
                }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), window.location.hash.slice(1) || '/');
        if (window.lucide) lucide.createIcons();
    };

    renderLayout();
};
