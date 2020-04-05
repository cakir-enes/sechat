import React, { useState } from "react"
import { useRoomStore } from "../hooks/useRooms"
import { Accordion, AccordionPanel, Box, Heading, Button, TextInput } from "grommet"
import { UserList } from "./Users"
import { AddCircle, Add, Checkmark, Close } from "grommet-icons"

export default function Rooms() {
    let [rooms, createRoom] = useRoomStore(s => [s.rooms, s.createRoom])

    let [name, setName] = useState("")
    let [isCreating, setIsCreating] = useState(false)

    let create = () => {
        setIsCreating(false)
        setName("")
        createRoom(name)
    }

    return (
        <Box>
            {isCreating ? (<Box direction="row" animation="fadeIn">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <Button margin={{ left: "2px" }} size="small" primary icon={<Checkmark />} />
                <Button margin={{ left: "2px" }} size="small" icon={<Close />} onClick={() => { setIsCreating(false); setName("") }} />
            </Box>
            ) : (<Box direction="row" animation="slideDown" background="brand">
                <Heading margin="none">
                    Rooms
                        </Heading>
                <Button onClick={() => setIsCreating(true)} icon={<Add size="medium" />} />
            </Box>)}
            <Accordion>
                {rooms.map(r => (
                    <AccordionPanel key={r.name} label={r.name}>
                        <UserList users={r.users} />
                    </AccordionPanel>))}
            </Accordion>
        </Box>)
}