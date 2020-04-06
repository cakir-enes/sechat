import React, { useState, useEffect } from "react"
import create from "zustand"

export const [useNotificationStore] = create(set => ({
    pending: [],
    newNotification: (newNotif) => set(s => ({ pending: [...s.pending, newNotif] })),
    remove: (req_id) => set(s => ({ pending: s.pending.filter(p => p.req_id !== req_id) }))
}))