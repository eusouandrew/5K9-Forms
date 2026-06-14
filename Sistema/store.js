// State management using localStorage
export const store = {
    getUser: () => JSON.parse(localStorage.getItem('5k9_user')),
    setUser: (user) => localStorage.setItem('5k9_user', JSON.stringify(user)),
    logout: () => localStorage.removeItem('5k9_user'),
    
    getQuestions: () => JSON.parse(localStorage.getItem('5k9_questions')) || [],
    saveQuestion: (question) => {
        const q = store.getQuestions();
        const index = q.findIndex(x => x.id === question.id);
        if (index > -1) {
            q[index] = question;
        } else {
            question.id = question.id || crypto.randomUUID();
            q.push(question);
        }
        localStorage.setItem('5k9_questions', JSON.stringify(q));
    },
    deleteQuestion: (id) => {
        const q = store.getQuestions().filter(x => x.id !== id);
        localStorage.setItem('5k9_questions', JSON.stringify(q));
    },
    
    getForms: () => JSON.parse(localStorage.getItem('5k9_forms')) || [],
    saveForm: (form) => {
        const f = store.getForms();
        const index = f.findIndex(x => x.id === form.id);
        if (index > -1) {
            f[index] = form;
        } else {
            form.id = form.id || crypto.randomUUID();
            form.createdAt = new Date().toISOString();
            f.push(form);
        }
        localStorage.setItem('5k9_forms', JSON.stringify(f));
    },
    getForm: (id) => store.getForms().find(f => f.id === id),
    deleteForm: (id) => {
        const f = store.getForms().filter(x => x.id !== id);
        localStorage.setItem('5k9_forms', JSON.stringify(f));
        // Limpa também as respostas associadas ao formulário
        localStorage.removeItem(`5k9_responses_${id}`);
    },

    getResponses: (formId) => JSON.parse(localStorage.getItem(`5k9_responses_${formId}`)) || [],
    saveResponse: (formId, response) => {
        const r = store.getResponses(formId);
        r.push({...response, id: crypto.randomUUID(), date: new Date().toISOString()});
        localStorage.setItem(`5k9_responses_${formId}`, JSON.stringify(r));
    },
    getResponse: (formId, responseId) => store.getResponses(formId).find(r => r.id === responseId),
    updateResponse: (formId, response) => {
        const r = store.getResponses(formId);
        const index = r.findIndex(x => x.id === response.id);
        if (index > -1) {
            r[index] = response;
            localStorage.setItem(`5k9_responses_${formId}`, JSON.stringify(r));
        }
    },
    deleteResponse: (formId, responseId) => {
        const r = store.getResponses(formId).filter(x => x.id !== responseId);
        localStorage.setItem(`5k9_responses_${formId}`, JSON.stringify(r));
    },

    // ─────────────────────────────────────────────────────────────────
    // PRESENÇA / USUÁRIOS ONLINE
    // PLACEHOLDER: hoje funciona localmente. Para presença real entre
    // máquinas, troque getOnlineUsers() por uma chamada ao backend
    // (WebSocket/Firebase/Supabase presence). O resto da UI já consome
    // este formato: [{ name, email, initials, color, online }].
    // ─────────────────────────────────────────────────────────────────
    getTeam: () => JSON.parse(localStorage.getItem('5k9_team')) || [
        { name: 'Ana Klein',      email: 'ana@5k9.studio',     color: '#e1bee7' },
        { name: 'João Dias',      email: 'joao@5k9.studio',    color: '#c5cae9' },
        { name: 'Marina Bastos',  email: 'marina@5k9.studio',  color: '#ffcc80' },
        { name: 'Rafael Costa',   email: 'rafael@5k9.studio',  color: '#a5d6a7' },
        { name: 'Beatriz Lima',   email: 'bia@5k9.studio',     color: '#ef9a9a' },
    ],
    setTeam: (team) => localStorage.setItem('5k9_team', JSON.stringify(team)),

    // Marca o usuário atual como "visto agora"
    heartbeat: () => {
        const u = store.getUser();
        if (!u) return;
        const seen = JSON.parse(localStorage.getItem('5k9_presence')) || {};
        seen[u.email] = Date.now();
        localStorage.setItem('5k9_presence', JSON.stringify(seen));
    },

    // Retorna o time com flag online. PLACEHOLDER: considera "online"
    // quem teve heartbeat nos últimos 5 min (no localStorage local).
    // Substitua por presença real do backend quando disponível.
    getOnlineUsers: () => {
        const team = store.getTeam();
        const seen = JSON.parse(localStorage.getItem('5k9_presence')) || {};
        const current = store.getUser();
        const FIVE_MIN = 5 * 60 * 1000;
        const now = Date.now();
        return team.map(member => {
            const initials = member.name.split(' ').map(s => s.charAt(0)).slice(0,2).join('').toUpperCase();
            const isCurrent = current && current.email === member.email;
            const lastSeen = seen[member.email];
            const online = isCurrent || (lastSeen && (now - lastSeen) < FIVE_MIN);
            return { ...member, initials, online, isCurrent };
        });
    }
};
