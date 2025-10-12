import { useState } from "react"
import { api } from "../../AxiosInstance"

interface requestFeedCreate {
    text: string | null
    imgs: File[] | null
}

interface responseFeedFetch {
    message: string
    data: null
}

export const useFeedCreate = () => {
    const createFeed = async (request: requestFeedCreate) => {
        const formData = new FormData()

        // text가 있으면 text를, 없으면 빈 문자열 전송
        formData.append('text', request.text || '')

        // imgs가 있으면 각 이미지를 추가
        if (request.imgs && request.imgs.length > 0) {
            request.imgs.forEach((img) => formData.append('imgs', img))
        } else {
            // imgs가 없을 때는 빈 Blob을 보내서 백엔드가 빈 배열로 인식하도록 함
            formData.append('imgs', new Blob(), '')
        }

        const response = await api.post<responseFeedFetch>('/social/social', formData)
        return response
    }
    return { createFeed }
}

export const useFeedDelete = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const deleteFeed = async ({ socialId }: { socialId: number }) => {
        setIsLoading(true)
        setError(null)
        try {
            await api.delete<responseFeedFetch>(`/social/social/${socialId}`)
        setIsLoading(false)
        setError(null)
    } catch (e) {
        setError(e instanceof Error ? e.message : '피드 삭제에 실패했습니다.')
        throw e
    } finally {
        setIsLoading(false)
    }
    }
    return { deleteFeed, isLoading, error }
}