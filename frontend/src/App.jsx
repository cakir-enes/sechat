import React, { useState, useEffect } from "react"
import Users from "./components/Users"
import { Main, Grommet, grommet, Box, Tabs, Tab, Heading } from "grommet"
import Header from "./components/Header"
import Rooms from "./components/Rooms"
import Chat from "./components/Chat"
import { useActiveUserStore } from "./hooks/useActiveUser"
import Login from "./components/Login"
import Register from "./components/Register"


export default function App() {

    let [user, loggedin] = useActiveUserStore(s => [s.activeUser, s.loggedin])
    useEffect(() => {
        setTimeout(() => {
            // loggedin({ name: "pllz" })
        }, 1000)
    }, [])
    return (
        <Grommet theme={grommet}>
            {user ? (
                <div style={{ display: "grid", gridTemplateColumns: "minmax(100px, 250px) auto minmax(auto, 250px)" }}>
                    <Users />
                    <Box>
                        <Header />
                        <Chat />
                    </Box>
                    <Rooms />
                </div>) : <Home />}
        </Grommet>
    )
}


function Home() {
    let [activeIdx, setActiveIdx] = useState(0)

    return (
        <Main animation="fadeIn" pad="large" margin="large" style={{ maxWidth: "800px", margin: "auto" }}>
            <Heading>Sechat</Heading>
            <Tabs activeIndex={activeIdx} onActive={i => setActiveIdx(i)}>
                <Tab title="Login">
                    <Login />
                </Tab>
                <Tab title="Register">
                    <Register />
                </Tab>
            </Tabs>
        </Main>
    )
}