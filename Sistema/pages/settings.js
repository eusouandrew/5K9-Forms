import { renderSidebar } from '../components/sidebar.js';
import { store } from '../store.js';
import { theme } from '../theme.js';

export const renderSettings = (container) => {

    const user = store.getUser() || { name: 'Usuário', email: 'usuario@5k9.studio' };
    const initials = user.name.split(' ').map(s => s.charAt(0)).slice(0,2).join('').toUpperCase() || '?';

    const renderLayout = () => {
        container.innerHTML = `
            <div class="page-container animate-fade-in" style="display: flex; height: 100vh; overflow: hidden; background-color: #F0F0F2; font-family: 'Instrument Sans', sans-serif;">
                
                <div id="sidebar-container"></div>
                
                <div style="flex: 1; height: 100vh; overflow-y: auto; padding: 32px 48px; padding-left: 112px;">
                    <div style="display: flex; flex-direction: column; gap: 32px; max-width: 1000px; margin: 0 auto;">
                        
                        <!-- TOP BAR -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 style="font-size: 24px; font-weight: 700; color: #010101; margin: 0;">Configurações</h2>
                        </div>

                        <!-- TWO-COLUMN LAYOUT -->
                        <div style="display: flex; gap: 16px; align-items: flex-start;">
                            
                            <!-- LEFT COLUMN (Nav) -->
                            <div style="width: 240px; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); padding: 16px; display: flex; flex-direction: column; flex-shrink: 0;">

                                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45); margin-bottom: 8px; padding-left: 8px;">CONTA</div>
                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <div class="nav-item active" data-section="perfil">
                                        <div class="active-accent"></div>
                                        <i data-lucide="user" style="width: 18px; height: 18px;"></i>
                                        <span>Perfil</span>
                                    </div>
                                    <div class="nav-item" data-section="notificacoes">
                                        <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
                                        <span>Notificações</span>
                                    </div>
                                    <div class="nav-item" data-section="aparencia">
                                        <i data-lucide="palette" style="width: 18px; height: 18px;"></i>
                                        <span>Aparência</span>
                                    </div>
                                </div>

                            </div>

                            <!-- RIGHT COLUMN (Content) -->
                            <div style="flex: 1; background-color: #DFDFE3; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; overflow: hidden;">
                                
                                <!-- HEADER -->
                                <div style="padding: 24px; border-bottom: 1px solid #DFDFE3;">
                                    <h3 style="font-size: 18px; font-weight: 700; color: #010101; margin: 0 0 4px 0;">Perfil</h3>
                                    <p style="font-size: 13px; color: rgba(1,1,1,0.45); margin: 0;">Informações pessoais e de acesso.</p>
                                </div>

                                <!-- BODY -->
                                <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
                                    
                                    <!-- AVATAR ROW -->
                                    <div style="display: flex; align-items: center; gap: 16px;">
                                        <div style="width: 72px; height: 72px; border-radius: 50%; background-color: #F0F0F2; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #010101;">
                                            ${initials}
                                        </div>
                                        <div style="display: flex; flex-direction: column; gap: 4px;">
                                            <div style="font-size: 15px; font-weight: 600; color: #010101;">${user.name}</div>
                                            <div style="font-size: 13px; color: rgba(1,1,1,0.45);">${user.email}</div>
                                            <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">
                                                <button class="ghost-btn" style="height: 32px; border-radius: 10px; font-size: 12px; padding: 0 12px;">Alterar foto</button>
                                                <button style="background: none; border: none; font-size: 12px; color: rgba(1,1,1,0.4); cursor: pointer; padding: 0; transition: color 0.2s;" class="remove-btn-hover">Remover</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- FIELD ROWS -->
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                        ${renderField('Nome completo', user.name)}
                                        ${renderField('E-mail', user.email, 'email')}
                                        ${renderField('Cargo', 'Membro')}
                                        ${renderField('Empresa', '5K9 Studio')}
                                    </div>

                                    <!-- NOTIFICATIONS SUB-SECTION -->
                                    <div style="border-top: 1px solid #DFDFE3; padding-top: 16px; margin-top: 12px;">
                                        <div style="font-size: 13px; font-weight: 600; color: #010101; margin-bottom: 12px;">Notificações</div>
                                        
                                        <div style="display: flex; flex-direction: column;">
                                            ${renderToggleRow('Novo formulário criado', true)}
                                            ${renderToggleRow('Nova resposta recebida', true)}
                                            ${renderToggleRow('Resumo semanal por e-mail', false)}
                                            ${renderToggleRow('Atualizações do sistema', false, true)}
                                        </div>
                                    </div>

                                </div>

                                <!-- SAVE ROW -->
                                <div style="border-top: 1px solid #DFDFE3; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; background-color: #DFDFE3;">
                                    <div style="font-size: 12px; color: rgba(1,1,1,0.35);">Alterações não salvas</div>
                                    <button class="save-pill-btn">Salvar alterações</button>
                                </div>

                            </div>
                        </div>

                        <div style="height: 32px;"></div>
                    </div>
                </div>
            </div>

            <style>
                .nav-item {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    border-radius: 12px;
                    padding: 0 8px;
                    gap: 10px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #010101;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    position: relative;
                }
                .nav-item:hover:not(.active) {
                    background-color: #F0F0F2;
                }
                .nav-item.active {
                    background-color: #010101;
                    color: #F0F0F2;
                    font-weight: 600;
                }
                .active-accent {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background-color: #7F00E1;
                    border-radius: 0 4px 4px 0;
                }

                .nav-divider {
                    height: 1px;
                    background-color: #DFDFE3;
                    margin: 12px 0;
                }

                .ghost-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                    border: 1px solid rgba(1,1,1,0.1);
                    color: #010101;
                    font-family: 'Instrument Sans', sans-serif;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .ghost-btn:hover { background-color: rgba(1,1,1,0.05); }

                .remove-btn-hover:hover { color: #010101 !important; }

                .field-input {
                    width: 100%;
                    height: 44px;
                    background-color: #F0F0F2;
                    border: 1px solid #DFDFE3;
                    border-radius: 10px;
                    padding: 0 12px;
                    font-size: 14px;
                    font-family: 'Instrument Sans', sans-serif;
                    color: #010101;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .field-input:focus {
                    border-color: #010101;
                }

                /* Toggle Switch CSS */
                .toggle-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 44px;
                    border-bottom: 1px solid #DFDFE3;
                }
                .toggle-row.last { border-bottom: none; }
                
                .toggle-switch {
                    width: 36px;
                    height: 20px;
                    border-radius: 100px;
                    position: relative;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .toggle-switch.on { background-color: #7F00E1; }
                .toggle-switch.off { background-color: #DFDFE3; border: 1px solid rgba(1,1,1,0.1); }
                
                .toggle-dot {
                    position: absolute;
                    top: 2px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    transition: transform 0.3s, background-color 0.3s;
                }
                .toggle-switch.on .toggle-dot {
                    background-color: #F0F0F2;
                    transform: translateX(18px);
                }
                .toggle-switch.off .toggle-dot {
                    background-color: rgba(1,1,1,0.4);
                    transform: translateX(1px);
                    top: 1px;
                }

                .save-pill-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    padding: 0 24px;
                    border-radius: 100px;
                    background-color: #010101;
                    color: #F0F0F2;
                    font-size: 13px;
                    font-weight: 600;
                    font-family: 'Instrument Sans', sans-serif;
                    cursor: pointer;
                    border: none;
                    transition: opacity 0.2s;
                }
                .save-pill-btn:hover { opacity: 0.9; }
            </style>
        `;

        renderSidebar(document.getElementById('sidebar-container'), '/settings');
        if (window.lucide) lucide.createIcons();

        // Toggle interativo
        const toggles = container.querySelectorAll('.toggle-switch');
        toggles.forEach(t => {
            t.addEventListener('click', () => {
                t.classList.toggle('on');
                t.classList.toggle('off');
            });
        });

        // Troca de seção no menu lateral (visual: marca ativo)
        const navItems = container.querySelectorAll('.nav-item[data-section]');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(n => {
                    n.classList.remove('active');
                    const acc = n.querySelector('.active-accent');
                    if (acc) acc.remove();
                });
                item.classList.add('active');
                if (!item.querySelector('.active-accent')) {
                    const acc = document.createElement('div');
                    acc.className = 'active-accent';
                    item.prepend(acc);
                }
                const section = item.dataset.section;
                if (section === 'aparencia') {
                    // Alterna o tema diretamente
                    const isDark = theme.get() === 'dark';
                    if (confirm(`Tema atual: ${isDark ? 'escuro' : 'claro'}. Deseja alternar?`)) {
                        theme.toggle();
                        renderLayout();
                    }
                }
            });
        });

        // Salvar alterações de perfil
        const saveBtn = container.querySelector('.save-pill-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const inputs = container.querySelectorAll('.field-input');
                const newName = inputs[0]?.value?.trim();
                const newEmail = inputs[1]?.value?.trim();
                if (newName && newEmail) {
                    store.setUser({ ...user, name: newName, email: newEmail });
                    alert('Alterações salvas!');
                    renderLayout();
                }
            });
        }
    };

    const renderField = (label, value, type="text") => {
        return `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.45);">${label}</label>
                <input type="${type}" class="field-input" value="${value}">
            </div>
        `;
    };

    const renderToggleRow = (label, isOn, isLast=false) => {
        return `
            <div class="toggle-row ${isLast ? 'last' : ''}">
                <span style="font-size: 13px; font-weight: 400; color: #010101;">${label}</span>
                <div class="toggle-switch ${isOn ? 'on' : 'off'}">
                    <div class="toggle-dot"></div>
                </div>
            </div>
        `;
    };

    renderLayout();
};
