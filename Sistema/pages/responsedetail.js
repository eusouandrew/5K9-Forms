import { renderSidebar } from '../components/sidebar.js';

export const renderResponseDetail = (container, responseId) => {
    
    // Mock data based on the spec
    const response = {
        id: responseId || '24',
        respondent: {
            name: 'João Silva',
            email: 'joao.silva@email.com',
            initials: 'JS'
        },
        metadata: {
            date: '12 jun 2025 · 14h32',
            timeTaken: '4m 12s',
            device: 'Desktop · Chrome Mac',
            ip: '192.168.1.1',
            completion: 100
        },
        answers: [
            {
                question: 'Qual o seu principal objetivo com a plataforma?',
                type: 'text',
                value: 'Gostaria de automatizar a coleta de feedbacks de clientes após as reuniões semanais.'
            },
            {
                question: 'Qual o tamanho da sua equipe?',
                type: 'multiple_choice',
                value: 'De 10 a 50 pessoas'
            },
            {
                question: 'Como você avalia nossa comunicação inicial?',
                type: 'rating',
                value: 4,
                max: 5
            },
            {
                question: 'Você já utilizou outra ferramenta parecida?',
                type: 'yes_no',
                value: 'Sim'
            },
            {
                question: 'Algum comentário adicional?',
                type: 'text',
                value: null // Not answered
            }
        ],
        notes: [
            { id: 1, text: 'Cliente com alto potencial para plano Enterprise. Acionar equipe de CS.', date: '12 jun · 15h00' }
        ]
    };

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                        
                        <!-- TOP BAR -->
                        <div style="display: flex; justify-content: space-between; align-items: center; height: 40px;">
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <button onclick="window.history.back()" style="background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; color: #010101;">
                                    <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                                </button>
                                <div style="font-size: 13px; color: rgba(1,1,1,0.4); font-weight: 500;">
                                    Respostas <span style="margin: 0 4px;">/</span> <span style="color: #010101;">Resposta #${response.id}</span>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <div style="display: flex; gap: 8px;">
                                    <button class="ghost-btn">Exportar</button>
                                    <button class="ghost-btn danger-hover" style="color: rgba(1,1,1,0.4);">Excluir Resposta</button>
                                </div>
                                <div style="width: 1px; height: 24px; background-color: rgba(1,1,1,0.1);"></div>
                                <div style="display: flex; gap: 4px;">
                                    <button class="nav-arrow-btn"><i data-lucide="chevron-left" style="width: 18px; height: 18px;"></i></button>
                                    <button class="nav-arrow-btn"><i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i></button>
                                </div>
                            </div>
                        </div>

                        <!-- TWO-COLUMN LAYOUT -->
                        <div style="display: flex; gap: 16px; align-items: flex-start;">
                            
                            <!-- LEFT COLUMN (Conteúdo) -->
                            <div style="flex: 1; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); padding: 20px; display: flex; flex-direction: column;">
                                
                                <h3 style="font-size: 16px; font-weight: 600; color: #010101; margin: 0; padding-bottom: 12px; border-bottom: 1px solid #DFDFE3;">
                                    Conteúdo da Resposta
                                </h3>

                                <div style="display: flex; flex-direction: column; padding-top: 16px; gap: 16px;">
                                    ${response.answers.map((ans, idx) => `
                                        <div style="display: flex; flex-direction: column; gap: 6px;">
                                            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">
                                                ${ans.question}
                                            </div>
                                            <div style="margin-top: 4px;">
                                                ${renderAnswerValue(ans)}
                                            </div>
                                        </div>
                                        ${idx < response.answers.length - 1 ? '<div style="height: 1px; background-color: #F0F0F2; width: 100%;"></div>' : ''}
                                    `).join('')}
                                </div>

                            </div>

                            <!-- RIGHT COLUMN (Metadados & Notas) -->
                            <div style="width: 280px; display: flex; flex-direction: column; gap: 12px;">
                                
                                <!-- CARD 1: Informações -->
                                <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; flex-direction: column;">
                                    
                                    <!-- Perfil -->
                                    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; padding-bottom: 16px; border-bottom: 1px solid #DFDFE3;">
                                        <div style="width: 44px; height: 44px; border-radius: 50%; background-color: #F0F0F2; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #010101; margin-bottom: 4px;">
                                            ${response.respondent.initials}
                                        </div>
                                        <div style="font-size: 15px; font-weight: 500; color: #010101; line-height: 1.2;">
                                            ${response.respondent.name}
                                        </div>
                                        <div style="font-size: 12px; color: rgba(1,1,1,0.4);">
                                            ${response.respondent.email}
                                        </div>
                                    </div>

                                    <!-- Metadados -->
                                    <div style="display: flex; flex-direction: column; padding: 8px 0;">
                                        ${renderMetaRow('calendar', 'Data de envio', response.metadata.date)}
                                        ${renderMetaRow('clock', 'Tempo de preenchimento', response.metadata.timeTaken)}
                                        ${renderMetaRow('monitor', 'Dispositivo', response.metadata.device)}
                                        ${renderMetaRow('globe', 'IP', response.metadata.ip)}
                                    </div>

                                    <!-- Progresso -->
                                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div style="width: 100%; height: 4px; border-radius: 100px; background-color: #DFDFE3; overflow: hidden; margin-right: 12px; flex: 1;">
                                                <div style="height: 100%; width: ${response.metadata.completion}%; background-color: #7F00E1;"></div>
                                            </div>
                                            <span style="font-size: 11px; font-weight: 600; color: #7F00E1;">${response.metadata.completion}% concluído</span>
                                        </div>
                                    </div>

                                </div>

                                <!-- CARD 2: Notas Internas -->
                                <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                                    <div style="font-size: 13px; font-weight: 600; color: #010101;">Notas internas</div>
                                    
                                    <div style="display: flex; flex-direction: column; gap: 8px;">
                                        <textarea placeholder="Adicionar anotação sobre esta resposta..." style="width: 100%; height: 80px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 10px 12px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none; resize: none;"></textarea>
                                        <div style="display: flex; justify-content: flex-end;">
                                            <button class="ghost-btn" style="height: 28px; padding: 0 12px; font-size: 11px; border-radius: 8px;">Salvar nota</button>
                                        </div>
                                    </div>

                                    ${response.notes.length > 0 ? `
                                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                                            ${response.notes.map(note => `
                                                <div style="background-color: #F0F0F2; border-radius: 10px; border: 1px solid #DFDFE3; padding: 12px; display: flex; flex-direction: column; gap: 8px; position: relative;">
                                                    <div style="font-size: 13px; color: #010101; line-height: 1.4;">${note.text}</div>
                                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                                        <span style="font-size: 11px; color: rgba(1,1,1,0.35);">${note.date}</span>
                                                        <button style="background: none; border: none; cursor: pointer; padding: 0;" class="trash-note">
                                                            <i data-lucide="trash-2" style="width: 14px; height: 14px; color: rgba(1,1,1,0.3);"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}

                                </div>

                            </div>
                        </div>

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
                    padding: 0 16px;
                    border-radius: 10px;
                    background-color: transparent;
                    border: 1px solid rgba(1,1,1,0.1);
                    color: #010101;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: 'Instrument Sans', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ghost-btn:hover { background-color: rgba(1,1,1,0.05); }
                
                .danger-hover { transition: color 0.2s; }
                .danger-hover:hover { color: #d32f2f !important; border-color: rgba(211,47,47,0.2); }

                .nav-arrow-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background-color: transparent;
                    border: 1px solid rgba(1,1,1,0.1);
                    color: #010101;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .nav-arrow-btn:hover { background-color: rgba(1,1,1,0.05); }

                .trash-note:hover i { color: #d32f2f !important; }
                
                textarea:focus { border-color: #010101 !important; }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), window.location.hash.slice(1) || '/');
        if (window.lucide) lucide.createIcons();
    };

    const renderAnswerValue = (ans) => {
        if (!ans.value) {
            return `<span style="font-size: 14px; font-style: italic; color: rgba(1,1,1,0.3);">Não respondido</span>`;
        }

        switch (ans.type) {
            case 'multiple_choice':
                return `
                    <div style="display: inline-flex; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); border-radius: 20px; padding: 6px 12px; font-size: 11px; font-weight: 500; color: #010101;">
                        ${ans.value}
                    </div>
                `;
            case 'yes_no':
                const isYes = ans.value.toLowerCase() === 'sim';
                return `
                    <div style="display: inline-flex; background-color: ${isYes ? '#010101' : '#DFDFE3'}; border-radius: 20px; padding: 6px 12px; font-size: 11px; font-weight: 500; color: ${isYes ? '#F0F0F2' : 'rgba(1,1,1,0.6)'};">
                        ${ans.value}
                    </div>
                `;
            case 'rating':
                return `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="display: flex; gap: 4px;">
                            ${Array.from({length: ans.max || 5}).map((_, i) => {
                                const filled = i < ans.value;
                                return `
                                    <div style="width: 24px; height: 24px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; ${filled ? 'background-color: #010101; color: #F0F0F2;' : 'background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); color: transparent;'}">
                                        ${filled ? (i + 1) : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <span style="font-size: 12px; color: rgba(1,1,1,0.4); font-weight: 500;">${ans.value} / ${ans.max || 5}</span>
                    </div>
                `;
            case 'text':
            default:
                return `<div style="font-size: 15px; font-weight: 400; color: #010101; line-height: 1.5;">${ans.value}</div>`;
        }
    };

    const renderMetaRow = (icon, label, value) => {
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; height: 32px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="${icon}" style="width: 16px; height: 16px; color: rgba(1,1,1,0.35);"></i>
                    <span style="font-size: 12px; color: rgba(1,1,1,0.45); font-weight: 500;">${label}</span>
                </div>
                <div style="font-size: 12px; font-weight: 500; color: #010101;">
                    ${value}
                </div>
            </div>
        `;
    };

    renderLayout();
};
