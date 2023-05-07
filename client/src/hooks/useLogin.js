import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export function useLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch }= useAuthContext();
    const API_BASE = "http://localhost:3001";  // connecting to the server

    async function login(email, password) {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // save the user to local storage (for remembering him even when closing the app)
            localStorage.setItem('user', JSON.stringify(json));

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    }

    return { login, isLoading, error }
}