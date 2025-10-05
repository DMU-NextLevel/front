import { create } from "zustand"

interface ProjectState {
    isAuthor: boolean
    setIsAuthor: (isAuthor: boolean) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
    isAuthor: false,
    setIsAuthor: (isAuthor) => set({ isAuthor }),
}))