import React from "react"
import { List, Heading, Box } from "grommet"
import { useUserStore } from "../hooks/useUsers"

export default function Users() {

    let [users] = useUserStore(s => [s.users])

    return (
        <Box background="light-1">
            <Heading margin="none">Users</Heading>
            <UserList users={users} />
        </Box>)
}

export function UserList({ users }) {


    return <List primaryKey="name" secondaryKey="status" background="light-2"
        data={users.map(u => ({ name: u.name, status: <Circle color={u.status === "online" ? "green" : "red"} /> }))} />
}


function Circle({ color }) {
    return <div style={{ width: "12px", height: "12px", borderRadius: "6px", background: color }} />
}

