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
            <div class="live-form-wrapper" style="position: relative; display: flex; flex-direction: column; height: 100vh; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif; overflow: hidden; align-items: center;">
                
                <!-- LOADING BORDER EFFECT -->
                <div class="border-top" style="position: absolute; top: 0; left: 0; height: 3px; background-color: #7F00E1; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50;"></div>
                <div class="border-right" style="position: absolute; top: 0; right: 0; width: 3px; background-color: #7F00E1; transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50;"></div>
                <div class="border-bottom" style="position: absolute; bottom: 0; right: 0; height: 3px; background-color: #7F00E1; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50;"></div>
                <div class="border-left" style="position: absolute; bottom: 0; left: 0; width: 3px; background-color: #7F00E1; transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1); z-index: 50;"></div>

                <!-- FLOATING HEADER -->
                <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); background-color: #DFDFE3; border-radius: 100px; border: 1px solid rgba(1,1,1,0.08); padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 32px; z-index: 40; min-width: 320px; max-width: 90vw;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#010101" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <div style="font-size: 13px; font-weight: 500; color: #010101; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                        ${form.title}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span id="header-progress-text" style="font-size: 12px; color: rgba(1,1,1,0.45); font-weight: 500;">1 / ${totalSteps}</span>
                        <div style="width: 120px; height: 3px; background-color: rgba(1,1,1,0.05); border-radius: 100px; position: relative; overflow: hidden;">
                            <div id="header-progress-bar" style="position: absolute; top: 0; left: 0; height: 100%; background-color: #7F00E1; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>

                <!-- QUESTION AREA -->
                <div id="question-container" style="flex: 1; width: 100%; max-width: 640px; display: flex; flex-direction: column; justify-content: center; padding: 0 24px; opacity: 0; transform: translateY(10px); transition: opacity 0.4s ease, transform 0.4s ease;">
                    <!-- Rendered per step -->
                </div>

                <!-- FLOATING BOTTOM NAV -->
                <div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background-color: #DFDFE3; border-radius: 100px; border: 1px solid rgba(1,1,1,0.08); padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 32px; z-index: 40; min-width: 320px;">
                    <button id="nav-prev" style="background: none; border: none; color: rgba(1,1,1,0.5); font-size: 12px; font-weight: 600; cursor: pointer; padding: 8px; transition: color 0.2s;">
                        ← Anterior
                    </button>
                    
                    <div id="step-dots" style="display: flex; gap: 8px;">
                        <!-- Rendered by JS -->
                    </div>

                    <button id="nav-next" style="background-color: #010101; color: #F0F0F2; border: none; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0 20px; height: 32px; transition: opacity 0.2s;">
                        Próxima →
                    </button>
                </div>

            </div>
            
            <style>
                .live-form-wrapper * { box-sizing: border-box; }
                
                /* Animations */
                .fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }
                
                /* Text Input */
                .live-input-text { width: 100%; font-size: 24px; font-family: 'Instrument Sans'; color: #010101; background: transparent; border: none; border-bottom: 1px solid rgba(1,1,1,0.1); padding: 8px 0; outline: none; transition: border-color 0.2s; }
                .live-input-text:focus { border-color: #010101; }
                .live-input-text::placeholder { color: rgba(1,1,1,0.3); font-style: italic; }

                /* Multiple Choice Cards */
                .mc-card { background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 12px; height: 56px; padding: 0 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s; }
                .mc-card:hover { border-color: #010101; }
                .mc-card.selected { background-color: #010101; color: #F0F0F2; }
                
                .key-badge { width: 20px; height: 20px; background-color: #F0F0F2; border: 1px solid rgba(1,1,1,0.08); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #010101; transition: all 0.2s; }
                .mc-card.selected .key-badge { background-color: transparent; border-color: rgba(240,240,242,0.3); color: #F0F0F2; }

                /* Rating Squares */
                .rating-sq { width: 48px; height: 48px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #010101; cursor: pointer; transition: all 0.2s; }
                .rating-sq:hover { border-color: #7F00E1; }
                .rating-sq.selected { background-color: #010101; color: #F0F0F2; border-color: #010101; }

                /* Yes/No Cards */
                .yn-card { flex: 1; height: 72px; background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #010101; cursor: pointer; transition: all 0.2s; }
                .yn-card:hover { border-color: #010101; }
                .yn-card.selected { background-color: #010101; color: #F0F0F2; }

                /* CTA */
                .live-cta-btn { background-color: #010101; color: #F0F0F2; border: none; border-radius: 100px; height: 48px; padding: 0 32px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: 'Instrument Sans'; }
                .live-cta-btn:hover { opacity: 0.9; }

                .step-dot { width: 6px; height: 6px; border-radius: 50%; border: 1px solid rgba(1,1,1,0.1); transition: all 0.2s; }
                .step-dot.active { background-color: #010101; border-color: #010101; }
                .step-dot.completed { background-color: #7F00E1; border-color: #7F00E1; }
            </style>
        `;

        if (window.lucide) lucide.createIcons();
        attachGlobalEvents();
        renderStep();
    };

    const updateProgressUI = () => {
        const p = totalSteps === 0 ? 0 : (currentStep / totalSteps) * 100;
        
        // Internal header text & bar
        document.getElementById('header-progress-text').textContent = `${currentStep + 1} / ${totalSteps}`;
        document.getElementById('header-progress-bar').style.width = `${p}%`;

        // Loading Border Effect (4 corners)
        // Stubs at 0% = 16px.
        const sizeStr = `max(16px, ${p}%)`;
        container.querySelector('.border-top').style.width = sizeStr;
        container.querySelector('.border-right').style.height = sizeStr;
        container.querySelector('.border-bottom').style.width = sizeStr;
        container.querySelector('.border-left').style.height = sizeStr;

        // Bottom Nav Dots
        const dotsContainer = document.getElementById('step-dots');
        dotsContainer.innerHTML = Array.from({length: totalSteps}).map((_, i) => {
            let cls = 'step-dot';
            if (i === currentStep) cls += ' active';
            else if (i < currentStep) cls += ' completed';
            return `<div class="${cls}"></div>`;
        }).join('');

        // Nav Buttons
        document.getElementById('nav-prev').style.opacity = currentStep === 0 ? '0.3' : '1';
        document.getElementById('nav-prev').style.pointerEvents = currentStep === 0 ? 'none' : 'auto';

        const nextBtn = document.getElementById('nav-next');
        if (currentStep === totalSteps - 1) {
            nextBtn.textContent = 'Enviar Formulário';
            nextBtn.style.backgroundColor = '#7F00E1';
        } else {
            nextBtn.textContent = 'Próxima →';
            nextBtn.style.backgroundColor = '#010101';
        }
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
                <div style="display: flex; flex-direction: column; align-items: flex-start; max-width: 100%;">
                    
                    <div style="font-size: 13px; font-weight: 700; color: #7F00E1; margin-bottom: 8px;">
                        ${String(currentStep + 1).padStart(2, '0')} →
                    </div>
                    
                    <h2 style="font-size: 32px; font-weight: 600; color: #010101; line-height: 1.3; margin: 0 0 8px 0; max-height: calc(32px * 1.3 * 2); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${q.title}
                        ${q.required ? '<span style="color: #7F00E1;">*</span>' : ''}
                    </h2>
                    
                    ${q.description ? `<p style="font-size: 14px; color: rgba(1,1,1,0.5); line-height: 1.6; margin: 0 0 32px 0;">${q.description}</p>` : '<div style="height: 32px;"></div>'}

                    <!-- INPUT AREA -->
                    <div style="width: 100%; margin-bottom: 32px;">
                        ${inputHtml}
                    </div>

                    <!-- CTA ROW -->
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <button id="live-confirm-btn" class="live-cta-btn">Confirmar</button>
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

        document.getElementById('nav-prev').addEventListener('click', () => {
            if (currentStep > 0) {
                saveTextAnswer();
                currentStep--;
                renderStep();
            }
        });

        document.getElementById('nav-next').addEventListener('click', () => {
            saveTextAnswer();
            goNext();
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
        const qContainer = document.getElementById('question-container');
        qContainer.classList.remove('fade-in-up');
        
        // Ensure header shows 100%
        document.getElementById('header-progress-text').textContent = `${totalSteps} / ${totalSteps}`;
        document.getElementById('header-progress-bar').style.width = `100%`;
        
        setTimeout(() => {
            qContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    
                    <!-- CENTERED CONFIRMATION CARD -->
                    <div style="background-color: #DFDFE3; border-radius: 20px; border: 1px solid rgba(1,1,1,0.08); width: 100%; max-width: 520px; padding: 48px; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center;">
                        
                        <!-- TOP ACCENT -->
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background-color: #7F00E1; border-radius: 20px 20px 0 0;"></div>

                        <!-- SUCCESS MARK -->
                        <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #010101; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                            <i data-lucide="check" style="width: 28px; height: 28px; color: #F0F0F2;"></i>
                        </div>
                        
                        <!-- ANIMATED LINE -->
                        <div style="height: 1px; background-color: #7F00E1; width: 0; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); margin-bottom: 20px;" id="success-line"></div>

                        <!-- HEADING -->
                        <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0 0 12px 0;">Enviado com sucesso!</h2>
                        
                        <!-- SUBTITLE -->
                        <p style="font-size: 14px; color: rgba(1,1,1,0.5); line-height: 1.65; max-width: 400px; margin: 0 0 20px 0;">
                            Obrigado por preencher o formulário. Suas respostas foram registradas e em breve você receberá um e-mail de confirmação.
                        </p>

                        <!-- RESPONDENT SUMMARY -->
                        <div style="background-color: #F0F0F2; border-radius: 12px; border: 1px solid #DFDFE3; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 360px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #DFDFE3; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #010101;">
                                    JS
                                </div>
                                <div style="display: flex; flex-direction: column; text-align: left;">
                                    <span style="font-size: 13px; font-weight: 500; color: #010101; line-height: 1.2;">João Silva</span>
                                    <span style="font-size: 11px; color: rgba(1,1,1,0.4);">joao.silva@email.com</span>
                                </div>
                            </div>
                            <div style="background-color: #010101; color: #F0F0F2; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 100px;">
                                100% concluído
                            </div>
                        </div>

                        <!-- CTA AREA -->
                        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 360px; margin-top: 24px;">
                            <a href="#/forms" style="width: 100%; height: 44px; border-radius: 100px; background-color: #7F00E1; color: #F0F0F2; font-size: 14px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                Acessar Dashboard
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                            </a>
                            <div style="font-size: 11px; color: rgba(1,1,1,0.3); text-align: center;">Você será redirecionado automaticamente em 5s</div>
                            
                            <a href="#/forms" style="width: 100%; height: 44px; border-radius: 10px; background-color: transparent; border: 1px solid #DFDFE3; color: #010101; font-size: 14px; font-weight: 500; text-decoration: none; display: flex; align-items: center; justify-content: center; margin-top: 4px;">
                                Voltar ao início
                            </a>
                        </div>
                    </div>

                    <!-- FLOATING BOTTOM NOTE -->
                    <div style="font-size: 11px; color: rgba(1,1,1,0.25); margin-top: 16px;">
                        5K9 Forms · Powered by 5K9 Studio
                    </div>
                    
                </div>
            `;
            qContainer.classList.add('fade-in-up');
            
            // Force border to 100% and hide nav
            const sizeStr = '100%';
            container.querySelector('.border-top').style.width = sizeStr;
            container.querySelector('.border-right').style.height = sizeStr;
            container.querySelector('.border-bottom').style.width = sizeStr;
            container.querySelector('.border-left').style.height = sizeStr;

            document.getElementById('step-dots').parentElement.style.display = 'none';

            if (window.lucide) lucide.createIcons();

            // Trigger animation
            setTimeout(() => {
                const line = document.getElementById('success-line');
                if (line) line.style.width = '240px';
            }, 100);

            // Mock auto-redirect
            // setTimeout(() => { window.location.hash = '/forms'; }, 5000);

        }, 300);
    };

    renderLayout();
};
