import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import {motion} from "framer-motion"

export default function Welcome({duration = 3000}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const shown = localStorage.getItem("welcomeShown");

        if (shown === "false") {
            setVisible(false);
            return; // directly exit
        }

        // pehli baar login hua hai → welcome dikhao
        

        const timer = setTimeout(() => {
            setVisible(false);
            localStorage.setItem("welcomeShown", "false"); // mark as completed
        }, duration);

        return () => clearTimeout(timer);
    }, []);

if(!visible) return null
return(
    <div className="h-screen w-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="w-screen  md:w-1/2 h-full flex justify-center items-center p-6">
        <div className="space-y-10  w-screen">
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5 justify-center ">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5 justify-end w-screen">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            <TypeAnimation
        sequence={[`Welcome To Chat Secret `]}
        wrapper="span"
        cursor={true}
        repeat={0}
        className="text-3xl text-white flex justify-center text-black"
        />
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32  bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5 justify-end">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            <motion.div
            animate={{
                y:[0 , -9 , 0]
            }}
            transition={{
                duration:2.4,
                repeat:Infinity
            }}
             className="flex gap-5 justify-center">
              <div className="h-10 w-10 bg-white/10 rounded-full"></div>
              <div className="h-10 w-full max-w-sm p-1 flex items-center rounded-2xl bg-white/10">
                <div className="h-7 w-32 bg-white/20 rounded-xl"></div>
              </div>
            </motion.div>
            
            
        
        
        
        </div>
        </div>
        
    </div>
)
}