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
    <div className="min-h-screen  w-full bg-gradient-to-br from-[#f7d8cb] via-[#f5cebe] to-[#ffe8df px-4 py-6 flex flex-col overflow-hidden">

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-6 relative">

        {/* LEFT SIDE */}
       {/* LEFT SIDE */}
<div className="hidden lg:flex flex-1 flex-col justify-center px-12">

  <span className="text-emerald-400 font-semibold uppercase tracking-widest">
    Chat & Connect
  </span>

  <h1 className="mt-4 text-5xl font-bold text-black leading-tight">
    Join The
    <br />
    Conversation
  </h1>

  <p className="mt-6 text-lg text-black max-w-lg">
    Create your account and start chatting with friends, share images,
    create groups and connect instantly from anywhere.
  </p>

  {/* CHAT PREVIEW */}
  <div className="mt-12 space-y-5">

    {/* Message 1 */}
    <div className="flex items-end gap-3">
      <img
        src="https://i.pravatar.cc/50?img=12"
        className="h-11 w-11 rounded-full"
      />

      <div className="rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-md px-5 py-3 max-w-xs">
        <p className="text-sm text-gray-300">Hey 👋</p>
        <p className="text-white">
          Welcome to our community!
        </p>
      </div>
    </div>

    {/* Message 2 */}
    <div className="flex justify-end">
      <div className="rounded-2xl rounded-br-sm bg-emerald-500 px-5 py-3 max-w-xs">
        <p className="text-white">
          Thanks ❤️ Excited to join.
        </p>
      </div>
    </div>

    {/* Message 3 */}
    <div className="flex items-end gap-3">
      <img
        src="https://i.pravatar.cc/50?img=32"
        className="h-11 w-11 rounded-full"
      />

      <div className="rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-md px-5 py-3 max-w-xs">
        <p className="text-white">
          Create your profile and start chatting.
        </p>
      </div>
    </div>

  </div>

</div>

        {/* RIGHT SIDE – Signup Form */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full max-w-lg bg-white/50 backdrop-blur-[6px] text-white p-8 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
         <div className="w-full flex justify-start mb-6">
  <a
    href="/register"
    className="text-black font-medium  hover:underline transition"
  >
    Already have an account? Login
  </a>
</div>

            {/* FORM CONTENT */}
            <div className="relative text-black z-10 space-y-2">
              
              <h2 className="text-2xl md:text-3xl font-semibold text-center">Sign Up</h2>
              <form onSubmit={handlesubmit} className="space-y-2 text-black">
                <input type="text" placeholder="Username" onChange={handleChanges} value={formdata.username} name="username"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
                <input type="email" placeholder="Email" onChange={handleChanges} value={formdata.email} name="email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
                <input type="password" placeholder="Password" onChange={handleChanges} value={formdata.password} name="password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
                <input type="number" placeholder="Phone Number" onChange={handleChanges} value={formdata.phonenumber} name="phonenumber"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
                <input type="text" placeholder="Full Name" onChange={handleChanges} value={formdata.name} name="name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
                <input type="file" onChange={handleChanges} name="avatar" accept="image/*"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />

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
