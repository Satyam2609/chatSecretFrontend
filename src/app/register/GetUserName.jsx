"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GetUserName() {
  const navigate = useRouter();
  const [username, setUsername] = useState("");

  const fetchusername = async() => {
    const usernamea = localStorage.getItem("username");
    try {
      if(!usernamea){
        const res = await axios.get("https://chatsecretbackend.onrender.com/api/username", {
          withCredentials: true 
        });
        localStorage.setItem("username", res.data.username);
        setUsername(res.data.username); // state update for UI
      } else {
        setUsername(usernamea);
      }
    } catch (error) {
      console.error("Error fetching username:", error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    fetchusername();
  }, []);

  return <div>Hello {username || "Guest"}</div>
}
