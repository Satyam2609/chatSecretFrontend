"use client"
import { createContext , useContext , useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user , setuser] = useState(null)
    return <AuthContext.Provider value={{user, setuser}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
