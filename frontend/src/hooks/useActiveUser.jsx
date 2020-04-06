import create from "zustand"

export const [useActiveUserStore] = create(set => ({
    active: null,
    loggedin: user => set(s => {
        console.log("here")
        console.dir(user)
        return { active: user }
    }),
    logout: () => set(s => {
        console.log("Logging out")
        return { active: null }
    })
}))
