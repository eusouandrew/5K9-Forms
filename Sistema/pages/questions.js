import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';

export const renderQuestions = (container) => {
    let currentCategory = 'Todas';
    let searchTerm = '';
    let editingId = null;

    const categories = ['Todas', 'Contatos', 'Escolhas', 'Texto', 'Vídeo e Áudio', 'Outros'];

    const getCategoryDot = (cat, isActive) => {
        if (isActive) return '#F0F0F2';
        if (cat === 'Contatos') return '#7F00E1';
        return 'rgba(1,1,1,0.3)';
    };

    const typeLabels = {
        short_text: 'Resposta Curta',
        long_text: 'Resposta Longa',
        phone: 'Nº de Telefone',
        email: 'E-mail',
        address: 'Endereço',
        website: 'Website',
        multiple_choice: 'Múltipla Escolha',
        checkbox: 'Caixa de Seleção',
        dropdown: 'Lista Suspensa',
        yes_no: 'Sim ou Não',
        file_upload: 'Upload de Arquivo',
        rating: 'Rating',
        ranking: 'Ranking',
        video: 'Vídeo',
        audio: 'Áudio'
    };

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1200px; margin: 0 auto;">
                        
                        <!-- Top Bar -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Banco de Questões</h2>
                                <p style="font-size: 13px; color: rgba(1,1,1,0.45); margin: 4px 0 0 0;">Repositório central de perguntas reutilizáveis.</p>
                            </div>
                            <button id="newQuestionBtn" style="display: inline-flex; align-items: center; justify-content: center; height: 44px; padding: 0 24px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s;">
                                ＋ Cadastrar Pergunta
                            </button>
                        </div>

                        <!-- Two-Column Layout -->
                        <div style="display: flex; gap: 16px; align-items: flex-start;">
                            
                            <!-- LEFT — CATEGORY PANEL -->
                            <div style="width: 240px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 16px; flex-shrink: 0; display: flex; flex-direction: column;">
                                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45); padding: 16px; border-bottom: 1px solid rgba(1,1,1,0.08);">
                                    Categorias
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 4px; padding: 12px;">
                                    ${categories.map(cat => {
                                        const isActive = currentCategory === cat;
                                        const bg = isActive ? '#010101' : 'transparent';
                                        const textColor = isActive ? '#F0F0F2' : '#010101';
                                        const weight = isActive ? '600' : '400';
                                        const dotColor = getCategoryDot(cat, isActive);
                                        return `
                                            <button class="cat-btn" data-cat="${cat}" style="width: 100%; height: 40px; border-radius: 12px; background-color: ${bg}; color: ${textColor}; font-weight: ${weight}; font-size: 14px; padding-left: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                                                <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${cat === 'Todas' && !isActive ? 'transparent' : dotColor};"></div>
                                                ${cat}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- RIGHT — QUESTIONS PANEL -->
                            <div style="flex: 1; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; min-height: 400px;">
                                
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <h3 style="font-size: 16px; font-weight: 600; color: #010101; margin: 0;">Perguntas Cadastradas</h3>
                                        <div id="q-count-badge" style="background-color: #7F00E1; color: #F0F0F2; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 100px;">0</div>
                                    </div>
                                    <div style="position: relative; width: 200px;">
                                        <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; color: rgba(1,1,1,0.4);"></i>
                                        <input type="text" id="q-search" placeholder="Buscar perguntas..." style="width: 100%; height: 36px; border-radius: 12px; background-color: transparent; border: 1px solid rgba(1,1,1,0.1); padding: 0 12px 0 32px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none;">
                                    </div>
                                </div>

                                <div id="questions-list" style="display: flex; flex-direction: column; gap: 8px;">
                                    <!-- Rendered Content -->
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- NEW/EDIT MODAL -->
                <div id="questionModal" style="position: fixed; inset: 0; background-color: rgba(240,240,242,0.8); z-index: 200; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                    <div style="width: 100%; max-width: 500px; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.1); padding: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                            <h3 id="modal-title" style="font-size: 18px; font-weight: 600; margin: 0;">Nova Pergunta</h3>
                            <button id="closeModal" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background-color: #F0F0F2;"><i data-lucide="x" style="width: 16px; height: 16px;"></i></button>
                        </div>
                        <form id="questionForm" style="display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                <label style="font-size: 12px; font-weight: 600; color: #010101;">Título da Pergunta</label>
                                <input type="text" id="qTitle" required style="height: 40px; border-radius: 10px; border: 1px solid rgba(1,1,1,0.08); background-color: #F0F0F2; padding: 0 12px; font-size: 14px; font-family: 'Instrument Sans'; outline: none;">
                            </div>
                            
                            <div style="display: flex; gap: 16px;">
                                <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                                    <label style="font-size: 12px; font-weight: 600; color: #010101;">Tipo</label>
                                    <select id="qType" style="height: 40px; border-radius: 10px; border: 1px solid rgba(1,1,1,0.08); background-color: #F0F0F2; padding: 0 12px; font-size: 14px; font-family: 'Instrument Sans'; outline: none;">
                                        <optgroup label="Texto">
                                            <option value="short_text">Resposta Curta</option>
                                            <option value="long_text">Resposta Longa</option>
                                        </optgroup>
                                        <optgroup label="Contatos">
                                            <option value="phone">Nº de Telefone</option>
                                            <option value="email">E-mail</option>
                                            <option value="address">Endereço</option>
                                            <option value="website">Website</option>
                                        </optgroup>
                                        <optgroup label="Escolhas">
                                            <option value="multiple_choice">Múltipla Escolha</option>
                                            <option value="checkbox">Caixa de Seleção</option>
                                            <option value="dropdown">Lista Suspensa</option>
                                            <option value="yes_no">Sim ou Não</option>
                                        </optgroup>
                                        <optgroup label="Vídeo e Outros">
                                            <option value="file_upload">Upload de Arquivo</option>
                                            <option value="rating">Rating</option>
                                            <option value="ranking">Ranking</option>
                                            <option value="video">Vídeo</option>
                                            <option value="audio">Áudio</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                                    <label style="font-size: 12px; font-weight: 600; color: #010101;">Categoria</label>
                                    <select id="qCategory" style="height: 40px; border-radius: 10px; border: 1px solid rgba(1,1,1,0.08); background-color: #F0F0F2; padding: 0 12px; font-size: 14px; font-family: 'Instrument Sans'; outline: none;">
                                        <option value="Contatos">Contatos</option>
                                        <option value="Escolhas">Escolhas</option>
                                        <option value="Texto" selected>Texto</option>
                                        <option value="Vídeo e Áudio">Vídeo e Áudio</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                            </div>

                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                                <input type="checkbox" id="qRequired" style="width: 16px; height: 16px; border-radius: 4px; accent-color: #010101;">
                                <label for="qRequired" style="font-size: 13px; color: #010101;">Marcar como Obrigatória</label>
                            </div>

                            <button type="submit" style="margin-top: 16px; height: 44px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 14px; font-weight: 600; border: none; cursor: pointer;">
                                Salvar Pergunta
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <style>
                .cat-btn:hover { background-color: #F0F0F2 !important; }
                .q-action-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
                .q-action-btn:hover { background-color: #DFDFE3; }
                .q-action-btn.danger:hover { background-color: #ffebee; color: #d32f2f !important; }
                .q-action-btn.danger:hover svg { color: #d32f2f !important; }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), '/questions');
        renderContent();
        attachEvents();
    };

    const renderContent = () => {
        const list = document.getElementById('questions-list');
        const badge = document.getElementById('q-count-badge');
        
        let questions = store.getQuestions();
        
        if (currentCategory !== 'Todas') {
            questions = questions.filter(q => q.category === currentCategory);
        }
        if (searchTerm) {
            questions = questions.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        badge.textContent = questions.length;

        if (questions.length === 0) {
            list.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; gap: 12px;">
                    <i data-lucide="help-circle" style="width: 36px; height: 36px; color: rgba(1,1,1,0.2);"></i>
                    <span style="font-size: 14px; color: rgba(1,1,1,0.4);">Nenhuma pergunta cadastrada.</span>
                    <span style="font-size: 12px; color: rgba(1,1,1,0.3);">Comece cadastrando sua primeira pergunta.</span>
                </div>
            `;
        } else {
            list.innerHTML = questions.map(q => `
                <div style="background-color: #F0F0F2; border-radius: 12px; border: 1px solid #DFDFE3; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background-color: #DFDFE3; color: #010101; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;">
                            ${typeLabels[q.type] || q.type}
                        </div>
                        <span style="font-size: 14px; font-weight: 500; color: #010101;">${q.title}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${q.required ? `<div style="background-color: #7F00E1; color: #F0F0F2; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;">Obrigatória</div>` : ''}
                        
                        <div style="display: flex; gap: 4px; margin-left: 8px;">
                            <button class="q-action-btn edit-btn" data-id="${q.id}" title="Editar">
                                <i data-lucide="edit-2" style="width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                            </button>
                            <button class="q-action-btn duplicate-btn" data-id="${q.id}" title="Duplicar">
                                <i data-lucide="copy" style="width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                            </button>
                            <button class="q-action-btn danger delete-btn" data-id="${q.id}" title="Excluir">
                                <i data-lucide="trash-2" style="width: 16px; height: 16px; color: rgba(1,1,1,0.4);"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        if (window.lucide) lucide.createIcons();
        attachListEvents();
    };

    const openModal = (question = null) => {
        editingId = question ? question.id : null;
        document.getElementById('modal-title').textContent = question ? 'Editar Pergunta' : 'Nova Pergunta';
        document.getElementById('qTitle').value = question ? question.title : '';
        document.getElementById('qType').value = question ? question.type : 'short_text';
        document.getElementById('qCategory').value = question ? question.category : 'Texto';
        document.getElementById('qRequired').checked = question ? question.required : false;
        
        document.getElementById('questionModal').style.display = 'flex';
    };

    const attachListEvents = () => {
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const q = store.getQuestions().find(x => x.id === id);
                if (q) openModal(q);
            });
        });

        container.querySelectorAll('.duplicate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const q = store.getQuestions().find(x => x.id === id);
                if (q) {
                    const duplicate = { ...q, title: q.title + ' (Cópia)', id: crypto.randomUUID() };
                    store.saveQuestion(duplicate);
                    renderContent();
                }
            });
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
                    store.deleteQuestion(id);
                    renderContent();
                }
            });
        });
    };

    const attachEvents = () => {
        // Categories
        container.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentCategory = e.currentTarget.getAttribute('data-cat');
                renderLayout(); // Re-render to update active states
            });
        });

        // Search
        document.getElementById('q-search').addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderContent();
        });

        // Modal triggers
        document.getElementById('newQuestionBtn').addEventListener('click', () => openModal());
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('questionModal').style.display = 'none';
        });

        // Form Submit
        document.getElementById('questionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const q = {
                title: document.getElementById('qTitle').value,
                type: document.getElementById('qType').value,
                category: document.getElementById('qCategory').value,
                required: document.getElementById('qRequired').checked
            };
            if (editingId) {
                q.id = editingId;
            }
            store.saveQuestion(q);
            document.getElementById('questionModal').style.display = 'none';
            e.target.reset();
            renderContent();
        });
    };

    // Init
    renderLayout();
};
