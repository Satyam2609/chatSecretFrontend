import { Edit } from "lucide-react"
import Navbar from "../components/Navbar"

export default function ProfilePage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full">
        {/*Profile*/}
      <div className="w-full p-7 border-b border-white flex flex-col items-center gap-6 md:flex-row md:gap-10">
       <div className="md:h-32 md:w-32 h-24 w-24 rounded-full bg-black/30 md:mt-4 mt-0 flex-shrink-0"></div>

        <div className="flex flex-col space-y-4 w-full max-w-sm">

          {/* USERNAME */}
          <div className="text-xl text-white">
            <p>UserName:</p>
            <div className="flex w-full">
              <input
                type="text"
                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
          </div>

          {/* EMAIL */}
          <div className="text-xl text-white">
            <p>Email:</p>
            <div className="flex w-full">
              <input
                type="text"
                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
          </div>

          {/* NAME */}
          <div className="text-xl text-white">
            <p>Name:</p>
            <div className="flex w-full">
              <input
                type="text"
                className="border border-white rounded-l-2xl px-4 py-2 w-full bg-transparent text-white"
              />
              <button className="bg-white p-3 text-black rounded-r-2xl">
                <Edit />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE CHAT SKELETON */}
        <div className="hidden md:flex flex-col w-full max-w-md ml-30 space-y-4 justify-end">
          <div className="flex gap-3 justify-start transition-all animate-bounce">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>

          <div className="flex gap-3 justify-center transition-all animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="bg-gray-700 px-4 py-2 rounded-2xl shadow-lg w-60">
              <div className="w-40 h-3 bg-gray-600 rounded-md"></div>
            </div>
          </div>
        </div>

      </div>

      <div>
        <div>
          <div>Password</div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>


      

    </div>
  </>
  )
}
