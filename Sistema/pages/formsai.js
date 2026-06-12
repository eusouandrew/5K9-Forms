import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderFormsAI = (container, formId) => {
    const form = store.getForm(formId);
    
    if (!form) {
        container.innerHTML = `
            <div style="display: flex; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; align-items: center; justify-content: center;">
                <h2>Formulário não encontrado</h2>
            </div>
        `;
        return;
    }

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                        
                        <!-- TOP BAR -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="font-size: 12px; color: rgba(1,1,1,0.35); font-weight: 500;">
                                    <a href="#/forms/responses/${form.id}" style="color: inherit; text-decoration: none;">Respostas</a> / ${form.title || 'Sem Título'}
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="sparkles" style="width: 20px; height: 20px; color: #7F00E1;"></i>
                                    <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Forms AI</h2>
                                </div>
                                <div style="font-size: 13px; color: rgba(1,1,1,0.45);">
                                    Análise inteligente das respostas deste formulário.
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <button class="ghost-btn">Exportar análise</button>
                                
                                <button class="ghost-btn action-menu-btn" style="padding: 0 10px;" aria-label="Ações de formulário">
                                    <i data-lucide="more-vertical" style="width: 16px; height: 16px;"></i>
                                </button>
                                <div class="ai-dropdown-menu" style="display: none; position: absolute; top: 76px; right: 240px; background: #F0F0F2; border: 1px solid rgba(1,1,1,0.1); border-radius: 8px; padding: 4px; z-index: 50; flex-direction: column; width: 140px;">
                                    <a href="#/forms/edit/${form.id}" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; color: #010101; text-decoration: none; border-radius: 6px;"><i data-lucide="edit-2" style="width: 14px; height: 14px;"></i> Editar</a>
                                    <a href="#/f/${form.id}" target="_blank" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; color: #010101; text-decoration: none; border-radius: 6px;"><i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Abrir Live</a>
                                </div>

                                <button class="primary-pill-btn">
                                    <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
                                    Gerar nova análise
                                </button>
                            </div>
                        </div>

                        <!-- AI STATUS BAR -->
                        <div style="display: flex; justify-content: center; margin-top: -16px;">
                            <div style="background-color: #DFDFE3; border-radius: 100px; border: 1px solid rgba(1,1,1,0.08); height: 40px; padding: 0 20px; display: inline-flex; align-items: center; gap: 12px;">
                                <div class="pulsing-dot"></div>
                                <span style="font-size: 12px; font-weight: 500; color: rgba(1,1,1,0.5);">
                                    Análise baseada em 48 respostas · Atualizada hoje às 14h32
                                </span>
                            </div>
                        </div>

                        <!-- VAGUE RESPONSE ALERT -->
                        <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.15); border-left: 3px solid #010101; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <i data-lucide="alert-triangle" style="width: 18px; height: 18px; color: #010101;"></i>
                                <span style="font-size: 14px; font-weight: 600; color: #010101;">Respostas vagas detectadas</span>
                                <div style="background-color: #010101; color: #F0F0F2; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 100px;">
                                    3 incidentes
                                </div>
                            </div>
                            <button class="ghost-btn" style="height: 32px; font-size: 12px; border-color: rgba(1,1,1,0.2);">Ver respostas</button>
                        </div>

                        <!-- SUMMARY CARD -->
                        <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); padding: 24px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; bottom: 0; left: 0; width: 3px; background-color: #7F00E1;"></div>
                            
                            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45); margin-bottom: 12px;">
                                Resumo Geral
                            </div>
                            <p style="font-size: 15px; font-weight: 400; color: #010101; line-height: 1.7; margin: 0; max-height: calc(15px * 1.7 * 4); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">
                                Os respondentes demonstraram interesse majoritário em soluções de automação, com 73% indicando que buscam reduzir tarefas manuais no dia a dia. O tom geral das respostas é positivo e propositivo, com ênfase em agilidade e integração de ferramentas.
                            </p>
                        </div>

                        <!-- INSIGHTS GRID -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            
                            <!-- Card: Tópicos -->
                            <div class="insight-card">
                                <div class="insight-label">Tópicos Identificados</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
                                    <div class="topic-pill major">Automação <span class="topic-count">18</span></div>
                                    <div class="topic-pill major">UX Design <span class="topic-count">14</span></div>
                                    <div class="topic-pill">Integrações</div>
                                    <div class="topic-pill">Velocidade</div>
                                    <div class="topic-pill major">Preço <span class="topic-count">9</span></div>
                                    <div class="topic-pill">Suporte Técnico</div>
                                    <div class="topic-pill">Mobile</div>
                                </div>
                            </div>

                            <!-- Card: Sentimento -->
                            <div class="insight-card">
                                <div class="insight-label">Sentimento Geral</div>
                                <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
                                    
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="font-size: 13px; font-weight: 500; color: #010101; width: 80px;">Positivo</div>
                                        <div style="flex: 1; height: 8px; border-radius: 100px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.05); display: flex;">
                                            <div style="width: 73%; height: 100%; border-radius: 100px; background-color: #7F00E1;"></div>
                                        </div>
                                        <div style="font-size: 12px; font-weight: 500; color: #010101; width: 36px; text-align: right;">73%</div>
                                    </div>

                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="font-size: 13px; font-weight: 500; color: #010101; width: 80px;">Neutro</div>
                                        <div style="flex: 1; height: 8px; border-radius: 100px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.05); display: flex;">
                                            <div style="width: 20%; height: 100%; border-radius: 100px; background-color: rgba(1,1,1,0.2);"></div>
                                        </div>
                                        <div style="font-size: 12px; font-weight: 500; color: #010101; width: 36px; text-align: right;">20%</div>
                                    </div>

                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="font-size: 13px; font-weight: 500; color: #010101; width: 80px;">Negativo</div>
                                        <div style="flex: 1; height: 8px; border-radius: 100px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.05); display: flex;">
                                            <div style="width: 7%; height: 100%; border-radius: 100px; background-color: rgba(1,1,1,0.08);"></div>
                                        </div>
                                        <div style="font-size: 12px; font-weight: 500; color: #010101; width: 36px; text-align: right;">7%</div>
                                    </div>

                                </div>
                            </div>

                            <!-- Card: Padrões Detectados -->
                            <div class="insight-card">
                                <div class="insight-label">Padrões Detectados</div>
                                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
                                    
                                    <div class="pattern-item">
                                        <i data-lucide="zap" style="width: 16px; height: 16px; color: #7F00E1; flex-shrink: 0; margin-top: 2px;"></i>
                                        <span style="font-size: 13px; color: #010101; line-height: 1.5;">67% dos respondentes mencionaram "prazo" nas respostas abertas.</span>
                                    </div>

                                    <div class="pattern-item">
                                        <i data-lucide="moon" style="width: 16px; height: 16px; color: #7F00E1; flex-shrink: 0; margin-top: 2px;"></i>
                                        <span style="font-size: 13px; color: #010101; line-height: 1.5;">Respostas enviadas no período noturno tendem a ser 40% mais detalhadas.</span>
                                    </div>

                                    <div class="pattern-item">
                                        <i data-lucide="users" style="width: 16px; height: 16px; color: #7F00E1; flex-shrink: 0; margin-top: 2px;"></i>
                                        <span style="font-size: 13px; color: #010101; line-height: 1.5;">Usuários de Mac (72%) tem maior índice de conclusão no primeiro campo de texto.</span>
                                    </div>

                                </div>
                            </div>

                            <!-- Card: Referências Sugeridas -->
                            <div class="insight-card">
                                <div class="insight-label">Referências Sugeridas (IA)</div>
                                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
                                    
                                    <div class="reference-item">
                                        <div class="ref-badge">Artigo</div>
                                        <div style="display: flex; flex-direction: column; flex: 1; gap: 2px;">
                                            <span style="font-size: 13px; font-weight: 500; color: #010101;">Melhores práticas em Automação B2B</span>
                                            <span style="font-size: 11px; color: rgba(1,1,1,0.35);">Harvard Business Review</span>
                                        </div>
                                        <i data-lucide="external-link" style="width: 14px; height: 14px; color: #7F00E1;"></i>
                                    </div>

                                    <div class="reference-item">
                                        <div class="ref-badge">Estudo</div>
                                        <div style="display: flex; flex-direction: column; flex: 1; gap: 2px;">
                                            <span style="font-size: 13px; font-weight: 500; color: #010101;">Relatório de UX Mobile 2025</span>
                                            <span style="font-size: 11px; color: rgba(1,1,1,0.35);">Nielsen Norman Group</span>
                                        </div>
                                        <i data-lucide="external-link" style="width: 14px; height: 14px; color: #7F00E1;"></i>
                                    </div>

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
                    transition: background-color 0.2s;
                }
                .ghost-btn:hover { background-color: rgba(1,1,1,0.05); }

                .primary-pill-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 44px;
                    padding: 0 24px;
                    border-radius: 100px;
                    background-color: #7F00E1;
                    color: #F0F0F2;
                    font-size: 14px;
                    font-weight: 600;
                    font-family: 'Instrument Sans', sans-serif;
                    cursor: pointer;
                    border: none;
                    transition: opacity 0.2s;
                }
                .primary-pill-btn:hover { opacity: 0.9; }

                .pulsing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #7F00E1;
                    animation: pulse 1.5s infinite ease-in-out;
                }
                @keyframes pulse {
                    0% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.3); }
                    100% { opacity: 0.4; transform: scale(1); }
                }

                .insight-card {
                    background-color: #DFDFE3;
                    border-radius: 16px;
                    border: 1px solid rgba(1,1,1,0.08);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .insight-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: rgba(1,1,1,0.45);
                }

                .topic-pill {
                    background-color: #F0F0F2;
                    border: 1px solid #DFDFE3;
                    border-radius: 10px;
                    padding: 6px 14px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #010101;
                }
                .topic-pill.major {
                    font-size: 14px;
                    border-color: #010101;
                    font-weight: 600;
                }
                .topic-count {
                    font-size: 10px;
                    color: #7F00E1;
                    margin-left: 4px;
                }

                .pattern-item {
                    background-color: #F0F0F2;
                    border-radius: 10px;
                    border: 1px solid #DFDFE3;
                    padding: 12px;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .reference-item {
                    background-color: #F0F0F2;
                    border-radius: 10px;
                    border: 1px solid #DFDFE3;
                    padding: 12px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .reference-item:hover {
                    border-color: #7F00E1;
                }
                .ref-badge {
                    background-color: #DFDFE3;
                    border-radius: 100px;
                    padding: 4px 10px;
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(1,1,1,0.6);
                }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), window.location.hash.slice(1) || '/');
        if (window.lucide) lucide.createIcons();

        // Action Menu dropdown behavior
        const actionBtn = container.querySelector('.action-menu-btn');
        const actionMenu = container.querySelector('.ai-dropdown-menu');
        
        if (actionBtn && actionMenu) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                actionMenu.style.display = actionMenu.style.display === 'none' ? 'flex' : 'none';
            });
            document.addEventListener('click', () => {
                actionMenu.style.display = 'none';
            });
        }
    };

    renderLayout();
};
