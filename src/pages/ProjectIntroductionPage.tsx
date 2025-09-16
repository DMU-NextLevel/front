import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCreateStore } from '../store/store'
import { api } from '../AxiosInstance'

const ProjectIntroductionPage: React.FC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { title, tag1 } = useCreateStore()

	const [formData, setFormData] = useState({
		overview: '',
		background: '',
		goal: '',
		plan: '',
		risk: '',
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

		try {
			const response = await api.post('/project/introduction', {
				title,
				tag1,
				...formData,
			})

			if (response.status === 200) {
				await Swal.fire({
					icon: 'success',
					title: '프로젝트 소개가 저장되었습니다!',
					showConfirmButton: false,
					timer: 1500,
				})
				navigate('/project/media')
			}
		} catch (error) {
			console.error('프로젝트 소개 저장 실패:', error)
			await Swal.fire({
				icon: 'error',
				title: '저장에 실패했습니다.',
				text: '다시 시도해주세요.',
			})
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
						2. 프로젝트 배경 <span className='text-red-500'>*</span>
					</h3>
					<textarea
						name='background'
						value={formData.background}
						onChange={handleChange}
						placeholder='프로젝트를 시작하게 된 배경과 이유를 설명해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						3. 프로젝트 목표 <span className='text-red-500'>*</span>
					</h3>
					<textarea
						name='goal'
						value={formData.goal}
						onChange={handleChange}
						placeholder='프로젝트를 통해 달성하고자 하는 목표를 명확히 작성해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						4. 실행 계획 <span className='text-red-500'>*</span>
					</h3>
					<textarea
						name='plan'
						value={formData.plan}
						onChange={handleChange}
						placeholder='프로젝트 실행 계획과 일정을 상세히 작성해주세요.'
						className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-purple-500'
						required
					/>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-sm'>
					<h3 className='text-xl font-semibold mb-4 text-gray-800'>
						5. 리스크 및 대응방안 <span className='text-red-500'>*</span>
					</h3>
					<textarea
						name='risk'
						value={formData.risk}
						onChange={handleChange}
						placeholder='예상되는 리스크와 그에 대한 대응방안을 작성해주세요.'
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
