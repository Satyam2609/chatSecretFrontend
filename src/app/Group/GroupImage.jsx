"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../AuthProvider"
import { Image } from "lucide-react"

export default function GroupImage({ value , setImageSend, onUploadComplete }) {
  const [GroupIma, setGroupIma] = useState(null);
  const [Preview, setPreview] = useState(null);
  const [uploadingProcess, setUploadingProcess] = useState(0);
  const [upload , setupload] = useState(false)

  const { send, setsend } = useAuth();

  const handleChanges = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupIma(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!send || !GroupIma || !value) return;

    const uploadImage = async () => {
      const formdata = new FormData();
      formdata.append("roomId", value);
      formdata.append("image", GroupIma);
      setupload(true);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/api/ImageShare`,
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadingProcess(percent);
            },
            withCredentials: true,
          }
        );

        setImageSend(res.data.imageUrl); 
        if (onUploadComplete) onUploadComplete(res.data.imageUrl); 
        setsend(false);
        setupload(false);
        setPreview(null)
      } catch (err) {
        console.log("Upload error", err);
        setsend(false);
        setupload(false);
      }
    };

    uploadImage();
  }, [send]);

  return (
    <div className={` absolute ${Preview ? " mb-[15rem] h-40 w-40 ":"h-20 w-20 mb-[12rem]"}`} >
  <input
    type="file"
    id="ProfileGroupPic"
    onChange={handleChanges}
    className="hidden"
  />

  <label
    htmlFor="ProfileGroupPic"
    className={`block h-full w-full rounded-2xl cursor-pointer ${Preview && "bg-white animate-bounce"}`}
  >
    {Preview ? (
      <img
        src={Preview}
        className="h-full w-full rounded-2xl  object-cover"
      />
    ) : (
      <Image size={74} className="m-auto rounded-2xl bg-white p-1 mt-4" />
    )}

    {upload && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold">
        {uploadingProcess}%
      </div>
    )}
  </label>
</div>

  )
}
