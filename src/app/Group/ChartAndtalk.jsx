"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Menu ,MoreVertical , Delete} from "lucide-react";

export default function ChartAndtalk({searchParams}) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chosenRoom, setChosenRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [popup, setPopup] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const [members , setmembers] = useState([]);
  const [showmembers , setshowmembers] = useState("");
  const [admin , setadmin] = useState("")
  const [typing , settyping] = useState([])
  const [deletebar , setdeletebar] = useState("")
  const [online , setonline] = useState("")
  const [showrigtPannel , setshowrightPannel] = useState(false)
  const [deleteMember , setdeletemember] = ("")
  const [isMobile, setIsMobile] = useState(false);


useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);

    // yaha se direct right panel ka state set kar do
    setshowrightPannel(!mobile); // mobile = false, desktop = true
  };

  checkMobile(); // initial check
  window.addEventListener("resize", checkMobile);

  return () => window.removeEventListener("resize", checkMobile);
}, []);

  

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    setUsername(savedUser || "");

    const newSocket = io("https://chatsecretsocket-3.onrender.com");
    setSocket(newSocket);

    newSocket.on("roomlist", (groupsList) => {
      setRooms(groupsList);
    });

    newSocket.on("getRoomMessage", ({ roomId, username, message }) => {
      setMessages((prev) => [...prev, { roomId, username, message }]);
    });

    newSocket.on("members", (list) => {
      setmembers(list.members); 
      
    });
    newSocket.on("members" , (admin) => {
      setadmin(admin.adminUserName)

    })
    newSocket.on("previousMessages" , (messageprev) => {
      setMessages(messageprev)
      console.log(messageprev)
    })

    newSocket.on("typing" , ({username}) => {
      settyping((prev) => {
        if(!prev.includes(username)) return [...prev , username]
        return prev
        
      })
      console.log("typing",username)
    })
   newSocket.on("hidetyping", ({ username }) => {
      settyping((prev) => prev.filter((u) => u !== username));
    });

    newSocket.on("onlineUsers" , (data) => {
      setonline(data)
      console.log(data)

    })


    return () => {newSocket.disconnect();
      newSocket.off("typing")
      newSocket.off("hidetyping")
       newSocket.off("onlineUsers");
    }
  }, []);

  const createRoom = () => {
    if (!roomName.trim()) return alert("Fill all fields");
    socket.emit("createRoom", { roomId: roomName.trim(), username });
    setChosenRoom(roomName.trim());
    setPopup("");
  };
  console.log("user ka naam bhai ji",searchParams.username)

  const joinRoom = () => {
    if (!roomName.trim() || !username.trim()) return alert("Fill all fields");
    socket.emit("joinRoom", { roomId: roomName.trim(), username });
    setChosenRoom(roomName.trim());
    setPopup("");
  };

  let typingTimeout;
  const handleInput = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !chosenRoom) return;

    socket.emit("typing", { roomId: chosenRoom, username });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId: chosenRoom, username });
    }, 1000);
  };


  const sendMessage = () => {
    if (!messageInput.trim() || !chosenRoom) return;
    socket.emit("roomMessage", {
      roomId: chosenRoom,
      message: messageInput,
      username,
    });
    setMessageInput("");
  };

  const selectRoom = (room) => {
    setChosenRoom(room);
    socket.emit("joinRoom", { roomId: room, username });
    setshowrightPannel(true)
    console.log("members",members)
    console.log("admin" ,admin)
    console.log(messages)
    
    
  };

  const groupDelete = () => {
    socket.emit("delete" , chosenRoom)
    window.location.reload()
  }
  const handleDelete = (member) => {
    socket.emit("deletemember" , {roomId:chosenRoom ,username:member})
    window.location.reload()

  }

 

  return (
    <div className="w-full p-3 h-screen">

      {/* POPUP MENU */}
      {popup && (
        <motion.div
          className="fixed top-0 left-0 h-full bg-white shadow-2xl w-64 p-4 rounded-r-2xl"
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex justify-between mb-4">
            <span className="text-xl">Rooms</span>
            <span onClick={() => setPopup("")} className="cursor-pointer text-xl">
              X
            </span>
          </div>

          <input
            type="text"
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full border p-2 rounded-xl mb-3"
          />

          
          <button
            onClick={createRoom}
            className="bg-black text-white w-full p-2 rounded-xl mb-3"
          >
            Create Room
          </button>

          <button
            onClick={joinRoom}
            className="bg-gray-300 text-black w-full p-2 rounded-xl"
          >
            Join Room
          </button>
        </motion.div>
      )}

      <div className={`flex gap-4 h-full`} >
        
        {/* LEFT SIDE ROOM LIST */}
        <div className={`w-full md:1/2 h-auto bg-white rounded-xl  shadow-xl  flex flex-col gap-4 ${showrigtPannel ? "w-0 opacity-0 overflow-hidden" :"w-full md:w-1/4 md:block"}`} >
          
          <div 
            onClick={() => setPopup("menu")} 
            className="bg-black text-white flex justify-around p-3 border-2 rounded-2xl cursor-pointer"
          >
            <p className="font-bold">Create Your Group</p>
            <Menu />
          </div>

          <div className="border-2 h-full font-bold bg-black text-white shadow-2xl p-2 rounded-2xl">
           {deletebar === "yes" && (<div className=" p-3  bg-white text-black rounded-2xl  w-full max-w-[13.5rem]"><p className="cursor-pointer" onClick={groupDelete}>Delete</p></div>)}
           {rooms.map((r, i) => (
  <div
    key={i}
    onClick={(e) => {selectRoom(r)  , e.stopPropagation()}}
    className={`cursor-pointer flex justify-between w-full p-2 rounded-xl ${
      chosenRoom === r ? "bg-white/20" : ""
    }`}
  >
    <span>{r}</span>
    <div
      onClick={() => {
        
        setdeletebar("yes");
      }}
    >
      <MoreVertical />
    </div>
  </div>
))}
            
            </div>
           
          
        </div>

        {/* RIGHT SIDE CHAT */}
          <div className={`bg-gray-500 rounded-xl border shadow-xl p-3 flex flex-col w-full  justify-between transition-all duration-300
        ${showrigtPannel ? " absolute h-screen  opacity-100" : "hidden md:flex md:w-3/4"}`}
      >

          
          <div className="overflow-y-auto  flex-1 mb-3">
            
            <div className="h-15 p-3 bg-black  top-10 w-full max-w-4xl text-white rounded-2xl flex justify-between items-center">
              <div onClick={() => setshowrightPannel(false)}>Groups</div>
              <span>{chosenRoom}</span>
              <span 
                className="cursor-pointer" 
                onMouseEnter={() => setshowmembers("show")}
              >
                Members
              </span>
            </div>

            {/* SHOW MEMBERS */}
            {showmembers === "show" &&  (
              
              <div className="p-2 bg-black text-white  absolute w-full max-w-xl font-bold rounded-xl m-2">
                <div onClick={() => setshowmembers("")} className="w-full  flex justify-end cursor-pointer">X</div>
  {members.map((m, i) => (
    <p className="border-1 p-1 flex justify-between border-white" key={i}>
     {m === admin ? `${m} (Creator)` : m}
      <div onClick={() => handleDelete(m)}><Delete/></div>
    </p>
    
  ))}
</div>

            )}

            {/* Messages */}
            {messages
              .filter((m) => m.roomId === chosenRoom)
              .map((m, i) => (
                <div key={i} className="bg-white text-black p-2 m-2 rounded-lg">
                  <b>{m.username}</b>: {m.message}
                
                </div>
            ))}
            {typing.length > 0 && (
    <div className="bottom-0 left-0 p-2 text-gray-200 italic">
        {typing.join(", ")} {typing.length > 1 ? "are" : "is"} typing...
    </div>
)}
          </div>

          <div className="flex gap-2 p-2 bg-gray-500">
            <input
              value={messageInput}
              onChange={handleInput}
              className="w-full bg-white text-black border p-2 rounded-xl"
              placeholder="Write message..."
            />
            <button
              onClick={sendMessage}
              className="bg-black text-white px-5 rounded-xl"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
