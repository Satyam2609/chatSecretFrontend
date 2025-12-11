"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { Image } from "lucide-react"
export default function GroupImage({value}){
    const [GroupIma , setGroupIma ] = useState(null)
    const [Preview , setPreview] = useState(null)
    const [uploadingProcess , setuploadingProccess] = useState(0)
    const [upload , setupload] = useState(true)
    const { setsend} = useAuth()

   
    const handleChanges = (e) => {
        const file = e.target.files[0]
        setGroupIma(file)
        setPreview(URL.createObjectURL(file))
    }

    
useEffect(() => {
    if(setsend && GroupIma && value){
        
        const formdata = new FormData
        formdata.append("roomId" , value)
        formdata.append("image" , GroupIma)
        try{
            const res = axios.post("https://chatsecretbackend.onrender.com/api//ImageShare" , formdata , {
                headers:{
                    "Content-Type" : "multipart/form-data"
                },
                onUploadProgress:(progressEvent) => {
                    const persent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setuploadingProccess(persent)

                },
                withCredentials:true
            })

            console.log(res.data)
        }
        catch(err){
            console.log("error comes" , err)

        }
    }
} , [setsend , GroupIma])


    return(
        <div className={`h-12 w-15 p-2  overflow-hidden ${Preview && "h-35 w-35"}`}>
            <input type="file" id="ProfileGroupPic" onChange={handleChanges} className="hidden"/>
            <label htmlFor="ProfileGroupPic" className={`h-34 w-14 bg-white  ${Preview && "h-60 w-20 object-contain"}`}>{Preview ? <img src={Preview} className="rounded-full object-contain" /> : <Image size={35} />}
            <div className="absolute">
                {
                upload &&<div className="absolute  flex items-center justify-center">{uploadingProcess}</div>
            }
            </div>
           
            </label>
            
        </div>
    )

}