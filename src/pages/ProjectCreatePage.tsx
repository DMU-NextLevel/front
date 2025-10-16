import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import Swal from 'sweetalert2'
import { useCreateStore } from '../store/store'
import { useAuth } from '../hooks/AuthContext'

interface ProjectFormData {
	title: string
	category1: number | null
	category2: number | null
}

const categories = [
	{ value: 1, label: '테크/가전', icon: 'bi-cpu' },
	{ value: 2, label: '라이프스타일', icon: 'bi-house' },
	{ value: 3, label: '패션/잡화', icon: 'bi-bag' },
	{ value: 4, label: '뷰티/헬스', icon: 'bi-heart-pulse' },
	{ value: 5, label: '취미/DIY', icon: 'bi-brush' },
	{ value: 6, label: '게임', icon: 'bi-controller' },
	{ value: 7, label: '교육/키즈', icon: 'bi-book' },
	{ value: 8, label: '반려동물', icon: 'bi-star' },
	{ value: 9, label: '여행/레저', icon: 'bi-airplane' },
	{ value: 10, label: '푸드/음료', icon: 'bi-cup-straw' },
]

const ProjectCreatePage: React.FC = () => {
	const navigate = useNavigate()
	const { isLoggedIn, user } = useAuth()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState<ProjectFormData>({
		title: '',
		category1: null,
		category2: null,
	})
	const { setTitle, setTag1, setTag2 } = useCreateStore()

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login')
		}
	}, [isLoggedIn, navigate])

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login')
		}
	}, [isLoggedIn, navigate])

	const isFormValid = formData.title.trim() !== '' && formData.category1 !== null && formData.category2 !== null

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		console.log('프로젝트 생성 데이터:', formData)

		const { isConfirmed } = await Swal.fire({
			title: '개인정보 수집 및 이용 동의',
			html: `
        <div style="text-align: left; padding: 0 10px;">


          <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <p style="font-weight: bold; margin-bottom: 10px;">개인정보 수집 및 이용 동의</p>

            <div style="max-height: 400px; overflow-y: auto; margin-bottom: 15px; padding: 10px; background: white; border: 1px solid #eee; border-radius: 4px;">
              <h3>1. 수집하는 개인정보 항목</h3>
              <div>
                <h4><개인 메이커></h4>
                <ul>
                  <li>필수항목: 대표자 정보 (이름, 이메일주소, 휴대전화 번호, 본인인증값(DI)), 정산대금 입금 계좌정보(은행명, 예금주명, 계좌번호), 뒷자리 마스킹된 신분증 사본(생년월일, 주소), 담당자정보(이메일, 전화번호, 담당자와 대표자가 다른 경우에 한함)</li>
                </ul>

                <h4><개인사업자 메이커 / 법인사업자 메이커></h4>
                <ul>
                  <li>필수항목: 대표자 정보 (이름, 이메일주소, 휴대전화 번호, 본인인증정보(DI), 생년월일, 사업장 소재지, 성별, 공동대표인 경우 대표 전부의 정보를 의미), 정산대금 입금 계좌정보(은행명, 예금주명, 계좌번호), 담당자정보(이메일, 전화번호, 담당자와 대표자가 다른 경우에 한함)</li>
                </ul>

                <p>회사는 부가가치세법 제16조에 따른 세금계산서 교부를 위해 개인 메이커에 대해 아래와 같은 개인정보를 수집합니다.</p>
                <ul>
                  <li>주민등록번호</li>
                </ul>

                <p>또한 서비스 이용 과정에서 서비스 이용기록, 접속로그, 쿠키, IP주소, 기기정보 등이 생성되어 저장될 수 있습니다.</p>
              </div>

              <h3>2. 개인정보의 수집 및 이용 목적</h3>
              <ul>
                <li>서비스 개설 관련 신청/문의 및 상담</li>
                <li>서비스 이용 메이커 회원 관리</li>
                <li>서비스 제공에 관한 계약 이행</li>
                <li>서비스 제공에 따른 정산금 지급 및 사후 관리</li>
              </ul>

              <h3>3. 개인정보의 보유 및 이용기간</h3>
              <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
              <p>관련 법령에 의해 일정기간 보관이 필요한 개인정보의 경우, 해당 법령의 규정에 따라 보관합니다.</p>
              <p>아래 법령에서 일정기간 정보의 보관을 규정하는 경우, 표시된 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다.</p>
              <ul>
                <li>국세기본법 : 거래에 관한 장부 및 증거서류 (5년)</li>
              </ul>
              <p>그 밖의 사항은 회사의 개인정보 처리방침에 따릅니다.</p>
            </div>
          </div>
        </div>
      `,
			icon: 'info',
			showCancelButton: true,
			confirmButtonColor: '#a66bff',
			cancelButtonColor: '#6c757d',
			confirmButtonText: '동의하고 계속하기',
			cancelButtonText: '취소',
			reverseButtons: true,
		})

		if (!isConfirmed) {
			return // 사용자가 취소한 경우
		}

		setIsLoading(true)

		// ✅ 카테고리 정렬 (낮은 값이 tag1, 높은 값이 tag2)
		const sortedCategories = [formData.category1, formData.category2].sort((a, b) => (a || 0) - (b || 0))
		const tag1Value = sortedCategories[0]
		const tag2Value = sortedCategories[1]

		// ✅ 라벨 값 찾아서 함께 넘김
		const selectedCategory1 = categories.find((cat) => cat.value === tag1Value)
		const selectedCategory2 = categories.find((cat) => cat.value === tag2Value)
		const category1Label = selectedCategory1?.label || tag1Value
		const category2Label = selectedCategory2?.label || tag2Value

		setTitle(formData.title)
		setTag1(tag1Value)
		setTag2(tag2Value)

		// 1초 대기 (로딩 효과를 보여주기 위함)
		await new Promise((resolve) => setTimeout(resolve, 1000))

		setIsLoading(false)

		navigate('/project/info', {
			state: {
				...formData,
				category1Label: category1Label,
				category2Label: category2Label,
			},
		})
	}

	return (
		<div className='max-w-4xl mx-auto mt-12 p-16 bg-white rounded-xl shadow-lg'>
			{isLoading && (
				<div className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-[1000]'>
					<div className='w-12 h-12 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin'></div>
					<div className='mt-5 text-white text-xl font-medium'>프로젝트 생성 중...</div>
				</div>
			)}
			<div className='text-xl font-medium text-gray-800 mb-7 py-5 px-5 bg-gray-50 rounded-lg text-center'>{user?.nickName}님, 환영합니다!</div>
			<form onSubmit={handleSubmit} className='flex flex-col items-center mx-auto w-full gap-8'>
				<h1 className='text-3xl font-semibold m-0 mb-8 pb-5 border-b-2 border-gray-100'>프로젝트 생성</h1>

				<div className='mb-7 text-left'>
					<label className='flex items-center text-lg font-medium text-gray-800 mb-3'>
						프로젝트 제목<span className='text-red-500 ml-1 text-base'>*</span>
					</label>
					<div className='relative w-[600px] mx-auto'>
						<input
							type='text'
							name='title'
							value={formData.title}
							onChange={handleChange}
							placeholder='프로젝트 제목을 입력해주세요!'
							maxLength={40}
							required
							className='w-full h-[70px] px-5 pr-20 border-2 border-gray-300 rounded-lg text-lg transition-colors duration-200 bg-white box-border focus:outline-none focus:border-purple-500 placeholder:text-gray-500'
						/>
						<span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 bg-white bg-opacity-90 px-2 py-0.5 rounded-xl'>
							{formData.title.length}/40
						</span>
					</div>
				</div>

				<div className='mb-7 text-left'>
					<label className='flex items-center text-lg font-medium text-gray-800 mb-3'>
						카테고리 (2개 선택)<span className='text-red-500 ml-1 text-base'>*</span>
					</label>
					<div className='relative w-[600px] mx-auto'>
						<div className='grid grid-cols-2 gap-3 w-full'>
							{categories.map((cat) => {
								const isSelected = formData.category1 === cat.value || formData.category2 === cat.value
								const isDisabled = !isSelected && formData.category1 !== null && formData.category2 !== null

								return (
									<button
										key={cat.value}
										type='button'
										disabled={isDisabled}
										onClick={() => {
											if (isSelected) {
												// 이미 선택된 카테고리면 선택 해제
												setFormData((prev) => ({
													...prev,
													category1: prev.category1 === cat.value ? null : prev.category1,
													category2: prev.category2 === cat.value ? null : prev.category2,
												}))
											} else {
												// 새로운 카테고리 선택
												if (formData.category1 === null) {
													setFormData((prev) => ({ ...prev, category1: cat.value }))
												} else if (formData.category2 === null) {
													setFormData((prev) => ({ ...prev, category2: cat.value }))
												}
											}
										}}
										className={`flex items-center py-3 px-4 border-2 rounded-lg text-base cursor-pointer gap-2.5 w-full transition-all duration-200 ${
											isSelected
												? 'border-purple-500 bg-purple-50'
												: isDisabled
												? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
												: 'border-gray-300 bg-white hover:bg-purple-50'
										}`}>
										<i className={`bi ${cat.icon} text-lg`}></i>
										<span>{cat.label}</span>
									</button>
								)
							})}
						</div>
					</div>

					<div className='flex items-center mt-2 py-2 px-3 bg-gray-50 rounded-md text-sm text-gray-600 leading-relaxed'>
						<span className='flex items-center justify-center w-4 h-4 mr-2 bg-purple-500 text-white rounded-full text-xs font-bold leading-none'>i</span>
						<span>프로젝트 성격에 맞는 카테고리 2개를 선택해주세요.</span>
					</div>
				</div>

				<button
					type='submit'
					disabled={!isFormValid}
					className={`w-full h-16 text-xl font-semibold border-none rounded-lg cursor-pointer mt-5 transition-all duration-200 ease ${
						isFormValid
							? 'bg-purple-500 text-white hover:bg-purple-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none active:bg-purple-600 active:translate-y-0'
							: 'bg-gray-200 text-gray-500'
					}`}>
					제출하기
				</button>
			</form>
		</div>
	)
}

export default ProjectCreatePage
