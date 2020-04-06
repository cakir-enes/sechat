import React, { useEffect, useState } from "react"
import { Header as GHeader, Button, Box, Text, Heading, Stack, DropButton, List, Markdown } from "grommet"
import { Logout, SettingsOption, Notification, FormCheckmark, FormClose } from "grommet-icons"
import { useActiveUserStore } from "../hooks/useActiveUser"
import { useMessageStore } from "../hooks/useMessaging"
import { useNotificationStore } from "../hooks/useNotifications"
import useCrypto from "../hooks/useCrypto"

export default function Header() {
    let [logout] = useActiveUserStore(s => [s.logout])
    let [room] = useMessageStore(s => [s.room])

    return (
        <GHeader background="brand" style={{}} alignSelf="start" elevation="medium">
            <Heading margin="none">{room ? room.name : "Sechat"}</Heading>
            <GHeader justify="end">
                <PendingRequests />
                <Button icon={<SettingsOption />} />
                <Button icon={<Logout />} onClick={logout} />
            </GHeader>
        </GHeader>)
}


function PendingRequests() {

    let [pending, remove] = useNotificationStore(s => [s.pending, s.remove])
    let { wrapRoomkey } = useCrypto()

    let handle = async (roomname, req_id, accepting) => {
        console.log("DIS SHIT")
        let req = { req_id, accepting, signature: "" }
        let resp = await fetch("http://localhost:8000/handle-join-req", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req)
        })
        if (!resp.ok) throw new Error("Something went wrong")
        if (accepting) {
            let { rsa_public_key } = resp.json()
            // let encr = await wrapRoomkey(rsa_public_key, roomname)
            let forwardReq = { req_id, key: "ASD", signature: "asdzcx" }
            console.log("SENDING: " + JSON.stringify(req))
            let forwardResp = await fetch("http://localhost:8000/forward-key", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(forwardReq)
            })
            if (forwardResp.ok) {
                remove(req_id)
            }
        }
    }

    return (<Stack anchor="top-right">
        <DropButton hoverIndicator icon={<Notification />}
            dropAlign={{ top: 'bottom' }}
            dropContent={
                <Box pad="small" background="light-2">
                    {pending.map(p => (
                        <Box key={p.req_id} direction="row" alignContent="between">
                            <Text alignSelf="center">
                                <Markdown>
                                    {`**${p.issuer}** wants to join **${p.room_name}**`}
                                </Markdown>
                            </Text>
                            <Button onClick={() => handle(p.room_name, p.req_id, true)} margin={{ left: "4px" }} primary color="limegreen" size="small" icon={<FormCheckmark />} />
                            <Button onClick={() => handle(p.room_name, p.req_id, false)} size="small" icon={<FormClose />} />
                        </Box>
                    ))}
                </Box>
            } />
        <Box pad={{ horizontal: "xsmall" }} background="limegreen" round>
            <Text size="small">{pending.length || 0}</Text>
        </Box>
    </Stack>)
}