"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Bell ,Search} from "lucide-react";
import { useAuth } from "../AuthProvider";

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
    <nav className="w-full absolute rounded-b-3xl   bg-black text-white p-5 flex items-center gap-3 md:justify-between">
      <h1 className="text-xs md:text-xl font-bold">Chat</h1>
      <div className="relative w-full md:mr-[30rem] max-w-xl">
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
    size={20}
  />
  <input
    type="text"
    className="bg-white w-full md:max-w-3xl max-w-xs md:py-1 pl-10 pr-2 rounded-2xl text-black"
    onChange={handleChange}
    placeholder="Search Your Group"
  />
</div>

      <ul className="flex gap-2 md:gap-6">
        <li className="relative w-full">
          <Bell
            className="cursor-pointer"
            onClick={() => setNotification((prev) => !prev)}
          />
          {notification && (
            <div className="absolute right-0 top-8 bg-white text-black w-34 md:w-64 max-h-64 overflow-y-auto shadow-xl rounded-xl p-3 z-50">
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
                    <span className="font-bold">New Join Request</span>
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

        <li>
          {token ? <a href="/Profile">Profile</a> : <></>}
        </li>

        <li>
          {token ? (
            <a href="/Group">Group</a>
          ) : (
            <a href="/register">LogIn</a>
          )}
        </li>
      </ul>
    </nav>
  );
}
