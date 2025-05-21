import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { testApi } from "../AxiosInstance";

interface Props {
    loginType: string;
}

const SocialLogin = ({ loginType }: Props) => {
    const code = new URL(document.location.toString()).searchParams.get("code");
    const navigate = useNavigate();
    const calledRef = useRef(false); // 인증 중복 방지

    useEffect(() => {
        if (!code || !loginType) return;

        // 테스트 환경에서 단 한 번만 호출되도록
        if (process.env.NODE_ENV === "development" && !calledRef.current) {
            calledRef.current = true;
            console.log("OAuth code:", code);
            console.log("로그인 타입:", loginType);

            testApi
                .post(`/login/oauth2/code/${loginType}?code=${code}`)
                .then((r) => {
                    console.log("서버 응답:", r.data);
                    // 예시: 로그인 성공 후 메인 페이지로
                    navigate("/");
                })
                .catch((err) => {
                    console.error("인증 실패:", err);
                });
        }
    }, [loginType, code, navigate]);

    return null;
};

export default SocialLogin;
