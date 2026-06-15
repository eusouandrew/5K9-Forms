import { store } from '../store.js';

export const renderLiveForm = (container, formId) => {
    const form = store.getForm(formId);
    
    if (!form) {
        container.innerHTML = `
            <div style="display: flex; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; align-items: center; justify-content: center; flex-direction: column;">
                <h2>Formulário não encontrado</h2>
                <a href="#/forms" style="color: #010101; text-decoration: underline; margin-top: 16px;">Voltar para Dashboard</a>
            </div>
        `;
        return;
    }

    if (!form.questions || form.questions.length === 0) {
        container.innerHTML = `
            <div style="display: flex; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; align-items: center; justify-content: center; flex-direction: column;">
                <h2>Este formulário ainda não possui perguntas.</h2>
            </div>
        `;
        return;
    }

    let currentStep = 0;
    const totalSteps = form.questions.length;
    let answers = {};

    const renderLayout = () => {
        container.innerHTML = `
            <div class="live-form-wrapper" style="position: fixed; inset: 0; display: flex; flex-direction: column; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; overflow: hidden; align-items: center; justify-content: center;">

                <!-- LOADING BORDER em tela cheia: barras laterais sobem e o topo fecha do centro -->
                <div class="lb-left" style="position: fixed; bottom: 0; left: 0; width: 5px; height: 100vh; z-index: 50; pointer-events: none;">
                    <div class="lb-left-fill" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background-color: #7F00E1; transition: height 0.5s cubic-bezier(0.4,0,0.2,1);"></div>
                </div>
                <div class="lb-right" style="position: fixed; bottom: 0; right: 0; width: 5px; height: 100vh; z-index: 50; pointer-events: none;">
                    <div class="lb-right-fill" style="position: absolute; bottom: 0; right: 0; width: 100%; height: 0%; background-color: #7F00E1; transition: height 0.5s cubic-bezier(0.4,0,0.2,1);"></div>
                </div>
                <!-- topo: duas metades que se encontram no centro -->
                <div class="lb-top" style="position: fixed; top: 0; left: 0; width: 100%; height: 5px; z-index: 50; pointer-events: none; display: flex; justify-content: center;">
                    <div class="lb-top-left" style="position: absolute; top: 0; left: 0; width: 0%; height: 100%; background-color: #7F00E1; transition: width 0.5s cubic-bezier(0.4,0,0.2,1);"></div>
                    <div class="lb-top-right" style="position: absolute; top: 0; right: 0; width: 0%; height: 100%; background-color: #7F00E1; transition: width 0.5s cubic-bezier(0.4,0,0.2,1);"></div>
                </div>

                <!-- QUESTION AREA: altura fixa, centralizada de verdade na tela -->
                <div id="question-container" style="width: 100%; max-width: 620px; min-height: 360px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 24px; margin: 0 auto; opacity: 0; transform: translateY(10px); transition: opacity 0.4s ease, transform 0.4s ease;">
                    <!-- Rendered per step -->
                </div>

            </div>

            <style>
                .live-form-wrapper * { box-sizing: border-box; }
                .fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }
                .live-input-text { width: 100%; font-size: 24px; font-family: 'Instrument Sans'; color: #010101; background: transparent; border: none; border-bottom: 1px solid rgba(1,1,1,0.1); padding: 8px 0; outline: none; transition: border-color 0.2s; text-align: center; }
                .live-input-text:focus { border-color: #010101; }
                .live-input-text::placeholder { color: rgba(1,1,1,0.3); font-style: italic; }
                .mc-card { background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 12px; height: 56px; padding: 0 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s; }
                .mc-card:hover { border-color: #010101; }
                .mc-card.selected { background-color: #010101; color: #F0F0F2; }
                .key-badge { width: 20px; height: 20px; background-color: #F0F0F2; border: 1px solid rgba(1,1,1,0.08); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #010101; transition: all 0.2s; flex-shrink: 0; }
                .mc-card.selected .key-badge { background-color: transparent; border-color: rgba(240,240,242,0.3); color: #F0F0F2; }
                .rating-sq { width: 48px; height: 48px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #010101; cursor: pointer; transition: all 0.2s; }
                .rating-sq:hover { border-color: #7F00E1; }
                .rating-sq.selected { background-color: #010101; color: #F0F0F2; border-color: #010101; }
                .yn-card { flex: 1; height: 72px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #010101; cursor: pointer; transition: all 0.2s; }
                .yn-card:hover { border-color: #010101; }
                .yn-card.selected { background-color: #010101; color: #F0F0F2; }
                .live-cta-btn { background-color: #010101; color: #F0F0F2; border: none; border-radius: 100px; height: 48px; padding: 0 32px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: 'Instrument Sans'; }
                .live-cta-btn:hover { opacity: 0.9; }
            </style>
        `;

        if (window.lucide) lucide.createIcons();

        // Respeita o toggle de contorno animado das configurações
        if (form.settings && form.settings.loadingBorder === false) {
            ['.lb-left', '.lb-right', '.lb-top'].forEach(sel => {
                const el = container.querySelector(sel);
                if (el) el.style.display = 'none';
            });
        }

        attachGlobalEvents();
        renderStep();
    };

    const updateProgressUI = () => {
        // Progresso baseado em quantas perguntas já foram respondidas
        const p = totalSteps === 0 ? 0 : (currentStep / totalSteps); // 0..1

        // ── BORDA EM TELA CHEIA ──
        // Fase 1 (0–70%):   as duas laterais sobem simultaneamente
        // Fase 2 (70–100%): o topo fecha vindo dos dois cantos para o centro
        const leftFill  = container.querySelector('.lb-left-fill');
        const rightFill = container.querySelector('.lb-right-fill');
        const topLeft   = container.querySelector('.lb-top-left');
        const topRight  = container.querySelector('.lb-top-right');

        const f1 = Math.min(p / 0.70, 1);                       // laterais (0..1)
        const f2 = Math.min(Math.max((p - 0.70) / 0.30, 0), 1); // topo (0..1)

        if (leftFill)  leftFill.style.height  = `${f1 * 100}%`;
        if (rightFill) rightFill.style.height = `${f1 * 100}%`;
        // cada metade do topo vai até 50% (encontram-se no centro)
        if (topLeft)   topLeft.style.width  = `${f2 * 50}%`;
        if (topRight)  topRight.style.width = `${f2 * 50}%`;
    };

    const renderStep = () => {
        const q = form.questions[currentStep];
        const qContainer = document.getElementById('question-container');
        
        // Reset animation
        qContainer.classList.remove('fade-in-up');
        
        setTimeout(() => {
            // Render Input HTML based on type
            let inputHtml = '';
            
            if (['short_text', 'long_text', 'email', 'number', 'phone', 'website'].includes(q.type)) {
                inputHtml = `
                    <input type="text" class="live-input-text" id="ans-input" placeholder="${q.placeholder || 'Digite sua resposta aqui...'}" autocomplete="off">
                `;
            } 
            else if (['multiple_choice', 'dropdown', 'checkbox'].includes(q.type)) {
                // Fake options for demo since data model doesn't store options yet
                const options = ['Opção A', 'Opção B', 'Opção C'];
                const letters = ['A', 'B', 'C', 'D', 'E'];
                inputHtml = `
                    <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                        ${options.map((opt, i) => `
                            <div class="mc-card" data-val="${opt}">
                                <div class="key-badge">${letters[i]}</div>
                                <span style="font-size: 15px;">${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            else if (q.type === 'rating') {
                inputHtml = `
                    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                        <div style="display: flex; gap: 8px;">
                            ${[1,2,3,4,5].map(n => `
                                <div class="rating-sq" data-val="${n}">${n}</div>
                            `).join('')}
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0 4px;">
                            <span style="font-size: 12px; color: rgba(1,1,1,0.4); font-weight: 500;">Discordo totalmente</span>
                            <span style="font-size: 12px; color: rgba(1,1,1,0.4); font-weight: 500;">Concordo totalmente</span>
                        </div>
                    </div>
                `;
            }
            else if (q.type === 'yes_no') {
                inputHtml = `
                    <div style="display: flex; gap: 16px; width: 100%;">
                        <div class="yn-card" data-val="Sim">Sim</div>
                        <div class="yn-card" data-val="Não">Não</div>
                    </div>
                `;
            }
            else {
                // Fallback
                inputHtml = `<input type="text" class="live-input-text" id="ans-input" placeholder="Digite sua resposta..." autocomplete="off">`;
            }

            qContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 100%;">

                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #7F00E1; margin-bottom: 12px;">
                        <span>${currentStep + 1} / ${totalSteps}</span>
                        <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                    </div>

                    <h2 style="font-size: 32px; font-weight: 600; color: #010101; line-height: 1.3; margin: 0 0 8px 0;">
                        ${q.title}
                        ${q.required ? '<span style="color: #7F00E1;">*</span>' : ''}
                    </h2>

                    ${q.description ? `<p style="font-size: 14px; color: rgba(1,1,1,0.5); line-height: 1.6; margin: 0 0 32px 0; max-width: 480px;">${q.description}</p>` : '<div style="height: 32px;"></div>'}

                    <!-- INPUT AREA -->
                    <div style="width: 100%; margin-bottom: 32px;">
                        ${inputHtml}
                    </div>

                    <!-- CTA ROW -->
                    <div style="display: flex; align-items: center; gap: 24px; justify-content: center;">
                        <button id="live-confirm-btn" class="live-cta-btn">${currentStep === totalSteps - 1 ? 'Enviar' : 'Confirmar'}</button>
                        <span style="font-size: 12px; color: rgba(1,1,1,0.35); font-weight: 500;">ou pressione Enter ↵</span>
                    </div>

                </div>
            `;
            
            // Animate In
            qContainer.classList.add('fade-in-up');
            
            // Attach Input Events
            attachInputEvents();
            
            // Focus input if text
            const textInput = document.getElementById('ans-input');
            if (textInput) {
                // Restore answer if exists
                if (answers[q.id]) textInput.value = answers[q.id];
                setTimeout(() => textInput.focus(), 100);
            }

            updateProgressUI();

        }, 100); // Small delay for out-animation
    };

    const attachInputEvents = () => {
        const q = form.questions[currentStep];

        // Selection logics for cards
        const handleSelection = (cardsSelector) => {
            const cards = document.querySelectorAll(cardsSelector);
            cards.forEach(card => {
                // Pre-select
                if (answers[q.id] === card.getAttribute('data-val')) {
                    card.classList.add('selected');
                }
                
                card.addEventListener('click', () => {
                    cards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    answers[q.id] = card.getAttribute('data-val');
                    
                    // Auto-advance on selection for quick inputs
                    setTimeout(goNext, 300);
                });
            });
        };

        handleSelection('.mc-card');
        handleSelection('.rating-sq');
        handleSelection('.yn-card');

        // Confirm btn
        document.getElementById('live-confirm-btn').addEventListener('click', () => {
            saveTextAnswer();
            goNext();
        });
    };

    const saveTextAnswer = () => {
        const textInput = document.getElementById('ans-input');
        if (textInput) {
            answers[form.questions[currentStep].id] = textInput.value;
        }
    };

    const attachGlobalEvents = () => {
        // Enter key to advance
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // prevent form submit or default actions
                
                // If it's a card-based question, only advance if something is selected
                const q = form.questions[currentStep];
                const isCard = ['multiple_choice', 'dropdown', 'checkbox', 'rating', 'yes_no'].includes(q.type);
                
                if (isCard && !answers[q.id]) {
                    // Optional: shake effect if required
                    return; 
                }

                saveTextAnswer();
                goNext();
            }
        });
    };

    const goNext = () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            renderStep();
        } else {
            // Final Submit
            finishForm();
        }
    };

    const finishForm = () => {
        const wrapper = container.querySelector('.live-form-wrapper');
        const qContainer = document.getElementById('question-container');

        // Identifica o respondente e persiste a resposta
        const respondent = resolveRespondent(answers, form);
        store.saveResponse(form.id, {
            answers: { ...answers },
            respondentName: respondent.name,
            respondentEmail: respondent.email,
            completion: 100
        });

        const redirectUrl = form.settings && form.settings.redirectUrl ? form.settings.redirectUrl : null;

        // 1) Completa as bordas: laterais cheias + topo fechado no centro
        const leftFill  = container.querySelector('.lb-left-fill');
        const rightFill = container.querySelector('.lb-right-fill');
        const topLeft   = container.querySelector('.lb-top-left');
        const topRight  = container.querySelector('.lb-top-right');
        if (leftFill)  leftFill.style.height  = '100%';
        if (rightFill) rightFill.style.height = '100%';
        if (topLeft)   topLeft.style.width  = '50%';
        if (topRight)  topRight.style.width = '50%';

        // 2) Some com a questão
        qContainer.style.transition = 'opacity 0.4s ease';
        qContainer.style.opacity = '0';

        // 3) Inunda a tela de rosa PELAS LATERAIS (duas metades que se encontram)
        setTimeout(() => {
            const flood = document.createElement('div');
            flood.id = 'completion-flood';
            flood.style.cssText = `
                position: fixed; inset: 0; z-index: 60;
                display: flex; align-items: center; justify-content: center;
                overflow: hidden; pointer-events: none;
            `;
            flood.innerHTML = `
                <div class="flood-half flood-left" style="position: absolute; top: 0; left: 0; height: 100%; width: 0; background-color: #7F00E1; transition: width 0.6s cubic-bezier(0.6,0,0.2,1);"></div>
                <div class="flood-half flood-right" style="position: absolute; top: 0; right: 0; height: 100%; width: 0; background-color: #7F00E1; transition: width 0.6s cubic-bezier(0.6,0,0.2,1);"></div>
                <div style="position: relative; z-index: 2; opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px; pointer-events: auto;" id="flood-content">
                    <div style="width: 72px; height: 72px; border-radius: 50%; background-color: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                        <i data-lucide="check" style="width: 36px; height: 36px; color: #FFFFFF;"></i>
                    </div>
                    <h1 style="font-size: 56px; font-weight: 700; color: #FFFFFF; margin: 0 0 12px 0; letter-spacing: -0.02em;">Concluído</h1>
                    <p style="font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.6; max-width: 380px; margin: 0;">
                        Obrigado, ${respondent.name.split(' ')[0]}! Suas respostas foram registradas com sucesso.
                    </p>
                    ${redirectUrl ? `
                    <a href="${redirectUrl}" target="_blank" rel="noopener" style="margin-top: 28px; background-color: #FFFFFF; color: #7F00E1; height: 44px; padding: 0 24px; border-radius: 100px; font-size: 14px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                        Continuar <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
                    </a>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 12px;">Redirecionando em 5s…</div>
                    ` : `
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 28px;">Você já pode fechar esta janela.</div>
                    `}
                </div>
            `;
            wrapper.appendChild(flood);

            requestAnimationFrame(() => {
                // cada metade cresce até 50% da largura → se encontram no centro
                const fl = flood.querySelector('.flood-left');
                const fr = flood.querySelector('.flood-right');
                if (fl) fl.style.width = '50%';
                if (fr) fr.style.width = '50%';
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    const fc = document.getElementById('flood-content');
                    if (fc) { fc.style.opacity = '1'; fc.style.transform = 'translateY(0)'; }
                }, 500);
            });

            if (redirectUrl) {
                setTimeout(() => { window.open(redirectUrl, '_blank', 'noopener'); }, 5000);
            }
        }, 500);
    };

    // Extrai o respondente das respostas (campos de email/nome) com fallbacks
    const resolveRespondent = (answers, form) => {
        let name = '';
        let email = '';
        if (form.questions) {
            form.questions.forEach(q => {
                const val = answers[q.id];
                if (!val) return;
                if (q.type === 'email' && !email) email = val;
                const label = (q.label || q.title || '').toLowerCase();
                if (!name && (label.includes('nome') || label.includes('name'))) name = val;
            });
        }
        const user = store.getUser();
        if (!name)  name  = user ? user.name  : 'Respondente anônimo';
        if (!email) email = user ? user.email : 'sem-email@5k9.forms';
        return { name, email };
    };

    renderLayout();
};
