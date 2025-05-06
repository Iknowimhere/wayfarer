import { useState,useContext,useEffect,createContext } from "react";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    let [token,setToken]=useState((localStorage.getItem("userToken"))?localStorage.getItem("userToken"):null);
    useEffect(()=>{
        const token = localStorage.getItem("userToken");
        if(token){
            setToken(token);
        }
    },[])
    return (
        <AuthContext.Provider value={{token,setToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}