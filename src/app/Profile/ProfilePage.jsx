"use client"
import { Edit } from "lucide-react"
import Navbar from "../components/Navbar"
import axios from "axios"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user , setuser] = useState({
    username:"",
    phonenumber:"",
    name:"",
    avatar:null
  })
  const navigtor = useRouter()
  const [message , setmessage] = useState("")

  const handleChanges = (e) => {
    const {name , value ,files , type} = e.target
    setuser((prev) => ({...prev, [name]: type === "file" ? files[0] : value}))
    
  }

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "https://chatsecretbackend.onrender.com/api/profile",
        { withCredentials: true }
      );
      
      if(res.data.success){
        setuser(res.data.profile);
      } else {
        navigtor.push("/register");
      }
    } catch (error) {
      console.log("Not found", error);
      
    }
  }

  fetchUser();
}, [])

const handlesubmit = async(e) => {
  e.preventDefault()

  try {

    const formdataa = new FormData()
    formdataa.append("username" , user.username)
    formdataa.append("phonenumber" , user.phonenumber)
    formdataa.append("name" , user.name)
    if(user.avatar){
      formdataa.append("avatar" , user.avatar)
      console.log(user.avatar)
    }
    const res = await axios.put("https://chatsecretbackend.onrender.com/api/UpdateProfile" , formdataa , {
      headers:{
        "Content-Type" : "multipart/form-data"

      },
      withCredentials:true
    })

    setuser(res.data.user)
    setmessage("Update successfully")
    
    
  } catch (error) {
    console.log("error aries" , error)
    
  }
}
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
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br relative top-15 from-gray-900 via-gray-800 to-gray-900 w-full">
        {/*Profile*/}
      <div className="w-full p-7   flex flex-col  md:items-start items-center gap-6 md:flex-row md:gap-10">
      <div className="md:h-32 md:w-32 h-24 w-24 mt-15 rounded-full bg-black/30  mt-0 flex-shrink-0 overflow-hidden relative cursor-pointer">
  {/* Hidden file input */}
  <input
    type="file"
    accept="image/*"
    className="hidden"
    id="avatarInput"
    name="avatar"
    onChange={handleChanges}
  />

  {/* Avatar display */}
  {user.avatar ? (
    <img
      src={user.avatar instanceof File  ? URL.createObjectURL(user.avatar) : user.avatar}
      alt="User Avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-white">
      No Avatar
    </div>
  )}

  {/* Overlay edit icon */}
  <label htmlFor="avatarInput" className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
    <Edit className="text-black" />
  </label>
</div>


        <div className="flex flex-col   space-y-4 w-full max-w-sm">
          <form onSubmit={handlesubmit}>

          {/* USERNAME */}
          <div className="text-xl text-white">
            <p>UserName:</p>
            <div className="flex w-full">
              <input
                type="text"
                onChange={handleChanges}
                value={user.username}
                name="username"
                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
          </div>

        
          <div className="text-xl text-white">
            <p>PhoneNumber:</p>
            <div className="flex w-full">
              <input
                type="text"
                onChange={handleChanges}
                value={user.phonenumber}
                name="phonenumber"

                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
          </div>

          {/* NAME */}
          <div className="text-xl text-white">
            <p>Name:</p>
            <div className="flex w-full">
              <input
                type="text"
                onChange={handleChanges}
                value={user.name}
                name="name"
                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
            
            {message && <p>{message}</p>}
            <button type="submit" className="px-7 py-2 mt-10 bg-white text-black rounded-2xl hover:bg-white/80">Save</button>
          </div>
          </form>
          <div className="mt-10 w-full gap-5 flex">
            <div className="flex flex-col gap-5">
              <p className="text-white text-xl">Delete Account</p>
            <button className="px-10 py-3 bg-white text-black rounded-2xl hover:bg-white/80">Delete</button>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-white text-xl">Log out your Account</p>
            <button onClick={handleLogout} className="px-7 py-3  bg-white text-black rounded-2xl hover:bg-white/80">LogOut</button>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE CHAT SKELETON */}
        <div className="hidden md:flex flex-col w-full max-w-md ml-30 space-y-4 justify-end">
          <div className="flex gap-3 justify-start transition-all animate-bounce">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>

          <div className="flex gap-3 justify-center transition-all animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
           <div className="flex gap-3 justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
           <div className="flex gap-3 justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
           <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
           <div className="flex gap-3 justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
          
        </div>

      </div>

      
      


      

    </div>
  </>
  )
}
