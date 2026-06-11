import { store } from '../store.js';
import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';

export const renderFormsAI = (container, formId) => {
    const form = store.getForm(formId);
    const responses = store.getResponses(formId);
    
    if (!form) {
        container.innerHTML = '<div class="p-8"><h2>Formulário não encontrado</h2></div>';
        return;
    }

    container.innerHTML = `
        <div class="page-container animate-fade-in">
            <div id="sidebar-container"></div>
            
            <div class="flex-col w-full" style="height: 100vh;">
                <div id="header-container"></div>
                
                <div class="page-content flex-col gap-4">
                    <div class="flex items-center gap-4 mb-4">
                        <i data-lucide="brain" style="color: var(--color-highlight); width: 32px; height: 32px;"></i>
                        <div>
                            <h2 style="color: var(--color-highlight);">Forms AI Analysis</h2>
                            <p style="font-size: 0.9rem;">Análise avançada e senso crítico das respostas do formulário: <strong>${form.title}</strong></p>
                        </div>
                    </div>

                    <div class="flex gap-4 h-full">
                        <div class="floating-card flex-col gap-4" style="width: 300px; padding: 1.5rem; overflow-y: auto;">
                            <h3>Dados</h3>
                            <div class="flex justify-between items-center p-3" style="background: var(--color-main); border-radius: 8px;">
                                <span style="font-size: 0.9rem;">Total de Respostas</span>
                                <span style="font-weight: bold;">${responses.length}</span>
                            </div>
                            <div class="flex justify-between items-center p-3" style="background: var(--color-main); border-radius: 8px;">
                                <span style="font-size: 0.9rem;">Questões no Form</span>
                                <span style="font-weight: bold;">${form.questions.length}</span>
                            </div>
                            <button id="generateAiBtn" class="btn primary mt-4 w-full justify-center">
                                <i data-lucide="sparkles"></i> Gerar Análise AI
                            </button>
                        </div>
                        
                        <div class="floating-card flex-1 flex-col gap-4" style="padding: 1.5rem; overflow-y: auto;">
                            <div id="ai-content">
                                <div class="flex flex-col items-center justify-center h-full text-center p-8" style="color: #888;">
                                    <i data-lucide="bot" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--color-sub);"></i>
                                    <h3>Aguardando Análise</h3>
                                    <p>Clique em "Gerar Análise AI" para processar as ${responses.length} respostas usando a API do Gemini.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderSidebar(document.getElementById('sidebar-container'), '/forms');
    renderHeader(document.getElementById('header-container'), 'Forms AI');

    const aiContent = document.getElementById('ai-content');
    
    document.getElementById('generateAiBtn').addEventListener('click', () => {
        if (responses.length === 0) {
            alert('Não há respostas suficientes para analisar.');
            return;
        }

        aiContent.innerHTML = `
            <div class="flex flex-col items-center justify-center p-8">
                <i data-lucide="loader" class="animate-spin" style="color: var(--color-highlight); width: 32px; height: 32px;"></i>
                <p style="margin-top: 1rem;">A IA está processando as respostas e gerando insights...</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();

        // Simulação do resultado do Gemini
        setTimeout(() => {
            aiContent.innerHTML = `
                <div class="animate-fade-in flex flex-col gap-6">
                    <div style="background-color: var(--color-main); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--color-highlight);">
                        <h3 style="margin-bottom: 0.5rem;">Resumo Executivo</h3>
                        <p style="font-size: 0.95rem;">Com base nas respostas recebidas, nota-se uma forte inclinação dos usuários para abordagens mais visuais. A maioria das respostas reflete um perfil criativo, com prioridades voltadas para design e inovação digital. Não foram detectadas respostas vazias ou vagas neste conjunto.</p>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem; color: var(--color-contrast);">Principais Tópicos Identificados</h3>
                        <div class="flex flex-col gap-3">
                            <div style="padding: 1rem; border: 1px solid var(--color-sub); border-radius: 8px;">
                                <h4 style="color: var(--color-highlight); margin-bottom: 0.25rem;">1. Preferência por Minimalismo</h4>
                                <p style="font-size: 0.9rem; color: #555;">Respostas indicam que interfaces mais limpas e focadas na tipografia geram melhor conversão e percepção de valor.</p>
                            </div>
                            <div style="padding: 1rem; border: 1px solid var(--color-sub); border-radius: 8px;">
                                <h4 style="color: var(--color-highlight); margin-bottom: 0.25rem;">2. Demanda por Interatividade</h4>
                                <p style="font-size: 0.9rem; color: #555;">Usuários citaram frequentemente animações, transições e micro-interações como diferenciais essenciais em suas escolhas.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem; color: var(--color-contrast);">Senso Crítico e Referências</h3>
                        <p style="font-size: 0.95rem; margin-bottom: 1rem;">O modelo de negócio parece estar bem alinhado com as expectativas, porém, recomenda-se explorar mais integrações nativas. Como referência para melhoria, considere estudar o modelo de onboarding do <em>Notion</em> e <em>Linear</em>, que aplicam exatamente esse balanço entre minimalismo e onboarding guiado.</p>
                        
                        <div class="flex items-start gap-2" style="background: #eef2ff; padding: 1rem; border-radius: 8px;">
                            <i data-lucide="lightbulb" style="color: #4f46e5; min-width: 24px;"></i>
                            <p style="font-size: 0.9rem; color: #3730a3; margin: 0;">Dica da IA: Para o próximo questionário, inclua uma pergunta de <strong>Ranking</strong> para priorizar features, o que pode quantificar de forma mais precisa esses insights.</p>
                        </div>
                    </div>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }, 2500);
    });
};
