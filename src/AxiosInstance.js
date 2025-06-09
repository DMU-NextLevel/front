import axios from "axios"

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const api = axios.create({
	// baseURL: 'https://api.nextlevel.r-e.kr/',
	baseURL: baseUrl,
	withCredentials: true,
})

export const testApi = axios.create({
    baseURL:'http://localhost:8080/',
    withCredentials: true
})
