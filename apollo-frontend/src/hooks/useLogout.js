import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useLogout = () => {
    const { dispatch } = useUserContext();

    const logout = () => {
        console.log("logout")
        localStorage.removeItem('user');
        dispatch({type: 'LOGOUT'})
    }

    return { logout };
}