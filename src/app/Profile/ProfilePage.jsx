"use client"
import { Edit } from "lucide-react"
import Navbar from "../components/Navbar"
import axios from "axios"
import {  useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [user , setuser] = useState({
    username:"",
    phonenumber:"",
    name:"",
    avatar:null
  })
  const navigtor = useRouter()
  const [message , setmessage] = useState("")
  const [loader , setloader] = useState(false)
  const [logoutloader , setlogoutloader] = useState(false)
 




  const handleChanges = (e) => {
    const {name , value ,files , type} = e.target
    setuser((prev) => ({...prev, [name]: type === "file" ? files[0] : value}))
    
  }

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/api/profile`,
        { withCredentials: true }
      );
      
      if(res.data.success){
        setuser(res.data.profile);
      } else {
        navigtor.push("/register");
      }
    } catch (error) {
      console.log("Not found", error);
      navigtor.push("/register")
      
     
      
    }
  }

  fetchUser();
}, [])

const handlesubmit = async(e) => {
  e.preventDefault()

  try {
    setloader(true)

    const formdataa = new FormData()
    formdataa.append("username" , user.username)
    formdataa.append("phonenumber" , user.phonenumber)
    formdataa.append("name" , user.name)
    if(user.avatar){
      formdataa.append("avatar" , user.avatar)
      console.log(user.avatar)
    }
    const res = await axios.put(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/UpdateProfile` , formdataa , {
      headers:{
        "Content-Type" : "multipart/form-data"

      },
      withCredentials:true
    })

    setuser(res.data.user)
    setmessage("Update successfully")
    setTimeout(() => {
      setmessage("")
    } , 1000)
    setloader(false)
    
    
  } catch (error) {
    console.log("error aries" , error)
    
  }
}
const handleLogout = async() => {
        try {
          setlogoutloader(true)
           await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/loggout`, {}, { withCredentials:true })

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("welcomeShown")
            setlogoutloader(false)

            window.location.href="/register"
            
        } catch (error) {
             console.log("Logout error:", error);
        }
    }

  return (
    <>
    <Navbar/>
   <div className="min-h-screen bg-[#f5cebe] pt-34 px-4 ">
  <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

    <div className="grid md:grid-cols-3">

      {/* Left */}
      <div className="bg-[#FBA987] flex flex-col items-center justify-center p-10">

        <div className="relative">

          <img
            src={
              user.avatar
                ? user.avatar instanceof File
                  ? URL.createObjectURL(user.avatar)
                  : user.avatar
                : "/profile.png"
            }
            className="w-52 h-52 rounded-full object-cover border-4 border-white shadow-lg"
          />

          <label
            htmlFor="avatarInput"
            className="absolute bottom-2 right-2 bg-white rounded-full p-3 cursor-pointer shadow-lg hover:scale-110 transition"
          >
            <Edit size={20} />
          </label>

          <input
            id="avatarInput"
            type="file"
            name="avatar"
            className="hidden"
            onChange={handleChanges}
          />

        </div>

        <h2 className="mt-6 text-3xl font-bold text-white">
          {user.name || "Your Name"}
        </h2>

        <p className="text-white/80">
          @{user.username}
        </p>

      </div>

      {/* Right */}

      <div className="md:col-span-2 p-10">

        <h1 className="text-4xl font-bold mb-8">
          Profile Settings
        </h1>

        <form
          onSubmit={handlesubmit}
          className="space-y-7"
        >

          <div>
            <label className="font-semibold">
              Username
            </label>

            <input
              name="username"
              value={user.username}
              onChange={handleChanges}
              className="w-full mt-2 rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#FBA987]"
            />
          </div>

          <div>
            <label className="font-semibold">
              Full Name
            </label>

            <input
              name="name"
              value={user.name}
              onChange={handleChanges}
              className="w-full mt-2 rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#FBA987]"
            />
          </div>

          <div>
            <label className="font-semibold">
              Phone Number
            </label>

            <input
              name="phonenumber"
              value={user.phonenumber}
              onChange={handleChanges}
              className="w-full mt-2 rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-[#FBA987]"
            />
          </div>

          {message && (
            <p className="text-green-600 font-semibold">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-8">

            <button
              type="submit"
              className="bg-[#FBA987] hover:bg-[#f79269] text-white font-semibold px-8 py-3 rounded-xl shadow"
            >
              {loader ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Profile"
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-black text-white px-8 py-3 rounded-xl"
            >
              {logoutloader ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Logout"
              )}
            </button>

            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl"
            >
              Delete Account
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>
</div>
  </>
  )
}