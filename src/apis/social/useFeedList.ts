import { useState, useEffect, useCallback } from "react"
import { api } from "../../AxiosInstance"

interface userData {
    name: string
    nickName: string
    followCount: number
    img: {
        id: number
        uri: string
    }
    isFollow: boolean
}

interface socialData {
    id: number
    text: string
    imgs: [
        {
            id: number
            uri: string
        }
    ]
    socialLikeCount: number
    isLiked: boolean
}

interface FeedData {
    user: userData
    socials: socialData[]
}

interface ResponseFeedList {
    message: string
    data: FeedData
}

export const useFeedList = (userId: number) => {
    const [feedList, setFeedList] = useState<FeedData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getFeedList = useCallback(async () => {
        if (!userId) return

        setIsLoading(true)
        setError(null)
        try {
            const res = await api.get<ResponseFeedList>(`/public/social/${userId}`)
            setFeedList(res.data.data)
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || '피드를 불러오는데 실패했습니다.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        getFeedList()
    }, [getFeedList])

    return { getFeedList, feedList, isLoading, error }
}