"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { Image } from "lucide-react"
export default function GroupImage({ value }) {
  const [GroupIma, setGroupIma] = useState(null);
  const [Preview, setPreview] = useState(null);
  const [uploadingProcess, setUploadingProcess] = useState(0);
  const [upload , setupload] = useState(false)

  const { send, setsend } = useAuth(); // boolean state NOT function

  const handleChanges = (e) => {
    const file = e.target.files[0];
    setGroupIma(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!send || !GroupIma || !value) return;

    const uploadImage = async () => {
      const formdata = new FormData();
      formdata.append("roomId", value);
      formdata.append("image", GroupIma);
      setupload(true)

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/api/ImageShare`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadingProcess(percent);
            },
            withCredentials: true,
          }
        );

        console.log(res.data);
        setsend(false);
        setupload(false)
      } catch (err) {
        console.log("Upload error", err);
        setsend(false);
      }
    };

    uploadImage();
  }, [send]);


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