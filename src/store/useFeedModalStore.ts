import { create } from 'zustand'

interface FeedModalState {
	isCreateModalOpen: boolean
	isEditModalOpen: boolean
	editFeedData: {
		feedId: number
		content: string
		images: string[]
	} | null
	openCreateModal: () => void
	closeCreateModal: () => void
	openEditModal: (feedId: number, content: string, images: string[]) => void
	closeEditModal: () => void
}

export const useFeedModalStore = create<FeedModalState>((set) => ({
	isCreateModalOpen: false,
	isEditModalOpen: false,
	editFeedData: null,
	openCreateModal: () => set({ isCreateModalOpen: true }),
	closeCreateModal: () => set({ isCreateModalOpen: false }),
	openEditModal: (feedId, content, images) =>
		set({
			isEditModalOpen: true,
			editFeedData: { feedId, content, images },
		}),
	closeEditModal: () =>
		set({
			isEditModalOpen: false,
			editFeedData: null,
		}),
}))

