import React, { useState } from "react"
import { useRoomStore } from "../hooks/useRooms"
import { Accordion, AccordionPanel, Box, Heading, Button, TextInput } from "grommet"
import { UserList } from "./Users"
import { AddCircle, Add, Checkmark, Close } from "grommet-icons"
import { useActiveUserStore } from "../hooks/useActiveUser"
import useCrypto, { createAESKey } from "../hooks/useCrypto"
import { set } from "idb-keyval"

export default function Rooms() {
    let [rooms] = useRoomStore(s => [s.rooms])


    let [user] = useActiveUserStore(s => [s.active])

    let [name, setName] = useState("")
    let [isCreating, setIsCreating] = useState(false)
    let { sign } = useCrypto()

    let create = async () => {
        let req = { room_name: name, admin_name: user.name, signature: await sign(name + user.name) }
        try {
            console.log("PLZUDE")
            let resp = await fetch("http://localhost:8000/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            })
            console.dir(req)
            if (!resp.ok) throw new Error("plz")
            set(`room:${name}`, await createAESKey())
            setName("")
            setIsCreating(false)
        } catch {
            setName("NOT VALID")
        }
    }

    let cancel = () => {
        setIsCreating(false)
        setName("")
    }
    return (
        <Box>
            {isCreating ? (<Box direction="row" animation="fadeIn">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <Button margin={{ left: "2px" }} size="small" primary icon={<Checkmark />} onClick={create} />
                <Button margin={{ left: "2px" }} size="small" icon={<Close />} onClick={cancel} />
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