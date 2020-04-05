
import create from "zustand"
import React, { useEffect } from "react"

export const [useUserStore, userApi] = create(set => ({
    users: [{name: "kemal", status: "online"}, {name: "vikvik", status: "offline"}],
    changeUserStatus: (username, loggedIn) => set(s => {
        console.count("ASDAS")
        let i = s.users.findIndex(u => u.name == username)
        let newStatus = {name: username, status: loggedIn ? "online" : "offline"}
        let isNewUser = i < 0
        if (isNewUser) return {users: [...s.users, newStatus]}
        return {users: [...s.users.slice(0, i), newStatus, ...s.users.slice(i+1)]}
    }),
}))
