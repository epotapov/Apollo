import { createContext, useEffect, useReducer } from "react";

export const ThemeContext = createContext();

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'DARK':
            return {
                theme: "dark"
            }
        case 'LIGHT':
            return {
                theme: "light"
            }
        default:
            return state
    }
}

export const ThemeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        theme: "light"
    })
    let i = 0;

    useEffect(() => {
        const theme = JSON.parse(localStorage.getItem('theme'));

        if (theme) {
            console.log("sotarge theme", theme)
            dispatch({type: theme.theme.toUpperCase()});
        }
        else {
            localStorage.setItem('theme', JSON.stringify({theme: "light"}));
            dispatch({type: 'LIGHT'});
        }
    }, []);

    return (
        <ThemeContext.Provider value={{...state, dispatch}}>
            { children }
        </ThemeContext.Provider>
    )
}