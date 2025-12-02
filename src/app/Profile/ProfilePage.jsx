"use client"
import { Edit } from "lucide-react"
import Navbar from "../components/Navbar"
import axios from "axios"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user , setuser] = useState({
    username:"",
    email:"",
    name:""
  })
  const navigtor = useRouter()

  const handleChanges = (e) => {
    const {name , value} = e.target
    setuser((prev) => ({...prev , [name]:value}))
  }

 useEffect(() => {
   

  const fetchUser = async(e) => {
   try {
     const res = await axios.get("http://localhost:4000/api/profile" , {} ,{
       headers:{
         
       },
       withCredentials:true
       
     })
     if(res.data.user){
      setuser(res.data.user)

     }
     else if(res.status === 401){
      alert("login in you account")
      navigtor.push("/register")

     }
   } catch (error) {
    console.log("not found" , error)
   
      navigtor.push("/register")
    
   }



    
  }
  fetchUser()
 },[])
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br relative top-15 from-gray-900 via-gray-800 to-gray-900 w-full">
        {/*Profile*/}
      <div className="w-full p-7   flex flex-col items-center gap-6 md:flex-row md:gap-10">
       <div className="md:h-32 md:w-32  h-24 w-24 rounded-full bg-black/30 md:mt-4 mt-0 flex-shrink-0"></div>

        <div className="flex flex-col   space-y-4 w-full max-w-sm">

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

          {/* EMAIL */}
          <div className="text-xl text-white">
            <p>Email:</p>
            <div className="flex w-full">
              <input
                type="email"
                onChange={handleChanges}
                value={user.email}
                name="email"

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
          </div>
          <div className="mt-10">
            <button className="px-10 py-3 bg-white text-black rounded-2xl hover:bg-white/80">LogOut</button>

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
