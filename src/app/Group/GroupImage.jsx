"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { Image } from "lucide-react"
import { useAuth } from "../AuthProvider"

export default function GroupImage({ roomId, onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [Preview, setPreview] = useState(null)
  const [upload, setUploading] = useState(false)
  const [Progress, setProgress] = useState(0)
  const {send ,setsend} = useAuth()

  const handleChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  useEffect(() => {
    if (!file || !send) return

    const uploadImage = async () => {
      setUploading(true)
      const formData = new FormData()
      formData.append("roomId", roomId)
      formData.append("image", file)

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CHAT_URL}/api/ImageShare`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
            withCredentials: true,
          }
        )
        onUploadComplete(res.data.imageUrl)
        setsend(false) // parent ko URL bhej do
      } catch (err) {
        console.log("Upload error", err)
        onUploadComplete(null)
      } finally {
        setUploading(false)
        setPreview(null)
        setFile(null)
      }
    }

    uploadImage()
  }, [file , send])

  return (
   <div className={` absolute   ${Preview ? " mb-[15rem] h-40 w-40 ":"h-15 w-15 mb-[12rem]"}`} >
  <input
    type="file"
    id="ProfileGroupPic"
    onChange={handleChange}
    className="hidden"
  />

  <label
    htmlFor="ProfileGroupPic"
    className={`block h-full w-full rounded-2xl shadow-md shadow-black  cursor-pointer ${Preview && "bg-white animate-bounce"}`}
  >
    {Preview ? (
      <img
        src={Preview}
        className="h-full w-full rounded-2xl  object-cover"
      />
    ) : (
      <Image size={54} className="m-auto rounded-2xl bg-white border-4 border-black/20 p-1 mt-4" />
    )}

    {upload && (
      <div className="absolute inset-0 flex items-center rounded-2xl justify-center bg-black/40 text-white font-bold">
        {Progress}%
      </div>
    )}
  </label>
</div>
  )
}
