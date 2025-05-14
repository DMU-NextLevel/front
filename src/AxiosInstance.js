import axios from "axios"

export const api = axios.create({
    baseURL: 'https://api.nextlevel.r-e.kr/',
    withCredentials: true
})

export const testApi = axios.create({
    baseURL:'http://localhost:8080/',
    withCredentials: true
})
