"use client"
import { useEffect , useState } from "react"
import { io } from "socket.io-client"
export default function ChatwithPeople(){
    const [socket , setsocket] = useState(null)
    const [users , setUsers] = useState([])
    const [message , setmessage] = useState([])
    const [messageInput , setmessageInput] = useState("")
    const [userId , setuserId] = useState("")
    const [receiverId , setreceiverId] = useState("")

    
    useEffect(() => {
        const username = localStorage.getItem("username")?.trim().toLowerCase()
        const newSocket = io("http://localhost:5000")
        setsocket(newSocket)     
        setuserId(username)

        newSocket.emit("register" , username)


        newSocket.on("getUser" , (userList) => {
            const other = userList.filter(u => u.trim() !== username)
            setUsers(other)
        })

        newSocket.on("getmessage", ({ senderId, receiverId, message }) => {
    setmessage((prev) => [...prev, { senderId, receiverId, message }]);
});



        return () => {
            newSocket.disconnect()
        }

    } , [])  

    const sendMessage = () => {
       
        if(receiverId && userId && messageInput ){
            socket.emit("privatemsg" , {
                senderId:userId,
                receiverId,
                message:messageInput
            })
             console.log(userId , receiverId , message)
            
             setmessage((prev) => [...prev, { senderId: userId,receiverId, message: messageInput }]);
            setmessageInput("")
        }
    }

    return (
        <div className="max-h-screen w-full">
            
            <div className="flex gap-2">
                {/* users */}
                <div className="h-full w-full border p-2  max-w-xs bg-cyan-200">
                    { 
                        users.map((Cuser , index) => (
                            <div onClick={() => setreceiverId(Cuser)} key={index} className={`h-full  w-full max-w-xs ${receiverId === Cuser ? "bg-gray-300 text-yellow-50":""}`}>
                                <div className="h-10 text-black w-full max-w-xs text-center p-2 border">{Cuser}</div>
                            </div>
                        ))

                    }
                </div>
                
                <div className="min-h-screen bg-black w-full border-1-white">
                    <div className="  p-10  rounded-2xl">
                        {message
  .filter((m) =>
    (m.senderId === userId && m.receiverId === receiverId) ||
    (m.senderId === receiverId && m.receiverId === userId)
  )
  .map((u, i) => (
    <div
      key={i}
      className={`${
        u.senderId === userId
          ? "mymsg text-start text-orange-400"
          : "othermsg text-end text-green-300"
      } p-2 rounded-2xl`}
    >
      {u.senderId === userId ? `Me: ${u.message}` : `${u.senderId}: ${u.message}`}
    </div>
  ))}



<div className="p-1 flex">
                    <input type="text" className="w-full rounded-2xl max-w-4xl bg-white p-2" placeholder="send msg..." onChange={(e) => setmessageInput(e.target.value)} value={messageInput}/>
                    <button onClick={sendMessage} className="text-white p-2">send</button>
                </div>

                    </div>
                </div>

            </div>

        </div>
    )

}