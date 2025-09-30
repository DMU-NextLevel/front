import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCreateStore } from '../store/store'
import { api } from '../AxiosInstance'

const ProjectIntroductionPage: React.FC = () => {
	const navigate = useNavigate()
	const { state } = useLocation()
	const { title, content, tag1, tag2, titleImg, imgs, expired, goal } = useCreateStore()

	const [formData, setFormData] = useState({
		overview: state?.overview || '',
		reason: state?.reason || '',
		background: state?.background || '',
		targetAudience: state?.targetAudience || '',
		uniqueValue: state?.uniqueValue || '',
		executionPlan: state?.executionPlan || '',
		budgetPlan: state?.budgetPlan || '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!isFormValid()) {
			Swal.fire({
				icon: 'error',
				title: '모든 필수 항목을 입력해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		const result = await Swal.fire({
			icon: 'question',
			title: '프로젝트를 제출하시겠습니까?',
			text: '제출 후에는 내용을 수정할 수 없습니다.',
			showCancelButton: true,
			confirmButtonColor: '#a66bff',
			cancelButtonColor: '#6c757d',
			confirmButtonText: '네, 제출할게요',
			cancelButtonText: '취소',
			reverseButtons: true,
		})

		if (result.isConfirmed) {
			try {
				Swal.fire({
					title: '제출 중...',
					text: '잠시만 기다려주세요.',
					allowOutsideClick: false,
					didOpen: () => {
						Swal.showLoading()
					},
				})

				const projectData = new FormData()
				projectData.append('title', title)
				projectData.append('content', content)
				if (titleImg !== null)
					projectData.append('titleImg', titleImg)
				projectData.append('tags', String(tag1))
				if (tag2 !== null)
					projectData.append('tags', String(tag2))
				imgs.forEach((img) => projectData.append('imgs', img))
				projectData.append('expired', expired)
				projectData.append('goal', String(goal))

				console.log(projectData)

				await api.post('/api1/project', projectData)

				await Swal.fire({
					icon: 'success',
					title: '제출 완료',
					text: '프로젝트가 성공적으로 제출되었습니다.',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
					timer: 1500,
					timerProgressBar: true,
				})

				navigate('/')
			} catch (error) {
				console.error('프로젝트 소개 저장 실패:', error)
				await Swal.fire({
					icon: 'error',
					title: '제출 실패',
					text: '제출 중 오류가 발생했습니다. 다시 시도해주세요.',
				})
			}
		}
	}

	const isFormValid = () => {
		return Object.values(formData).every((value) => value.trim() !== '')
	}

	return (
		<div className='max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen box-border'>
			<form onSubmit={handleSubmit} className='flex flex-col gap-8'>
				<h2 className='text-3xl font-bold text-gray-800 my-8 text-center'>프로젝트 소개</h2>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						1. 프로젝트 개요 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>프로젝트의 목적, 주요 기능, 타겟 고객 등 프로젝트를 소개해주세요.</p>
					<textarea
						name='overview'
						value={formData.overview}
						onChange={handleChange}
						placeholder='프로젝트에 대한 간단한 소개를 작성해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						2. 프로젝트 선정 이유 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>이 프로젝트를 왜 진행하게 되었는지, 어떤 문제를 해결하고자 하는지 설명해주세요.</p>
					<textarea
						name='reason'
						value={formData.reason}
						onChange={handleChange}
						placeholder='프로젝트를 시작하게 된 배경과 이유를 설명해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						3. 프로젝트 배경 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>이 프로젝트를 시작하게 된 배경과 동기에 대해 설명해주세요.</p>
					<textarea
						name='background'
						value={formData.background}
						onChange={handleChange}
						placeholder='프로젝트를 통해 달성하고자 하는 목표를 명확히 작성해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						4. 타겟 고객 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>이 프로젝트의 주요 고객층은 누구인가요?</p>
					<textarea
						name='targetAudience'
						value={formData.targetAudience}
						onChange={handleChange}
						placeholder='예: 20대 여성, 프로그래밍 초보자, 취미 활동 참여자 등'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						5. 차별화 포인트 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>기존 서비스와 차별화된 점이 무엇인가요?</p>
					<textarea
						name='uniqueValue'
						value={formData.uniqueValue}
						onChange={handleChange}
						placeholder='예: 플랫폼 차별화, 커뮤니티 기능, 개인화 서비스 등'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						6. 실행 계획 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>프로젝트를 어떻게 진행할 계획인가요?</p>
					<textarea
						name='executionPlan'
						value={formData.executionPlan}
						onChange={handleChange}
						placeholder='프로젝트를 어떻게 진행할 계획인가요?'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						7. 예산 계획 <span className='text-red-500'>*</span>
					</h3>
					<p className='font-[0.9rem] text-gray-600 mb-[1.5rem]'>예산을 어떻게 사용할 계획인가요?</p>
					<textarea
						name='budgetPlan'
						value={formData.budgetPlan}
						onChange={handleChange}
						placeholder='사용 계획을 작성해주세요.,'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='flex justify-end gap-4 mt-8'>
					<button type='button' onClick={() => navigate(-1)} className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200'>
						이전
					</button>
					<button
						type='submit'
						disabled={!isFormValid()}
						className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
							isFormValid() ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}>
						제출하기
					</button>
				</div>
			</form>
		</div>
	)
}

export default ProjectIntroductionPage
