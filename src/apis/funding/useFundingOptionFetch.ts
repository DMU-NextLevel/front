import { useEffect, useState, useCallback } from "react"
import { api, apiWithoutCredentials } from "../../AxiosInstance"

interface fundingOptionList {
    id: number
    price: number
    description: string
}

interface responseFundingOptionList {
    message: string
    data: fundingOptionList[]
}

export const useGetFundingOptionList = (projectId: string) => {
    const [optionList, setOptionList] = useState<fundingOptionList[]>([])
    const [refetchTrigger, setRefetchTrigger] = useState(0)

    const fetchOptionList = useCallback(async () => {
        try {
            const res = await apiWithoutCredentials.get<responseFundingOptionList>(`/public/option/${projectId}`)
            setOptionList(res.data.data)
        } catch (error) {
            console.error('옵션 리스트 조회 실패:', error)
        }
    }, [projectId])

    useEffect(() => {
        fetchOptionList()
    }, [fetchOptionList, refetchTrigger])

    const refetch = () => {
        setRefetchTrigger(prev => prev + 1)
    }

    return { optionList, refetch }
}

interface responseFundingOption {
    message: string
    data: null
}

interface requestFundingOptionAdd {
    projectId: string
    price: number
    description: string
}

export const useAddFundingOption = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const addFundingOption = async ({ projectId, price, description }: requestFundingOptionAdd) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await api.post<responseFundingOption>(`/api1/option/${projectId}`, {
                price: price,
                description: description,
            })
            return response.data
        } catch (error) {
            setError(error instanceof Error ? error.message : '옵션 추가에 실패했습니다.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { addFundingOption, isLoading, error }
}

interface requestFundingOptionUpdate {
    optionId: number
    price: number
    description: string
}

export const useUpdateFundingOption = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateFundingOption = async ({ optionId, price, description }: requestFundingOptionUpdate) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await api.put<responseFundingOption>(`/api1/option/${optionId}`, {
                price: price,
                description: description,
            })
            return response.data
        } catch (error) {
            setError(error instanceof Error ? error.message : '옵션 수정에 실패했습니다.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { updateFundingOption, isLoading, error }
}

interface requestFundingOptionDelete {
    optionId: number
}

export const useDeleteFundingOption = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteFundingOption = async ({ optionId }: requestFundingOptionDelete) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await api.delete<responseFundingOption>(`/api1/option/${optionId}`)
            return response.data
        } catch (error) {
            setError(error instanceof Error ? error.message : '옵션 삭제에 실패했습니다.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { deleteFundingOption, isLoading, error }
}