import create from "zustand"

export const [useActiveUserStore] = create(set => ({
    active: null,
    logout: () => set(s => {
        console.log("Logging out")
    })
}))
