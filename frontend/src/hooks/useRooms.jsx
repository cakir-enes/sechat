import React, { useState, useEffect } from 'react'
import { replace } from './utils'
import create from "zustand"
import useCrypto, { createAESKey } from "../hooks/useCrypto"
import { useActiveUserStore } from './useActiveUser'

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
}))

export default function useRoom() {

    let { sign } = useCrypto()
    let [user] = useActiveUserStore(s => [s.user])

    let createRoom = (async (roomname) => {
        let key = await createAESKey()
        let req = { username: user.name, roomname: roomname }
        let sig = await sign(req)
        req.sig = sig
        console.log(`Create new room plz: ${JSON.stringify(req)}`)
    })

    return [createRoom]
}
