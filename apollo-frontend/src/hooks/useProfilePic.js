import { useState } from "react";
import { useUserContext } from "./useUserContext";

export const useProfilePic = () => {

    const { dispatch } = useUserContext();

    const updatePic = (newProfilePic) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            console.log(user)
            user.user.profilePicture = newProfilePic;
            console.log(user)
            console.log(newProfilePic)
            localStorage.removeItem('user');
            dispatch({type: 'LOGOUT'})
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({type: 'UPDATE', payload: user})
        }
    }

    return { updatePic };
}