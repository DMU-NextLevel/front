import React, { useState } from 'react';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { motion } from 'framer-motion';
import bannerImage from '../assets/images/banner.png';
import { useNavigate } from 'react-router-dom';
import { api } from '../AxiosInstance';
import { useAuth } from '../hooks/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate();
  const { login } = useAuth()

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      await api
				.put('/public/login', {
					email,
					password,
				})
				.then(() => {
					login('true')
				})

      navigate("/")
    } catch(e:any) {
      const errorCode = e.response?.data?.code
      console.log(e)
      if(errorCode === '02001') {
        alert('아이디와 비밀번호를 잘못 입력하였습니다.')
      } else {
        alert("다시 시도해주세요. (서버에러)")
      }
    }
  }

  const handleSignup = () => {
    navigate('/signup')
  }

  const handleIdfind = () => {
    navigate('/idfind')
  }

  return (
    <>

      <style>
        {`
          input[type='password']::-ms-reveal,
          input[type='password']::-webkit-credentials-auto-fill-button,
          input[type='password']::-webkit-password-toggle-button {
            display: none;
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.formBox}>
            <h2 style={styles.title}>이메일로 로그인</h2>

            <label style={styles.label}>이메일 주소</label>
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                type="email"
                placeholder="이메일 주소를 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label style={styles.label}>비밀번호</label>
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <AiOutlineEye style={styles.eyeIcon} onClick={togglePassword} />
              ) : (
                <AiOutlineEyeInvisible style={styles.eyeIcon} onClick={togglePassword} />
              )}
            </div>

            <button style={styles.button} onClick={handleLogin}>로그인</button>

            <p style={styles.socialText}>다른 방법으로 로그인</p>
            <div style={styles.socialIcons}>
              <RiKakaoTalkFill style={{ ...styles.iconStyle, background: '#fae100' }} />
              <SiNaver style={{ ...styles.iconStyle, background: '#03c75a', color: 'white' }} />
              <FcGoogle style={styles.iconStyle} />
            </div>

            <div style={styles.bottomText}>
              아직 텀블벅 계정이 없으신가요?
              <span onClick={handleSignup}  style={styles.link}>회원가입</span>
              <br />
              혹시 비밀번호를 잊으셨나요?
              <span onClick={handleIdfind} style={styles.link}>비밀번호 재설정</span>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          ></motion.div>

          <motion.img
            src={bannerImage}
            alt="withU 설명 이미지"
            style={styles.image}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          ></motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  left: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    width: '90%',
    height: 'auto',
    objectFit: 'cover',
  },
  formBox: {
    width: 480,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    display: 'block',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: '16px 48px 16px 16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 18,
    boxSizing: 'border-box',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: 'translateY(-50%)',
    fontSize: 22,
    color: '#999',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#A66CFF',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 20,
    marginBottom: 28,
    cursor: 'pointer',
  },
  socialText: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 18,
    color: '#888',
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 28,
  },
  iconStyle: {
    width: 56,
    height: 56,
    padding: 14,
    borderRadius: '50%',
    background: '#f5f5f5',
    cursor: 'pointer',
  },
  bottomText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  link: {
    color: '#A66CFF',
    margin: '0 8px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
};
