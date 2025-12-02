import axios from "axios";
import { useState } from "react";
import {motion} from "framer-motion"
import { io } from "socket.io-client";

export default function Login() {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setmessage] = useState("");

  const socket = io("http://localhost:5000")

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://chatsecretbackend.onrender.com/api/login",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("data ", res.data);
      localStorage.setItem("token", res.data.accesstoken);
      setmessage("user logged in successfully");
      window.location.href = "/Group";
      <Welcome  duration={3000}/>
      
    } catch (error) {
      console.log("login error", error);
      setmessage(error.response?.data?.message);
    }
  };

  return (
    <>
    
    <div className="min-h-screen absolute flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* LEFT SECTION */}
      
      <div className="flex justify-center items-center w-full md:w-1/2 p-6">
      
      
        <div className="flex flex-col justify-center space-y-6 rounded-2xl p-8 w-full max-w-md bg-white/10 backdrop-blur-xl">

          <div className="w-full flex justify-center text-xl text-white">
            Login Into Your Account
          </div>

          <form onSubmit={handlerSubmit} className="w-full">
            <div className="space-y-6 text-white text-lg">
              <div>
                <span>UserName</span>
                <input
                  className="w-full rounded-xl px-4 py-2 bg-white text-black"
                  type="text"
                  value={formdata.name}
                  onChange={handleChanges}
                  name="name"
                  placeholder="Registered name"
                />
              </div>

              <div>
                <span>Email</span>
                <input
                  className="w-full rounded-xl px-4 py-2 bg-white text-black"
                  type="email"
                  value={formdata.email}
                  onChange={handleChanges}
                  name="email"
                  placeholder="Registered email"
                />
              </div>

              <div>
                <span>Password</span>
                <input
                  className="w-full rounded-xl px-4 py-2 bg-white text-black"
                  type="password"
                  value={formdata.password}
                  onChange={handleChanges}
                  name="password"
                  placeholder="Password"
                />
              </div>

              <button
                className="w-full bg-emerald-500 text-white py-2 rounded-xl font-semibold hover:bg-emerald-600 transition"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>

          {message && (
            <div className="text-center text-emerald-300">{message}</div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 h-full  flex justify-center items-center p-6">
        <div className="w-full max-w-lg flex flex-col space-y-10">

          <div className="text-white text-2xl">
            Login In Your Registered Account
          </div>

          <div className="space-y-20">

            <div className="flex gap-5 animate-bounce">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </div>

            <div className="flex justify-end gap-5">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </div>

            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>

            <div className="flex gap-5 justify-end">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </>
  );
}
