import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import signupImage from '../assets/images/Signup.png'
import { api, apiWithoutCredentials } from '../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

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
		formdata.append('key', emailCode)
		formdata.append('password', password)
		formdata.append('name', name)
		formdata.append('nickName', nickname)
		formdata.append('number', '010-1234-5678')
		formdata.append('address', 'test')
		if (!nameError && !emailError && !passwordError && !termsError) {
			apiWithoutCredentials.post('/public/login', formdata)
			toast.success('회원가입 완료!')
			navigate('/login')
		}
	}

	const handleSendCode = () => {
		try {
			apiWithoutCredentials.post('/public/login/email', {
				email,
			})
			toast.success('인증번호가 전송되었습니다.')
			setIsVerifying(true)
			setTimer(300)
		} catch (e: any) {
			toast.error('인증번호 전송 실패')
		}
	}

	const handleVerifyClick = () => {
		try {
			apiWithoutCredentials.put('/public/login/email', {
				email: email,
				key: emailCode,
			})
			toast.success('인증 완료!')
			setIsVerifying(false)
			setTimer(0)
		} catch (e: any) {
			Swal.fire({
				icon: 'error',
				title: '이메일 인증 실패',
				text: '인증번호가 일치하지 않습니다.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}
	}

	const handleResendClick = () => {
		try {
			apiWithoutCredentials.post('/public/login/email', {
				email,
			})
			toast.success('인증번호가 재전송되었습니다.')
			setTimer(300)
		} catch (e: any) {
			Swal.fire({
				icon: 'error',
				title: '인증번호 전송 실패',
				text: '잠시 후 다시 시도해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}
	}

	const nicknameCheck = () => {
		try {
			apiWithoutCredentials.get(`/public/login/nickName?nickName=${nickname}`).then((response) => {
				if (response.status === 200) {
					if (nickname.length > 0 && nickname !== takenNick) {
						setIsNicknameVaild(true)
						setCheckOn(true)
					}
				} else if (response.status === 409) {
					if (nickname.length > 0 && nickname !== takenNick) {
						setIsNicknameVaild(false)
						setCheckOn(true)
					}
				}
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: '닉네임 검증 오류',
				text: '잠시 후 다시 시도해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}
	}

	const takenNick = 'takenNick'

	return (
		<div className='flex h-screen font-sans'>
			<div className='flex-1 bg-white flex flex-col justify-start items-center py-12 px-6'>
				<motion.div
					initial={{ x: -80, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.9, ease: 'easeInOut' }}
					className='text-5xl font-bold text-black mb-8 tracking-wider'>
					with<span className='text-purple-500'>U</span>, 새로운 펀딩의 시작점.
				</motion.div>
				<img src={signupImage} alt='Signup illustration' className='w-4/5 max-w-3xl h-auto' />
			</div>

			<div className='flex-1 flex justify-center items-start overflow-y-auto h-screen py-8'>
				<div className='w-full max-w-lg bg-white p-8 rounded-xl shadow-lg'>
					<h1 className='text-3xl font-bold mb-12'>이메일로 가입하기</h1>

					<label className='text-base font-medium block mb-1.5'>이름</label>
					<input
						type='text'
						placeholder='사용하실 이름을 입력해주세요.'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='w-full py-3 px-3 text-base border border-gray-300 rounded-lg mb-5'
					/>
					{nameError && <p className='text-red-500 text-sm -mt-3 mb-5'>이름에는 한글만 적어주십시오.</p>}

					<label className='text-base font-medium block mb-1.5'>닉네임</label>
					<div className='flex gap-2 mb-2.5'>
						<input
							type='text'
							placeholder='사용하실 닉네임을 입력해주세요.'
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							className='flex-1 py-3 px-3 text-base border border-gray-300 rounded-lg mb-0'
						/>
						<button onClick={nicknameCheck} className='py-3 px-4 bg-purple-500 text-white border-none rounded-lg text-sm cursor-pointer'>
							중복확인
						</button>
					</div>
					{checkOn && (
						<p className={`text-sm -mt-3 mb-5 ${isNicknameValid ? 'text-green-500' : 'text-red-500'}`}>
							{isNicknameValid ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
						</p>
					)}

					<label className='text-base font-medium block mb-1.5'>이메일 주소</label>
					<div className='flex gap-2 mb-2.5'>
						<input
							type='email'
							placeholder='이메일 주소를 입력해주세요.'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='flex-1 py-3 px-3 text-base border border-gray-300 rounded-lg mb-0'
						/>
						<button onClick={handleSendCode} className='py-3 px-4 bg-purple-500 text-white border-none rounded-lg text-sm cursor-pointer'>
							확인
						</button>
					</div>
					{emailError && <p className='text-red-500 text-sm -mt-3 mb-5'>이메일 형식이 올바르지 않습니다.</p>}

					<label className='text-base font-medium block mb-1.5'>이메일 인증번호</label>
					<div className='flex gap-2 mb-2.5'>
						<input
							type='text'
							placeholder='인증번호를 입력해주세요.'
							value={emailCode}
							onChange={(e) => setEmailCode(e.target.value)}
							className='flex-1 py-3 px-3 text-base border border-gray-300 rounded-lg mb-0'
						/>
						{!isVerifying ? (
							<></>
						) : (
							<>
								<button onClick={handleVerifyClick} className='py-3 px-4 bg-purple-500 text-white border-none rounded-lg text-sm cursor-pointer'>
									인증
								</button>
								<button onClick={handleResendClick} className='py-3 px-4 bg-purple-500 text-white border-none rounded-lg text-sm cursor-pointer'>
									재전송
								</button>
							</>
						)}
					</div>

					{isVerifying && <div className='text-sm text-purple-500 mb-5 text-right'>남은 시간: {formatTime(timer)}</div>}

					<label className='text-base font-medium block mb-1.5'>비밀번호</label>
					<input
						type='password'
						placeholder='비밀번호를 입력해주세요.'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='w-full py-3 px-3 text-base border border-gray-300 rounded-lg mb-5'
					/>
					<p className='text-xs text-gray-500 -mt-4 mb-4'>※ 비밀번호는 8글자 이상으로 작성해주십시오.</p>

					<label className='text-base font-medium block mb-1.5'>비밀번호 확인</label>
					<input
						type='password'
						placeholder='비밀번호를 확인합니다.'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className='w-full py-3 px-3 text-base border border-gray-300 rounded-lg mb-5'
					/>
					{passwordError && <p className='text-red-500 text-sm -mt-3 mb-5'>{password.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : '비밀번호가 일치하지 않습니다.'}</p>}

					<div className='mb-4'>
						<input type='checkbox' checked={allAgree} onChange={handleAllAgreeChange} /> 전체동의
					</div>

					{termsList.map((text, idx) => (
						<div key={idx} className='mb-4'>
							<input type='checkbox' checked={checkedTerms[idx]} onChange={() => handleTermChange(idx)} /> {text}
							<a href='/a' className='text-purple-500 ml-1.5'>
								보기
							</a>
						</div>
					))}

					{termsError && <p className='text-red-500 text-sm -mt-3 mb-5'>필수 약관에 모두 동의해야 합니다.</p>}

					<button onClick={handleSignup} className='bg-purple-500 text-white w-full text-lg py-3 rounded-lg border-none mt-6 cursor-pointer'>
						회원가입
					</button>

					<p className='text-center mt-4 text-sm text-gray-600'>
						이미 계정이 있으신가요?{' '}
						<a href='/login' className='text-purple-500 no-underline font-bold'>
							로그인
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Signup
