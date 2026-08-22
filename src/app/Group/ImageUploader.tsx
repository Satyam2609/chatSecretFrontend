"use client";

import axios from "axios";
import { useState , useEffect } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function ImageUploader({
  
  onUploadComplete,
  onUploadStart,
  onUploadEnd,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const {setsendImage, sendImage , setPreview , send , file , roomset , setroom} = useAuth()

  useEffect(() => {
       console.log("EFFECT RUN");
   console.log("file:", file);
   console.log("send:", send);
     if (!file || !send) return;
 
     const uploadImage = async () => {
       setUploading(true);
 
       const formData = new FormData();
       formData.append("roomId", roomset);
       formData.append("image", file);
 
       try {
         const res = await axios.post(
           `${process.env.NEXT_PUBLIC_CHAT_URL}/api/ImageShare`,
           formData,
           {
             headers: {
               "Content-Type": "multipart/form-data",
             },
             withCredentials: true,
             onUploadProgress: (e) => {
               if (!e.total) return;
               setProgress(Math.round((e.loaded * 100) / e.total));
             },
           }
         );
 
         onUploadComplete(res.data.imageUrl);
         
       } catch (err) {
         console.log(err);
         onUploadComplete(null);
       } finally {
         setUploading(false);
         setPreview(null);
         
       }
     };
 
     uploadImage();
   }, [file, send]);
  return (
    <div className="mt-2">

      {!uploading ? (
        <button
          type="button"
          disabled={!file}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload size={16} />

          Upload Image
        </button>
      ) : (
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full bg-black transition-all duration-200"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>
      )}

      {uploading && (
        <p className="mt-1 text-center text-xs text-gray-500">
          Uploading {progress}%
        </p>
      )}
    </div>
  );
}