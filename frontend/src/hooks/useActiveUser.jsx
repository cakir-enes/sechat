import create from "zustand"

export const [useActiveUserStore] = create(set => ({
    active: null,
    loggedin: user => set(s => {
        return { active: user }
    }),
    logout: () => set(s => {
        console.log("Logging out")
    })
}))
