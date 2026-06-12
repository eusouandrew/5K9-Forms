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
    
    getResponses: (formId) => JSON.parse(localStorage.getItem(`5k9_responses_${formId}`)) || [],
    saveResponse: (formId, response) => {
        const r = store.getResponses(formId);
        r.push({...response, id: crypto.randomUUID(), date: new Date().toISOString()});
        localStorage.setItem(`5k9_responses_${formId}`, JSON.stringify(r));
    }
};
