import React from "react"
import Users from "./components/Users"
import { Main, Grommet, grommet } from "grommet"
import Rooms from "./components/Rooms"
import Chat from "./components/Chat"


export default function App() {

    return (
        <Grommet theme={grommet}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 5fr 1fr"}}>
            <Users />
            <Chat />
            <Rooms />
        </div>
        </Grommet>
    )
}