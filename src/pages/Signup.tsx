import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import signupImage from '../assets/images/Signup.png';
import { api, testApi } from '../AxiosInstance'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [passwordError, setPasswordError] = useState(false)
	const [name, setName] = useState('')
	const [nickname, setNickname] = useState('')
	const [nameError, setNameError] = useState(false)
	const [emailCode, setEmailCode] = useState('')
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [termsError, setTermsError] = useState(false)
  	const [isNicknameValid, setIsNicknameVaild] = useState(false)
	const [checkOn, setCheckOn] = useState<boolean>(false)
	const navigate = useNavigate()

	const termsList = [
		'[필수] 만 14세 이상입니다.',
		'[필수] 이용약관 동의',
		'[필수] 개인정보 수집 및 이용 동의',
		'[선택] 마케팅 및 이벤트 목적의 개인정보 수집 및 이용 동의',
		'[선택] 광고성 정보 수신 동의',
	]

	const [allAgree, setAllAgree] = useState(false)
	const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))

	const [isVerifying, setIsVerifying] = useState(false)
	const [timer, setTimer] = useState(0)

	useEffect(() => {
		let interval: NodeJS.Timeout
		if (isVerifying && timer > 0) {
			interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
		}
		return () => clearInterval(interval)
	}, [isVerifying, timer])

	const formatTime = (sec: number) => {
		const m = String(Math.floor(sec / 60)).padStart(2, '0')
		const s = String(sec % 60).padStart(2, '0')
		return `${m}:${s}`
	}

	const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const checked = e.target.checked
		setAllAgree(checked)
		setCheckedTerms(new Array(termsList.length).fill(checked))
	}

	const handleTermChange = (index: number) => {
		const updated = [...checkedTerms]
		updated[index] = !updated[index]
		setCheckedTerms(updated)
		setAllAgree(updated.every(Boolean))
	}

	const handleSignup = () => {
		const koreanRegex = /^[가-힣]+$/
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!koreanRegex.test(name)) {
			setNameError(true)
			return
		} else {
			setNameError(false)
		}

		if (!emailRegex.test(email)) {
			setEmailError(true)
			return
		} else {
			setEmailError(false)
		}

		if (password.length < 8 || password !== confirmPassword) {
			setPasswordError(true)
			return
		} else {
			setPasswordError(false)
		}

		const requiredTerms = [0, 1, 2]
		const isAllRequiredTermsChecked = requiredTerms.every((index) => checkedTerms[index])
		if (!isAllRequiredTermsChecked) {
			setTermsError(true)
			return
		} else {
			setTermsError(false)
		}

    let formdata = new FormData()

    formdata.append('email', email)
    formdata.append('key',emailCode)
    formdata.append('password',password)
    formdata.append('name',name)
    formdata.append('nickName',nickname)
    formdata.append('number', '010-1234-5678')
    formdata.append('address', 'test')
		if (!nameError && !emailError && !passwordError && !termsError) {
			testApi.post('/public/login', formdata)
			alert('회원가입 완료!')
			navigate('/login')
		}
	}

	const handleSendCode = () => {
		try {
			testApi.post('/public/login/email', {
				email,
			})
      alert('인증번호가 전송되었습니다.')
			setIsVerifying(true)
			setTimer(300)
		} catch (e: any) {
			console.log(e)
      alert('인증번호 전송 실패')
		}
	}

	const handleVerifyClick = () => {
    try {
      testApi.post('/public/login/email',{
        email : email,
        key : emailCode
      })
      alert('인증 완료!')
      setIsVerifying(false)
      setTimer(0)
    } catch(e:any) {
      console.log(e)
      alert('이메일 인증 실패')
    }
	}

	const handleResendClick = () => {
    try {
      testApi.post('/public/login/email', {
				email,
			})
      alert('인증번호가 재전송되었습니다.')
      setTimer(300)
    } catch(e:any) {
      console.log(e)
      alert('인증번호 전송 실패')
    }
	}

  const nicknameCheck = () => {
    try {
      testApi.get(`/public/login/nickName?nickName=${nickname}`).then((response) => {
        if(response.status === 200) {
          if(nickname.length > 0 && nickname !== takenNick) {
            setIsNicknameVaild(true)
			setCheckOn(true)
          }
        } else if(response.status === 409) {
          if(nickname.length > 0 && nickname !== takenNick) {
            setIsNicknameVaild(false)
			setCheckOn(true)
          }
        }
      })
    } catch(e) {
      console.log(e)
      alert('닉네임 검증 오류')
    }
  }

	const takenNick = 'takenNick'

	return (
		<Container>
			<Left>
				<BrandingWrapper initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
					with<span>U</span>, 새로운 펀딩의 시작점.
				</BrandingWrapper>
				<StyledImage src={signupImage} alt='Signup illustration' />
			</Left>

			<Right>
				<Form>
					<Title>이메일로 가입하기</Title>

					<Label>이름</Label>
					<Input type='text' placeholder='사용하실 이름을 입력해주세요.' value={name} onChange={(e) => setName(e.target.value)} />
					{nameError && <ErrorMessage>이름에는 한글만 적어주십시오.</ErrorMessage>}

					<Label>닉네임</Label>
					<Row>
						<CodeInput type='text' placeholder='사용하실 닉네임을 입력해주세요.' value={nickname} onChange={(e) => setNickname(e.target.value)} />
						<CheckButton onClick={nicknameCheck}>중복확인</CheckButton>
					</Row>
					{checkOn && <NicknameCheckMessage isValid={isNicknameValid}>{isNicknameValid ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}</NicknameCheckMessage>}

					<Label>이메일 주소</Label>
					<Row>
						<CodeInput type='email' placeholder='이메일 주소를 입력해주세요.' value={email} onChange={(e) => setEmail(e.target.value)} />
						{emailError && <ErrorMessage>이메일 형식이 올바르지 않습니다.</ErrorMessage>}
						<ResendButton onClick={handleSendCode}>확인</ResendButton>
					</Row>

					<Label>이메일 인증번호</Label>
					<Row>
						<CodeInput type='text' placeholder='인증번호를 입력해주세요.' value={emailCode} onChange={(e) => setEmailCode(e.target.value)} />
						{!isVerifying ? (
							<></>
						) : (
							<>
								<ResendButton onClick={handleVerifyClick}>인증</ResendButton>
								<ResendButton onClick={handleResendClick}>재전송</ResendButton>
							</>
						)}
					</Row>

					{isVerifying && <TimerText>남은 시간: {formatTime(timer)}</TimerText>}

					<Label>비밀번호</Label>
					<Input type='password' placeholder='비밀번호를 입력해주세요.' value={password} onChange={(e) => setPassword(e.target.value)} />
					<GuideText>※ 비밀번호는 8글자 이상으로 작성해주십시오.</GuideText>

					<Label>비밀번호 확인</Label>
					<Input type='password' placeholder='비밀번호를 확인합니다.' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
					{passwordError && <ErrorMessage>{password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '비밀번호가 일치하지 않습니다.'}</ErrorMessage>}

					<CheckboxWrapper>
						<input type='checkbox' checked={allAgree} onChange={handleAllAgreeChange} /> 전체동의
					</CheckboxWrapper>

					{termsList.map((text, idx) => (
						<CheckboxWrapper key={idx}>
							<input type='checkbox' checked={checkedTerms[idx]} onChange={() => handleTermChange(idx)} /> {text}
							<a href='/a' style={{ color: '#A66CFF', marginLeft: 6 }}>
								보기
							</a>
						</CheckboxWrapper>
					))}

					{termsError && <ErrorMessage>필수 약관에 모두 동의해야 합니다.</ErrorMessage>}

					<Button onClick={handleSignup}>회원가입</Button>

					<p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
						이미 계정이 있으신가요?{' '}
						<a href='/login' style={{ color: '#A66CFF', textDecoration: 'none', fontWeight: 'bold' }}>
							로그인
						</a>
					</p>
				</Form>
			</Right>
		</Container>
	)
}

export default Signup

const Container = styled.div`
	display: flex;
	height: 100vh;
	font-family: 'Noto Sans KR', sans-serif;
`

const Left = styled.div`
	flex: 1;
	background: #fff;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 48px 24px;
`

const BrandingWrapper = styled(motion.div)`
	font-size: 54px;
	font-weight: bold;
	color: #000;
	margin-bottom: 32px;
	letter-spacing: 2px;

	span {
		color: #a66cff;
	}
`

const StyledImage = styled.img`
	width: 80%;
	max-width: 750px;
	height: auto;
`

const Right = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	overflow-y: auto;
	height: 100vh;
	padding: 32px 0;
`

const Title = styled.h1`
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 48px;
`

const Form = styled.div`
	width: 100%;
	max-width: 420px;
	background: #fff;
	padding: 32px;
	border-radius: 12px;
	box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
`

const Label = styled.label`
	font-size: 16px;
	font-weight: 500;
	display: block;
	margin-bottom: 6px;
`

const Input = styled.input`
	width: 100%;
	padding: 12px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 8px;
	margin-bottom: 20px;
`

const Row = styled.div`
	display: flex;
	gap: 8px;
	margin-bottom: 10px;
`

const CodeInput = styled(Input)`
	flex: 1;
	margin-bottom: 0;
`

const ResendButton = styled.button`
	padding: 12px 16px;
	background: #a66cff;
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	cursor: pointer;
`

const CheckButton = styled.button`
	padding: 12px 16px;
	background: #a66cff;
	color: #fff;
	border: none;
	border-radius: 8px;
	font-size: 14px;
	cursor: pointer;
`

const TimerText = styled.div`
	font-size: 14px;
	color: #a66cff;
	margin-bottom: 20px;
	text-align: right;
`

const CheckboxWrapper = styled.div`
	margin-bottom: 16px;
`

const Button = styled.button`
	background: #a66cff;
	color: #fff;
	width: 100%;
	font-size: 18px;
	padding: 12px;
	border-radius: 8px;
	border: none;
	margin-top: 24px;
	cursor: pointer;
`

const ErrorMessage = styled.p`
	color: red;
	font-size: 14px;
	margin-top: -12px;
	margin-bottom: 20px;
`

const GuideText = styled.p`
	font-size: 12px;
	color: #999;
	margin-top: -16px;
	margin-bottom: 16px;
`

const NicknameCheckMessage = styled.p<{ isValid: boolean }>`
	font-size: 14px;
	color: ${(props) => (props.isValid ? 'green' : 'red')};
	margin-top: -12px;
	margin-bottom: 20px;
`
