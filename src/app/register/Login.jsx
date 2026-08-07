import axios from "axios";
import { useState } from "react";
import {motion} from "framer-motion"
import { io } from "socket.io-client";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setmessage] = useState("");
  const navigator = useRouter()
  const [loader , setloader] = useState(false)
  const {setUser , setusername} = useAuth()

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      setloader(true)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/api/login`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("data ", res.data);
      setUser(res.data.user.username)
      setusername(res.data.user.username)
      setloader(false)
      setmessage("user logged in successfully");
      localStorage.setItem("token", res.data.accesstoken);
      navigator.push("/Group");
   
      
    } catch (error) {
      console.log("login error", error);
      setmessage(error.response?.data?.message);
      setloader(false)
    }
  };

  return (
    <>
    
   <div className="min-h-screen bg-gradient-to-br from-[#f7d8cb] via-[#f5cebe] to-[#ffe8df] flex flex-col md:flex-row">

  {/* LEFT */}
  <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12">

    <div className="w-full max-w-md rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/40 shadow-2xl p-8">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>
        <p className="text-gray-600 mt-2">
          Login to continue
        </p>
      </div>

      <form onSubmit={handlerSubmit} className="space-y-6">

        {/* Username */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Username
          </label>

          <input
            type="text"
            name="name"
            value={formdata.name}
            onChange={handleChanges}
            placeholder="Enter username"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChanges}
            placeholder="Enter email"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={handleChanges}
            placeholder="Enter password"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-emerald-500 text-white font-semibold text-lg transition hover:bg-emerald-600 active:scale-95"
        >
          {loader ? (
            <Loader2 className="animate-spin h-6 w-6 mx-auto" />
          ) : (
            "Login"
          )}
        </button>

      </form>

      {message && (
        <div className="mt-6 rounded-xl bg-emerald-100 p-3 text-center text-emerald-700">
          {message}
        </div>
      )}

    </div>

  </div>

  {/* RIGHT */}
  <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">

    <div className="absolute w-80 h-80 rounded-full bg-emerald-300/30 blur-3xl"></div>

    <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-pink-300/30 blur-3xl"></div>

    <img
      src="/loginimage.png"
      alt="login"
      className="relative z-10 w-[80%] max-w-lg"
    />

  </div>

</div>
  </>
  );
}
