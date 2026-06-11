import { store } from '../store.js';

export const renderLogin = (container) => {
    container.innerHTML = `
        <div class="flex items-center justify-center h-full w-full animate-fade-in" style="background-color: var(--color-sub);">
            <div class="floating-card" style="width: 100%; max-width: 400px;">
                <div class="flex flex-col items-center gap-4 mb-8">
                    <img src="Logo.svg" alt="5K9 Forms Logo" class="logo" style="height: 48px;">
                    <h2 style="color: var(--color-contrast);">Bem-vindo ao 5K9 Forms</h2>
                    <p style="text-align: center; font-size: 0.9rem;">Por favor, identifique-se para acessar o sistema.</p>
                </div>
                <form id="loginForm" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="name" style="font-size: 0.85rem; font-weight: 500;">Nome Completo</label>
                        <input type="text" id="name" class="input-field" placeholder="Seu nome" required>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="email" style="font-size: 0.85rem; font-weight: 500;">E-mail</label>
                        <input type="email" id="email" class="input-field" placeholder="seu@email.com" required>
                    </div>
                    <button type="submit" class="btn primary justify-center mt-4">Entrar <i data-lucide="arrow-right"></i></button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        store.setUser({ name, email });
        window.location.hash = '/';
    });
};
