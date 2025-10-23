import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCreateStore } from '../store/store'

const categories = [
	{ value: '1', label: '테크/가전' },
	{ value: '2', label: '라이프스타일' },
	{ value: '3', label: '패션/잡화' },
	{ value: '4', label: '뷰티/헬스' },
	{ value: '5', label: '취미/DIY' },
	{ value: '6', label: '게임' },
	{ value: '7', label: '교육/키즈' },
	{ value: '8', label: '반려동물' },
	{ value: '9', label: '여행/레저' },
	{ value: '10', label: '푸드/음료' },
]

const ProjectInfoPage: React.FC = () => {
	const navigate = useNavigate()
	const { state } = useLocation()
	const { setExpired, setGoal, setStartAt } = useCreateStore()

	const categoryLabel =
		state?.category1Label || state?.category2Label || categories.find((c) => c.value === state?.category)?.label || state?.categoryLabel || state?.category || ''
	const [formData, setFormData] = useState({
		title: state?.title || '',
		category: categoryLabel,
		startDate: '',
		endDate: '',
		targetAmount: '',
		location: '',

		// 프로젝트 소개 섹션
		overview: '',
		reason: '',

		// 프로젝트 상세 섹션
		background: '',
		targetAudience: '',
		uniqueValue: '',

		// 프로젝트 계획 섹션
		executionPlan: '',
		schedule: '',
		budgetPlan: '',

		// 팀 소개 섹션
		team: '',
		teamExpertise: '',
		teamRoles: '',

		// 기타..
		future: '',
	})

	useEffect(() => {
		if (!state?.title || (!state?.category1 && !state?.category)) {
			navigate('/project/create')
		}
	}, [navigate, state])

	const formatNumber = (num: string) => {
		let numString = num.replace(/[^0-9]/g, '')
		if (numString.length > 9) {
			numString = numString.slice(0, 9)
		}
		return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	const parseNumber = (formattedNum: string) => {
		return parseInt(formattedNum.replace(/,/g, '')) || 0
	}

	const validateAmount = (amount: string) => {
		const numAmount = parseNumber(amount)
		if (numAmount < 5000) {
			Swal.fire({
				title: '경고',
				text: '최소 5천 원 이상 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return false
		}
		if (numAmount > 100000000) {
			Swal.fire({
				title: '경고',
				text: '최대 1억 원 이하로 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return false
		}
		return true
	}

	const handleConfirmClick = () => {
		const numAmount = parseNumber(formData.targetAmount)
		if (numAmount === 0) {
			Swal.fire({
				icon: 'error',
				title: '오류',
				text: '금액을 입력해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (validateAmount(formData.targetAmount)) {
			const formattedAmount = formatNumber(formData.targetAmount)
			Swal.fire({
				title: '확인',
				text: `${formattedAmount}원으로 설정하시겠습니까?`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: '#a66bff',
				cancelButtonColor: '#d33',
				confirmButtonText: '예, 설정합니다',
				cancelButtonText: '취소',
			}).then((result: { isConfirmed: boolean }) => {
				if (result.isConfirmed) {
					const input = document.querySelector('input[name="targetAmount"]') as HTMLInputElement
					if (input) {
						input.blur()
					}

					Swal.fire({
						icon: 'success',
						title: '설정 완료',
						text: `${formattedAmount}원으로 설정되었습니다.`,
						confirmButtonColor: '#a66bff',
						confirmButtonText: '확인',
					})
				}
			})
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		if (name === 'targetAmount') {
			const formattedValue = formatNumber(value)
			setFormData((prev) => ({ ...prev, [name]: formattedValue }))
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }))
		}
	}

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const startDate = e.target.value
		setFormData((prev) => {
			let newEndDate = prev.endDate
			if (startDate && newEndDate && new Date(newEndDate) <= new Date(startDate)) {
				const minEndDate = new Date(startDate)
				minEndDate.setDate(minEndDate.getDate() + 7)
				newEndDate = minEndDate.toISOString().split('T')[0]
			}
			return { ...prev, startDate, endDate: newEndDate }
		})
	}

	const isFormValid = () => {
		const requiredFields = ['title', 'category', 'startDate', 'endDate', 'targetAmount']

		return requiredFields.every((field) => {
			const value = formData[field as keyof typeof formData]
			return value !== undefined && value !== null && value !== ''
		})
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		navigate('/project/introduction', {
			state: {
				...state,
				...formData,
			},
		})
	}

	const nextClick = () => {
		setStartAt(formData.startDate)
		setExpired(formData.endDate)
		setGoal(parseNumber(formData.targetAmount))

		navigate('/project/media', { state: formData })
	}

	return (
		<div className='max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen'>
			<form onSubmit={handleSubmit} className='flex flex-col gap-8'>
				<h2 className='text-3xl font-bold text-gray-800 mt-8 mb-8 text-center relative pb-4 after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-15 after:h-1 after:bg-purple-500 after:rounded-sm'>
					프로젝트 기본 정보
				</h2>

				<div className='bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-8'>
					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800 flex items-center gap-1'>
							프로젝트 제목
							<span className='text-purple-500 text-lg'>*</span>
						</label>
						<input
							type='text'
							name='title'
							value={formData.title}
							readOnly
							required
							className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none bg-gray-50 cursor-not-allowed'
						/>
					</div>

					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800 flex items-center gap-1'>
							카테고리
							<span className='text-purple-500 text-lg'>*</span>
						</label>
						<input
							type='text'
							name='category'
							value={formData.category}
							readOnly
							required
							className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none bg-gray-50 cursor-not-allowed'
						/>
					</div>

					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800 flex items-center gap-1'>
							시작일
							<span className='text-purple-500 text-lg'>*</span>
						</label>
						<input
							type='date'
							name='startDate'
							value={formData.startDate}
							onChange={handleStartDateChange}
							min={new Date().toISOString().split('T')[0]}
							required
							className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none'
						/>
					</div>

					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800 flex items-center gap-1'>
							마감일
							<span className='text-purple-500 text-lg'>*</span>
						</label>
						<input
							type='date'
							name='endDate'
							value={formData.endDate}
							onChange={handleChange}
							min={
								formData.startDate
									? (() => {
											const minDate = new Date(formData.startDate)
											minDate.setDate(minDate.getDate() + 7)
											return minDate.toISOString().split('T')[0]
									  })()
									: ''
							}
							required
							disabled={!formData.startDate}
							className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed'
						/>
						<span className='block text-sm text-gray-500 mt-1'>시작일로부터 최소 7일 뒤로 설정해주세요.</span>
					</div>

					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800 flex items-center gap-1'>
							목표 금액
							<span className='text-purple-500 text-lg'>*</span>
						</label>
						<div className='flex gap-2'>
							<input
								type='text'
								inputMode='numeric'
								pattern='[0-9,]*'
								name='targetAmount'
								value={formData.targetAmount}
								onChange={handleChange}
								placeholder='5,000원 ~ 100,000,000원'
								required
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleConfirmClick()
									}
								}}
								className='flex-1 py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none'
							/>
							<button
								type='button'
								onClick={handleConfirmClick}
								disabled={!formData.targetAmount}
								className='py-3 px-6 bg-purple-500 text-white border-none rounded-md cursor-pointer font-medium whitespace-nowrap transition-all duration-200 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed'>
								확인
							</button>
						</div>
						<span className='block text-sm text-gray-500 mt-1'>최소 5천 원 ~ 최대 1억 원 사이에서 설정해 주세요.</span>
					</div>

					<div className='mb-6'>
						<label className='block mb-2 font-medium text-gray-800'>위치</label>
						<input
							type='text'
							name='location'
							value={formData.location}
							onChange={handleChange}
							placeholder='예: 서울시 강남구'
							className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none'
						/>
					</div>
				</div>

				<div className='flex gap-4 justify-end mt-8'>
					<button
						type='button'
						onClick={() => navigate(-1)}
						className='py-3 px-6 bg-gray-100 text-gray-600 border-none rounded-md text-base font-medium cursor-pointer transition-all duration-300 hover:bg-gray-200'>
						이전
					</button>
					<button
						type='button'
						onClick={nextClick}
						disabled={!isFormValid()}
						className={`py-3 px-6 border-none rounded-md text-base font-medium cursor-pointer transition-all duration-200 ${
							isFormValid()
								? 'bg-purple-500 text-white hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(166,107,255,0.3)] active:translate-y-0'
								: 'bg-gray-100 text-gray-400 cursor-not-allowed'
						}`}>
						다음 단계로
					</button>
				</div>
			</form>
		</div>
	)
}

export default ProjectInfoPage
