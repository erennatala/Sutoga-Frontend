import { SET_AUTHENTICATED, SET_TOKEN, SET_USER_NAME } from '../actions/authActions';

const initialState = {
    isAuthenticated: false,
    token: null,
    userName: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload,
            };
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case SET_USER_NAME:
            return {
                ...state,
                userName: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
