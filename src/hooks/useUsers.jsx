
import create from "zustand"
import React, { useEffect } from "react"

const [useUserStore] = create(set => ({
    users: [{name: "kemal", status: "online"}, {name: "vikvik", status: "offline"}],
    changeUserStatus: (username, loggedIn) => set(s => {
        let i = s.users.findIndex(u => u.username == username)
        let newStatus = {username, status: loggedIn ? "online" : "offline"}
        let isNewUser = i < 0
        if (isNewUser) return [...users, newStatus]
        return {users: [...users.slice(0, i), newStatus, ...users.slice(i+1)]}
    }),
}))

export default function useUsers() {
    
    let [users] = useUserStore(s => [s.users])

    useEffect(() => {

    }, [])
    
    return { users }
}