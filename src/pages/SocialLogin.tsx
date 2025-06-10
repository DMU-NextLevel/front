// socialLogin.tsx

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosInstance";

interface Props {
    loginType: string;
}

const SocialLogin = ({ loginType }: Props) => {
    const code = new URL(document.location.toString()).searchParams.get("code");
    const navigate = useNavigate();
    const calledRef = useRef(false); // 인증 중복 방지

    useEffect(() => {
			if (!code || !loginType) return

			// 테스트 환경에서 단 한 번만 호출되도록
			if (process.env.NODE_ENV === 'development' && !calledRef.current) {
				calledRef.current = true
				console.log('OAuth code:', code)
				console.log('로그인 타입:', loginType)

				api
					.get(`/public/auth/${loginType}?code=${code}`)
					.then((r) => {
						alert('소셜 로그인 성공')
						// 예시: 로그인 성공 후 메인 페이지로

						setTimeout(() => {
							if (window.opener && !window.opener.closed) {
								window.opener.postMessage('social-success', window.location.origin)
								window.close()
							}
							window.location.href = '/'
						}, 0)
					})
					.catch((err) => {
						alert('로그인 실패')
					})
			}
		}, [loginType, code, navigate])

    return null;
};

export default SocialLogin;
