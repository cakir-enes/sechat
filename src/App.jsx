import React from "react"
import Users from "./components/Users"
import { Main, Grommet, grommet, Box } from "grommet"
import Rooms from "./components/Rooms"
import Chat from "./components/Chat"
import Header from "./components/Header"
import useChangeListener from "./hooks/useChangeListener"


export default function App() {
    useChangeListener()
    
    return (
        <Grommet theme={grommet}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 5fr 1fr"}}>
            <Users />
            <Box>
                <Header />
                <Chat />
            </Box>
            <Rooms />
        </div>
        </Grommet>
    )
}