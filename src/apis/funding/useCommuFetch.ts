import { useState } from "react"
import { api } from "../../AxiosInstance"

interface QuestionAddProps {
	projectId: string
	content: string
}

export const useQuestionAdd = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addQuestion = async ({ projectId, content }: QuestionAddProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.post(`/api1/project/${projectId}/community`, {
				content: content,
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '질문 추가에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { addQuestion, isLoading, error }
}

interface AnswerAddProps {
	askId: string
	content: string
}

export const useAnswerAdd = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addAnswer = async ({ askId, content }: AnswerAddProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.post(`/api1/project/${askId}/community/answer`, {
				content: content,
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '답변 추가에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { addAnswer, isLoading, error }
}

interface CommunityUpdateProps {
    communityId: string
    content: string
    isType: 'ask' | 'answer' | null
}

export const useCommunityUpdate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateCommunity = async ({ communityId, content, isType }: CommunityUpdateProps) => {
        setIsLoading(true)
        setError(null)

        try {
            if (isType === 'ask') {
                await api.post(`/api1/project/community/${communityId}`, { content: content })
            } else if (isType === 'answer') {
                await api.post(`/api1/project/community/${communityId}/answer`, { content: content })
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `${isType === 'ask' ? '질문' : '답변'} 수정에 실패했습니다.`
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { updateCommunity, isLoading, error }
}

interface CommunityDeleteProps {
    communityId: string
    isType: 'ask' | 'answer' | null
}

export const useCommunityDelete = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteCommunity = async ({ communityId, isType }: CommunityDeleteProps) => {
        setIsLoading(true)
        setError(null)

        try {
            if (isType === 'ask') {
                await api.delete(`/api1/project/community/${communityId}`)
            } else if (isType === 'answer') {
                await api.delete(`/api1/project/community/${communityId}/answer`)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `${isType === 'ask' ? '질문' : '답변'} 삭제에 실패했습니다.`
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { deleteCommunity, isLoading, error }
}