"use client";

import { useDebugValue, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MoreVertical, Delete ,Image, Check, Slice } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { Loader2 , User , X } from "lucide-react";
import GroupImage from "./GroupImage";
import { MessageCircleMore, Users, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Features from "./Features";

export default function ChartAndtalk() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [chosenRoom, setChosenRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [popup, setPopup] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [admin, setAdmin] = useState("");
  const [typing, setTyping] = useState([]);
  const [deleteBar, setDeleteBar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [loader , setloader] = useState(false)
  const [RequestJoin , setRequestJoin] = useState(false)
  const [replyingto , setreplyingto] = useState(null)
  const [ImageSend , setImageSend] = useState(null)
  const [filterSearch , setFilterSearch] = useState(null)
  const [giveMess , setgiveMess] = useState(false)
  const [recommendation , setrecommendation] = useState(null) 
  const [open  , setopen] = useState(false) 
  const [shareaudio , setshareaudio] = useState(null)
  const { userna , setrequest , accept , setsend , search ,send } = useAuth();

  useEffect(() => {
    if (userna) setUsername(userna);

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  withCredentials: true,
});
    
    setSocket(newSocket);

    newSocket.on("connect", () => {
    if (userna) newSocket.emit("userna", userna);
  });


    newSocket.on("roomlist", (groupsList) =>{
       setloader(true);
       setRooms(groupsList); 
       setloader(false) 
    });
    newSocket.on("getRoomMessage", ({ roomId, username, message , timestamp , replyto , imageto }) =>
      setMessages((prev) => [...prev, { roomId, username, message , timestamp , replyto , imageto}]),
    
    
    );
    newSocket.on("members", (data) => setMembers(data.members));
    newSocket.on("members", (adminData) => setAdmin(adminData.adminUserName));
    newSocket.on("previousMessages", (msgs) => setMessages(msgs));
    
    
    newSocket.on("typing", (data) => {
  console.log("typing data received:", data); 
  setTyping((prev) => (!prev.includes(data.username) ? [...prev, data.username] : prev));
 
});
newSocket.on("recommendation" , (data) => {
   setrecommendation(data.recommendations || [])
  
})


    newSocket.on("hidetyping", ({ username }) =>
      setTyping((prev) => prev.filter((u) => u !== username))
    );
   newSocket.on("RequerstjoinRoom", (data) => {
  setrequest(data.request);
});

    return () => {
      newSocket.disconnect();
      newSocket.off("typing");
      newSocket.off("hidetyping");
    };
  }, [userna]);

  
useEffect(() => {
  if (!chosenRoom) {
    setgiveMess(false);
    return;
  }

  const isMember = members.includes(username);
  setgiveMess(isMember);
}, [members, username, chosenRoom]);

  const createRoom = () => {
    if (!roomName.trim()) return alert("Fill all fields");
    socket.emit("createRoom", { roomId: roomName.trim(), username });
    setPopup(false);
  };
  

  const joinRoom = () => {
    if (!roomName.trim() || !username.trim()) return alert("Fill all fields");
    socket.emit("joinRoom", { roomId: roomName.trim(), username});
    setRequestJoin(true)
    setTimeout(() => setRequestJoin(false) , 2000)
    setPopup(false);
  };

  const selectjoinRoom = (room) => {
    socket.emit("joinRoom", { roomId:room, username});
    setRequestJoin(true)
    setTimeout(() => setRequestJoin(false) , 2000)
    console.log(messages)
  
    
  }

  

  useEffect(() => {
  if (!accept?.roomId || !accept?.user) return;

  socket.emit("acceptResponse", {
    roomId: accept.roomId,
    username: accept.user,
    access: "yes"
  });
}, [accept])

useEffect(() => {
  setFilterSearch(search)
},[search])

useEffect(() => {
  const reccomend = () => {
    if (!socket) return;
    socket.emit("recommendUser", { roomId: chosenRoom, username});
  }
reccomend()
},[messages])

  let typingTimeout;
  const handleInput = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !chosenRoom) return;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId: chosenRoom, username , });
      if(e.target.value === ""){
        setrecommendation(null)
      }
    }, 1000);
  };

  const sendMessage = (image = null) => {
  if (!messageInput.trim() && !image) return;

  socket.emit("roomMessage", {
    roomId: chosenRoom,
    message: messageInput.trim() || "",
    username,
    replyto: replyingto ? { username: replyingto.username, message: replyingto.message } : null,
    image: image // image or null
  });
    image = null
  setMessageInput("");
  setreplyingto(null);
  setImageSend(null);
  setrecommendation(null)
  if(send){
  setTimeout(() => {
    setsend(false)
  },5000)
}
};


  const selectRoom = (room) => {
    if(!room) setChosenRoom("")
    setChosenRoom(room);
    socket.emit("selectRoom", { roomId: room, username });
    setShowRightPanel(true);
    setrecommendation(null)
  };

 const groupDelete = () => {
  if(!chosenRoom) {
    setDeleteBar(false)
    alert("plzz choice group first")
    
  }
  socket.emit("delete", chosenRoom);
};

useEffect(() => {
  socket?.on("deleteSuccess", (roomId) => {
    setRooms(prev => prev.filter(room => room !== roomId));
    setMessages(prev => prev.filter(msg => msg.roomId !== roomId));

    setChosenRoom("");
    setDeleteBar(false);
  });

  socket?.on("error", (msg) => {
    setDeleteBar(false)
    alert(msg);
    
  });

  return () => {
    socket?.off("deleteSuccess");
    socket?.off("error");
  };
}, [socket]);
  

  const handleDelete = (member) => {
    socket.emit("deletemember", { roomId: chosenRoom, username: member });
    if (typeof window !== "undefined") window.location.reload();
  };

 
  

  return (
    <>
    <Navbar/>
   <div className="bg-[#f5cebe] min-h-screen  md:p-6">
  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-24px)] md:h-[calc(100vh-48px)]">
      {/* Popup for Create/Join Room */}
     <AnimatePresence>
      {popup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Group</h2>

        <button
          onClick={() => setPopup(false)}
          className="text-2xl text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

      <input
        type="text"
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter Group name"
        className="mb-4 w-full rounded-xl border p-3 text-black outline-none focus:border-cyan-500"
      />

      <div className="flex gap-3">
        <button
          onClick={createRoom}
          className="flex-1 rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600"
        >
          Create Group
        </button>

        <button
          onClick={joinRoom}
          className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-black hover:bg-gray-100"
        >
          Join Group
        </button>
      </div>
    </motion.div>
  
</div>)}
</AnimatePresence>

<div className="w-full p-3 gap-6 flex flex-col md:flex-row mt-13 ">

      {/* Left Panel - Room List */}
      <motion.div initial={{x:-120 , opacity:1}} animate={{x:0 , opacity:1}} transition={{duration:0.1 , ease:"easeInOut"}}
        className={`bg-white text-black   shadow-xl rounded-2xl  flex flex-col gap-4 p-2 w-full md:w-1/4
          ${showRightPanel ? "hidden md:flex" : "flex"}
          transition-all  duration-300`}
      >
        <div onClick={() => setPopup(true)} className="bg-[#FBA987] shadow-md shadow-black border-2 border-white/40  flex justify-between p-3 rounded-2xl cursor-pointer">
          <span className="font-bold">Create Your Group</span>
          <Menu />
        </div>

       
        {RequestJoin &&
        <div className="flex w-full absolute  h-full justify-center items-center">
     <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-black/40 absolute  shadow-md shadow-black flex justify-center  p-4 rounded-2xl">Request sent successfully</motion.span>
    </div>
}

        <div className="flex flex-col  overflow-y-auto gap-2">
          {(filterSearch ? filterSearch : rooms).map((r, i) => (
            <div key={i} className="flex justify-between  items-center text-black p-2 rounded-xl cursor-pointer" onClick={() => selectRoom(r)}>
              <span className="text-black font-bold  text-lg">{loader? <Loader2 className="h-15 w-15 text-black animate-spin"/> : r}</span>
              <MoreVertical
  onClick={(e) => {
    e.stopPropagation();        
    setDeleteBar(prev => !prev) 
  }}
  className="cursor-pointer p-1 rounded-2xl hover:bg-black/30"
/>


            </div>
          ))}
           {deleteBar && (
          <div className="p-2 bg-gray-600 text-black md:ml-[20rem] shadow-md absolute max-w-xs rounded-xl text-center w-full cursor-pointer" onClick={groupDelete}>
            Delete Room
          </div>
        )}
        </div>
        
      </motion.div>

      {/* Right Panel - Chat */}
   {chosenRoom ?  <div
  className={`bg-white shadow-xl rounded-2xl flex flex-col
    w-full md:w-3/4
    h-[calc(100vh-80px)] md:h-[calc(100vh-90px)]
    min-h-0
    p-2
    ${showRightPanel ? "flex" : "hidden md:flex"}
    transition-all duration-300`}
>
        {/* Header */}
        <div className="flex justify-between shadow-md shadow-black  items-center bg-[#FBA987] text-black p-3 rounded-xl mb-2">
          <div className="md:hidden cursor-pointer" onClick={() => setShowRightPanel(false)}>Back</div>
          <span className="font-bold">{chosenRoom}</span>
          <span className="cursor-pointer drop-shadow-2xl " onClick={() => setShowMembers(true)}><User className="drop-shadow-2xl drop-shadow-black" size={24}/></span>
        </div>

       {showMembers && (
  <div className="relative h-dvh p0p/xx  backdrop-blur-sm z-50 flex justify-end">

    <div className="w-full max-w-sm bg-white shadow-2xl">

      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-2xl font-bold">
          Group Members
        </h2>

        <X
          size={28}
          onClick={() => setShowMembers(false)}
          className="cursor-pointer hover:text-red-500"
        />
      </div>

      {/* Members */}

      <div className="p-4 space-y-3 overflow-y-auto h-[85%]">

        {members.map((m, i) => (

          <div
            key={i}
            className="flex justify-between items-center
            bg-gray-100
            hover:bg-orange-100
            transition
            rounded-xl
            px-4
            py-3"
          >

            <div className="flex items-center gap-3">

              <div
                className="
                h-11
                w-11
                rounded-full
                bg-orange-300
                flex
                items-center
                justify-center
                font-bold
                text-lg"
              >
                {m[0].toUpperCase()}
              </div>

              <div>

                <div className="font-semibold">
                  {m}
                </div>

                <div className="text-sm text-gray-500">

                  {m === admin
                    ? "👑 Creator"
                    : "Member"}

                </div>

              </div>

            </div>

            {m !== admin && (

              <Delete
                size={20}
                className="text-red-500 cursor-pointer hover:scale-110 transition"
                onClick={() => handleDelete(m)}
              />

            )}

          </div>

        ))}

      </div>

      <div className="border-t p-4 font-semibold text-gray-600">
        Total Members : {members.length}
      </div>

    </div>

  </div>
)}
        {/* Messages */}
        {!showMembers && <div className="flex-1 flex flex-col mb-3 gap-2 p-3  h-dvh overflow-y-auto  ">
          
          {messages
            .filter((m) => m.roomId === chosenRoom)
            .map((m, i) => {
              const isCurrentUser = m.username === username;
              
              return (
                <div key={i} onClick={() => setreplyingto(m)} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`p-2 w-full shadow-md hover:shadow hover:border-white shadow-black border-2 border-white/20  md:max-w-md max-w-3xs rounded-lg  ${isCurrentUser ? "bg-blue-600 h-auto text-white  " : "bg-black/20 h-auto text-black"} `}>
                     {m.replyto && m.replyto.username && m.replyto.message && (
  <div className="text-sm bg-gray-200 p-2 text-black rounded-t-2xl">
    {m.replyto.username} {"-> "} {m.replyto.message}
  </div>
                  )}
                  <div className="flex-wrap">
                  <div className="text-shadow-gray-100 text-[15px] ">{m.username}</div>
                    {m.imageto && <img src={m.imageto} className="rounded-2xl p-1"  />}
                    <span className=" w-fit text-lg max-w-xl break-words">{m.message}</span>
                    </div>

                    <span className={`text-xs w-full flex justify-end ${isCurrentUser ? "text-white":"text-black"} ` }>{m.timestamp}</span>
                    
                  </div>
                </div>
              )
            })}
        </div>}
<Features sharewithsocket={setshareaudio} open={open} setOpen={setopen} />
        
        {typing.length > 0 && (
          <div className="text-gray-200 italic p-2">
            {typing.join(", ")} {typing.length > 1 ? "are" : "is"} typing...
          </div>
        )}

        {/* Input */}
        <div className="flex flex-col justify-center p-2 pt-0 ">
       


  {
    giveMess ?  <div className="flex gap-2 p-2 pt-0 items-end">
        
  <div className="rounded-2xl w-full bg-white">
    {replyingto && (
      <div className="p-2  rounded-t-2xl gap-4 w-full flex justify-between items-center">
        <span>{replyingto.username} → {replyingto.message}</span>
        <div className="w-full flex  justify-end mr-7">
        <X onClick={() => setreplyingto(false)} size={22} className="cursor-pointer font-bold border-2 border-black/30 text-black/30 rounded-full"/>
          </div>
      </div>
    )}
    {recommendation?.length > 0 && 
    <motion.div initial={{x:0 , opacity:0}} animate={{x:1 , opacity:1}} transition={{delay:0.5}} exit={{x:0 , opacity:0}} className="rounded-2xl  text-black flex gap-2 md:gap-10 p-1   w-full bg-white">
      {recommendation?.slice(0,3).map((rec , i) => (
        <div onClick={() => setMessageInput(rec)} className="border  p-2 md:text-lg text-xs rounded-2xl" key={i}>{rec}</div>
      ))}
    </motion.div>
}
<div className="relative w-full">
  <input
    value={messageInput}
    onChange={handleInput}
    placeholder="Write message..."
    className="w-full rounded-xl border-4 border-white/90 bg-[#FBA987] p-2 pr-28 shadow-md shadow-black"
  />

  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
    <GroupImage
      roomId={chosenRoom}
      onUploadComplete={(url) => {
        if (url) {
          sendMessage(url);
          setImageSend(url);
        }
      }}
    />

    <button
      onClick={() => setopen(true)}
      className="rounded-full p-2 hover:bg-gray-200"
    >
      <Menu size={20} />
    </button>
  </div>
</div>
  </div>

  <button
  className="bg-black text-white shadow-md hover:shadow  shadow-black border-2 border-white/40 h-10 px-5 rounded-xl"
  onClick={() => {
    if (ImageSend) {
      setImageSend("")
    } else {
      sendMessage(); 
    }
    setsend(true);
  }}
>
  Send
</button>

</div>:<div className="bg-white p-3 text-xl w-full gap-3 flex justify-center font-bold rounded-2xl">
  Send Request to the user
  <button onClick={() => selectjoinRoom(chosenRoom)} className="shadow-md shadow-black p-1 bg-gray-500 rounded-2xl text-md">Request</button>
</div>
  }

        </div>
      </div>:<div
  className="
   bg-white shadow-xl rounded-2xl  flex flex-col w-full md:w-3/4 justify-between p-1
  "
>
  {/* Icon */}
 <div className="relative z-10 flex items-center gap-5 px-8 py-6 rounded-2xl bg-[#FBA987] backdrop-blur-xl border border-white/20 shadow-2xl">

  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/10 border border-black">
    <MessageCircleMore size={34} className="text-black" />
  </div>

  <div className="flex flex-col">
    <span className="text-xs uppercase tracking-[0.35em] text-black font-semibold">
      Welcome
    </span>

    <h2 className="text-3xl font-bold text-black">
      Chat With Chat
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Connect instantly, create groups, and start meaningful conversations.
    </p>
  </div>

</div>
  {/* Heading */}
  <h1 className="relative z-10 mt-8 text-4xl font-bold text-black text-center">
    Start a Conversation
  </h1>

  {/* Description */}
  <div className="w-full flex justify-center">
  <p className="relative z-10 mt-4 max-w-xl flex justify-center text-center text-gray-800 text-lg leading-8 px-6">
    Create a new group or select an existing one to start chatting,
    share files, and stay connected with your friends.
  </p>
  </div>

  {/* Features */}
  <div className="relative z-10 flex gap-8 mt-10 flex-wrap justify-center">

    <div className="flex items-center gap-3 bg-black/10 px-5 py-3 rounded-xl border border-white/10">
      <Users className="text-black" />
      <span className="text-gray-900" onClick={() => setPopup(true)} >Create Groups</span>
    </div>

    <div className="flex items-center gap-3 bg-black/10 px-5 py-3 rounded-xl border border-white/10">
      <MessageCircleMore className="text-black" />
      <span
  onClick={() => {
    if (rooms.length > 0) {
      selectRoom(rooms[0]);
    }
  }}
  className="text-gray-900 cursor-pointer"
>
  Instant Messaging
</span>
    </div>

  </div>

  {/* Button */}
  <button className="relative z-10 mt-12 flex items-center gap-2 rounded-xl  px-8 py-4 text-lg font-semibold text-black transition-all duration-300 ">
    Create Group
    <ArrowRight size={20} className="hover:ml-4" />
  </button>

</div>}
</div>
    </div>
    </div>
    
    </>
  );
}