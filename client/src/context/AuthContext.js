import { createContext, useReducer, useEffect } from "react";

export const AuthContext  = createContext(); // creating a new context

/* Change the information of AuthContext */
export const authRedeucer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };

        case 'LOGOUT':
            return { user: null };

        default:
            return state;
    }
}

/* Where I actully use the context and passing it to the children */
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authRedeucer, {user: null});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []);

    console.log('AuthContext: ', state);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}