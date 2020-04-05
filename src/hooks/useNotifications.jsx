import React, { useState, useEffect } from "react"

export default function useNotifications() {
    
    let [pending, setPending] = useState([])

    useEffect(() => {

    }, [])

    return {pending}

}