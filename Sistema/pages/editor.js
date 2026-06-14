import { store } from '../store.js';

export const renderEditor = (container, formId) => {
    let form = formId === 'new' ? {
        id: crypto.randomUUID(),
        title: 'Novo Formulário',
        questions: [],
        settings: {}
    } : store.getForm(formId);

    if (!form && formId !== 'new') {
        container.innerHTML = `<div style="padding: 32px; text-align: center; font-family: 'Instrument Sans';"><h2>Formulário não encontrado</h2></div>`;
        return;
    }

    let activeFieldId = null;
    let previewOpen = false;

    // Campos padrão (paleta) — sempre disponíveis
    const fieldTypes = [
        { type: 'short_text',      icon: 'align-left',    label: 'Texto curto' },
        { type: 'long_text',       icon: 'align-justify', label: 'Texto longo' },
        { type: 'multiple_choice', icon: 'check-circle',  label: 'Múltipla escolha' },
        { type: 'checkbox',        icon: 'check-square',  label: 'Caixa de seleção' },
        { type: 'date',            icon: 'calendar',      label: 'Data' },
        { type: 'file_upload',     icon: 'upload',        label: 'Upload' },
        { type: 'email',           icon: 'mail',          label: 'E-mail' },
        { type: 'number',          icon: 'hash',          label: 'Número' },
        { type: 'phone',           icon: 'phone',         label: 'Telefone' },
        { type: 'rating',          icon: 'star',          label: 'Rating' },
        { type: 'yes_no',          icon: 'thumbs-up',     label: 'Sim/Não' },
        { type: 'video',           icon: 'video',         label: 'Vídeo' }
    ];

    const getFieldTypeLabel = (type) => (fieldTypes.find(f => f.type === type) || {}).label || 'Campo';
    const getFieldTypeIcon  = (type) => (fieldTypes.find(f => f.type === type) || {}).icon || 'help-circle';

    // ───────────────────────── LAYOUT ─────────────────────────
    const renderLayout = () => {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; overflow: hidden; padding: 16px; gap: 16px;">

                <!-- TOP BAR -->
                <div style="background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); height: 56px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; flex-shrink: 0;">

                    <div style="display: flex; align-items: center; gap: 12px; width: 280px;">
                        <a href="#/forms" style="color: #010101; text-decoration: none; display: flex; align-items: center;">
                            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
                        </a>
                        <input type="text" id="editor-form-title" value="${form.title}" style="font-size: 16px; font-weight: 600; color: #010101; background: transparent; border: none; outline: none; width: 100%; font-family: 'Instrument Sans';">
                    </div>

                    <div style="display: flex; background-color: transparent; border: 1px solid rgba(1,1,1,0.1); border-radius: 10px; height: 34px; align-items: center; padding: 2px;">
                        <button id="tab-construtor" class="tab-btn active" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: #010101; color: #F0F0F2; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Construtor</button>
                        <button id="tab-config" class="tab-btn" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: transparent; color: #010101; font-size: 13px; font-weight: 400; border: none; cursor: pointer;">Configurações</button>
                        <button id="tab-preview" class="tab-btn" style="height: 100%; padding: 0 16px; border-radius: 8px; background-color: transparent; color: #010101; font-size: 13px; font-weight: 400; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Pré-visualização
                        </button>
                    </div>

                    <div style="display: flex; gap: 10px; width: 280px; justify-content: flex-end;">
                        <button id="save-draft-btn" style="height: 38px; padding: 0 16px; border-radius: 100px; background-color: transparent; border: 1px solid rgba(1,1,1,0.15); color: #010101; font-size: 13px; font-weight: 600; cursor: pointer;">Salvar Rascunho</button>
                        <button id="publish-btn" style="height: 38px; padding: 0 20px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 13px; font-weight: 600; border: none; cursor: pointer;">Publicar</button>
                    </div>
                </div>

                <!-- PANELS -->
                <div id="editor-panels" style="display: flex; flex: 1; gap: 16px; overflow: hidden; min-width: 0;">

                    <!-- LEFT PANEL: CAMPOS + BANCO -->
                    <div style="width: 240px; flex-shrink: 0; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 14px 16px; border-bottom: 1px solid rgba(1,1,1,0.08); display: flex; gap: 4px;">
                            <button id="src-tab-campos" class="src-tab active" style="flex:1; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #010101; background: #F0F0F2; border: none; border-radius: 8px; height: 30px; cursor: pointer;">Campos</button>
                            <button id="src-tab-banco" class="src-tab" style="flex:1; font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45); background: transparent; border: none; border-radius: 8px; height: 30px; cursor: pointer;">Banco</button>
                        </div>
                        <div id="source-content" style="flex: 1; overflow-y: auto; padding: 16px;"></div>
                    </div>

                    <!-- CENTER CANVAS -->
                    <div style="flex: 1; min-width: 0; background-color: #F0F0F2; border-radius: 16px; border: 1px solid #DFDFE3; position: relative; display: flex; flex-direction: column; overflow: hidden;">
                        <div id="drop-zone" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 60px; max-width: 820px; width: 100%; margin: 0 auto;"></div>
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background-color: #DFDFE3;">
                            <div id="progress-fill" style="height: 100%; width: 0%; background-color: #7F00E1; transition: width 0.3s ease;"></div>
                        </div>
                    </div>

                    <!-- RIGHT PANEL: PROPRIEDADES -->
                    <div id="props-panel-wrap" style="width: 280px; flex-shrink: 0; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; overflow: hidden;">
                        <div style="padding: 16px; border-bottom: 1px solid rgba(1,1,1,0.08);">
                            <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Propriedades</span>
                        </div>
                        <div id="properties-panel" style="padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;"></div>
                    </div>

                    <!-- PREVIEW PANEL (toggle) -->
                    <div id="preview-panel" style="width: 0; flex-shrink: 0; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #DFDFE3; display: none; flex-direction: column; overflow: hidden;">
                        <div style="padding: 16px 20px; border-bottom: 1px solid #DFDFE3; display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-size: 13px; font-weight: 600; color: #010101;">Pré-visualização</span>
                            <button id="close-preview" style="background: none; border: none; cursor: pointer; color: rgba(1,1,1,0.4); display: flex;"><i data-lucide="x" style="width: 18px; height: 18px;"></i></button>
                        </div>
                        <div id="preview-content" style="flex: 1; overflow-y: auto; padding: 32px;"></div>
                    </div>

                </div>
            </div>

            <style>
                .palette-item { transition: border-color 0.18s, transform 0.18s; }
                .palette-item:hover { border-color: #7F00E1 !important; transform: translateY(-1px); }
                .palette-item:active { cursor: grabbing; }

                .bank-item { transition: border-color 0.18s, transform 0.18s; }
                .bank-item:hover { border-color: #7F00E1 !important; transform: translateY(-1px); }

                .canvas-item { transition: border-color 0.2s; cursor: pointer; }
                .canvas-item:hover { border-color: rgba(1,1,1,0.25); }
                .canvas-item.active { border-color: #7F00E1 !important; }
                .canvas-item .drag-handle { opacity: 0; transition: opacity 0.2s; cursor: grab; }
                .canvas-item:hover .drag-handle, .canvas-item.active .drag-handle { opacity: 1; }

                .canvas-action-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; opacity: 0.5; transition: opacity 0.2s; flex-shrink: 0; }
                .canvas-action-btn:hover { opacity: 1; }

                .drop-placeholder { border: 2px dashed #7F00E1; border-radius: 12px; background-color: rgba(127,0,225,0.05); height: 76px; margin: 4px 0; }

                .prop-input { width: 100%; height: 36px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 12px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none; box-sizing: border-box; }
                .prop-input:focus { border-color: #7F00E1; }

                .type-badge { display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 6px; background-color: #F0F0F2; border: 1px solid rgba(1,1,1,0.08); font-size: 11px; font-weight: 500; color: rgba(1,1,1,0.55); flex-shrink: 0; }

                .src-tab { transition: all 0.15s; }
            </style>
        `;

        if (window.lucide) lucide.createIcons();
        renderSource('campos');
        renderCanvas();
        renderProperties();
        attachEvents();
        attachDragAndDrop();
    };

    // ───────────────────────── PALETA / BANCO ─────────────────────────
    let sourceTab = 'campos';
    let bankFilter = 'all';

    const renderSource = (tab) => {
        sourceTab = tab;
        const content = document.getElementById('source-content');
        document.getElementById('src-tab-campos').style.background = tab === 'campos' ? '#F0F0F2' : 'transparent';
        document.getElementById('src-tab-campos').style.color = tab === 'campos' ? '#010101' : 'rgba(1,1,1,0.45)';
        document.getElementById('src-tab-banco').style.background = tab === 'banco' ? '#F0F0F2' : 'transparent';
        document.getElementById('src-tab-banco').style.color = tab === 'banco' ? '#010101' : 'rgba(1,1,1,0.45)';

        if (tab === 'campos') {
            content.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${fieldTypes.map(ft => `
                        <div class="palette-item" draggable="true" data-type="${ft.type}" style="background-color: #F0F0F2; border: 1px solid #DFDFE3; border-radius: 10px; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; cursor: grab;">
                            <i data-lucide="${ft.icon}" style="width: 20px; height: 20px; color: #010101; stroke-width: 1.5px;"></i>
                            <span style="font-size: 10.5px; color: rgba(1,1,1,0.55); text-align: center; line-height: 1;">${ft.label}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            renderBank(content);
        }
        if (window.lucide) lucide.createIcons();
        attachDragAndDrop();
    };

    // Banco de questões com filtro por categoria
    const CATEGORIES = [
        { id: 'all',      label: 'Todas' },
        { id: 'contato',  label: 'Contato' },
        { id: 'escolha',  label: 'Escolhas' },
        { id: 'texto',    label: 'Texto' },
        { id: 'outros',   label: 'Outros' },
    ];
    const categoryOf = (type) => {
        if (['email','phone','address','website'].includes(type)) return 'contato';
        if (['multiple_choice','checkbox','dropdown','yes_no'].includes(type)) return 'escolha';
        if (['short_text','long_text','number'].includes(type)) return 'texto';
        return 'outros';
    };

    const renderBank = (content) => {
        const questions = store.getQuestions ? store.getQuestions() : [];
        const filtered = bankFilter === 'all' ? questions : questions.filter(q => categoryOf(q.type) === bankFilter);

        content.innerHTML = `
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                ${CATEGORIES.map(c => `
                    <button class="bank-filter" data-cat="${c.id}" style="font-size: 11px; padding: 4px 10px; border-radius: 100px; border: 1px solid ${bankFilter === c.id ? '#010101' : 'rgba(1,1,1,0.12)'}; background: ${bankFilter === c.id ? '#010101' : 'transparent'}; color: ${bankFilter === c.id ? '#F0F0F2' : '#010101'}; cursor: pointer; font-family: 'Instrument Sans'; font-weight: 500;">${c.label}</button>
                `).join('')}
            </div>
            ${filtered.length === 0 ? `
                <div style="text-align: center; padding: 32px 8px; color: rgba(1,1,1,0.35); font-size: 12px; line-height: 1.5;">
                    ${questions.length === 0 ? 'Nenhuma pergunta no banco ainda.<br>Cadastre no Banco de Questões.' : 'Nenhuma pergunta nesta categoria.'}
                </div>
            ` : `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${filtered.map(q => `
                        <div class="bank-item" draggable="true" data-bank-id="${q.id}" style="background-color: #F0F0F2; border: 1px solid #DFDFE3; border-radius: 10px; padding: 10px 12px; cursor: grab; display: flex; flex-direction: column; gap: 4px;">
                            <span style="font-size: 12px; font-weight: 500; color: #010101; line-height: 1.3;">${q.title || q.label || 'Pergunta'}</span>
                            <span class="type-badge"><i data-lucide="${getFieldTypeIcon(q.type)}" style="width:11px;height:11px;"></i> ${getFieldTypeLabel(q.type)}</span>
                        </div>
                    `).join('')}
                </div>
            `}
        `;
        if (window.lucide) lucide.createIcons();

        content.querySelectorAll('.bank-filter').forEach(btn => {
            btn.addEventListener('click', () => { bankFilter = btn.dataset.cat; renderBank(content); attachDragAndDrop(); });
        });
        attachDragAndDrop();
    };

    // ───────────────────────── CANVAS ─────────────────────────
    const renderCanvas = () => {
        const dropZone = document.getElementById('drop-zone');
        if (!dropZone) return;

        if (form.questions.length === 0) {
            dropZone.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 160px; border: 1px dashed rgba(1,1,1,0.15); border-radius: 16px; margin-top: 20px; color: rgba(1,1,1,0.35);">
                    <i data-lucide="mouse-pointer-click" style="width: 28px; height: 28px; margin-bottom: 8px;"></i>
                    <span style="font-size: 13px;">Arraste campos ou perguntas do banco aqui</span>
                </div>
            `;
            updateProgress();
            if (window.lucide) lucide.createIcons();
            return;
        }

        dropZone.innerHTML = form.questions.map((q, index) => {
            const isActive = q.id === activeFieldId;
            return `
                <div class="canvas-item ${isActive ? 'active' : ''}" data-id="${q.id}" draggable="true" style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid ${isActive ? '#7F00E1' : 'rgba(1,1,1,0.08)'}; padding: 14px 16px 14px 8px; display: flex; align-items: flex-start; gap: 12px;">

                    <i data-lucide="grip-vertical" class="drag-handle" style="width: 14px; height: 14px; color: rgba(1,1,1,0.3); margin-top: 4px; flex-shrink: 0;"></i>

                    <div style="font-size: 12px; font-weight: 700; color: #7F00E1; width: 30px; flex-shrink: 0; margin-top: 2px;">${String(index + 1).padStart(2, '0')} →</div>

                    <!-- Conteúdo: título em cima, placeholder embaixo, badge de tipo -->
                    <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px;">
                        <span style="font-size: 14px; font-weight: 600; color: #010101; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${q.title || 'Nova Pergunta'}${q.required ? ' <span style="color:#7F00E1;">*</span>' : ''}
                        </span>
                        ${q.placeholder ? `<span style="font-size: 12px; color: rgba(1,1,1,0.4); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${q.placeholder}</span>` : ''}
                        <span class="type-badge"><i data-lucide="${getFieldTypeIcon(q.type)}" style="width:11px;height:11px;"></i> ${getFieldTypeLabel(q.type)}</span>
                    </div>

                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                        <button class="canvas-action-btn dup-btn" data-id="${q.id}"><i data-lucide="copy" style="width: 16px; height: 16px; color: #010101;"></i></button>
                        <button class="canvas-action-btn del-btn" data-id="${q.id}"><i data-lucide="trash-2" style="width: 16px; height: 16px; color: #010101;"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
        attachCanvasItemEvents();
        updateProgress();
        if (previewOpen) renderPreview();
    };

    const attachCanvasItemEvents = () => {
        const dropZone = document.getElementById('drop-zone');
        dropZone.querySelectorAll('.canvas-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                activeFieldId = item.getAttribute('data-id');
                renderCanvas();
                renderProperties();
            });
        });
        dropZone.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.getAttribute('data-id');
                form.questions = form.questions.filter(q => q.id !== id);
                if (activeFieldId === id) { activeFieldId = null; renderProperties(); }
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

    // ───────────────────────── PROPRIEDADES ─────────────────────────
    const renderProperties = () => {
        const panel = document.getElementById('properties-panel');
        if (!panel) return;
        if (!activeFieldId) {
            panel.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(1,1,1,0.4); font-size: 13px; text-align: center; margin-top: 40px;">Selecione um campo no canvas para ver as propriedades.</div>`;
            return;
        }
        const q = form.questions.find(x => x.id === activeFieldId);
        if (!q) return;

        panel.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Título (Label)</label>
                <input type="text" class="prop-input" id="prop-title" value="${(q.title || '').replace(/"/g,'&quot;')}">
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">Placeholder</label>
                <input type="text" class="prop-input" id="prop-placeholder" value="${(q.placeholder || '').replace(/"/g,'&quot;')}">
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                <label style="font-size: 13px; font-weight: 500; color: #010101;">Campo Obrigatório</label>
                <button class="toggle-btn" id="prop-required" style="background:none;border:none;cursor:pointer;padding:0;">
                    <i data-lucide="${q.required ? 'toggle-right' : 'toggle-left'}" style="width: 36px; height: 36px; color: ${q.required ? '#7F00E1' : 'rgba(1,1,1,0.3)'};"></i>
                </button>
            </div>
            ${['short_text', 'long_text'].includes(q.type) ? `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; border-top: 1px solid rgba(1,1,1,0.08); padding-top: 16px;">
                    <label style="font-size: 13px; font-weight: 500; color: #010101;">Detector de Vagas (IA)</label>
                    <button class="toggle-btn" id="prop-vague" style="background:none;border:none;cursor:pointer;padding:0;">
                        <i data-lucide="${q.vagueDetector ? 'toggle-right' : 'toggle-left'}" style="width: 36px; height: 36px; color: ${q.vagueDetector ? '#7F00E1' : 'rgba(1,1,1,0.3)'};"></i>
                    </button>
                </div>
                <span style="font-size: 11px; color: rgba(1,1,1,0.4); line-height: 1.4;">Se ativado, a IA bloqueará respostas evasivas (ex: "Não sei", "N/A") forçando uma resposta válida.</span>
            ` : ''}
        `;
        if (window.lucide) lucide.createIcons();

        document.getElementById('prop-title').addEventListener('input', (e) => { q.title = e.target.value; renderCanvas(); });
        document.getElementById('prop-placeholder').addEventListener('input', (e) => { q.placeholder = e.target.value; renderCanvas(); });
        document.getElementById('prop-required').addEventListener('click', () => { q.required = !q.required; renderProperties(); renderCanvas(); });
        const vagueBtn = document.getElementById('prop-vague');
        if (vagueBtn) vagueBtn.addEventListener('click', () => { q.vagueDetector = !q.vagueDetector; renderProperties(); });
    };

    const updateProgress = () => {
        const fill = document.getElementById('progress-fill');
        if (!fill) return;
        fill.style.width = form.questions.length === 0 ? '0%' : '100%';
    };

    // ───────────────────────── PREVIEW (estilo Google Forms) ─────────────────────────
    const renderPreview = () => {
        const pc = document.getElementById('preview-content');
        if (!pc) return;
        const title = document.getElementById('editor-form-title')?.value || form.title;

        pc.innerHTML = `
            <div style="max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
                <div style="border-top: 6px solid #7F00E1; border-radius: 10px; background: #fff; border: 1px solid #e8e8e8; border-top: 6px solid #7F00E1; padding: 24px;">
                    <h1 style="font-size: 26px; font-weight: 700; color: #010101; margin: 0 0 8px 0;">${title}</h1>
                    <p style="font-size: 13px; color: rgba(1,1,1,0.5); margin: 0;">${form.questions.length} pergunta${form.questions.length !== 1 ? 's' : ''}</p>
                </div>
                ${form.questions.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: rgba(1,1,1,0.35); font-size: 13px;">Adicione perguntas para ver o preview.</div>
                ` : form.questions.map((q, i) => `
                    <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 20px;">
                        <div style="font-size: 15px; font-weight: 500; color: #010101; margin-bottom: 14px;">
                            ${i + 1}. ${q.title || 'Pergunta sem título'}${q.required ? ' <span style="color:#d32f2f;">*</span>' : ''}
                        </div>
                        ${renderPreviewInput(q)}
                    </div>
                `).join('')}
            </div>
        `;
    };

    const renderPreviewInput = (q) => {
        const ph = q.placeholder || '';
        switch (q.type) {
            case 'long_text':
                return `<div style="border: 1px solid #ddd; border-radius: 6px; height: 72px; padding: 8px 12px; color: rgba(1,1,1,0.35); font-size: 13px;">${ph || 'Resposta longa'}</div>`;
            case 'multiple_choice':
            case 'checkbox':
                return ['Opção 1', 'Opção 2', 'Opção 3'].map(o => `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="width: 18px; height: 18px; border: 2px solid #bbb; border-radius: ${q.type === 'checkbox' ? '4px' : '50%'};"></div>
                        <span style="font-size: 14px; color: #010101;">${o}</span>
                    </div>`).join('');
            case 'yes_no':
                return `<div style="display:flex; gap: 12px;">
                    <div style="flex:1; border:1px solid #ddd; border-radius:8px; padding:12px; text-align:center; font-size:14px;">Sim</div>
                    <div style="flex:1; border:1px solid #ddd; border-radius:8px; padding:12px; text-align:center; font-size:14px;">Não</div>
                </div>`;
            case 'rating':
                return `<div style="display:flex; gap:8px;">${[1,2,3,4,5].map(n=>`<div style="width:36px;height:36px;border:1px solid #ddd;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;">${n}</div>`).join('')}</div>`;
            case 'date':
                return `<div style="border-bottom: 1px solid #ddd; padding: 6px 0; color: rgba(1,1,1,0.35); font-size: 13px; width: 200px;">dd/mm/aaaa</div>`;
            case 'file_upload':
                return `<div style="border: 1px dashed #ccc; border-radius: 8px; padding: 16px; text-align: center; color: rgba(1,1,1,0.4); font-size: 13px;">⬆ Adicionar arquivo</div>`;
            default:
                return `<div style="border-bottom: 1px solid #ddd; padding: 6px 0; color: rgba(1,1,1,0.35); font-size: 13px;">${ph || 'Resposta curta'}</div>`;
        }
    };

    const togglePreview = (open) => {
        previewOpen = open;
        const panel = document.getElementById('preview-panel');
        const propsWrap = document.getElementById('props-panel-wrap');
        if (open) {
            panel.style.display = 'flex';
            panel.style.width = '440px';
            // Em telas menores, esconde o painel de propriedades p/ dar espaço
            if (window.innerWidth < 1280) propsWrap.style.display = 'none';
            renderPreview();
            if (window.lucide) lucide.createIcons();
        } else {
            panel.style.display = 'none';
            panel.style.width = '0';
            propsWrap.style.display = 'flex';
        }
    };

    // ───────────────────────── DRAG & DROP ─────────────────────────
    const attachDragAndDrop = () => {
        const dropZone = document.getElementById('drop-zone');
        if (!dropZone) return;

        let draggedType = null;
        let draggedBankId = null;
        let draggedIndex = null;
        let placeholder = document.createElement('div');
        placeholder.className = 'drop-placeholder';

        // Paleta de campos
        document.querySelectorAll('.palette-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedType = item.getAttribute('data-type');
                draggedBankId = null; draggedIndex = null;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', draggedType);
            });
            item.addEventListener('dragend', () => {
                if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                draggedType = null;
            });
        });

        // Itens do banco
        document.querySelectorAll('.bank-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedBankId = item.getAttribute('data-bank-id');
                draggedType = null; draggedIndex = null;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', draggedBankId);
            });
            item.addEventListener('dragend', () => {
                if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
                draggedBankId = null;
            });
        });

        // Reordenar itens existentes
        dropZone.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.canvas-item');
            if (item) {
                draggedIndex = form.questions.findIndex(q => q.id === item.getAttribute('data-id'));
                draggedType = null; draggedBankId = null;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => item.style.display = 'none', 0);
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

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = (draggedType || draggedBankId) ? 'copy' : 'move';
            const targetItem = e.target.closest('.canvas-item');
            if (targetItem) {
                const b = targetItem.getBoundingClientRect();
                const offset = b.y + (b.height / 2);
                if (e.clientY - offset > 0) targetItem.after(placeholder);
                else targetItem.before(placeholder);
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
                const newField = { id: crypto.randomUUID(), type: draggedType, title: '', placeholder: '', required: false };
                form.questions.splice(dropIndex, 0, newField);
                activeFieldId = newField.id;
            } else if (draggedBankId) {
                const bankQ = (store.getQuestions ? store.getQuestions() : []).find(x => x.id === draggedBankId);
                if (bankQ) {
                    const newField = {
                        id: crypto.randomUUID(),
                        type: bankQ.type,
                        title: bankQ.title || bankQ.label || '',
                        placeholder: bankQ.placeholder || '',
                        required: !!bankQ.required,
                        fromBank: bankQ.id
                    };
                    form.questions.splice(dropIndex, 0, newField);
                    activeFieldId = newField.id;
                }
            } else if (draggedIndex !== null) {
                const moved = form.questions.splice(draggedIndex, 1)[0];
                const finalIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
                form.questions.splice(finalIndex, 0, moved);
            }

            if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
            renderCanvas();
            renderProperties();
        });
    };

    // ───────────────────────── EVENTOS GERAIS ─────────────────────────
    const attachEvents = () => {
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
            if (!e.target.value.trim()) e.target.value = 'Novo Formulário';
            if (previewOpen) renderPreview();
        });

        // Fonte: campos / banco
        document.getElementById('src-tab-campos').addEventListener('click', () => renderSource('campos'));
        document.getElementById('src-tab-banco').addEventListener('click', () => renderSource('banco'));

        // TABS topo
        const tabConstrutor = document.getElementById('tab-construtor');
        const tabConfig     = document.getElementById('tab-config');
        const tabPreview    = document.getElementById('tab-preview');

        const setActiveTab = (btn) => {
            [tabConstrutor, tabConfig].forEach(b => {
                const active = b === btn;
                b.style.backgroundColor = active ? '#010101' : 'transparent';
                b.style.color = active ? '#F0F0F2' : '#010101';
                b.style.fontWeight = active ? '600' : '400';
            });
        };

        tabConstrutor.addEventListener('click', () => { setActiveTab(tabConstrutor); renderBuilderView(); });
        tabConfig.addEventListener('click', () => { setActiveTab(tabConfig); renderSettingsView(); });

        // Pré-visualização: toggle do painel lateral
        tabPreview.addEventListener('click', () => {
            togglePreview(!previewOpen);
            tabPreview.style.backgroundColor = previewOpen ? '#7F00E1' : 'transparent';
            tabPreview.style.color = previewOpen ? '#F0F0F2' : '#010101';
        });

        const closeBtn = document.getElementById('close-preview');
        if (closeBtn) closeBtn.addEventListener('click', () => {
            togglePreview(false);
            tabPreview.style.backgroundColor = 'transparent';
            tabPreview.style.color = '#010101';
        });
    };

    const renderBuilderView = () => { renderLayout(); };

    // Configurações do formulário (mantida do passo anterior)
    const renderSettingsView = () => {
        const panelsRow = container.querySelector('#editor-panels');
        if (!panelsRow) return;
        panelsRow.innerHTML = `
            <div style="flex: 1; min-width: 0; background-color: #F0F0F2; border-radius: 16px; border: 1px solid #DFDFE3; overflow-y: auto; padding: 32px; display: flex; justify-content: center;">
                <div style="width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <h3 style="font-size: 18px; font-weight: 700; color: #010101; margin: 0 0 4px 0;">Configurações do formulário</h3>
                        <p style="font-size: 13px; color: rgba(1,1,1,0.45); margin: 0;">Ajustes de comportamento e finalização.</p>
                    </div>
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 14px; font-weight: 500; color: #010101;">Contorno de progresso animado</div>
                            <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-top: 2px;">Preenche as bordas da tela conforme o usuário responde.</div>
                        </div>
                        <label class="ed-switch"><input type="checkbox" id="set-loading-border" ${form.settings?.loadingBorder !== false ? 'checked' : ''}><span class="ed-slider"></span></label>
                    </div>
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="font-size: 14px; font-weight: 500; color: #010101;">Detector de respostas vagas</div>
                            <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-top: 2px;">Sinaliza respostas com apenas símbolos ou números sem sentido.</div>
                        </div>
                        <label class="ed-switch"><input type="checkbox" id="set-vague" ${form.settings?.vagueDetector ? 'checked' : ''}><span class="ed-slider"></span></label>
                    </div>
                    <div style="background-color: #DFDFE3; border-radius: 12px; border: 1px solid rgba(1,1,1,0.08); padding: 16px;">
                        <div style="font-size: 14px; font-weight: 500; color: #010101; margin-bottom: 8px;">Link de redirecionamento</div>
                        <div style="font-size: 12px; color: rgba(1,1,1,0.45); margin-bottom: 12px;">Para onde enviar o respondente após concluir (opcional).</div>
                        <input type="url" id="set-redirect" value="${form.settings?.redirectUrl || ''}" placeholder="https://..." style="width: 100%; height: 40px; border-radius: 10px; background-color: #F0F0F2; border: 1px solid #DFDFE3; padding: 0 12px; font-size: 13px; font-family: 'Instrument Sans'; color: #010101; outline: none; box-sizing: border-box;">
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
