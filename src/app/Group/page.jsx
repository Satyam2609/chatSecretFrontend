"use client";

import Navbar from "../components/Navbar";
import GetUserName from "../register/GetUserName";
import Welcome from "../Welcome/Welcome";
import ChartAndtalk from "./ChartAndtalk";

export default function Group() {

    if (typeof window !== "undefined") {
    window.location.reload();
}
    return(
        <>
        <Welcome  duration={3000}/>
        <Navbar/>
        <ChartAndtalk/>
    <GetUserName/>

        </>

    );
}
