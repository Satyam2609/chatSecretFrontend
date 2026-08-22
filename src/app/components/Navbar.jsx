"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Bell ,Search} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { motion } from "framer-motion";

export default function Navbar({setSearchres}) {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(false);
   const [request , setrequest] = useState([])
  const [searchGroup , setsearchGroup] = useState("")
  const { setsearch , search} = useAuth();

  useEffect(() => {
     const fetchRequest = async() => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/userFetchRequest` ,
         {withCredentials:true}
       )
       setrequest(res.data.request)
    
  } catch (error) {
    console.log("error" , error) 
  }
  }
  fetchRequest()
  if(notification){
  const interval = setInterval(fetchRequest, 1000);

  return () => clearInterval(interval);
  }
   
  },[setrequest])

  const handleChange = (e) => {
      setsearchGroup(e.target.value)
  }

 useEffect(() => {
   if (!searchGroup || searchGroup.trim().length < 1) {
    setsearch(null); 
    return;
  }


  const controller = new AbortController();

  const searcht = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/api/Search/${searchGroup}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );
      const names = res.data.group.map(g => g.groupName);


      console.log("hello",names)
      setsearch(names)
      
     
      
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error(err);
      }
    }
  };

  const timer = setTimeout(() => {
    searcht();
  }, 300); 

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [searchGroup]);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  
  const handlerAccept = (u) => {
    try {
      const res = axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/userAcceptInGroup`,
      { roomId: u.roomId, username: u.username, accept: "yes" },
      { withCredentials: true }
    );
setrequest(prev => prev.filter(r => r.username !== u.username));
      
    } catch (error) {
      console.log(error)
      
    }
  }




  return (
   <motion.nav
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  }}
  className="
    fixed top-0 left-0 z-50
    w-full
    rounded-b-3xl
    bg-white/50
    backdrop-blur-2xl
    text-black
    px-3 py-3 sm:px-5
    flex flex-col
    gap-2
    md:flex-row
    md:items-center
    md:justify-between
  "
>
  {/* Top row */}
  <div className="w-full flex items-center justify-between md:w-auto">
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold shrink-0">
      Chat
    </h1>

    {/* Mobile notification */}
    <div className="md:hidden relative">
      <Bell
        className="cursor-pointer"
        size={21}
        onClick={() => setNotification((prev) => !prev)}
      />

      {notification && (
        <div
          className="
            absolute right-0 top-8
            w-[calc(100vw-24px)]
            max-w-sm
            max-h-64
            overflow-y-auto
            bg-white
            text-black
            shadow-xl
            rounded-xl
            p-3
            z-[100]
          "
        >
          {request.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No new requests
            </div>
          ) : (
            request.map((u, i) => (
              <div
                key={i}
                className="border-b last:border-none p-2 flex flex-col gap-1"
              >
                <span className="font-bold text-sm">
                  New Join Request
                </span>

                <div className="text-xs sm:text-sm break-words">
                  Room: <b>{u.roomId}</b>
                </div>

                <div className="text-xs sm:text-sm break-words">
                  User: <b>{u.username}</b>
                </div>

                <button
                  onClick={() => handlerAccept(u)}
                  className="
                    mt-1
                    bg-black
                    text-white
                    py-1.5
                    rounded-lg
                    text-sm
                    w-full
                  "
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  </div>

  {/* Search */}
  <div className="relative w-full md:flex-1 md:max-w-xl md:mx-6">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
      size={18}
    />

    <input
      type="text"
      className="
        bg-white
        w-full
        h-9
        sm:h-10
        pl-9
        pr-3
        rounded-2xl
        text-black
        text-sm
        outline-none
        border
        border-black/10
        focus:border-black/30
      "
      onChange={handleChange}
      placeholder="Search Your Group"
    />
  </div>

  {/* Desktop / Mobile navigation */}
  <ul
    className="
      w-full
      flex
      items-center
      justify-between
      gap-2
      md:w-auto
      md:justify-end
      md:gap-5
    "
  >
    {/* Desktop notification */}
    <li className="relative hidden md:block">
      <Bell
        className="cursor-pointer"
        size={21}
        onClick={() => setNotification((prev) => !prev)}
      />

      {notification && (
        <div className="absolute right-0 top-8 bg-white text-black w-64 max-h-64 overflow-y-auto shadow-xl rounded-xl p-3 z-[100]">
          {request.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No new requests
            </div>
          ) : (
            request.map((u, i) => (
              <div
                key={i}
                className="border-b last:border-none p-2 flex flex-col gap-1"
              >
                <span className="font-bold">
                  New Join Request
                </span>

                <div className="text-sm">
                  Room: <b>{u.roomId}</b>
                </div>

                <div className="text-sm">
                  User: <b>{u.username}</b>
                </div>

                <button
                  onClick={() => handlerAccept(u)}
                  className="mt-1 bg-black text-white py-1 rounded-lg text-sm"
                >
                  Accept
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </li>

    {token && (
      <li className="text-xs sm:text-sm md:text-base whitespace-nowrap">
        <a href="/Profile">Profile</a>
      </li>
    )}

    <li className="text-xs sm:text-sm md:text-base whitespace-nowrap">
      {token ? (
        <a href="/Group">Group</a>
      ) : (
        <a href="/register">LogIn</a>
      )}
    </li>

    <li className="text-xs sm:text-sm md:text-base whitespace-nowrap">
      <a href="/Profile">SingleChat</a>
    </li>
  </ul>
</motion.nav>
  );
}
