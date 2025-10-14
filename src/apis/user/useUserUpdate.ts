import { useState } from 'react'
import { api } from '../../AxiosInstance'

interface UserUpdateRequest {
	name: string // name, nickName, number, address, areaNumber
	value: string
}

interface UserUpdateResponse {
	message: string
	data: null
}

export const useUserUpdate = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const updateUser = async ({ name, value }: UserUpdateRequest) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.put<UserUpdateResponse>('/social/user', {
				name,
				value,
			})
			return response.data
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '유저 정보 수정에 실패했습니다.'
			setError(errorMessage)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return { updateUser, isLoading, error }
}

