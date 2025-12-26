import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"

export default function GroupNameImage({roomId,groupImage , sendGroupUrlImg}){
    const [Preview , setPreview] = useState(null)
    const [image , setimage] = useState(null)
    
  

   const handlechanges = (e) => {
    const file = e.target.files[0]
    if (!file) return
setimage(file)
    setPreview(URL.createObjectURL(file))

    
  }
    useEffect(() => {
        if(!groupImage || !image || !roomId) return 
        const sendProfileImage = async() => {
            const formdata = new FormData()
            formdata.append("groupImage" , image)
            formdata.append("roomId",roomId )
            
        
            const res = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/GroupAvatar` , formdata ,{
                headers:{
                    "Content-Type" : "multipart/form-data"
                },
                withCredentials:true
            },)
            console.log("error" , res.data)

            sendGroupUrlImg(res.data.groupImagePr)
       
     }
     sendProfileImage()
                
    },[groupImage , image])


    return(
        <div className="h-20 flex justify-center mb-10 rounded-2xl w-full">
           <label htmlFor="imageGrop"> <img src={Preview} alt="Choose image" className=" rounded-full object-cover h-full w-20" />
           <p>Group Profile</p>
           </label>
            <input type="file" accept="image/*"  onChange={handlechanges} id="imageGrop" className="hidden"/>
        </div>
    )
}