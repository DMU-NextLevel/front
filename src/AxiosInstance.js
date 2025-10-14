import axios from "axios"

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const api = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
})

export const apiWithoutCredentials = axios.create({
	baseURL: baseUrl,
	withCredentials: false,
})

// Response interceptor - 401 에러 처리
api.interceptors.response.use(
	(response) => {
		// 성공 응답은 그대로 반환
		return response
	},
	(error) => {
		// 401 Unauthorized 에러 처리
		if (error.response && error.response.status === 401) {
			console.log('인증 에러 발생: 로그인 페이지로 이동합니다.')
			// 로그인 페이지로 리다이렉트
			window.location.href = '/login'
		}
		// 다른 에러는 그대로 전달
		return Promise.reject(error)
	}
)