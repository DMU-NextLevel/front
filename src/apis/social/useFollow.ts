import { api } from "../../AxiosInstance"

interface RequestFollow {
    targetId: number
    follow: boolean
}

interface ResponseFollow {
    message: string
    data: null
}

export const useFollow = () => {
    const follow = async (request: RequestFollow) => {
        try {
            const response = await api.post<ResponseFollow>('/social/follow', request)
            return response
        } catch (e: any) {
            console.log(e.response.data.message)
            alert(e.response.data.message)
        }
    }
    return { follow }
}
