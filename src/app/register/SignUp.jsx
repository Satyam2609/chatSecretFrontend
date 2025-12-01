import axios from "axios"
import { useState } from "react"

export default function Signupuser(){
    const [formdata , setformdata] = useState({
        username:"",
        email:"",
        name:"",
        password:"",
        phonenumber:"",
        avatar:null

    })
    const [message , setmessage] = useState("")
   

    const handleChanges = (e) => {
        const {name , value , files , type} = e.target
        setformdata((prev) => ({...prev , [name]:type === "file" ? files[0] :value}))
        
    }

    const handlesubmit = async(e) => {
        e.preventDefault()


      try {
          const formdatauser = new FormData()
          formdatauser.append("username" , formdata.username)
          formdatauser.append("email" , formdata.email)
          formdatauser.append("password" ,formdata.password)
          formdatauser.append("phonenumber" , formdata.phonenumber)
          formdatauser.append("name" , formdata.name)
          formdatauser.append("avatar" , formdata.avatar)

          const res = await axios.post("https://chatsecretbackend.onrender.com/api/signUp" , formdatauser , {
            headers:{
                "Content-Type" : "multipart/form-data"
            }
          })
           console.log("user signup successfully")
           setmessage("user register successfully")
           localStorage.setItem("username" , res.data.user.username)
           window.location.href="/register"


          
      } catch (error) {
        console.log(error.response?.data.message)
        setmessage(error.response?.data.message)
        
      }

    }
    return (
         
    <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-6">

      {/* LEFT SIDE – Illustration / Dummy Chat */}
      <div className="absolute inset-0 z-0  flex flex-col justify-center md:static md:z-auto md:w-1/2  w-1/2 px-10">
        
        <h1 className="text-4xl md:flex hidden font-bold text-white leading-tight mb-4">
          Create Your Account  
        </h1>

        <p className="text-gray-300 md:flex hidden text-lg mb-10">
          Join the community. Connect, chat and explore new possibilities.
        </p>

        {/* Chat Bubbles Illustration */}
        <div className="space-y-10  md:space-y-4">
          
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

          <div className="flex gap-3 ml-30">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-52">
              <div className="w-28 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>

           <div className="flex gap-3 justify-end  ">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

<div className="flex md:hidden gap-3 justify-center ml-30">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex md:hidden gap-3 justify-center ml-30">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
<div className="flex md:hidden gap-3 justify-end ml-30">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex md:hidden gap-3 justify-start ml-30">
            <div className="bg-gray-700 px-4 py-3 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE – Signup Form */}
      <div className="flex justify-center md:pt-10  items-center w-full md:w-1/2">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-[2px] text-white p-8  rounded-2xl shadow-xl space-y-6 border border-white/10">

          <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
          <form onSubmit={handlesubmit} className="h-full w-full">

          <div className="space-y-3">
            <input type="text" placeholder="Username" onChange={handleChanges} value={formdata.username} name="username"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none"/>
            
            <input type="email" placeholder="Email" onChange={handleChanges} value={formdata.email} name="email"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none"/>

            <input type="password" placeholder="Password" onChange={handleChanges} value={formdata.password} name="password"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none"/>

            <input type="number" placeholder="Phone Number" onChange={handleChanges} value={formdata.phonenumber} name="phonenumber"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none"/>

            <input type="text" placeholder="Full Name" onChange={handleChanges} value={formdata.name} name="name"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none"/>

            <input type="file" onChange={handleChanges} name="avatar" accept="image/*"
              className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl cursor-pointer"/>
          
          

          <button type="submit"  className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all py-3 rounded-xl font-semibold text-lg">
            Create Account
          </button>
          {message && <p>{message}</p>}
          </div>
          </form>

        </div>
      </div>

    </div>
    
    )
}