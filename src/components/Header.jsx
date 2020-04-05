import React, { useEffect, useState } from "react"
import { Header as GHeader, Button, Box, Text, Heading, Stack, DropButton, List, Markdown } from "grommet"
import { Logout, SettingsOption, Notification, FormCheckmark, FormClose } from "grommet-icons"

export default function Header() {

    return (
        <GHeader background="brand">
            <Heading margin="none">ASDASD</Heading>
            <GHeader justify="end">
                <PendingRequests />
                <Button icon={<SettingsOption />} />
                <Button icon={<Logout />} />
            </GHeader>
        </GHeader>)
}


function PendingRequests() {

    let [requests, setRequests] = useState()

    useEffect(() => {


    }, [])

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
                        <Button margin={{left: "4px"}} primary color="limegreen" size="small" icon={<FormCheckmark />} />
                        <Button size="small" icon={<FormClose />} />
                    </Box>
                </Box>
            } />
        <Box pad={{ horizontal: "xsmall" }} background="limegreen" round>
            <Text size="small">8</Text>
        </Box>
    </Stack>)
}