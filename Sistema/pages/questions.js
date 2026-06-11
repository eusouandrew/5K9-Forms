import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

export const renderQuestions = (container) => {
    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div id="header-container"></div>
                
                <div class="page-content flex-col gap-4">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h2>Banco de Questões</h2>
                            <p style="font-size: 0.9rem;">Repositório central de perguntas reutilizáveis.</p>
                        </div>
                        <button id="newQuestionBtn" class="btn primary">
                            <i data-lucide="plus"></i> Cadastrar Pergunta
                        </button>
                    </div>
                    
                    <div class="flex gap-4">
                        <div class="floating-card flex-col gap-2" style="width: 250px; padding: 1rem;">
                            <h4 style="margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-sub); padding-bottom: 0.5rem;">Categorias</h4>
                            <a href="#" class="menu-item active">Todas</a>
                            <a href="#" class="menu-item">Contatos</a>
                            <a href="#" class="menu-item">Escolhas</a>
                            <a href="#" class="menu-item">Texto</a>
                            <a href="#" class="menu-item">Vídeo e Áudio</a>
                            <a href="#" class="menu-item">Outros</a>
                        </div>
                        
                        <div class="floating-card flex-1 flex-col gap-4" style="padding: 1.5rem;">
                            <div class="flex justify-between items-center mb-2">
                                <h3>Perguntas Cadastradas</h3>
                            </div>
                            
                            <div id="questions-list" class="flex flex-col gap-3">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Novo -->
            <div id="questionModal" class="modal-overlay hidden">
                <div class="floating-card" style="width: 100%; max-width: 500px;">
                    <div class="flex justify-between items-center mb-4">
                        <h3>Nova Pergunta</h3>
                        <button id="closeModal" style="background: none; border: none; cursor: pointer;"><i data-lucide="x"></i></button>
                    </div>
                    <form id="questionForm" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label style="font-size: 0.85rem; font-weight: 500;">Título da Pergunta</label>
                            <input type="text" id="qTitle" class="input-field" required>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label style="font-size: 0.85rem; font-weight: 500;">Tipo</label>
                            <select id="qType" class="input-field">
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
                        <div class="flex flex-col gap-2">
                            <label style="font-size: 0.85rem; font-weight: 500;">Categoria</label>
                            <select id="qCategory" class="input-field">
                                <option value="Contatos">Contatos</option>
                                <option value="Escolhas">Escolhas</option>
                                <option value="Texto" selected>Texto</option>
                                <option value="Vídeo e Áudio">Vídeo e Áudio</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="qRequired">
                            <label for="qRequired" style="font-size: 0.85rem;">Resposta Obrigatória</label>
                        </div>
                        <button type="submit" class="btn primary justify-center mt-2">Salvar Pergunta</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/questions');
    renderHeader(document.getElementById('header-container'), 'Banco de Questões');

    const renderList = () => {
        const list = document.getElementById('questions-list');
        const questions = store.getQuestions();
        
        if (questions.length === 0) {
            list.innerHTML = '<p style="color: #888;">Nenhuma pergunta cadastrada.</p>';
            return;
        }

        list.innerHTML = questions.map(q => `
            <div class="flex justify-between items-center p-4" style="border: 1px solid var(--color-sub); border-radius: 8px;">
                <div>
                    <h4 style="margin: 0;">${q.title}</h4>
                    <div class="flex gap-2" style="margin-top: 0.5rem;">
                        <span style="font-size: 0.7rem; background: var(--color-main); padding: 0.2rem 0.5rem; border-radius: 4px;">${q.type}</span>
                        <span style="font-size: 0.7rem; background: var(--color-main); padding: 0.2rem 0.5rem; border-radius: 4px;">${q.category}</span>
                        ${q.required ? '<span style="font-size: 0.7rem; background: #ffebee; color: #c62828; padding: 0.2rem 0.5rem; border-radius: 4px;">Obrigatória</span>' : ''}
                    </div>
                </div>
                <button class="btn outline" style="padding: 0.5rem;"><i data-lucide="trash-2"></i></button>
            </div>
        `).join('');
        if (window.lucide) lucide.createIcons();
    };

    renderList();

    const modal = document.getElementById('questionModal');
    document.getElementById('newQuestionBtn').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    document.getElementById('questionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        store.saveQuestion({
            title: document.getElementById('qTitle').value,
            type: document.getElementById('qType').value,
            category: document.getElementById('qCategory').value,
            required: document.getElementById('qRequired').checked
        });
        modal.classList.add('hidden');
        e.target.reset();
        renderList();
    });
};
