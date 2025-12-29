"use client";

import axios from "axios";
import { useState ,useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Signupuser() {
  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    phonenumber: "",
    avatar: null,
  });
  const {user} = useAuth()
  const navigator = useRouter()
  const [loader , setloader] = useState(false)

 useEffect(() => {
  if (user) {
    navigator.push("/Group");
     alert("Already LogIn")
  }
}, [user]);
 
  const [message, setmessage] = useState("");

  const handleChanges = (e) => {
    const { name, value, files, type } = e.target;
    setformdata((prev) => ({ ...prev, [name]: type === "file" ? files[0] : value }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      setloader(true)
      const formdatauser = new FormData();
      formdatauser.append("username", formdata.username);
      formdatauser.append("email", formdata.email);
      formdatauser.append("password", formdata.password);
      formdatauser.append("phonenumber", formdata.phonenumber);
      formdatauser.append("name", formdata.name);
      formdatauser.append("avatar", formdata.avatar);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/api/signUp`,
        formdatauser,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setmessage("User registered successfully");
      localStorage.setItem("username", res.data.user.username);
      setloader(false)
     navigator.push("/register")
    } catch (error) {
      console.log(error.response?.data.message);
      setmessage(error.response?.data.message);
    }
  };

  return (
    <div className="min-h-screen  w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-6 flex flex-col overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-6 relative">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 flex-col justify-center px-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Create Your Account
          </h1>
          <p className="text-gray-300 text-lg">
            Join the community. Connect, chat and explore new possibilities.
          </p>

          {/* Chat bubbles */}
          <div className="space-y-4 overflow-hidden">
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
           
           
            
            <div className="flex justify-end gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
                <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
                <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
                <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE BACKGROUND BUBBLES */}
        <div className="md:hidden overflow-hidden w-full absolute top-10 space-y-10 pointer-events-none">
          <div className="flex gap-3 justify-end">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-center">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-center">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-center">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-48">
              <div className="w-32 h-3 bg-gray-600 rounded-md"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
         
        </div>

        {/* RIGHT SIDE – Signup Form */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-[6px] text-white p-8 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
          <div className="w-full"><a href="/register">Login</a></div>

            {/* FORM CONTENT */}
            <div className="relative z-10 space-y-2">
              
              <h2 className="text-2xl md:text-3xl font-semibold text-center">Sign Up</h2>
              <form onSubmit={handlesubmit} className="space-y-2">
                <input type="text" placeholder="Username" onChange={handleChanges} value={formdata.username} name="username"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none" />
                <input type="email" placeholder="Email" onChange={handleChanges} value={formdata.email} name="email"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none" />
                <input type="password" placeholder="Password" onChange={handleChanges} value={formdata.password} name="password"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none" />
                <input type="number" placeholder="Phone Number" onChange={handleChanges} value={formdata.phonenumber} name="phonenumber"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none" />
                <input type="text" placeholder="Full Name" onChange={handleChanges} value={formdata.name} name="name"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl focus:border-emerald-400 outline-none" />
                <input type="file" onChange={handleChanges} name="avatar" accept="image/*"
                  className="w-full px-4 py-2 sm:px-6 bg-white/20 border border-white/20 rounded-xl cursor-pointer" />

                <button type="submit"
                  className="w-full bg-emerald-500 text-center hover:bg-emerald-600 transition-all py-3 rounded-xl font-semibold text-lg">
                    <div className="w-full flex justify-center">
                  {loader ? <Loader2 className="h-7 w-7 animate-spin"/>:"Create Account"}
                  </div>
                </button>
                

                {message && <p className="text-center text-red-400">{message}</p>}
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
