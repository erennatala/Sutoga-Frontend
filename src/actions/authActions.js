export const SET_TOKEN = "SET_TOKEN";
export const SET_USER_NAME = "SET_USER_NAME"
export const setToken = (token) => {
    return {
        type: SET_TOKEN,
        payload: token,
    };
};

export const setUserName = (userName) => {
    return {
        type: SET_USER_NAME,
        payload: userName
    };
};
export const logout = () => ({
    type: 'LOGOUT',
});