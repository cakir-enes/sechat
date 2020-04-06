import React, { useState, useEffect, useRef } from "react"
import { useUserStore } from "../hooks/useUsers"
import shallow from "zustand/shallow"
import { useRoomStore } from "./useRooms"
import { useNotificationStore } from "./useNotifications"
import useCrypto from "./useCrypto"
import { useMessageStore } from "./useMessaging"
import { useActiveUserStore } from "./useActiveUser"

export default function useChangeListener() {

    let [user] = useActiveUserStore(s => [s.active])
    let [changeUserStatus] = useUserStore(s => [s.changeUserStatus])
    let rooms = useRoomStore(s => ({
        userLeft: s.userLeft,
        userJoined: s.userJoined,
        userLoggedIn: s.userLoggedIn,
        created: s.roomCreated,
        userLoggedOut: s.userLoggedOut
    }), shallow)
    let newNotification = useNotificationStore(s => s.newNotification, shallow)
    let [currentRoom, newMessage, setSend] = useMessageStore(s => [s.currentRoom, s.newMessage, s.setSend], shallow)
    let [ws, setWs] = useState()
    let { sign, decrypt, encrypt } = useCrypto()

    useEffect(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send({ type: "CHANGE_ROOM", payload: currentRoom.name })
        }
    }, [currentRoom, ws])

    useEffect(() => {
        if (!user) {
            console.error("NOTUSER")
            return
        }
        console.count("CREATING SOCK CONN")
        let ws = new WebSocket("ws://localhost:8000/notifications/" + user.name)
        setWs(ws)
        setSend(async (msg) => {
            let encrpyted = await encrypt(msg)
            console.count("SENDING")
            console.dir(encrpyted)
            ws.send(JSON.stringify({ type: "NEW_MSG", payload: encrpyted }))
        })

        ws.onmessage = ({ data }) => {
            console.log("MSG RECV: " + data)
            let { payload, type } = JSON.parse(data)
            switch (type) {
                case "YOU_OK":
                    ws.send({ type: "CHANGE_ROOM", payload: rooms.names })
                    break
                case "CHALLENGE":
                    console.log("WE HAVE A CHALLLLLLLENGE")
                    sign(payload).then(sig => ws.send(sig))
                    break
                case "NEW_ROOM":
                    let newRoom = payload
                    rooms.created(newRoom)
                    break
                case "NEW_REQ":
                    let req = payload
                    newNotification(req)
                    break
                case "NEW_MSG":
                    let msg = payload
                    decrypt(msg).then(m => newMessage(m)).catch(err => {
                        console.error("Coudlnt decipher " + msg)
                    })
                    break
                case "USER_LEFT":
                    rooms.userLeft(payload)
                    break
                case "USER_JOINED":
                    rooms.userJoined(payload.user, payload.room)
                    break
                case "USER_LOGGED_IN":
                    changeUserStatus(payload)
                    rooms.userLoggedIn(payload)
                    break
                case "USER_LOGGED_OUT":
                    rooms.userLoggedOut(payload)
                    break
                default:
                    console.log("COULDNT PARSE " + type)
                    console.dir(payload)
            }
        }
        () => { ws.close(); setWs(null) }
    }, [user])
    return []
}