"use client"
import axios from "axios";
import { useState } from "react";

export default function GetUserName() {
 

  const fetchusername = async() => {
     const usernamea = localStorage.getItem("username")
  try {
    if(!usernamea){
    const res = await axios.get("https://chatsecretbackend.onrender.com/api/username", {
      withCredentials: true 
    });
   console.log(res.data.username)
    localStorage.setItem("username" , res.data.username)
    return res.data.username;
  }
    
  } catch (error) {
    console.error("Error fetching username:", error.response?.data?.message || error.message);
  }
}

fetchusername()
}

