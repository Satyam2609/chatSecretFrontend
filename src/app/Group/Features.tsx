"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import SoundRecorder from "./SoundRecorder";

export default function Features({open , setOpen , sharewithsocket}) {
  
  const [location, setLocation] = useState("");
  if(!open){
    return null;
  }

  const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Accuracy:", accuracy, "meters");

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );

      const data = await res.json();

      console.log(data);
      console.log("Address:", data.display_name);
    },
    (error) => {
      console.log(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  return (
    <>

      {/* Overlay */}
      <div
        className={`fixed  inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Popup */}
      <div className="px-30">
      <div
        className={`relative flex justify-between w-full  bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        
       <div className="flex items-center gap-4">

            {/* Location Button */}
            <button
              onClick={getLocation}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md transition hover:bg-blue-600 active:scale-95"
            >
              <MapPin size={23} />
            </button>

            {/* Mic Button */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-md">
              <SoundRecorder sendAudio={sharewithsocket}/>
            </div>

          </div>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={22} />
          </button>

        </div>
      </div>
    </>
  );
}