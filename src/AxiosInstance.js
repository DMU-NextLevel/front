import axios from "axios"

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const api = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
})
