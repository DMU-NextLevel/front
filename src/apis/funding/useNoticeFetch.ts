import { useState } from "react"
import { NoticeAddData } from "../../types/project"
import { api } from "../../AxiosInstance"

interface NoticeAddProps {
	projectId: string
	noticeData: NoticeAddData
}

export const useNoticeAdd = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addNotice = async ({ projectId, noticeData }: NoticeAddProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const formData = new FormData()
			formData.append('title', noticeData.title)
			formData.append('content', noticeData.content)
			if (noticeData.img) {
				formData.append('img', noticeData.img)
			}

			const response = await api.post(`/api1/project/${projectId}/notice`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '공지 추가에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { addNotice, isLoading, error }
}

interface NoticeDeleteProps {
    noticeId: string
}

export const useNoticeDelete = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteNotice = async ({ noticeId }: NoticeDeleteProps) => {
        setIsLoading(true)
        setError(null)

        try {
            await api.delete(`/api1/project/notice/${noticeId}`).then((res) => {
                return res.data
            }).catch((e) => {
                throw e
            })
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '공지 삭제에 실패했습니다.'
            setError(errorMessage)
            throw e
        } finally {
            setIsLoading(false)
        }
    }

    return { deleteNotice, isLoading, error }
}

interface NoticeUpdateProps {
	noticeId: string
	noticeData: NoticeAddData
}

export const useNoticeUpdate = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const updateNotice = async ({ noticeId, noticeData }: NoticeUpdateProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const formData = new FormData()
			formData.append('title', noticeData.title)
			formData.append('content', noticeData.content)
			if (noticeData.img) {
				formData.append('img', noticeData.img)
			}

			const response = await api.put(`/api1/project/notice/${noticeId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '공지 수정에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { updateNotice, isLoading, error }
}