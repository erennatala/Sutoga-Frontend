export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_NAME = 'SET_USER_NAME';

export const setAuthenticated = (isAuthenticated) => ({
    type: SET_AUTHENTICATED,
    payload: isAuthenticated,
});

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

export const setUserName = (userName) => ({
    type: SET_USER_NAME,
    payload: userName,
});

export const logout = () => ({
    type: 'LOGOUT',
});