"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Menu, MoreVertical, Delete } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { Loader2 , User , Image} from "lucide-react";

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
  const { userna , setrequest , accept } = useAuth();

  useEffect(() => {
    if (userna) setUsername(userna);

    const newSocket = io("https://chatsecretsocket-3.onrender.com");
    setSocket(newSocket);

    newSocket.on("connect", () => {
    if (userna) newSocket.emit("userna", userna);
  });


    newSocket.on("roomlist", (groupsList) =>{
       setloader(true);
       setRooms(groupsList); 
       setloader(false) 
    });
    newSocket.on("getRoomMessage", ({ roomId, username, message , timestamp , replyto , imageto}) =>
      setMessages((prev) => [...prev, { roomId, username, message , timestamp , replyto , imageto}])
    );
    newSocket.on("members", (data) => setMembers(data.members));
    newSocket.on("members", (adminData) => setAdmin(adminData.adminUserName));
    newSocket.on("previousMessages", (msgs) => setMessages(msgs));

    newSocket.on("typing", ({ username }) => {
      setTyping((prev) => (!prev.includes(username) ? [...prev, username] : prev));
    });
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

  const handleChanges = (e) => {
    setImageSend(e.target.files[0])
  }


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

  useEffect(() => {
  if (!accept?.roomId || !accept?.user) return;

  socket.emit("acceptResponse", {
    roomId: accept.roomId,
    username: accept.user,
    access: "yes"
  });
}, [accept])


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

  const sendMessage = async () => {
  if ((!messageInput.trim() && !ImageSend) || !chosenRoom) return;

  if (ImageSend) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;
      socket.emit("roomMessage", {
        roomId: chosenRoom,
        message: messageInput,
        username,
        replyto: replyingto ? { username: replyingto.username, message: replyingto.message } : null,
        imageto: base64Image
      });

      setMessageInput("");
      setImageSend(null);
      setreplyingto(null);
    };
    reader.readAsDataURL(ImageSend);
  } else {
    socket.emit("roomMessage", {
      roomId: chosenRoom,
      message: messageInput,
      username,
      replyto: replyingto ? { username: replyingto.username, message: replyingto.message } : null
    });
    setMessageInput("");
    setreplyingto(null);
  }
};


  const selectRoom = (room) => {
    setChosenRoom(room);
    socket.emit("selectRoom", { roomId: room, username });
    setShowRightPanel(true);
  };

  const groupDelete = () => {
    socket.emit("delete", chosenRoom);
    if (typeof window !== "undefined") window.location.reload();
  };

  

  const handleDelete = (member) => {
    socket.emit("deletemember", { roomId: chosenRoom, username: member });
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row p-2 gap-2 ">
      {/* Popup for Create/Join Room */}
      {popup && (
        <motion.div
          className="absolute z-50 top-15 left-0  bg-white shadow-2xl w-64 h-full max-h-120 p-4 rounded-r-2xl"
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex justify-between mb-4">
            <span className="text-xl text-black font-bold">Rooms</span>
            <span onClick={() => setPopup(false)} className="cursor-pointer text-black text-xl">X</span>
          </div>
          <input
            type="text"
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full border border-black text-black p-2 rounded-xl mb-3"
          />
          <button onClick={createRoom} className="bg-black text-white w-full p-2 rounded-xl mb-3">
            Create Room
          </button>
          <button onClick={joinRoom} className="bg-gray-300 text-black w-full p-2 rounded-xl">
            Join Room
          </button>

        </motion.div>
      )}

      {/* Left Panel - Room List */}
      <div
        className={`bg-white shadow-xl rounded-xl flex flex-col gap-4 p-2 w-full md:w-1/4
          ${showRightPanel ? "hidden md:flex" : "flex"}
          transition-all h-dvh duration-300`}
      >
        <div onClick={() => setPopup(true)} className="bg-black mt-15 text-white flex justify-between p-3 rounded-2xl cursor-pointer">
          <span className="font-bold">Create Your Group</span>
          <Menu />
        </div>

        {deleteBar && (
          <div className="p-2 bg-gray-600 text-black absolute top-20 max-w-xs rounded-xl w-full text-center cursor-pointer" onClick={groupDelete}>
            Delete Room
          </div>
        )}
        {RequestJoin &&
        <div className="flex w-full absolute h-full justify-center items-center">
     <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-black/40 absolute shadow-2xl  flex justify-center  text-white p-4 rounded-2xl">Request sent successfully</motion.span>
    </div>
}

        <div className="flex flex-col gap-2">
          {rooms.map((r, i) => (
            <div key={i} className="flex justify-between items-center text-black p-2 rounded-xl cursor-pointer" onClick={() => selectRoom(r)}>
              <span className="text-black">{loader? <Loader2 className="h-15 w-15 text-black animate-spin"/> : r}</span>
              <MoreVertical onClick={(e) => {setDeleteBar((prev) => !prev), e.stopPropagation()}} className="cursor-pointer p-1 rounded-2xl hover:bg-black/30" />
            </div>
          ))}
        </div>
        
      </div>

      {/* Right Panel - Chat */}
      <div
        className={`bg-gray-500 shadow-xl rounded-xl flex flex-col w-full md:w-3/4 justify-between p-1
          ${showRightPanel ? "block" : "hidden  md:flex"}
            absolute md:static md:h-auto h-dvh  transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between   md:mt-15 mt-0 items-center bg-black text-white p-3 rounded-xl mb-2">
          <div className="md:hidden cursor-pointer" onClick={() => setShowRightPanel(false)}>Back</div>
          <span>{chosenRoom}</span>
          <span className="cursor-pointer" onClick={() => setShowMembers(true)}><User size={24}/></span>
        </div>

        {showMembers && members.length > 0 && (
          <div className="absolute bg-black flex flex-col top-0 md:top-15 justify-between text-white p-4 rounded-xl w-full max-w-xs m-2 z-50">
            <div className="flex justify-end cursor-pointer" onClick={() => setShowMembers(false)}>X</div>
            {members.map((m, i) => (
              <div key={i} className="flex justify-between border-b border-white p-1">
                <span>{m === admin ? `${m} (Creator)` : m}</span>
                <Delete className="cursor-pointer" onClick={() => handleDelete(m)} />
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 flex flex-col  h-dvh overflow-y-auto mb-2 ">
          
          {messages
            .filter((m) => m.roomId === chosenRoom)
            .map((m, i) => {
              const isCurrentUser = m.username === username;
              return (
                <div key={i} onClick={() => setreplyingto(m)} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`p-2 w-full max-w-md rounded-lg ${isCurrentUser ? "bg-blue-500 h-auto text-white" : "bg-white h-auto text-black"}`}>
                     {m.replyto && m.replyto.username && m.replyto.message && (
  <div className="text-sm bg-gray-200 p-2 text-black rounded-t-2xl">
    {m.replyto.username} {"-> "} {m.replyto.message}
  </div>
)}
{
  m.imageto && <div className="h-30 w-full max-w-xs p-1 rounded-2xl"><img src={m.imageto}/></div>
}
                    <b className="text-black">{m.username}</b>{"-> "}<span className=" w-fit max-w-md break-words">{m.message}</span>
                    <div className="text-xs w-full flex justify-end text-black/30">{m.timestamp}</div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Typing indicator */}
        {typing.length > 0 && (
          <div className="text-gray-200 italic p-2">
            {typing.join(", ")} {typing.length > 1 ? "are" : "is"} typing...
          </div>
        )}

        {/* Input */}
        <div className="flex flex-col justify-center p-2 pt-0 ">
          <div className="flex mb-5">
           
                <input type="file" id="shereFile" onChange={handleChanges} accept="image/*"   className="hidden w-10" />
          </div>

          {replyingto && <div className="bg-white p-2 max-w-xl rounded-t-2xl w-full">
            <span>{replyingto.username}</span> {"-> "}<span>{replyingto.message}</span>
            </div>}
<div className="mb-5">
             {ImageSend ? (
  <img
    src={URL.createObjectURL(ImageSend)}
    alt="preview"
    className="w-32 h-32 rounded-xl"
  />
) : (
  <label htmlFor="shereFile">
    <Image size={39} className="bg-white rounded-2xl text-black p-1"/>
  </label>
)}
</div>

           
            <div className="flex gap-2 p-2 pt-0">
          <input
            value={messageInput}
            onChange={handleInput}
            placeholder="Write message..."
            className="flex-1 border p-2 rounded-xl bg-white text-black"
          />
          <button onClick={sendMessage} className="bg-black text-white px-5 rounded-xl">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
