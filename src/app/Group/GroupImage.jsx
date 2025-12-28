"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { Image ,X} from "lucide-react"
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
        setsend(false) 
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
  <div
  className={`absolute ${
    Preview ? "h-40 w-40 mt-[-11rem]" : "h-15 w-15 mb-[22rem]"
  }`}
>
  <input
    type="file"
    id="ProfileGroupPic"
    onChange={handleChange}
    className="hidden"
  />

  <div className="relative h-full w-full rounded-2xl cursor-pointer">
    {Preview ? (
      <>
        <X
          className="absolute top-2 right-2 text-black z-30 cursor-pointer"
          size={22}
          onClick={() => setPreview(null)}
        />

        <img
          src={Preview}
          className="h-full w-full rounded-2xl object-cover"
        />
      </>
    ) : (
      <label
        htmlFor="ProfileGroupPic"
        className="flex h-full w-full mt-[-10px]  items-center justify-center rounded-2xl "
      >
        <Image size={44} className="text-black p-1" />
      </label>
    )}

    {upload && (
      <div className="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-black/50 text-white font-bold">
        {Progress}%
      </div>
    )}
  </div>
</div>

  )
}
