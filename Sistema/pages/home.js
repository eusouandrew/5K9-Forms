import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderHome = (container) => {
    const user = store.getUser();
    const forms = store.getForms();
    
    const colors = ['#e1bee7', '#c5cae9', '#ffcc80'];
    const initials = ['AK', 'JD', 'MB'];

    container.innerHTML = `
        <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
            
            <div id="sidebar-container"></div>
            
            <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                    
                    <!-- Top Bar & Collaborators Pill -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Olá, ${user.name.split(' ')[0]} 👋</h2>
                            <p style="font-size: 13px; color: rgba(1,1,1,0.45); margin: 4px 0 0 0;">Bem-vindo ao painel administrativo do 5K9 Forms.</p>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 12px;">
                            <a href="#/forms/edit/new" style="display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 24px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 14px; font-weight: 600; text-decoration: none; transition: opacity 0.2s;">
                                ＋ Criar Novo Formulário
                            </a>
                            
                            <!-- Collaborators Pill -->
                            <div style="display: flex; align-items: center; gap: 12px; background-color: #DFDFE3; border-radius: 100px; padding: 6px 12px 6px 6px;">
                                <div style="display: flex; align-items: center;">
                                    ${initials.map((init, i) => `
                                        <div style="position: relative; margin-right: -8px;">
                                            <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${colors[i]}; border: 2px solid #DFDFE3; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #010101;">
                                                ${init}
                                            </div>
                                            <div style="position: absolute; bottom: 0; right: 0; width: 6px; height: 6px; border-radius: 50%; background-color: #7F00E1; border: 1px solid #DFDFE3;"></div>
                                        </div>
                                    `).join('')}
                                </div>
                                <span style="font-size: 12px; color: rgba(1,1,1,0.45); padding-left: 8px;">Você e mais 2 online</span>
                            </div>
                        </div>
                    </div>

                    <!-- Metric Cards Row -->
                    <div style="display: flex; gap: 16px;">
                        <!-- Card 1 -->
                        <div style="flex: 1; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                            <i data-lucide="file-text" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                            <span style="font-size: 12px; color: rgba(1,1,1,0.45);">Formulários Criados</span>
                            <span style="font-size: 32px; font-weight: 700; color: #010101; line-height: 1;">${forms.length}</span>
                        </div>
                        
                        <!-- Card 2 -->
                        <div style="flex: 1; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                            <i data-lucide="message-square" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                            <span style="font-size: 12px; color: rgba(1,1,1,0.45);">Respostas Recebidas</span>
                            <span style="font-size: 32px; font-weight: 700; color: #010101; line-height: 1;">0</span>
                        </div>
                        
                        <!-- Card 3 (Black) -->
                        <div style="flex: 1; background-color: #010101; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                            <i data-lucide="users" style="width: 20px; height: 20px; color: #F0F0F2; stroke-width: 1.5px;"></i>
                            <span style="font-size: 12px; color: rgba(240,240,242,0.6);">Colaboradores Ativos</span>
                            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                                <span style="font-size: 32px; font-weight: 700; color: #F0F0F2; line-height: 1;">3</span>
                                <span style="font-size: 12px; color: rgba(240,240,242,0.6);">Você e mais 2 online</span>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity Section -->
                    <div style="background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #010101; margin: 0;">Atividades Recentes</h3>
                            <a href="#/forms" style="font-size: 12px; color: #010101; border: 1px solid #DFDFE3; border-radius: 10px; padding: 6px 12px; text-decoration: none; background-color: transparent;">Ver Todos</a>
                        </div>
                        
                        <div id="recent-forms" style="display: flex; flex-direction: column; gap: 12px;">
                        </div>
                    </div>

                </div>
            </div>
        </div>
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
        recentFormsContainer.innerHTML = displayForms.map(f => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid rgba(1,1,1,0.1); border-radius: 12px; background: #F0F0F2;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #DFDFE3; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="file-text" style="width: 18px; height: 18px; color: #010101;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #010101;">${f.title || 'Formulário Sem Título'}</h4>
                        <p style="font-size: 12px; color: rgba(1,1,1,0.45); margin: 2px 0 0 0;">Modificado em ${new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <a href="#/forms/edit/${f.id}" style="padding: 6px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101;"><i data-lucide="edit-2" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/forms/ai/${f.id}" style="padding: 6px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101;"><i data-lucide="brain" style="width: 16px; height: 16px;"></i></a>
                    <a href="#/f/${f.id}" target="_blank" style="padding: 6px; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; color: #010101;"><i data-lucide="external-link" style="width: 16px; height: 16px;"></i></a>
                </div>
            </div>
        `).join('');
    }
};
