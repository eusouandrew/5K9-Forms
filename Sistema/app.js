import { renderLogin } from './pages/login.js';
import { renderHome } from './pages/home.js';
import { renderForms } from './pages/forms.js';
import { renderQuestions } from './pages/questions.js';
import { renderEditor } from './pages/editor.js';
import { renderLiveForm } from './pages/liveform.js';
import { renderFormsAI } from './pages/formsai.js';
import { store } from './store.js';

const app = document.getElementById('app');

// Simple SPA Router
const router = () => {
    const path = window.location.hash.slice(1) || '/';
    app.innerHTML = ''; // Clear current content

    // Check auth
    if (!store.getUser() && path !== '/login' && !path.startsWith('/f/')) {
        window.location.hash = '/login';
        return;
    }

    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Routing logic
    if (path === '/login') {
        renderLogin(app);
    } else if (path === '/') {
        renderHome(app);
    } else if (path === '/forms') {
        renderForms(app);
    } else if (path === '/questions') {
        renderQuestions(app);
    } else if (path.startsWith('/forms/edit/')) {
        const id = path.split('/')[3];
        renderEditor(app, id);
    } else if (path.startsWith('/f/')) {
        const id = path.split('/')[2];
        renderLiveForm(app, id);
    } else if (path.startsWith('/forms/ai/')) {
        const id = path.split('/')[3];
        renderFormsAI(app, id);
    } else {
        app.innerHTML = '<div class="flex items-center justify-center h-full w-full"><h2>Página não encontrada</h2></div>';
    }

    // Re-initialize icons after rendering
    setTimeout(() => {
        if (window.lucide) lucide.createIcons();
    }, 0);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export { router };
