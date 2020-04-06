import useCrypto from "./useCrypto";
import { useRoomStore } from "./useRooms";
import { useCallback, useState, useEffect } from "react";
import create from "zustand";


export const [useMessageStore] = create(set => ({
    currentRoom: null,
    messages: [],
    send: null,
    setSend: sendfn => set(s => ({ send: sendfn })),
    changeRoom: (newRoom) => set(s => ({ currentRoom: newRoom })),
    newMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
}))