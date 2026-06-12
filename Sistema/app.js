import { renderLogin } from './pages/login.js';
import { renderHome } from './pages/home.js';
import { renderForms } from './pages/forms.js';
import { renderQuestions } from './pages/questions.js';
import { renderEditor } from './pages/editor.js';
import { renderLiveForm } from './pages/liveform.js';
import { renderFormsAI } from './pages/formsai.js';
import { renderResponses } from './pages/responses.js';
import { renderResponseDetail } from './pages/responsedetail.js';
import { renderSettings } from './pages/settings.js';
import { store } from './store.js';
import { theme } from './theme.js';

const app = document.getElementById('app');

// Inicializa o tema (claro/escuro) antes de qualquer render
theme.init();

// Resolve qual página renderizar para um dado path
const resolve = (path) => {
    if (path === '/login')                       return () => renderLogin(app);
    if (path === '/')                            return () => renderHome(app);
    if (path === '/forms')                       return () => renderForms(app);
    if (path === '/questions')                   return () => renderQuestions(app);
    if (path.startsWith('/forms/edit/'))         return () => renderEditor(app, path.split('/')[3]);
    if (path.startsWith('/f/'))                  return () => renderLiveForm(app, path.split('/')[2]);
    if (path.startsWith('/forms/ai/'))           return () => renderFormsAI(app, path.split('/')[3]);
    if (path.startsWith('/forms/responses/'))    return () => renderResponses(app, path.split('/')[3]);
    if (path.startsWith('/response/'))           return () => renderResponseDetail(app, path.split('/')[2]);
    if (path === '/settings')                    return () => renderSettings(app);
    return null;
};

let currentPath = null;

// SPA Router com transição suave (fade) entre páginas
const router = () => {
    const path = window.location.hash.slice(1) || '/';

    // Guard de autenticação
    if (!store.getUser() && path !== '/login' && !path.startsWith('/f/')) {
        window.location.hash = '/login';
        return;
    }

    // Evita re-render desnecessário do mesmo path
    if (path === currentPath) return;

    const renderFn = resolve(path);

    const doRender = () => {
        app.innerHTML = '';
        if (renderFn) {
            renderFn();
        } else {
            app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;width:100%;font-family:\'Instrument Sans\';"><h2>Página não encontrada</h2></div>';
        }
        // (Re)inicializa ícones após render
        requestAnimationFrame(() => {
            if (window.lucide) lucide.createIcons();
            // fade-in da nova página
            app.classList.remove('page-leaving');
            app.classList.add('page-entering');
        });
        currentPath = path;
    };

    // Fade-out rápido da página atual, depois troca
    if (currentPath !== null) {
        app.classList.add('page-leaving');
        setTimeout(doRender, 120);
    } else {
        doRender();
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export { router };
