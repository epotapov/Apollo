import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useLogin = () => {
    

    const { dispatch } = useUserContext();

    const login = async (username, password) => {
        //setIsLoading(true);
        //setError(null);
        let error = null
        let isLoading = null;
        const response = await fetch('http://localhost:5001/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const json = await response.json();

        if (!response.ok) {
            //setIsLoading(false);
            isLoading = true;
            error = json.error;
        }
        else {
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'LOGIN', payload: json})

            isLoading = false;
        }
        return { error, isLoading }
    }

    return { login };
}