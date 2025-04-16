import axios from "axios"

export const api = axios.create({
    baseURL: 'https://nextlevel.kro.kr:8080/'
})