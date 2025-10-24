// socialLogin.tsx

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../AxiosInstance";
import Swal from "sweetalert2";

interface Props {
    loginType: string;
}

const SocialLogin = ({ loginType }: Props) => {
    const code = new URL(document.location.toString()).searchParams.get("code");
    const navigate = useNavigate();
    const calledRef = useRef(false); // 인증 중복 방지

    useEffect(() => {
			if (!code || !loginType || calledRef.current) return

				calledRef.current = true

				api
					.get(`/public/auth/${loginType}?code=${code}`)
					.then((r) => {

						setTimeout(() => {
							if (window.opener && !window.opener.closed) {
								window.opener.postMessage('social-success', window.location.origin)
								window.close()
							}
							window.location.href = '/'
						}, 0)
					})
					.catch((err) => {
						Swal.fire({
							icon: 'error',
							title: '로그인 실패',
							text: '잠시 후 다시 시도해주세요.',
							confirmButtonColor: '#a666ff',
							confirmButtonText: '확인',
						})
					})
		}, [loginType, code, navigate])

    return null;
};

export default SocialLogin;
