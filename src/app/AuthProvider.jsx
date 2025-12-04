"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
   const [userna , setusername] = useState(null)
   const [request , setrequest] = useState([])
   const [accept , setaccept] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://chatsecretbackend.onrender.com/api/username", { withCredentials: true }); // cookie send hogi
        setUser(res.data.user);
        setusername(res.data.user.username)
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading , userna , setusername , request , setrequest , accept , setaccept}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
