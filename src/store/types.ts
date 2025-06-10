interface CreateState {
  title: string
  content: string
  tag1: number | null
  tag2: number | null
  titleImg: File | null
  imgs: File[]
  expired: string
  goal: number
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setTag1: (tag1: number | null) => void
  setTag2: (tag2: number | null) => void
  setTitleImg: (file: File | null) => void
  setImgs: (files: File[]) => void
  setExpired: (date: string) => void
  setGoal: (goal: number) => void
}