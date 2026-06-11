import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

export const renderEditor = (container, formId) => {
    let form = formId === 'new' ? { 
        id: crypto.randomUUID(), 
        title: 'Novo Formulário', 
        questions: [], 
        settings: {
            welcomeScreen: false,
            welcomeTitle: 'Bem-vindo',
            welcomeText: '',
            endScreen: false,
            endTitle: 'Obrigado!',
            endText: '',
            redirectLink: '',
            vagueDetector: false,
            loadingBorder: true,
            emailClient: false,
            emailClientText: '',
            emailStudio: false,
            emailStudioText: ''
        } 
    } : store.getForm(formId);

    if (!form && formId !== 'new') {
        container.innerHTML = '<div class="p-8"><h2>Formulário não encontrado</h2></div>';
        return;
    }

    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div id="header-container"></div>
                
                <div class="page-content editor-layout">
                    
                    <!-- Área Principal de Edição -->
                    <div class="editor-main-panel">
                        <div class="floating-card flex-col gap-4" style="padding: 1.5rem;">
                            <div class="flex justify-between items-center">
                                <input type="text" id="formTitle" class="input-field" value="${form.title}" style="font-size: 1.5rem; font-weight: 700; border: none; padding: 0.5rem 0;" placeholder="Título do Formulário">
                                <div class="flex gap-2">
                                    <button id="saveFormBtn" class="btn primary"><i data-lucide="save"></i> Salvar</button>
                                    <a href="#/f/${form.id}" target="_blank" class="btn outline"><i data-lucide="play"></i> Preview</a>
                                </div>
                            </div>
                        </div>

                        <div class="floating-card flex-1 flex-col gap-4" style="padding: 1.5rem; overflow-y: auto;">
                            <div class="flex justify-between items-center">
                                <h3>Perguntas do Formulário</h3>
                                <button id="addQuestionFromBankBtn" class="btn outline btn-sm"><i data-lucide="plus"></i> Adicionar do Banco</button>
                            </div>
                            
                            <div id="form-questions-list" class="flex flex-col gap-3">
                                <!-- Preenchido via JS -->
                            </div>
                        </div>
                    </div>

                    <!-- Menu Lateral de Configurações -->
                    <div class="floating-card editor-sidebar" style="overflow-y: auto;">
                        <h3 class="mb-4 flex items-center gap-2" style="font-size: 1.2rem;"><i data-lucide="settings"></i> Configurações</h3>
                        
                        <div class="flex flex-col gap-4">
                            <!-- Visual -->
                            <div class="flex-col gap-2" style="border-bottom: 1px solid var(--color-sub); padding-bottom: 1rem;">
                                <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Visual & UX</h4>
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500;">
                                    <input type="checkbox" id="cfgLoadingBorder" ${form.settings.loadingBorder ? 'checked' : ''}>
                                    Borda de Loading
                                </label>
                            </div>

                            <!-- Telas -->
                            <div class="flex-col gap-2" style="border-bottom: 1px solid var(--color-sub); padding-bottom: 1rem;">
                                <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Telas Especiais</h4>
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;">
                                    <input type="checkbox" id="cfgWelcome" ${form.settings.welcomeScreen ? 'checked' : ''}> Tela de Bem-vindo
                                </label>
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem;">
                                    <input type="checkbox" id="cfgEnd" ${form.settings.endScreen ? 'checked' : ''}> Tela de Finalização
                                </label>
                                <input type="text" id="cfgRedirect" class="input-field" placeholder="Redirecionamento URL" value="${form.settings.redirectLink}" style="font-size: 0.85rem; padding: 0.5rem;">
                            </div>

                            <!-- IA & Validação -->
                            <div class="flex-col gap-2" style="border-bottom: 1px solid var(--color-sub); padding-bottom: 1rem;">
                                <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Validação e IA</h4>
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500;" title="Bloqueia respostas com apenas caracteres especiais ou números vagos">
                                    <input type="checkbox" id="cfgVague" ${form.settings.vagueDetector ? 'checked' : ''}> Detector de Respostas Vagas
                                </label>
                            </div>

                            <!-- E-mails -->
                            <div class="flex-col gap-2">
                                <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem;">Disparo de E-mails</h4>
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;">
                                    <input type="checkbox" id="cfgEmailClient" ${form.settings.emailClient ? 'checked' : ''}> E-mail para Cliente
                                </label>
                                <textarea id="cfgEmailClientText" class="input-field ${form.settings.emailClient ? '' : 'hidden'}" placeholder="Texto do e-mail..." style="font-size: 0.85rem; padding: 0.5rem; min-height: 80px; margin-bottom: 0.5rem;">${form.settings.emailClientText}</textarea>
                                
                                <label class="flex items-center gap-2" style="font-size: 0.85rem; font-weight: 500;">
                                    <input type="checkbox" id="cfgEmailStudio" ${form.settings.emailStudio ? 'checked' : ''}> Alerta para o Studio
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            <!-- Modal Banco de Questões -->
            <div id="bankModal" class="modal-overlay hidden">
                <div class="floating-card flex-col gap-4" style="width: 100%; max-width: 600px; max-height: 80vh;">
                    <div class="flex justify-between items-center">
                        <h3>Adicionar Perguntas</h3>
                        <button id="closeBankModal" style="background: none; border: none; cursor: pointer;"><i data-lucide="x"></i></button>
                    </div>
                    <div id="bank-list" class="flex-col gap-2" style="overflow-y: auto; flex: 1;">
                        <!-- JS populate -->
                    </div>
                </div>
            </div>
        </div>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/forms');
    renderHeader(document.getElementById('header-container'), 'Editor de Formulário');

    // UI Logic
    const toggleDisplay = (checkboxId, targetId) => {
        const checkbox = document.getElementById(checkboxId);
        const target = document.getElementById(targetId);
        if(!checkbox || !target) return;
        checkbox.addEventListener('change', (e) => {
            target.classList.toggle('hidden', !e.target.checked);
        });
    };
    toggleDisplay('cfgEmailClient', 'cfgEmailClientText');

    const renderFormQuestions = () => {
        const list = document.getElementById('form-questions-list');
        if (form.questions.length === 0) {
            list.innerHTML = '<div class="p-8 flex justify-center items-center w-full" style="border: 2px dashed var(--color-sub); border-radius: 8px; color: #888;">Nenhuma pergunta adicionada a este formulário. Use o botão acima para puxar perguntas do banco.</div>';
            return;
        }

        list.innerHTML = form.questions.map((q, index) => `
            <div class="flex justify-between items-center p-4" style="border: 1px solid var(--color-sub); border-radius: 8px; background: #fff;">
                <div class="flex items-center gap-3">
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--color-highlight); width: 24px;">${index + 1}</div>
                    <div>
                        <h4 style="margin: 0;">${q.title}</h4>
                        <span style="font-size: 0.7rem; color: #666;">${q.type} ${q.required ? ' • Obrigatória' : ''}</span>
                    </div>
                </div>
                <button class="btn outline remove-q-btn" data-id="${q.id}" style="padding: 0.5rem;"><i data-lucide="trash-2"></i></button>
            </div>
        `).join('');

        document.querySelectorAll('.remove-q-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                form.questions = form.questions.filter(q => q.id !== id);
                renderFormQuestions();
            });
        });

        if (window.lucide) lucide.createIcons();
    };

    renderFormQuestions();

    // Bank Modal Logic
    const bankModal = document.getElementById('bankModal');
    document.getElementById('addQuestionFromBankBtn').addEventListener('click', () => {
        const bankList = document.getElementById('bank-list');
        const allQuestions = store.getQuestions();
        
        bankList.innerHTML = allQuestions.map(q => {
            const added = form.questions.find(fq => fq.id === q.id);
            return `
            <div class="flex justify-between items-center p-3" style="border: 1px solid var(--color-sub); border-radius: 8px;">
                <div>
                    <h4 style="margin: 0; font-size: 0.95rem;">${q.title}</h4>
                    <span style="font-size: 0.7rem; color: #666;">${q.category}</span>
                </div>
                <button class="btn ${added ? 'outline' : 'primary'} add-q-btn" data-id="${q.id}" ${added ? 'disabled' : ''} style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                    ${added ? 'Adicionada' : 'Adicionar'}
                </button>
            </div>
        `}).join('');

        document.querySelectorAll('.add-q-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const q = store.getQuestions().find(x => x.id === id);
                if(q) {
                    form.questions.push({...q}); // clone
                    renderFormQuestions();
                    e.currentTarget.disabled = true;
                    e.currentTarget.innerText = 'Adicionada';
                    e.currentTarget.classList.remove('primary');
                    e.currentTarget.classList.add('outline');
                }
            });
        });

        bankModal.classList.remove('hidden');
    });

    document.getElementById('closeBankModal').addEventListener('click', () => {
        bankModal.classList.add('hidden');
    });

    // Save Form
    document.getElementById('saveFormBtn').addEventListener('click', () => {
        form.title = document.getElementById('formTitle').value;
        form.settings = {
            welcomeScreen: document.getElementById('cfgWelcome').checked,
            endScreen: document.getElementById('cfgEnd').checked,
            redirectLink: document.getElementById('cfgRedirect').value,
            vagueDetector: document.getElementById('cfgVague').checked,
            loadingBorder: document.getElementById('cfgLoadingBorder').checked,
            emailClient: document.getElementById('cfgEmailClient').checked,
            emailClientText: document.getElementById('cfgEmailClientText').value,
            emailStudio: document.getElementById('cfgEmailStudio').checked
        };
        store.saveForm(form);
        alert('Formulário salvo com sucesso!');
        if(formId === 'new') window.location.hash = `/forms/edit/${form.id}`;
    });
};
