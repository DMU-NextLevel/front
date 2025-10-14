import { api } from "../../AxiosInstance"

interface RequestFeedLike {
    socialId: number
    like: boolean
}

interface ResponseFeedLike {
    message: string
    data: null
}

export const useFeedLike = () => {
    const likeFeed = async (request: RequestFeedLike) => {
        const response = await api.post<ResponseFeedLike>('/social/social/like', request)
        return response
    }
    return { likeFeed }
}