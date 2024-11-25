import {Navigate} from "react-router-dom";
import { jwtDecode} from "jwt-decode";
import api from "../api"
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../Constants";
import { useState,useEffect } from "react";
import React from 'react'

function ProtectedRoute({ children }) {
    const [isAutherized, setIsAutherized] = useState(null);

    useEffect(()=>{
        auth() .catch(()=>setIsAutherized(false))
    },[])

    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try{
            const res = await api.post("/users/token/refresh/",{
                refresh:refreshToken,
            })
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                setIsAutherized(true)
            }else{
                setIsAutherized(false)
            }
        } catch (error){
            console.log(error);
            setIsAutherized(false)
        } 
    }

    const auth = async()=>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAutherized(false);
            return;
        }
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now){
            await refreshToken();
        }else{
            setIsAutherized(true)
        }
    }

  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute