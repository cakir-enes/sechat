import React, { useState, useEffect, useRef } from "react"
import {userApi, useUserStore} from "../hooks/useUsers"
import shallow from "zustand/shallow"
import { useRoomStore } from "./useRooms"
import { useNotificationStore } from "./useNotifications"

export default function useChangeListener() {
    
    let [changeUserStatus] = useUserStore(s => [s.changeUserStatus], shallow)
    let rooms = useRoomStore(s => ({userLeft: s.userLeft, 
                                        userJoined: s.userJoined, 
                                        userLoggedIn: s.userLoggedIn,
                                        userLoggedOut: s.userLoggedOut}), shallow)
    let newNotification = useNotificationStore(s => s.newNotification, shallow)
    

    useEffect(() => {
        console.count("render")
    })

    useEffect(() => {

        setTimeout(() => {
            console.count("BRUH")
            changeUserStatus("kemal", false)
        }, 1000)
    }, [])

    return []
}