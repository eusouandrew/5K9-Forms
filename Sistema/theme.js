// ───────────────────────────────────────────────────────────────────────────
// theme.js — Gerenciador de tema (claro/escuro) do 5K9 Forms
// Estratégia: como o sistema usa cores hardcoded inline (#F0F0F2, #DFDFE3,
// #010101) em centenas de pontos, o dark mode é aplicado via um <style>
// global que mira exatamente esses valores conhecidos. Zero alteração nas
// páginas — basta alternar o atributo data-theme no <html>.
// ───────────────────────────────────────────────────────────────────────────

export const theme = {
    get: () => localStorage.getItem('5k9_theme') || 'light',
    set: (value) => {
        localStorage.setItem('5k9_theme', value);
        theme.apply();
    },
    toggle: () => {
        theme.set(theme.get() === 'dark' ? 'light' : 'dark');
    },
    apply: () => {
        document.documentElement.setAttribute('data-theme', theme.get());
    },
    init: () => {
        theme.apply();
        if (!document.getElementById('theme-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-overlay-styles';
            style.textContent = THEME_CSS;
            document.head.appendChild(style);
        }
    }
};

// Paleta dark — derivada da identidade 5K9 mantendo o roxo de destaque
// light  -> dark
// #F0F0F2 (fundo principal)   -> #121214
// #DFDFE3 (superfícies/cards)  -> #1E1E22
// #010101 (texto/contraste)    -> #F0F0F2
// #7F00E1 (destaque)           -> #9B3DFF (levemente mais claro p/ contraste)

const THEME_CSS = `
/* ====== DARK MODE OVERLAY ====== */
html[data-theme="dark"] body { background-color: #121214; color: #E8E8EC; }

/* Catch-all: por padrão, todo texto no dark é claro. Regras específicas
   abaixo re-escurecem o que estiver sobre fundos claros (botões etc). */
html[data-theme="dark"] #app,
html[data-theme="dark"] #app * {
    color: #E8E8EC;
}
/* Placeholders e textos auxiliares um tom abaixo */
html[data-theme="dark"] #app *::placeholder { color: rgba(232,232,236,0.4) !important; }

/* Backgrounds principais (#F0F0F2) */
html[data-theme="dark"] [style*="background-color: #F0F0F2"],
html[data-theme="dark"] [style*="background-color:#F0F0F2"],
html[data-theme="dark"] [style*="background: #F0F0F2"] {
    background-color: #1E1E22 !important;
}

/* Superfícies / cards (#DFDFE3) */
html[data-theme="dark"] [style*="background-color: #DFDFE3"],
html[data-theme="dark"] [style*="background-color:#DFDFE3"],
html[data-theme="dark"] [style*="background: #DFDFE3"] {
    background-color: #2A2A30 !important;
}

/* Fundos brancos puros (#fff / #ffffff / white) -> superfície escura,
   com texto escuro forçado a claro */
html[data-theme="dark"] [style*="background-color: #fff"],
html[data-theme="dark"] [style*="background-color:#fff"],
html[data-theme="dark"] [style*="background-color: #FFFFFF"],
html[data-theme="dark"] [style*="background-color: white"],
html[data-theme="dark"] [style*="background: #fff"],
html[data-theme="dark"] [style*="background: white"] {
    background-color: #2A2A30 !important;
}

/* Page containers que usam #F0F0F2 como fundo de tela inteira */
html[data-theme="dark"] .page-container[style*="#F0F0F2"] { background-color: #121214 !important; }

/* Texto preto (#010101) -> claro legível */
html[data-theme="dark"] [style*="color: #010101"],
html[data-theme="dark"] [style*="color:#010101"] {
    color: #E8E8EC !important;
}

/* Fundos pretos (#010101) — botões primários, avatares, itens ativos.
   No dark eles ficam CLAROS (#F0F0F2) para manter o contraste invertido. */
html[data-theme="dark"] [style*="background-color: #010101"],
html[data-theme="dark"] [style*="background-color:#010101"],
html[data-theme="dark"] [style*="background: #010101"] {
    background-color: #F0F0F2 !important;
}
/* Conteúdo DENTRO de fundos pretos (que era claro) volta a ser escuro,
   incluindo ícones — o quadrado de seleção é branco, então ícone preto.
   IMPORTANTE: incluímos o PRÓPRIO elemento (não só os filhos), pois o
   texto pode estar diretamente nele (ex: botão "Novo Formulário"). */
html[data-theme="dark"] [style*="background-color: #010101"],
html[data-theme="dark"] [style*="background-color:#010101"],
html[data-theme="dark"] [style*="background: #010101"],
html[data-theme="dark"] [style*="background-color: #010101"] *,
html[data-theme="dark"] [style*="background-color:#010101"] * {
    color: #121214 !important;
}
html[data-theme="dark"] [style*="background-color: #010101"] svg,
html[data-theme="dark"] [style*="background-color:#010101"] svg {
    color: #121214 !important;
    stroke: #121214 !important;
}

/* Item ativo da sidebar (rail-icon--active tem fundo claro): ícone preto */
html[data-theme="dark"] .rail-icon--active svg { color: #121214 !important; stroke: #121214 !important; }
html[data-theme="dark"] .nav-item--active,
html[data-theme="dark"] .nav-item--active * { color: #121214 !important; }
html[data-theme="dark"] .nav-item--active svg { stroke: #121214 !important; }

/* Ícones lucide pretos genéricos -> claros (quando NÃO estão em fundo claro) */
html[data-theme="dark"] [style*="color: #010101"] svg { color: #E8E8EC !important; stroke: #E8E8EC !important; }

/* O lucide copia o style inline do <i> para o <svg>. Então svg/i com
   color preto no PRÓPRIO elemento também precisa virar claro.
   Exceção: dentro de um fundo que virou claro (botão preto->claro),
   que é tratado pela regra de [background-color: #010101] svg acima. */
html[data-theme="dark"] svg[style*="color: #010101"],
html[data-theme="dark"] i[style*="color: #010101"],
html[data-theme="dark"] svg[style*="color:#010101"] {
    color: #E8E8EC !important; stroke: #E8E8EC !important;
}
/* Reafirma: ícones dentro de botões/superfícies CLARAS (que eram #010101)
   permanecem escuros, sobrescrevendo a regra acima. */
html[data-theme="dark"] [style*="background-color: #010101"] svg[style*="color: #010101"],
html[data-theme="dark"] [style*="background-color:#010101"] svg[style*="color: #010101"] {
    color: #121214 !important; stroke: #121214 !important;
}

/* Texto muted (rgba preto) -> cinza claro legível dentro dos cards */
html[data-theme="dark"] [style*="rgba(1,1,1,0.6)"],
html[data-theme="dark"] [style*="rgba(1,1,1,0.5)"],
html[data-theme="dark"] [style*="rgba(1,1,1,0.45)"],
html[data-theme="dark"] [style*="rgba(1,1,1,0.4)"],
html[data-theme="dark"] [style*="rgba(1,1,1,0.35)"],
html[data-theme="dark"] [style*="rgba(1,1,1,0.3)"] {
    color: rgba(232,232,236,0.6) !important;
}

/* Borda 1px sólida #DFDFE3 */
html[data-theme="dark"] [style*="border: 1px solid #DFDFE3"],
html[data-theme="dark"] [style*="border:1px solid #DFDFE3"] {
    border-color: #34343C !important;
}

/* Variáveis globais para componentes que usam var() */
html[data-theme="dark"] {
    --color-main: #121214;
    --color-sub: #2A2A30;
    --color-contrast: #ECECEE;
    --color-card-bg: #1E1E22;
    --color-muted: rgba(240,240,242,0.6);
    --color-placeholder: rgba(240,240,242,0.4);
}

/* Scrollbar no dark */
html[data-theme="dark"] ::-webkit-scrollbar-thumb { background: #34343C; }
html[data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #44444C; }

/* Sidebar wrapper no dark */
html[data-theme="dark"] #sidebar-wrapper { background-color: #1E1E22 !important; }

/* Transição suave ao alternar tema */
html[data-theme="dark"] body,
html[data-theme="dark"] [style*="background"],
html[data-theme="light"] body {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
`;
