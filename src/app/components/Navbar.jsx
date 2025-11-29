"use client";

import axios from "axios";
import Link from "next/link";
import { useState , useEffect } from "react";

export default function Navbar() {
  const [text , settext] = useState(null)

  useEffect(() => {
  const token = localStorage.getItem("token");
  settext(token);
}, []); 

    const handleLogout = async() => {
        try {
           await axios.post("http://localhost:4000/api/loggout", {}, { withCredentials:true })

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("welcomeShown")

            window.location.href="/register"
            
        } catch (error) {
             console.log("Logout error:", error);
        }
    }
  return (
    <nav className="w-full bg-black text-white px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">Chat Groups</h1>

      <ul className="flex gap-6">
        <li>
          <Link href="/chat" className="hover:opacity-70">
            Chat
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:opacity-70">
            SignIn
          </Link>
        </li>
       <li>
 {
  text ? (<button onClick={handleLogout}>LogOut</button>):(<a href="/register">LogIn</a>)

 }
 
</li>

      </ul>
    </nav>
  );
}
