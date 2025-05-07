import axios from "axios"

export const api = axios.create({
    baseURL: 'https://api.nextlevel.r-e.kr/',
    withCredentials: true
})
