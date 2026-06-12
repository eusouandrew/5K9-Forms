export const renderSidebar = (container, currentPath) => {
    if (localStorage.getItem('sidebar_expanded') === null) {
        localStorage.setItem('sidebar_expanded', 'false');
    }
    const isExpanded = localStorage.getItem('sidebar_expanded') === 'true';

    container.innerHTML = `
        <div class="sidebar-wrapper" style="position: fixed; top: 0; left: 0; z-index: 100; display: flex; height: calc(100vh - 32px); margin: 16px 0 16px 16px; border-radius: 16px; border: 1px solid rgba(1,1,1,0.08); overflow: hidden; background-color: #DFDFE3; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); width: ${isExpanded ? '544px' : '64px'};">
            
            <!-- LAYER 1 — ICON RAIL (64px) -->
            <div style="width: 64px; background-color: #DFDFE3; border-right: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; align-items: center; padding: 20px 0; flex-shrink: 0;">
                <div id="sidebar-toggle" style="font-size: 22px; color: #010101; line-height: 1; cursor: pointer;" title="Toggle Menu">✦</div>
                
                <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 6px; width: 100%; align-items: center;">
                    <!-- Active Icon -->
                    <div style="width: 36px; height: 36px; border-radius: 12px; background-color: #F0F0F2; border: 1px solid #DFDFE3; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <i data-lucide="layout-dashboard" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                    </div>
                    <!-- Inactive Icons -->
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.6; cursor: pointer;">
                        <i data-lucide="search" style="width: 20px; height: 20px; color: #010101;"></i>
                    </div>
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.6; cursor: pointer;">
                        <i data-lucide="bell" style="width: 20px; height: 20px; color: #010101;"></i>
                    </div>
                </div>

                <div style="margin-top: auto; display: flex; flex-direction: column; gap: 6px; width: 100%; align-items: center;">
                    <div style="width: 32px; border-top: 1px solid rgba(1,1,1,0.08); margin: 8px 0;"></div>
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.6; cursor: pointer;">
                        <i data-lucide="settings" style="width: 20px; height: 20px; color: #010101;"></i>
                    </div>
                    <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; opacity: 0.6; cursor: pointer;">
                        <i data-lucide="log-out" style="width: 20px; height: 20px; color: #010101;"></i>
                    </div>
                </div>
            </div>

            <!-- LAYER 2 — NAV MENU (240px) -->
            <div style="width: 240px; background-color: #F0F0F2; border-right: 1px solid rgba(1,1,1,0.08); display: flex; flex-direction: column; flex-shrink: 0;">
                <div style="padding: 20px; display: flex; align-items: center; gap: 8px;">
                    <div style="font-size: 16px; color: #010101; line-height: 1;">✦</div>
                    <span style="font-size: 18px; font-weight: 600; color: #010101;">Menu</span>
                </div>
                
                <div style="padding: 0 16px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto;">
                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101;">
                        <i data-lucide="home" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Home</span>
                    </a>

                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101; position: relative;">
                        <div style="position: relative;">
                            <i data-lucide="message-square" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                            <div style="position: absolute; top: -2px; right: -2px; width: 6px; height: 6px; border-radius: 50%; background-color: #7F00E1;"></div>
                        </div>
                        <span style="font-size: 14px; font-weight: 400; flex: 1;">Messages</span>
                        <div style="background-color: #010101; color: #F0F0F2; font-size: 11px; height: 18px; padding: 0 6px; border-radius: 100px; display: flex; align-items: center; justify-content: center; font-weight: 600;">2</div>
                    </a>

                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101;">
                        <i data-lucide="plug" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                        <span style="font-size: 14px; font-weight: 400; flex: 1;">Integrations</span>
                        <span style="font-size: 14px; color: rgba(1,1,1,0.4);">+</span>
                    </a>

                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101;">
                        <i data-lucide="dollar-sign" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Finance</span>
                    </a>

                    <!-- Active Item -->
                    <div style="display: flex; flex-direction: column;">
                        <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; background-color: #010101; color: #F0F0F2;">
                            <i data-lucide="message-circle" style="width: 20px; height: 20px; color: #F0F0F2; stroke-width: 2px;"></i>
                            <span style="font-size: 14px; font-weight: 600; flex: 1;">Threads</span>
                            <span style="font-size: 14px; color: rgba(240,240,242,0.6);">−</span>
                        </a>
                        
                        <div style="display: flex; flex-direction: column; margin-left: 21px; padding-top: 4px; border-left: 1px solid #DFDFE3;">
                            <a href="#" style="display: flex; align-items: center; height: 32px; padding-left: 20px; font-size: 13px; color: #010101; text-decoration: none;">Fignuts</a>
                            <a href="#" style="display: flex; align-items: center; height: 32px; padding-left: 20px; font-size: 13px; font-weight: 600; color: #010101; text-decoration: none;">Enlarz System</a>
                            <a href="#" style="display: flex; align-items: center; height: 32px; padding-left: 20px; font-size: 13px; color: #010101; text-decoration: none;">Hugeicons</a>
                        </div>
                    </div>

                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101;">
                        <i data-lucide="users" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Contacts</span>
                    </a>

                    <a href="#" class="layer2-item" style="display: flex; align-items: center; gap: 12px; padding: 0 12px; height: 40px; border-radius: 12px; text-decoration: none; color: #010101;">
                        <i data-lucide="compass" style="width: 20px; height: 20px; color: #010101; stroke-width: 2px;"></i>
                        <span style="font-size: 14px; font-weight: 400; flex: 1;">Explore</span>
                        <span style="font-size: 14px; color: rgba(1,1,1,0.4);">+</span>
                    </a>
                </div>
            </div>

            <!-- LAYER 3 — CONTEXT PANEL (240px) -->
            <div style="width: 240px; background-color: #DFDFE3; display: flex; flex-direction: column; padding: 20px; gap: 24px; flex-shrink: 0;">
                
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="archive" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Archive</span>
                    </a>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="heart" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Favourite's</span>
                    </a>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 10px; margin-bottom: 4px;">
                        <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.5);">Drafts (3)</span>
                        <i data-lucide="pin" style="width: 14px; height: 14px; color: rgba(1,1,1,0.5);"></i>
                    </div>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">General</span>
                    </a>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Drafts</span>
                    </a>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Feedback</span>
                    </a>
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 10px; margin-bottom: 4px;">
                        <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: rgba(1,1,1,0.5);">Folders (6)</span>
                        <i data-lucide="folder-plus" style="width: 14px; height: 14px; color: rgba(1,1,1,0.5);"></i>
                    </div>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Stroke LLC</span>
                    </a>
                    
                    <a href="#" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101; background-color: #F0F0F2; border: 1px solid #DFDFE3;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px; color: #7F00E1;"></i>
                        <span style="font-size: 14px; font-weight: 600;">Duotone</span>
                    </a>
                    
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Solid</span>
                    </a>
                    <a href="#" class="layer3-item" style="display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 10px; text-decoration: none; color: #010101;">
                        <i data-lucide="folder" style="width: 18px; height: 18px; stroke-width: 1.5px;"></i>
                        <span style="font-size: 14px; font-weight: 400;">Animations</span>
                    </a>
                </div>

            </div>
        </div>
    `;
    
    if (!document.getElementById('sidebar-styles')) {
        const style = document.createElement('style');
        style.id = 'sidebar-styles';
        style.textContent = `
            .layer2-item:hover { background-color: #DFDFE3; }
            .layer3-item:hover { background-color: #F0F0F2; }
        `;
        document.head.appendChild(style);
    }

    // Toggle event listener
    const toggleBtn = container.querySelector('#sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = localStorage.getItem('sidebar_expanded') === 'true';
            localStorage.setItem('sidebar_expanded', !current);
            renderSidebar(container, currentPath);
            if (window.lucide) lucide.createIcons();
        });
    }
};
