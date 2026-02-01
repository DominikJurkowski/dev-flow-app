const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    ASK_QUESTION: '/ask-question',
    TAGS: (id: string) => `/tags/${id}`,
    PROFILE: (id: string) => `/profile/${id}`,
    QUESTION: (id: string) => `/question/${id}`,
};

export default ROUTES;
