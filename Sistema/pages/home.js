import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderHome = (container) => {
    const user = store.getUser();
    const forms = store.getForms();

    // Heartbeat de presença + dados de equipe online
    store.heartbeat();
    const team = store.getOnlineUsers();
    const online = team.filter(m => m.online);
    const onlineCount = online.length;
    const othersCount = Math.max(0, onlineCount - 1);

    // Métricas
    let totalResponses = 0;
    forms.forEach(f => { totalResponses += store.getResponses(f.id).length; });

    // Item 6: 3º card vira "Taxa de Resposta" (respostas por formulário)
    const responseRate = forms.length > 0 ? Math.round((totalResponses / forms.length) * 10) / 10 : 0;

    container.innerHTML = `
        <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">

            <div id="sidebar-container"></div>

            <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 40px 48px; padding-left: 116px;">
                <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">

                    <!-- Top Bar & Collaborators Pill -->
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;">
                        <div>
                            <h1 style="font-size: 38px; font-weight: 700; color: #010101; margin: 0; letter-spacing: -0.02em; line-height: 1.05;">Olá, ${user.name.split(' ')[0]} 👋</h1>
                            <p style="font-size: 16px; color: rgba(1,1,1,0.5); margin: 8px 0 0 0;">Bem-vindo ao painel administrativo do 5K9 Forms.</p>
                        </div>

                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 12px;">
                            <a href="#/forms/edit/new" class="dash-cta" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 26px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 15px; font-weight: 600; text-decoration: none; transition: transform 0.15s, opacity 0.2s; white-space: nowrap;">
                                ＋ Criar Novo Formulário
                            </a>

                            <!-- Collaborators Pill (funcional) -->
                            <div style="display: flex; align-items: center; gap: 12px; background-color: #DFDFE3; border-radius: 100px; padding: 7px 16px 7px 7px;" title="${online.map(m => m.name + (m.isCurrent ? ' (você)' : '')).join(', ')}">
                                <div style="display: flex; align-items: center;">
                                    ${online.slice(0, 4).map(m => `
                                        <div style="position: relative; margin-right: -8px;">
                                            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${m.color}; border: 2px solid #DFDFE3; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #010101;">
                                                ${m.initials}
                                            </div>
                                            <div style="position: absolute; bottom: 0px; right: 2px; width: 8px; height: 8px; border-radius: 50%; background-color: #7F00E1; border: 1.5px solid #DFDFE3;"></div>
                                        </div>
                                    `).join('')}
                                </div>
                                <span style="font-size: 13px; color: rgba(1,1,1,0.5); padding-left: 8px; white-space: nowrap;">
                                    ${onlineCount <= 1 ? 'Apenas você online' : `Você e mais ${othersCount} online`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Metric Cards Row -->
                    <div style="display: flex; gap: 16px;">
                        <!-- Card 1: Formulários (clicável) -->
                        <a href="#/forms" class="metric-card" style="flex: 1; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 12px; text-decoration: none; transition: transform 0.15s, border-color 0.15s; cursor: pointer;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <i data-lucide="file-text" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                                <i data-lucide="arrow-up-right" style="width: 16px; height: 16px; color: rgba(1,1,1,0.3);"></i>
                            </div>
                            <span style="font-size: 13px; color: rgba(1,1,1,0.5);">Formulários Criados</span>
                            <span style="font-size: 34px; font-weight: 700; color: #010101; line-height: 1;">${forms.length}</span>
                        </a>

                        <!-- Card 2: Respostas (clicável) -->
                        <a href="#/forms" class="metric-card" style="flex: 1; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 12px; text-decoration: none; transition: transform 0.15s, border-color 0.15s; cursor: pointer;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <i data-lucide="message-square" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                                <i data-lucide="arrow-up-right" style="width: 16px; height: 16px; color: rgba(1,1,1,0.3);"></i>
                            </div>
                            <span style="font-size: 13px; color: rgba(1,1,1,0.5);">Respostas Recebidas</span>
                            <span style="font-size: 34px; font-weight: 700; color: #010101; line-height: 1;">${totalResponses}</span>
                        </a>

                        <!-- Card 3 (Black): Taxa de Resposta — substitui colaboradores -->
                        <div class="metric-card-dark" style="flex: 1; background-color: #010101; border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 12px;">
                            <i data-lucide="trending-up" style="width: 20px; height: 20px; color: #F0F0F2; stroke-width: 1.5px;"></i>
                            <span style="font-size: 13px; color: rgba(240,240,242,0.6);">Média de Respostas por Formulário</span>
                            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                <span style="font-size: 34px; font-weight: 700; color: #F0F0F2; line-height: 1;">${responseRate}</span>
                                <span style="font-size: 12px; color: #7F00E1; font-weight: 600;">${totalResponses > 0 ? 'Ativo' : 'Sem dados ainda'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity Section -->
                    <div style="background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #010101; margin: 0;">Atividades Recentes</h3>
                            <a href="#/forms" style="font-size: 12px; color: #010101; border: 1px solid rgba(1,1,1,0.15); border-radius: 10px; padding: 6px 12px; text-decoration: none; background-color: transparent;">Ver Todos</a>
                        </div>

                        <div id="recent-forms" style="display: flex; flex-direction: column; gap: 12px;">
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <style>
            .dash-cta:hover { transform: translateY(-1px); opacity: 0.95; }
            .metric-card:hover { transform: translateY(-2px); border-color: rgba(1,1,1,0.25) !important; }
            .recent-row { transition: border-color 0.15s, transform 0.15s; }
            .recent-row:hover { border-color: rgba(1,1,1,0.2) !important; }

            /* Item 7: hover dos ícones de ação nas atividades recentes */
            .act-btn { transition: all 0.15s; }
            .act-btn--edit:hover, .act-btn--live:hover {
                background-color: #010101 !important;
                border-color: #010101 !important;
            }
            .act-btn--edit:hover i, .act-btn--live:hover i { color: #F0F0F2 !important; }
            .act-btn--ai:hover {
                background-color: #7F00E1 !important;
                border-color: #7F00E1 !important;
            }
            .act-btn--ai:hover i { color: #F0F0F2 !important; }
        </style>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/');

    const recentFormsContainer = document.getElementById('recent-forms');
    const displayForms = forms.slice(0, 4);

    if (displayForms.length === 0) {
        recentFormsContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 0;">
                <p style="font-size: 14px; color: rgba(1,1,1,0.4); margin: 0;">Nenhum formulário ativo encontrado.</p>
                <a href="#/forms/edit/new" style="font-size: 14px; color: #7F00E1; text-decoration: underline; font-weight: 500; margin-top: 8px;">Criar o primeiro agora</a>
            </div>
        `;
    } else {
        recentFormsContainer.innerHTML = displayForms.map(f => {
            const respCount = store.getResponses(f.id).length;
            const dateStr = f.createdAt ? new Date(f.createdAt).toLocaleDateString('pt-BR') : '—';
            return `
            <div class="recent-row" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid rgba(1,1,1,0.1); border-radius: 12px; background: #F0F0F2;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #DFDFE3; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="file-text" style="width: 18px; height: 18px; color: #010101;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #010101;">${f.title || 'Formulário Sem Título'}</h4>
                        <p style="font-size: 12px; color: rgba(1,1,1,0.45); margin: 2px 0 0 0;">${respCount} resposta${respCount !== 1 ? 's' : ''} · Modificado em ${dateStr}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <a href="#/forms/edit/${f.id}" class="act-btn act-btn--edit" data-tip="Editar" style="padding: 8px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101; display: flex;"><i data-lucide="edit-2" style="width: 16px; height: 16px; transition: color 0.15s;"></i></a>
                    <a href="#/forms/ai/${f.id}" class="act-btn act-btn--ai" data-tip="Forms AI" style="padding: 8px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101; display: flex;"><i data-lucide="sparkles" style="width: 16px; height: 16px; transition: color 0.15s;"></i></a>
                    <a href="#/f/${f.id}" target="_blank" class="act-btn act-btn--live" data-tip="Abrir formulário" style="padding: 8px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101; display: flex;"><i data-lucide="external-link" style="width: 16px; height: 16px; transition: color 0.15s;"></i></a>
                </div>
            </div>
        `}).join('');
    }

    if (window.lucide) lucide.createIcons();
};
