import React, { useState, useEffect } from 'react'
import { replace } from './utils'
import create from "zustand"

export const [useRoomStore] = create(set => ({
    rooms: [{ name: "Cet", users: [{ name: "asd", status: "online" }, { name: "zxc", status: "offline" }] }],
    userLeft: (roomname, username) => set(s => {
        let roomIdx = rooms.find(r => r.name = roomname)
        if (!roomIdx) return s
        let room = rooms[roomIdx]
        let userIdx = room.findIndex(user => user.name === username)
        if (userIdx < 0) return s
        return { room }
    }),
    userJoined: (rommname, username) => set(s => {

    }),
    userLoggedIn: (roomname, username) => set(s => {

    }),
    userLoggedOut: (roomname, username) => set(s => {

    }),
    roomCreated: (room) => set(s => ({ rooms: [...s.rooms, room] }))
}))