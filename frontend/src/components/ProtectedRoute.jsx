import {Navigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../Constants";
import { useState, useEffect } from "react";
import React from 'react'

function ProtectedRoute({ children, adminOnly = false }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])                                                  

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setIsAuthorized(false);
            return false;
        }

        try {
            const res = await api.post("/users/token/refresh/", {
                refresh: refreshToken,
            });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
                return true;
            } else {
                setIsAuthorized(false);
                return false;
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            setIsAuthorized(false);
            return false;
        } 
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        // If no token exists at all
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decode = jwtDecode(token);
            const tokenExpiration = decode.exp;
            const now = Date.now() / 1000;

            // If token is expired, try to refresh
            if (tokenExpiration < now) {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    setIsAuthorized(false);
                    return;
                }
            }

            setIsAuthorized(true);
        } catch (error) {
            console.error("Authorization error:", error);
            setIsAuthorized(false);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;