import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { testApi } from "../AxiosInstance";

interface props {
    loginType: string
}

const SocialLogin = ({loginType}:props) => {
    const code = new URL(document.location.toString()).searchParams.get('code');
    const navigate = useNavigate()

    // code 백으로 전달
    useEffect(() => {
        console.log(code)
        testApi.post(`/login/oauth2/code/${loginType}?code=${code}`).then((r) => {
            console.log(r.data)
        })
    },[])
    return <></>
}

export default SocialLogin