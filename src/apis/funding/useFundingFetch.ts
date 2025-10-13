import { useEffect, useState } from "react"
import { api } from "../../AxiosInstance"
import { useParams } from "react-router-dom"
import { RewardData } from "../../components/UI/FundingPage/modals/FundingModal"

interface FundingFetchProps {
    reward: RewardData
}

export const useFundingFetch = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {no} = useParams<{no:string}>()

    const fetchFunding = async ({ reward }: FundingFetchProps) => {
        setIsLoading(true)
        setError(null)

        try {
            // reward 타입에 따라 데이터 구성
            let requestData: {
                option: { optionId: number; couponId: number | null } | null
                free: { price: number; projectId: number } | null
            }

            if (reward.type === 'option') {
                requestData = {
                    option: {
                        optionId: (reward.data as any).optionId,
                        couponId: (reward.data as any).couponId || null
                    },
                    free: null
                }
            } else {
                // reward.type === 'free'
                requestData = {
                    option: null,
                    free: {
                        price: (reward.data as any).price,
                        projectId: (reward.data as any).projectId
                    }
                }
            }

            console.log('📤 펀딩 요청 데이터:', requestData)

            const response = await api.post(`/api1/funding`, requestData)

            console.log('✅ 펀딩 응답:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ 펀딩 오류:', error)
            setError(error as string)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { fetchFunding, isLoading, error }
}

interface FundingOptionData {
    id: number
    price: number
    description: string
}

interface FundingOptionResponse {
    message: string
    data: FundingOptionData
}

export const useGetFundingOption = (projectId: string) => {
    const [fundingOption, setFundingOption] = useState<FundingOptionData | null>(null)

    useEffect(() => {
        api.get<FundingOptionResponse>(`/public/option/${projectId}`).then((res) => {
            setFundingOption(res.data.data)
        })
    }, [projectId])

    return { fundingOption }
}