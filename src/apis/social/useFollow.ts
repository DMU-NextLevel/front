import Swal from "sweetalert2"
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
            Swal.fire({
                title: e.response.data.message,
                icon: 'error',
                confirmButtonColor: '#a66bff',
                confirmButtonText: '확인',
            })
        }
    }
    return { follow }
}
