import create from "zustand"

export const [useActiveUserStore] = create(set => ({
    active: null,
    login: () => set(s => {

    }),
    logout: () => set(s => {

    })
}))
