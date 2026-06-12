import { store } from '../store.js';

export const renderLogin = (container) => {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
            
            <div style="position: relative; width: 100%; max-width: 480px; background-color: #DFDFE3; border-radius: 20px; border: 1px solid rgba(1,1,1,0.08); padding: 48px; display: flex; flex-direction: column;">
                
                <!-- Accent Detail (Top Line) -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background-color: #7F00E1; border-top-left-radius: 20px; border-top-right-radius: 20px;"></div>

                <!-- Logo -->
                <div style="display: flex; justify-content: center; width: 100%;">
                    <!-- Using text as logotype fallback if SVG is external to ensure it perfectly respects color and font weight -->
                    <div style="height: 32px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: #010101; letter-spacing: -0.05em;">
                        5K9 Forms
                    </div>
                </div>

                <!-- Divider -->
                <div style="width: 100%; height: 1px; background-color: rgba(1,1,1,0.08); margin-top: 16px;"></div>

                <!-- Text Content -->
                <h2 style="font-size: 24px; font-weight: 700; color: #010101; text-align: center; margin: 28px 0 0 0;">
                    Bem-vindo ao 5K9 Forms
                </h2>
                
                <p style="font-size: 14px; color: rgba(1,1,1,0.5); text-align: center; line-height: 1.6; max-width: 360px; margin: 12px auto 0 auto;">
                    Informe seu nome e e-mail para entrar. Você receberá notificações quando formulários forem criados ou preenchidos.
                </p>

                <!-- Form -->
                <form id="loginForm" style="display: flex; flex-direction: column; gap: 16px; margin-top: 28px;">
                    
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label for="name" style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.5);">Nome completo</label>
                        <input type="text" id="name" class="login-input" placeholder="Como podemos te chamar?" required>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label for="email" style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.5);">E-mail</label>
                        <input type="email" id="email" class="login-input" placeholder="seu@email.com" required>
                    </div>

                    <div style="margin-top: 24px;">
                        <button type="submit" style="width: 100%; height: 52px; border-radius: 100px; background-color: #010101; color: #F0F0F2; font-size: 16px; font-weight: 600; letter-spacing: 0.01em; border: none; cursor: pointer; transition: opacity 0.2s;">
                            Entrar
                        </button>
                        <p style="font-size: 12px; color: rgba(1,1,1,0.35); text-align: center; margin-top: 12px;">
                            Sem senha necessária. Apenas nome e e-mail.
                        </p>
                    </div>

                </form>

            </div>

            <!-- Page Footer -->
            <div style="margin-top: 20px; font-size: 11px; color: rgba(1,1,1,0.3); text-align: center;">
                5K9 Studio © 2025
            </div>

            <style>
                .login-input {
                    background-color: #F0F0F2;
                    border: 1px solid #DFDFE3;
                    border-radius: 12px;
                    height: 48px;
                    padding: 0 16px;
                    font-size: 15px;
                    font-family: 'Instrument Sans', sans-serif;
                    color: #010101;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .login-input:focus {
                    border-color: #010101;
                }
                .login-input::placeholder {
                    color: rgba(1,1,1,0.3);
                }
                button[type="submit"]:hover {
                    opacity: 0.9;
                }
            </style>
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
