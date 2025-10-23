import React, { useState, useEffect } from 'react'
import { api } from '../AxiosInstance'
import Swal from 'sweetalert2'
import { useAuth } from '../hooks/AuthContext'

const AdditionalInfo = () => {
	const { user } = useAuth()
	const [currentStep, setCurrentStep] = useState(0)
	const [formData, setFormData] = useState({
		name: '',
		nickName: '',
		number: '',
		address: '',
	})

	// user 정보가 로드되면 formData 업데이트
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || '',
				nickName: user.nickName || '',
				number: user.number || '',
				address: user.address || '',
			})
		}
	}, [user])

	const steps = [
		{ key: 'name', label: '이름', placeholder: '이름을 입력해주세요' },
		{ key: 'nickName', label: '닉네임', placeholder: '닉네임을 입력해주세요' },
		{ key: 'number', label: '전화번호', placeholder: '010-1234-5678' },
		{ key: 'address', label: '주소', placeholder: '주소를 입력해주세요' },
	]

	const handleInputChange = (key: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}))
	}

	const handleNext = async () => {
		const currentKey = steps[currentStep].key as keyof typeof formData

		if (!formData[currentKey].trim()) {
			Swal.fire('알림', `${steps[currentStep].label}을(를) 입력해주세요.`, 'warning')
			return
		}

		// 전화번호 유효성 검사
		if (currentKey === 'number') {
			const phoneRegex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/
			if (!phoneRegex.test(formData.number)) {
				Swal.fire('알림', '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)', 'warning')
				return
			}
		}

		// 현재 필드 정보를 서버에 업데이트
		try {
			const response = await api.put('/social/user', {
				name: currentKey,
				value: formData[currentKey],
			})

			if (response.data.message === 'success') {

				// 마지막 단계가 아니면 다음 단계로
				if (currentStep < steps.length - 1) {
					setCurrentStep(currentStep + 1)
				} else {
					// 마지막 단계면 완료 처리
					await Swal.fire('완료', '회원 정보가 등록되었습니다!', 'success')
					// 메인 페이지로 이동하고 새로고침하여 권한 업데이트
					window.location.href = '/'
				}
			}
		} catch (error) {
			Swal.fire({
				title: '에러',
				text: `${steps[currentStep].label} 업데이트에 실패했습니다. 다시 시도해주세요.`,
				icon: 'error',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleNext()
		}
	}

	return (
		<div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5'>
			<div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg p-12 animate-fadeIn'>
				{/* 제목 */}
				<h1 className='text-3xl font-bold text-gray-800 text-center mb-2'>WithU에 오신걸 환영합니다!</h1>
				<p className='text-sm text-gray-600 text-center mb-8'>서비스 이용을 위해 추가 정보를 입력해주세요</p>

				{/* 진행률 바 */}
				<div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-5'>
					<div
						className='h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out'
						style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
					/>
				</div>

				{/* 스텝 인디케이터 */}
				<div className='text-center text-sm font-semibold text-indigo-600 mb-8'>
					{currentStep + 1} / {steps.length}
				</div>

				{/* 폼 컨테이너 */}
				<div className='mb-8'>
					{steps.map((step, index) => (
						<div
							key={step.key}
							className={`mb-5 transition-all duration-300 ${index <= currentStep ? 'block animate-slideDown' : 'hidden'} ${
								index === currentStep ? 'opacity-100' : 'opacity-60'
							}`}>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>{step.label}</label>
							<input
								type='text'
								placeholder={step.placeholder}
								value={formData[step.key as keyof typeof formData]}
								onChange={(e) => handleInputChange(step.key, e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={index < currentStep}
								autoFocus={index === currentStep}
								className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${
									index < currentStep
										? 'border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
										: 'border-2 border-indigo-500 bg-white text-gray-800 focus:border-purple-600 focus:ring-4 focus:ring-purple-100'
								} placeholder-gray-400`}
							/>
						</div>
					))}
				</div>

				{/* 버튼 컨테이너 */}
				<div className='flex gap-4 justify-end'>
					{currentStep > 0 && (
						<button
							onClick={() => setCurrentStep(currentStep - 1)}
							className='px-8 py-3.5 border-2 border-indigo-500 rounded-lg bg-white text-indigo-600 font-semibold text-base cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:-translate-y-0.5 active:scale-98'>
							이전
						</button>
					)}
					<button
						onClick={handleNext}
						className='px-8 py-3.5 border-none rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base cursor-pointer transition-all duration-300 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/60 hover:-translate-y-0.5 active:scale-98'>
						{currentStep === steps.length - 1 ? '완료' : '다음'}
					</button>
				</div>
			</div>

			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-20px);
						max-height: 0;
					}
					to {
						opacity: 1;
						transform: translateY(0);
						max-height: 100px;
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.5s ease-out;
				}

				.animate-slideDown {
					animation: slideDown 0.3s ease-out;
				}

				.active\\:scale-98:active {
					transform: scale(0.98);
				}
			`}</style>
		</div>
	)
}

export default AdditionalInfo

