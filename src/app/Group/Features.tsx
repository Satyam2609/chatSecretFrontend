"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";

export default function Features({open , setOpen}) {
  
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
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-110"
      >
        <MapPin size={24} />
      </button>

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
        className={`relative justify-center w-full  bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-end">
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className=" px-2">
          <MapPin
          onClick={getLocation}
            size={30}
            className=" absolute bg-blue-400 rounded-2xl px-2 inset-5 text-white"
          />
         
        </div>

        
      </div>
      </div>
    </>
  );
}