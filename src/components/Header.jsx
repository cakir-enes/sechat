import React, { useEffect, useState } from "react"
import { Header as GHeader, Button, Box, Text, Heading, Stack, DropButton, List, Markdown } from "grommet"
import { Logout, SettingsOption, Notification, FormCheckmark, FormClose } from "grommet-icons"
import { useActiveUserStore } from "../hooks/useActiveUser"
import { useMessageStore } from "../hooks/useMessaging"
import { useNotificationStore } from "../hooks/useNotifications"

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

    let [pending] = useNotificationStore(s => [s.pending])

    return (<Stack anchor="top-right">
        <DropButton hoverIndicator icon={<Notification />}
            dropAlign={{ top: 'bottom' }}
            dropContent={
                <Box pad="small" background="light-2">
                    <Box direction="row" alignContent="between">
                        <Text alignSelf="center">
                            <Markdown >
                                **asda** wants to join **asdas**
                        </Markdown>

                        </Text>
                        <Button margin={{ left: "4px" }} primary color="limegreen" size="small" icon={<FormCheckmark />} />
                        <Button size="small" icon={<FormClose />} />
                    </Box>
                </Box>
            } />
        <Box pad={{ horizontal: "xsmall" }} background="limegreen" round>
            <Text size="small">{pending.length || 0}</Text>
        </Box>
    </Stack>)
}