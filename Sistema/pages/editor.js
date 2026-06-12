import { store } from '../store.js';

export const renderEditor = (container, formId) => {
    let form = formId === 'new' ? { 
        id: crypto.randomUUID(), 
        title: 'Novo Formulário', 
        questions: [], 
        settings: {} 
    } : store.getForm(formId);

    if (!form && formId !== 'new') {
        container.innerHTML = '<div style="padding: 32px; text-align: center; font-family: \'Instrument Sans\';"><h2>Formulário não encontrado</h2></div>';
        return;
    }

    let activeFieldId = null;

    const fieldTypes = [
        { type: 'short_text', icon: 'align-left', label: 'Texto curto' },
        { type: 'long_text', icon: 'align-justify', label: 'Texto longo' },
        { type: 'multiple_choice', icon: 'check-circle', label: 'Múltipla escolha' },
        { type: 'checkbox', icon: 'check-square', label: 'Caixa de seleção' },
        { type: 'date', icon: 'calendar', label: 'Data' },
        { type: 'file_upload', icon: 'upload', label: 'Upload' },
        { type: 'email', icon: 'mail', label: 'E-mail' },
        { type: 'number', icon: 'hash', label: 'Número' },
        { type: 'phone', icon: 'phone', label: 'Telefone' },
        { type: 'rating', icon: 'star', label: 'Rating' },
        { type: 'yes_no', icon: 'thumbs-up', label: 'Sim/Não' },
        { type: 'video', icon: 'video', label: 'Vídeo' }
    ];

    const getFieldTypeLabel = (type) => {
        const ft = fieldTypes.find(f => f.type === type);
        return ft ? ft.label : 'Campo';
    };

    const renderLayout = () => {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; overflow: hidden; padding: 16px; gap: 16px;">
                
                <!-- TOP BAR -->
                <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); height: 56px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; flex-shrink: 0;">
                    
                    <div style="display: flex; align-items: center; gap: 12px; width: 260px;">
                        <a href="#/forms" style="color: #010101; text-decoration: none; display: flex; align-items: center;">
                            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                        </a>
                        <input type="text" id="editor-form-title" value="${form.title}" style="font-size: 16px; font-weight: 600; color: #010101; background: transparent; border: none; outline: none; width: 100%; font-family: 'Instrument Sans';">
                    </div>

                    <div style="display: flex; background-color: transparent; border: 1px solid #DFDFE3; border-radius: 10px; height: 32px; align-items: center; padding: 2px;">
                        <button id="tab-construtor" class="tab-btn active" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: #010101; color: #F0F0F2; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Construtor</button>
                        <button id="tab-config" class="tab-btn" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: transparent; color: #010101; font-size: 13px; font-weight: 400; border: none; cursor: pointer;">Configurações</button>
                        <button id="tab-preview" class="tab-btn" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: transparent; color: #010101; font-size: 13px; font-weight: 400; border: none; cursor: pointer;">Pré-visualização</button>
                    </div>

                    <div style="display: flex; gap: 12px; width: 260px; justify-content: flex-end;">
                        <button id="save-draft-btn" style="height: 36px; padding: 0 16px; border-radius: 100px; background-color: transparent; color: #010101; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Salvar Rascunho</button>
                        <button id="publish-btn" style="height: 36px; padding: 0 20px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Publicar</button>
                    </div>

                </div>

                <!-- 3 PANELS -->
                <div id="editor-panels" style="display: flex; flex: 1; gap: 16px; overflow: hidden; min-width: 0;">
                    
                    <!-- LEFT PANEL: CAMPOS -->
                    <div style="width: 220px; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 16px; border-bottom: 1px solid rgba(1,1,1,0.08);">
                            <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Campos</span>
                        </div>
                        <div style="padding: 16px; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;" id="fields-palette">
                            ${fieldTypes.map(ft => `
                                <div class="palette-item" draggable="true" data-type="${ft.type}" style="background-color: #F0F0F2; border: 1px solid #DFDFE3; border-radius: 10px; height: 56px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: grab; position: relative;">
                                    <i data-lucide="grip-vertical" class="drag-handle-icon" style="position: absolute; left: 4px; width: 14px; height: 14px; color: rgba(1,1,1,0.3); opacity: 0; transition: opacity 0.2s;"></i>
                                    <i data-lucide="${ft.icon}" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                                    <span style="font-size: 11px; color: rgba(1,1,1,0.5); text-align: center; line-height: 1;">${ft.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- CENTER CANVAS -->
                    <div style="flex: 1; min-width: 0; background-color: #F0F0F2; border-radius: 16px; border: 1px solid #DFDFE3; position: relative; display: flex; flex-direction: column; overflow: hidden;">
                        <div id="drop-zone" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 60px;">
                            <!-- Populated by JS -->
                        </div>
                        
                        <!-- Progress Bar (Absolute Bottom) -->
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background-color: #DFDFE3;">
                            <div id="progress-fill" style="height: 100%; width: 0%; background-color: #7F00E1; transition: width 0.3s ease;"></div>
                        </div>
                    </div>

                    <!-- RIGHT PANEL: PROPRIEDADES -->
                    <div style="width: 260px; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 16px; border-bottom: 1px solid rgba(1,1,1,0.08);">
                            <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Propriedades</span>
                        </div>
                        <div id="properties-panel" style="padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;">
                            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(1,1,1,0.4); font-size: 13px; text-align: center; margin-top: 40px;">
                                Selecione um campo no canvas para ver as propriedades.
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            
            <style>
                .palette-item { transition: border-color 0.2s; }
                .palette-item:hover { border-color: #7F00E1 !important; }
                .palette-item:hover .drag-handle-icon { opacity: 1 !important; }

                .canvas-item { transition: border-color 0.2s; cursor: pointer; }
                .canvas-item:hover { border-color: rgba(1,1,1,0.3); }
                .canvas-item.active { border-color: #7F00E1 !important; }
                
                .canvas-item .drag-handle { opacity: 0; transition: opacity 0.2s; cursor: grab; }
                .canvas-item:hover .drag-handle, .canvas-item.active .drag-handle { opacity: 1; }
                
                .canvas-action-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; opacity: 0.5; transition: opacity 0.2s; }
                .canvas-action-btn:hover { opacity: 1; }

                .drop-placeholder { border: 2px dashed #7F00E1; border-radius: 12px; background-color: rgba(127,0,225,0.05); height: 64px; margin: 4px 0; }

                .prop-input { width: 100%; height: 36px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 12px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none; }
                .prop-input:focus { border-color: #7F00E1; }
                
                .toggle-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
            </style>
        `;

        if (window.lucide) lucide.createIcons();
        renderCanvas();
        attachDragAndDrop();
        attachEvents();
    };

    const renderCanvas = () => {
        const dropZone = document.getElementById('drop-zone');
        
        if (form.questions.length === 0) {
            dropZone.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 120px; border: 1px dashed rgba(1,1,1,0.15); border-radius: 16px; margin-top: 40px; color: rgba(1,1,1,0.35);">
                    <i data-lucide="mouse-pointer-click" style="width: 28px; height: 28px; margin-bottom: 8px;"></i>
                    <span style="font-size: 13px;">Arraste campos aqui para começar</span>
                </div>
            `;
            updateProgress();
            if (window.lucide) lucide.createIcons();
            return;
        }

        dropZone.innerHTML = form.questions.map((q, index) => {
            const isActive = q.id === activeFieldId;
            return `
                <div class="canvas-item ${isActive ? 'active' : ''}" data-id="${q.id}" draggable="true" style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid ${isActive ? '#7F00E1' : 'rgba(1,1,1,0.08)'}; height: 64px; display: flex; align-items: center; padding: 0 16px 0 8px; gap: 12px;">
                    
                    <i data-lucide="grip-vertical" class="drag-handle" style="width: 14px; height: 14px; color: rgba(1,1,1,0.3);"></i>
                    
                    <div style="font-size: 12px; font-weight: 700; color: #7F00E1; width: 28px;">${String(index + 1).padStart(2, '0')} →</div>
                    
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <span style="font-size: 13px; font-weight: 500; color: #010101;">${q.title || 'Nova Pergunta'}</span>
                        <span style="font-size: 11px; color: rgba(1,1,1,0.4);">${getFieldTypeLabel(q.type)}</span>
                    </div>

                    <div style="width: 180px; height: 32px; background-color: #F0F0F2; border-radius: 8px; border: 1px solid rgba(1,1,1,0.05); padding: 0 12px; display: flex; align-items: center; color: rgba(1,1,1,0.3); font-size: 12px;">
                        ${q.placeholder || 'Preview input...'}
                    </div>

                    <div style="display: flex; gap: 4px; margin-left: 12px;">
                        <button class="canvas-action-btn dup-btn" data-id="${q.id}">
                            <i data-lucide="copy" style="width: 16px; height: 16px; color: #010101;"></i>
                        </button>
                        <button class="canvas-action-btn del-btn" data-id="${q.id}">
                            <i data-lucide="trash-2" style="width: 16px; height: 16px; color: #010101;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
        attachCanvasItemEvents();
        updateProgress();
    };

    const attachCanvasItemEvents = () => {
        const dropZone = document.getElementById('drop-zone');
        
        dropZone.querySelectorAll('.canvas-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if(e.target.closest('button')) return; // ignore btn clicks
                activeFieldId = item.getAttribute('data-id');
                renderCanvas(); // re-render to update active border
                renderProperties();
            });
        });

        dropZone.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.getAttribute('data-id');
                form.questions = form.questions.filter(q => q.id !== id);
                if (activeFieldId === id) {
                    activeFieldId = null;
                    renderProperties();
                }
                renderCanvas();
            });
        });

        dropZone.querySelectorAll('.dup-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.getAttribute('data-id');
                const qIndex = form.questions.findIndex(q => q.id === id);
                if (qIndex > -1) {
                    const clone = { ...form.questions[qIndex], id: crypto.randomUUID() };
                    form.questions.splice(qIndex + 1, 0, clone);
                    activeFieldId = clone.id;
                    renderCanvas();
                    renderProperties();
                }
            });
        });
    };

    const renderProperties = () => {
        const panel = document.getElementById('properties-panel');
        if (!activeFieldId) {
            panel.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(1,1,1,0.4); font-size: 13px; text-align: center; margin-top: 40px;">
                    Selecione um campo no canvas para ver as propriedades.
                </div>
            `;
            return;
        }

        const q = form.questions.find(x => x.id === activeFieldId);
        if (!q) return;

        panel.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Título (Label)</label>
                <input type="text" class="prop-input" id="prop-title" value="${q.title || ''}">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Placeholder</label>
                <input type="text" class="prop-input" id="prop-placeholder" value="${q.placeholder || ''}">
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                <label style="font-size: 13px; font-weight: 500; color: #010101;">Campo Obrigatório</label>
                <button class="toggle-btn" id="prop-required">
                    <i data-lucide="${q.required ? 'toggle-right' : 'toggle-left'}" style="width: 36px; height: 36px; color: ${q.required ? '#7F00E1' : 'rgba(1,1,1,0.3)'};"></i>
                </button>
            </div>

            ${['short_text', 'long_text'].includes(q.type) ? `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; border-top: 1px solid rgba(1,1,1,0.08); padding-top: 16px;">
                    <label style="font-size: 13px; font-weight: 500; color: #010101;">Detector de Vagas (IA)</label>
                    <button class="toggle-btn" id="prop-vague">
                        <i data-lucide="${q.vagueDetector ? 'toggle-right' : 'toggle-left'}" style="width: 36px; height: 36px; color: ${q.vagueDetector ? '#7F00E1' : 'rgba(1,1,1,0.3)'};"></i>
                    </button>
                </div>
                <span style="font-size: 11px; color: rgba(1,1,1,0.4); line-height: 1.3;">Se ativado, a IA bloqueará respostas evasivas (ex: "Não sei", "N/A") forçando uma resposta válida.</span>
            ` : ''}
        `;

        if (window.lucide) lucide.createIcons();

        // Bind events
        document.getElementById('prop-title').addEventListener('input', (e) => {
            q.title = e.target.value;
            renderCanvas(); // Two-way binding visual update
        });

        document.getElementById('prop-placeholder').addEventListener('input', (e) => {
            q.placeholder = e.target.value;
            renderCanvas();
        });

        document.getElementById('prop-required').addEventListener('click', () => {
            q.required = !q.required;
            renderProperties();
        });

        const vagueBtn = document.getElementById('prop-vague');
        if(vagueBtn) {
            vagueBtn.addEventListener('click', () => {
                q.vagueDetector = !q.vagueDetector;
                renderProperties();
            });
        }
    };

    const updateProgress = () => {
        const fill = document.getElementById('progress-fill');
        if(!fill) return;
        const total = form.questions.length;
        // Just a visual representation for the builder
        if(total === 0) fill.style.width = '0%';
        else fill.style.width = '100%';
    };

    // Drag and Drop Logic
    const attachDragAndDrop = () => {
        const dropZone = document.getElementById('drop-zone');
        const paletteItems = document.querySelectorAll('.palette-item');
        
        let draggedType = null;
        let draggedIndex = null;
        let placeholder = document.createElement('div');
        placeholder.className = 'drop-placeholder';

        // 1. Dragging from palette
        paletteItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedType = e.target.getAttribute('data-type');
                draggedIndex = null;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', draggedType); // required for Firefox
            });
            item.addEventListener('dragend', () => {
                if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                draggedType = null;
            });
        });

        // 2. Dragging existing items inside canvas
        dropZone.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.canvas-item');
            if (item) {
                draggedIndex = form.questions.findIndex(q => q.id === item.getAttribute('data-id'));
                draggedType = null;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => item.style.display = 'none', 0); // Hide original while dragging
            }
        });

        dropZone.addEventListener('dragend', (e) => {
            const item = e.target.closest('.canvas-item');
            if (item) {
                item.style.display = 'flex';
                if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                draggedIndex = null;
                renderCanvas();
            }
        });

        // 3. Drop Zone logic
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = draggedType ? 'copy' : 'move';
            
            const targetItem = e.target.closest('.canvas-item');
            if (targetItem) {
                const bounding = targetItem.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    targetItem.after(placeholder);
                } else {
                    targetItem.before(placeholder);
                }
            } else if (form.questions.length === 0 || e.target === dropZone) {
                dropZone.appendChild(placeholder);
            }
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!placeholder.parentNode) return;

            const items = Array.from(dropZone.children);
            const dropIndex = items.indexOf(placeholder);

            if (draggedType) {
                // Add new field from palette
                const newField = {
                    id: crypto.randomUUID(),
                    type: draggedType,
                    title: '',
                    placeholder: '',
                    required: false
                };
                form.questions.splice(dropIndex, 0, newField);
                activeFieldId = newField.id;
            } else if (draggedIndex !== null) {
                // Reorder existing field
                const movedField = form.questions.splice(draggedIndex, 1)[0];
                // Adjust drop index if we removed from before the drop point
                const finalIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
                form.questions.splice(finalIndex, 0, movedField);
            }

            if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
            renderCanvas();
            renderProperties();
        });
    };

    const attachEvents = () => {
        // Save
        document.getElementById('save-draft-btn').addEventListener('click', () => {
            form.title = document.getElementById('editor-form-title').value;
            store.saveForm(form);
            alert('Rascunho salvo!');
            if (formId === 'new') window.location.hash = `/forms/edit/${form.id}`;
        });

        document.getElementById('publish-btn').addEventListener('click', () => {
            form.title = document.getElementById('editor-form-title').value;
            store.saveForm(form);
            alert('Formulário publicado!');
            window.location.hash = '/forms';
        });

        document.getElementById('editor-form-title').addEventListener('blur', (e) => {
            if(!e.target.value.trim()) e.target.value = 'Novo Formulário';
        });

        // ── TABS ──
        const tabConstrutor = document.getElementById('tab-construtor');
        const tabConfig     = document.getElementById('tab-config');
        const tabPreview    = document.getElementById('tab-preview');

        const setActiveTab = (btn) => {
            [tabConstrutor, tabConfig].forEach(b => {
                const active = b === btn;
                b.style.backgroundColor = active ? '#010101' : 'transparent';
                b.style.color = active ? '#F0F0F2' : '#010101';
                b.style.fontWeight = active ? '600' : '400';
                b.classList.toggle('active', active);
            });
        };

        // Construtor: volta para a visão padrão
        tabConstrutor.addEventListener('click', () => {
            setActiveTab(tabConstrutor);
            renderBuilderView();
        });

        // Configurações: troca o conteúdo central pelo painel de settings
        tabConfig.addEventListener('click', () => {
            setActiveTab(tabConfig);
            renderSettingsView();
        });

        // Pré-visualização: salva e abre o formulário público em nova aba
        tabPreview.addEventListener('click', () => {
            form.title = document.getElementById('editor-form-title').value;
            if (!form.questions || form.questions.length === 0) {
                alert('Adicione ao menos uma pergunta antes de pré-visualizar.');
                return;
            }
            store.saveForm(form);
            if (formId === 'new') {
                window.location.hash = `/forms/edit/${form.id}`;
            }
            // Abre o liveform em nova aba
            const url = `${window.location.origin}${window.location.pathname}#/f/${form.id}`;
            window.open(url, '_blank');
        });
    };

    // Re-renderiza a visão do construtor (3 painéis)
    const renderBuilderView = () => {
        renderLayout();
    };

    // Renderiza a visão de Configurações do formulário dentro do editor
    const renderSettingsView = () => {
        const panelsRow = container.querySelector('#editor-panels');
        if (!panelsRow) return;
        panelsRow.innerHTML = `
            <div style="flex: 1; background-color: #F0F0F2; border-radius: 16px; border: 1px solid #DFDFE3; overflow-y: auto; padding: 32px; display: flex; justify-content: center;">
                <div style="width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 24px;">

                    <div>
                        <h3 style="font-size: 18px; font-weight: 700; color: #010101; margin: 0 0 4px 0;">Configurações do formulário</h3>
                        <p style="font-size: 13px; color: rgba(1,1,1,0.45); margin: 0;">Ajustes de comportamento e finalização.</p>
                    </div>

                    <!-- Loading border toggle -->
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 14px; font-weight: 500; color: #010101;">Contorno de progresso animado</div>
                            <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-top: 2px;">Preenche as bordas da tela conforme o usuário responde.</div>
                        </div>
                        <label class="ed-switch">
                            <input type="checkbox" id="set-loading-border" ${form.settings?.loadingBorder !== false ? 'checked' : ''}>
                            <span class="ed-slider"></span>
                        </label>
                    </div>

                    <!-- Detector de vagas -->
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 14px; font-weight: 500; color: #010101;">Detector de respostas vagas</div>
                            <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-top: 2px;">Sinaliza respostas com apenas símbolos ou números sem sentido.</div>
                        </div>
                        <label class="ed-switch">
                            <input type="checkbox" id="set-vague" ${form.settings?.vagueDetector ? 'checked' : ''}>
                            <span class="ed-slider"></span>
                        </label>
                    </div>

                    <!-- Redirect -->
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px;">
                        <div style="font-size: 14px; font-weight: 500; color: #010101; margin-bottom: 8px;">Link de redirecionamento</div>
                        <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-bottom: 12px;">Para onde enviar o respondente após concluir (opcional).</div>
                        <input type="url" id="set-redirect" value="${form.settings?.redirectUrl || ''}" placeholder="https://..." style="width: 100%; height: 40px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 12px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none;">
                    </div>

                    <button id="save-settings-btn" style="align-self: flex-end; height: 40px; padding: 0 20px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Salvar configurações</button>

                </div>
            </div>
            <style>
                .ed-switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
                .ed-switch input { opacity: 0; width: 0; height: 0; }
                .ed-slider { position: absolute; cursor: pointer; inset: 0; background-color: rgba(1,1,1,0.15); border-radius: 100px; transition: 0.2s; }
                .ed-slider:before { content: ""; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: #F0F0F2; border-radius: 50%; transition: 0.2s; }
                .ed-switch input:checked + .ed-slider { background-color: #7F00E1; }
                .ed-switch input:checked + .ed-slider:before { transform: translateX(18px); }
            </style>
        `;

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            form.settings = form.settings || {};
            form.settings.loadingBorder = document.getElementById('set-loading-border').checked;
            form.settings.vagueDetector = document.getElementById('set-vague').checked;
            form.settings.redirectUrl = document.getElementById('set-redirect').value.trim();
            form.title = document.getElementById('editor-form-title').value;
            store.saveForm(form);
            alert('Configurações salvas!');
            if (formId === 'new') window.location.hash = `/forms/edit/${form.id}`;
        });
    };

    renderLayout();
};
