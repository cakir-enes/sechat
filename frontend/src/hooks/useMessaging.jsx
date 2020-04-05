import useCrypto from "./useCrypto";
import { useRoomStore } from "./useRooms";
import { useCallback, useState, useEffect } from "react";
import create from "zustand";


export const [useMessageStore] = create(set => ({
    currentRoom: null,
    messages: [],
    changeRoom: (newRoom) => set(s => ({currentRoom: newRoom})),
    newMessage: (msg) => set(s => ({messages: []}))
}))

export default function useMessaging() {
    let {encrypt, decrypt} = useCrypto()
    let [messages, room] = useMessageStore(s => [s.messages, s.currentRoom])
    let [ws, setWs] = useState()
    
    let send = useCallback(() => {

    }, [room])


    useEffect(() => {

    }, [room])

    return {send, messages, room}
}