import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useUserContext();

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5001/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        else {
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false);
        }
    }

    return { login, isLoading, error };
}