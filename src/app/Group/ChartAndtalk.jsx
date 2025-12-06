"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Menu, MoreVertical, Delete } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { Loader2 } from "lucide-react";

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
  const [RequestJoin , setRequestJoin] = useState([])

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
    newSocket.on("getRoomMessage", ({ roomId, username, message }) =>
      setMessages((prev) => [...prev, { roomId, username, message }])
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
   newSocket.on("RequerstjoinRoom", ({ roomId, request }) => {
  setrequest(prev => [...prev, { roomId, username: request }]);
});

    return () => {
      newSocket.disconnect();
      newSocket.off("typing");
      newSocket.off("hidetyping");
    };
  }, [userna]);

  const createRoom = () => {
    if (!roomName.trim()) return alert("Fill all fields");
    socket.emit("createRoom", { roomId: roomName.trim(), username });
    setChosenRoom(roomName.trim());
    setPopup(false);
  };

  const joinRoom = () => {
    if (!roomName.trim() || !username.trim()) return alert("Fill all fields");
    socket.emit("joinRoom", { roomId: roomName.trim(), username});
    setChosenRoom(roomName.trim());
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

  const sendMessage = () => {
    if (!messageInput.trim() || !chosenRoom) return;
    socket.emit("roomMessage", { roomId: chosenRoom, message: messageInput, username });
    setMessageInput("");
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
          className="absolute z-50 top-15 left-0 h-full bg-white shadow-2xl w-64 p-4 rounded-r-2xl"
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
          transition-all duration-300`}
      >
        <div onClick={() => setPopup(true)} className="bg-black mt-15 text-white flex justify-between p-3 rounded-2xl cursor-pointer">
          <span className="font-bold">Create Your Group</span>
          <Menu />
        </div>

        {deleteBar && (
          <div className="p-2 bg-white text-black rounded-xl w-full text-center cursor-pointer" onClick={groupDelete}>
            Delete Room
          </div>
        )}

        <div className="flex flex-col gap-2">
          {rooms.map((r, i) => (
            <div key={i} className="flex justify-between items-center text-black p-2 rounded-xl cursor-pointer hover:bg-gray-200" onClick={() => selectRoom(r)}>
              <span className="text-black">{loader? <Loader2 className="h-15 w-15 text-black animate-spin"/> : r}</span>
              <MoreVertical onClick={() => setDeleteBar(true)} className="cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div
        className={`bg-gray-500 shadow-xl rounded-xl flex flex-col w-full md:w-3/4 justify-between p-2
          ${showRightPanel ? "block" : "hidden md:flex"}
            absolute md:static md:h-auto h-screen transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between md:mt-15 mt-0 items-center bg-black text-white p-3 rounded-xl mb-2">
          <div className="md:hidden cursor-pointer" onClick={() => setShowRightPanel(false)}>Back</div>
          <span>{chosenRoom}</span>
          <span className="cursor-pointer" onMouseEnter={() => setShowMembers(true)}>Members</span>
        </div>

    
        {showMembers && (
          <div className="absolute bg-black text-white p-2 rounded-xl w-full max-w-xl m-2 z-50">
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
        <div className="flex-1 flex flex-col overflow-y-auto mb-2 ">
          {messages
            .filter((m) => m.roomId === chosenRoom)
            .map((m, i) => {
              const isCurrentUser = m.username === username;
              return (
                <div key={i} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`p-2 rounded-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-black"}`}>
                    <b>{m.username}</b>: {m.message}
                    <div className="text-xs w-full flex justify-end text-black/30">{m.timestamp}</div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Typing indicator */}
        {typing.length > 0 && (
          <div className="text-gray-200 italic p-2">
            {typing.join(", ")} {typing.length > 1 ? "are" : "is"} typing...
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 p-2">
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
  );
}
