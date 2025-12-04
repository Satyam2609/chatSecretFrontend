"use client";

import axios from "axios";
import Link from "next/link";
import { useState , useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function Navbar() {
  const [text , settext] = useState(null)
  const [notification , setNotification] = useState("")
  const {request , setaccept} = useAuth()
  

  useEffect(() => {
  const token = localStorage.getItem("token");
  settext(token);
}, []); 

    const handleLogout = async() => {
        try {
           await axios.post("https://chatsecretbackend.onrender.com/api/loggout", {}, { withCredentials:true })

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("welcomeShown")

            window.location.href="/register"
            
        } catch (error) {
             console.log("Logout error:", error);
        }
    }
  return (
    <nav className="w-full absolute bg-black text-white  p-5 flex items-center justify-between">
      <h1 className="text-xl font-bold">Chat Groups</h1>

      <ul className="flex gap-6">
        <li>
          {text ? (<a href="/Profile">profile</a>):<a></a>}
        </li>
       <li>
 {
  text ? (<a href="Group">Group</a>):(<a href="/register">LogIn</a>)

 }
 
</li>
<li>
  <Bell onClick={() => setNotification("show")}/>
    {notification === "show" && <div className="h-auto w-full max-w-xs">  
      
      {request.map(u => (
        <div><span>Request by the user</span><div>{u.roomId} : {u.username}</div>
        <button onClick={() => setaccept("yes")}>yes</button>
        </div>


      )) } </div>}

</li>

      </ul>
    </nav>
  );
}
