import useCrypto from "./useCrypto";
import { useRoomStore } from "./useRooms";
import { useCallback, useState, useEffect } from "react";

export default function useMessaging() {
    let {encrypt, decrypt} = useCrypto()
    let [room] = useRoomStore(s => [s.currentRoom])
    let [messages, setMessages] = useState([])

    let send = useCallback(() => {

    }, [])

    useEffect(() => {

    }, [])

    return {send, messages, room}
}