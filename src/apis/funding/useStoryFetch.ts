import { useState } from "react"
import { api } from "../../AxiosInstance"

interface StoryUpdateProps {
    projectId: string
    imgs: File[]
}

export const useStoryUpdate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateStory = async ({ projectId, imgs }: StoryUpdateProps) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            imgs.forEach((img) => formData.append('imgs', img))
            await api.put(`/api1/project/${projectId}/story`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : '스토리 수정에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return { updateStory, isLoading, error }
}