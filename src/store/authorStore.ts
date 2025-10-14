import { create } from "zustand"

interface AuthorState {
    isAuthor: boolean
    setIsAuthor: (isAuthor: boolean) => void
}

export const useAuthorStore = create<AuthorState>((set) => ({
    isAuthor: false,
    setIsAuthor: (isAuthor) => set({ isAuthor }),
}))
