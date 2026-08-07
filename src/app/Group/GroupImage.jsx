"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Image, X } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function GroupImage({ roomId, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { send, setsend } = useAuth();

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  useEffect(() => {
    if (!file || !send) return;

    const uploadImage = async () => {
      setUploading(true);

      const formData = new FormData();
      formData.append("roomId", roomId);
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
        setsend(false);
      } catch (err) {
        console.log(err);
        onUploadComplete(null);
      } finally {
        setUploading(false);
        setPreview(null);
        setFile(null);
      }
    };

    uploadImage();
  }, [file, send]);

  return (
    <>
      {/* Preview */}
      {preview && (
        <div className="absolute bottom-14 right-0 z-50 h-44 w-44 overflow-hidden rounded-xl border bg-white shadow-xl">
          <button
            onClick={() => {
              setPreview(null);
              setFile(null);
            }}
            className="absolute right-2 top-2 z-10 rounded-full bg-white p-1"
          >
            <X size={18} />
          </button>

          <img
            src={preview}
            alt="preview"
            className="h-full w-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
              {progress}%
            </div>
          )}
        </div>
      )}

      {/* Hidden Input */}
      <input
        type="file"
        id="ProfileGroupPic"
        className="hidden"
        onChange={handleChange}
      />

      {/* Upload Icon */}
      <label
        htmlFor="ProfileGroupPic"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-200"
      >
        <Image size={22} className="text-black" />
      </label>
    </>
  );
}