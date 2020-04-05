import React, { useState } from "react"
import Users from "./components/Users"
import { Main, Grommet, grommet, Box, Header, Tabs, Tab, Heading } from "grommet"
import Rooms from "./components/Rooms"
import Chat from "./components/Chat"
import { useActiveUserStore } from "./hooks/useActiveUser"
import Login from "./components/Login"
import Register from "./components/Register"


export default function App() {

    let [user] = useActiveUserStore(s => [s.activeUser])

    return (
        <Grommet theme={grommet}>
            {user ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr 1fr" }}>
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
        <Main animation="fadeIn" pad="large">
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