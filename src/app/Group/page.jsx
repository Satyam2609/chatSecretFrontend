"use client";

import Navbar from "../components/Navbar";
import GetUserName from "../register/GetUserName";
import Welcome from "../Welcome/Welcome";
import ChartAndtalk from "./ChartAndtalk";

export default function Group() {

    
    return(
        <>
        <div className="w-full">
        <Welcome  duration={3000}/>
        <Navbar/>
        <ChartAndtalk/>
    <GetUserName/>
    </div>

        </>

    );
}
