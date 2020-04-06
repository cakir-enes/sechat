
import create from "zustand"
import React, { useEffect } from "react"

export const [useUserStore, userApi] = create(set => ({
    users: [],
    changeUserStatus: (username, loggedIn) => set(s => {
        let i = s.users.findIndex(u => u.name == username)
        let newStatus = { name: username, status: loggedIn ? "online" : "offline" }
        let isNewUser = i < 0
        if (isNewUser) return { users: [...s.users, newStatus] }
        return { users: [...s.users.slice(0, i), newStatus, ...s.users.slice(i + 1)] }
    }),
}))
