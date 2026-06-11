import { store } from '../store.js';

export const renderLiveForm = (container, formId) => {
    const form = store.getForm(formId);
    
    if (!form) {
        container.innerHTML = '<div class="flex items-center justify-center h-full w-full"><h2>Formulário não encontrado</h2></div>';
        return;
    }

    let currentIndex = form.settings.welcomeScreen ? -1 : 0;
    const totalQuestions = form.questions.length;
    const responses = {};

    const updateLoadingBorder = () => {
        const border = document.getElementById('liveLoadingBorder');
        if (!border || !form.settings.loadingBorder) return;
        
        // Calcular progresso baseado nas perguntas (ignorando bem-vindo e fim)
        let progress = 0;
        if (currentIndex >= totalQuestions) progress = 100;
        else if (currentIndex >= 0) progress = (currentIndex / totalQuestions) * 100;
        
        // O efeito visual do preenchimento da borda
        // Como o CSS puro para preencher as bordas parcialmente é complexo usando apenas box-shadow,
        // vamos simular com pseudoelementos ou div de overlay se for preciso.
        // Simplificando, alteramos a opacidade/grossura ou um clip-path
        border.style.clipPath = `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`;
    };

    const renderQuestion = () => {
        let content = '';

        if (currentIndex === -1) {
            content = `
                <div class="flex flex-col items-center gap-6 animate-fade-in text-center" style="max-width: 600px; margin: auto;">
                    <h1 style="font-size: 3rem; color: var(--color-contrast);">${form.settings.welcomeTitle || 'Bem-vindo'}</h1>
                    <p style="font-size: 1.2rem; color: #555;">${form.settings.welcomeText || 'Aperte Start para começar o formulário.'}</p>
                    <button id="nextBtn" class="btn primary" style="font-size: 1.2rem; padding: 1rem 2.5rem;">Start <i data-lucide="arrow-right"></i></button>
                </div>
            `;
        } else if (currentIndex === totalQuestions) {
            content = `
                <div class="flex flex-col items-center gap-6 animate-fade-in text-center" style="max-width: 600px; margin: auto;">
                    <h1 style="font-size: 3rem; color: var(--color-contrast);">${form.settings.endTitle || 'Obrigado!'}</h1>
                    <p style="font-size: 1.2rem; color: #555;">${form.settings.endText || 'Suas respostas foram salvas com sucesso.'}</p>
                    ${form.settings.redirectLink ? `<a href="${form.settings.redirectLink}" class="btn primary">Continuar</a>` : ''}
                </div>
            `;
        } else {
            const q = form.questions[currentIndex];
            let inputHTML = '';
            
            // Simple renderer base on type
            if (q.type === 'long_text') {
                inputHTML = `<textarea id="qInput" class="input-field" style="min-height: 150px; font-size: 1.2rem;" placeholder="Sua resposta aqui...">${responses[q.id] || ''}</textarea>`;
            } else if (q.type === 'yes_no') {
                inputHTML = `
                    <div class="flex gap-4 w-full">
                        <button class="btn outline flex-1 opt-btn" style="font-size:1.5rem; padding: 2rem;" data-val="Sim">Sim</button>
                        <button class="btn outline flex-1 opt-btn" style="font-size:1.5rem; padding: 2rem;" data-val="Não">Não</button>
                    </div>
                `;
            } else {
                inputHTML = `<input type="text" id="qInput" class="input-field" style="font-size: 1.5rem; padding: 1rem;" placeholder="Sua resposta" value="${responses[q.id] || ''}">`;
            }

            content = `
                <div class="flex flex-col gap-8 animate-fade-in" style="width: 100%; max-width: 700px; margin: auto;">
                    <div class="flex items-center gap-4">
                        <span style="font-size: 1.5rem; font-weight: bold; color: var(--color-highlight);">${currentIndex + 1}</span>
                        <i data-lucide="arrow-right" style="color: var(--color-highlight);"></i>
                        <h2 style="font-size: 2rem; color: var(--color-contrast); margin: 0;">${q.title}</h2>
                    </div>
                    
                    ${inputHTML}
                    
                    <div class="flex justify-between items-center mt-4">
                        <button id="prevBtn" class="btn outline" ${currentIndex === 0 ? 'disabled' : ''}><i data-lucide="arrow-left"></i></button>
                        <button id="nextBtn" class="btn primary" style="padding: 1rem 2rem; font-size: 1.1rem;">OK <i data-lucide="check"></i></button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            ${form.settings.loadingBorder ? '<div id="liveLoadingBorder" class="loading-border active" style="transition: clip-path 0.5s ease; border-color: var(--color-highlight);"></div>' : ''}
            <div class="flex flex-col h-full w-full justify-center items-center" style="padding: 2rem; background-color: var(--color-main);">
                ${content}
            </div>
        `;
        
        if (window.lucide) lucide.createIcons();
        updateLoadingBorder();

        // Bind events
        const validateVague = (text) => {
            if (!form.settings.vagueDetector) return true;
            // Vaga: menos que 3 letras, ou apenas números/símbolos repetitivos
            if (text.length < 3) return false;
            if (/^[^a-zA-Z]+$/.test(text)) return false; // Sem letras
            return true;
        };

        const handleNext = () => {
            if (currentIndex >= 0 && currentIndex < totalQuestions) {
                const q = form.questions[currentIndex];
                const input = document.getElementById('qInput');
                if (input) {
                    const val = input.value;
                    if (q.required && !val.trim()) {
                        alert('Resposta obrigatória.');
                        return;
                    }
                    if (val.trim() && !validateVague(val)) {
                        alert('Por favor, forneça uma resposta mais detalhada e válida.');
                        return;
                    }
                    responses[q.id] = val;
                }
            }

            currentIndex++;
            
            // Se chegou no fim
            if (currentIndex === totalQuestions) {
                // Salvar resposta no store local
                store.saveResponse(form.id, responses);
                
                // Mocks de e-mail (alertas para visualização do fluxo)
                if (form.settings.emailClient) {
                    console.log(`E-mail CLIENTE enviado: ${form.settings.emailClientText}`);
                }
                if (form.settings.emailStudio) {
                    console.log(`Alerta STUDIO enviado: Novo preenchimento!`);
                }
            }
            
            renderQuestion();
        };

        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.addEventListener('click', handleNext);

        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentIndex--;
            renderQuestion();
        });

        // Yes/No Quick Select
        document.querySelectorAll('.opt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const q = form.questions[currentIndex];
                responses[q.id] = e.target.getAttribute('data-val');
                handleNext();
            });
        });
    };

    renderQuestion();
};
