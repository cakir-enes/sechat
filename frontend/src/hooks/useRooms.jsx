import React, { useState, useEffect } from 'react'
import { replace } from './utils'
import create from "zustand"

export const [useRoomStore] = create(set => ({
    rooms: [],
    userLeft: (roomname, username) => set(s => {
        let roomIdx = rooms.find(r => r.name = roomname)
        if (!roomIdx) return s
        let room = rooms[roomIdx]
        let userIdx = room.findIndex(user => user.name === username)
        if (userIdx < 0) return s
        return { room }
    }),
    userJoined: (roomname, username) => set(s => {
        let roomIdx = s.rooms.findIndex(r => r.name === roomname)
        let room = s.rooms[roomIdx]
        room.users.push({ name: username, status: "online" })
        return { rooms: replace(s.rooms, roomIdx, [...room]) }
    }),
    userLoggedIn: (username) => set(s => {
    }),
    userLoggedOut: (roomname, username) => set(s => {

    }),
    roomCreated: (room) => set(s => ({ rooms: [...s.rooms, room] }))
}))