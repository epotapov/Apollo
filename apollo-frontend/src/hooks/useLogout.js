import { useState } from "react";
import { useUserContext } from "./useUserContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const { dispatch } = useUserContext();
    const navigate = useNavigate();

    const logout = () => {
        console.log("logout")
        localStorage.removeItem('user');
        dispatch({type: 'LOGOUT'})
        navigate('/');
    }

    return { logout };
}