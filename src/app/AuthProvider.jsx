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
   const [send , setsend] = useState(false)
   const [imageUrl , setimageUrl] = useState("")
   const [search, setsearch] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/username`, { withCredentials: true }); // cookie send hogi
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
    <AuthContext.Provider value={{ user, setUser, loading , userna , setusername , request , setrequest , accept ,send,setsend, setaccept ,search,setsearch, setimageUrl , imageUrl}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
