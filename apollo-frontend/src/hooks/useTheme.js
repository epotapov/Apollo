import { useState } from "react";
import { useThemeContext } from "./useThemeContext";

export const useTheme = () => {
    const { theme, dispatch } = useThemeContext();

    const changeTheme = () => {
        console.log("hello", theme)
        
        if (theme === "light") {
            dispatch({type: "DARK"});
            localStorage.setItem('theme', JSON.stringify({theme: "dark"}));
        }
        else if (theme === "dark") {
            dispatch({type: "LIGHT"});
            localStorage.setItem('theme', JSON.stringify({theme: "light"}));
        }
    }

    return { changeTheme };
}