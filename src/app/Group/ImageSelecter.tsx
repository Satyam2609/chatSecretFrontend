"use client";

import { useState } from "react";
import { Image, X } from "lucide-react";
import { useAuth } from "../AuthProvider";

export default function ImageSelector() {
  const [preview, setPreview] = useState(null);

  const {sendImage , setFile} = useAuth()

  const handleChange = (e:any) => {
    const data = e.target.files?.[0];

    if (!data) return;
    console.log("cdkj",data)
    setFile(data)
    const previewUrl = URL.createObjectURL(data);

    setPreview(previewUrl);

    
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFile(null);
  };

  return (
    <>
      {/* File Input */}
      <input
        type="file"
        id="groupImage"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Select Image Button */}
      <label
        htmlFor="groupImage"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-200"
      >
        <Image
          size={22}
          className="text-black"
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="absolute bottom-14 right-0 z-50 h-44 w-44 overflow-hidden rounded-xl border bg-white shadow-xl">

          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 shadow"
          >
            <X size={18} />
          </button>

          <img
            src={preview}
            alt="Selected image"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </>
  );
}