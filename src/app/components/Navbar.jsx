"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(false);
   const [request , setrequest] = useState([])
   const [sendObj , setsendObj] = useState({})
  const { setaccept } = useAuth();

  useEffect(() => {
     const fetchRequest = async() => {
  try {
    const res = await axios.get("https://chatsecretbackend.onrender.com/api/userFetchRequest" ,
         {withCredentials:true}
       )
       setrequest(res.data.request)
    
  } catch (error) {
    console.log("error" , error) 
  }
  }
  fetchRequest()
  const interval = setInterval(fetchRequest, 5000); // har 5 second me fetch

  return () => clearInterval(interval);
   
  },[])

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);




  return (
    <nav className="w-full absolute  bg-black text-white p-5 flex items-center justify-between">
      <h1 className="text-xl font-bold">Chat Groups</h1>
      <ul className="flex gap-6">
        <li className="relative">
          <Bell
            className="cursor-pointer"
            onClick={() => setNotification((prev) => !prev)}
          />
          {notification && (
            <div className="absolute right-0 top-8 bg-white text-black w-64 max-h-64 overflow-y-auto shadow-xl rounded-xl p-3 z-50">
              {request.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  No new requests
                </div>
              ) : (
                request.map((u, i) => (
                  <div
                    key={i}
                    className="border-b last:border-none p-2 flex flex-col gap-1"
                  >
                    <span className="font-bold">New Join Request</span>
                    <div className="text-sm">
                      Room: <b>{u.roomId}</b>
                    </div>
                    <div className="text-sm">
                      User: <b>{u.username}</b>
                    </div>
                    <button
                      onClick={() =>
                        setaccept({ roomId: u.roomId, username: u.username })
                      }
                      className="mt-1 bg-black text-white py-1 rounded-lg text-sm"
                    > 
                      Accept
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </li>

        <li>
          {token ? <a href="/Profile">Profile</a> : <></>}
        </li>

        <li>
          {token ? (
            <a href="/Group">Group</a>
          ) : (
            <a href="/register">LogIn</a>
          )}
        </li>
      </ul>
    </nav>
  );
}
