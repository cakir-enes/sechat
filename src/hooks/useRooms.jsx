import React, { useState, useEffect } from 'react'
import { replace } from './utils'
import create from "zustand"

export const [useRoomStore] = create(set => ({
    rooms: [{name: "Cet", users: [{name: "asd", status: "online"}, {name: "zxc", status: "offline"}]}],
    currentRoom: null,
    // TODO
    userLeftorJoined: (roomname, username) => set(s => {
        let roomIdx = rooms.find(r => r.name = roomname)
        if (!roomIdx) return s
        let room = rooms[roomIdx]
        let userIdx = room.findIndex(user => user.name === username)
        if (userIdx < 0) return s
        
        return {room}
    }),
    changeUserStatus: (username, status) => set(s => {
        let i = s.users.findIndex(u => u.username == username)
        switch (status) {
            case "loggedin":{

            }
            case "logout":{

            }
            case "left": {

            }
            case "joined": {

            }
            default:
                return s
        }
        let newStatus = {username, status: loggedIn ? "online" : "offline"}
        let isNewUser = i < 0
        if (isNewUser) return [...users, newStatus]
        return {users: [...users.slice(0, i), newStatus, ...users.slice(i+1)]}
    }),
    createRoom: (roomname, username) => {

    },
    changeRoom: (newRoom) => set(s => ({currentRoom: newRoom})),
}))

