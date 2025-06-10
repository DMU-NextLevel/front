import { create } from "zustand"

export const useCreateStore = create<CreateState>()((set) => ({
  title: '',
  content: '',
  tag1: null,
  tag2: null,
  titleImg: null,
  imgs: [],
  expired: '',
  goal: 0,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTag1: (tag1) => set({ tag1 }),
  setTag2: (tag2) => set({ tag2 }),
  setTitleImg: (file) => set({ titleImg: file }),
  setImgs: (files) => set({ imgs: files }),
  setExpired: (date) => set({ expired: date }),
  setGoal: (goal) => set({ goal }),
}))