import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { api } from '../../AxiosInstance';
import { useUserUpdate } from '../../apis/user/useUserUpdate'

import Sidebar from './Sidebar'
import SettingsOverlay from './SettingsOverlay'
import RecentOverlay from './RecentOverlay'
import PointOverlay from './PointOverlay'
import LikeOverlay from './LikeOverlay'
import FundingOverlay from './FundingOverlay'
import MainContent from './MainContent'

interface userResponse {
	message: string
	data: {
		name: string
		nickName: string
		point: number
		address: string
		number: string
		areaNumber: string
		email: string
		socialProvider: string
		img: {
			id: number
			uri: string
		}
	}
}

const MyPage = () => {
	const [fundingCount, setFundingCount] = useState<number>(0)
	const [homePhone, setHomePhone] = useState({ area: '02', number: '' })
	const [showRecentView, setShowRecentView] = useState(false)
	const [showSettingsOverlay, setShowSettingsOverlay] = useState(false)
	const [showPointOverlay, setShowPointOverlay] = useState(false)
	const [showLikeOverlay, setShowLikeOverlay] = useState(false)
	const [showFundingOverlay, setShowFundingOverlay] = useState(false)
	const navigate = useNavigate()
	const { updateUser } = useUserUpdate()

	const [profileImage, setProfileImage] = useState<string | null>(null)
	const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
	const [point, setPoint] = useState(0)
	const [activeTab, setActiveTab] = useState<'서포터' | '메이커'>('서포터')

	const [userInfo, setUserInfo] = useState({
		name: '',
		nickname: '',
		phone: '',
		email: '',
		password: '비밀번호 변경하기',
		passwordcf: '비밀번호 확인',
	})
	const [tempUserInfo, setTempUserInfo] = useState(userInfo)

	const [editFields, setEditFields] = useState<{ [key: string]: boolean }>({})
	const [selectedFilter, setSelectedFilter] = useState('전체')

	// 📌 공통 닫기
	const closeAll = () => {
		setShowRecentView(false)
		setShowSettingsOverlay(false)
		setShowPointOverlay(false)
		setShowLikeOverlay(false)
		setShowFundingOverlay(false)
	}

	// 📌 메뉴 클릭 핸들러
	const handleClick = (menu: string) => {
		switch (menu) {
			case '내 정보 설정':
				setShowSettingsOverlay(true)
				break
			case '최근본':
				setShowRecentView(true)
				break
			case '포인트 충전':
				setShowPointOverlay(true)
				break
			case '좋아요':
				setShowLikeOverlay(true)
				break
			case '펀딩 목록':
				setShowFundingOverlay(true)
				break
			case '내 프로젝트':
				// ✅ 페이지 이동으로 변경
				navigate('/mypage/myprojects')
				break
			case '팔로잉':
				navigate('/following')
				break
			default:
				Swal.fire({
					title: '알림',
					text: `'${menu}' 메뉴로 이동합니다.'`,
					confirmButtonColor: '#a66cff',
				})
				break
		}
	}

	// ✅ 포인트 오버레이 열릴 때 스크롤 막기
	useEffect(() => {
		if (showPointOverlay) {
			const originalStyle = window.getComputedStyle(document.body).overflow
			document.body.style.overflow = 'hidden'
			return () => {
				document.body.style.overflow = originalStyle
			}
		}
	}, [showPointOverlay])

	// 📌 Toss 결제 팝업 열기
	const openPaymentWindow = (amount: number) => {
		const width = 700
		const height = 900
		const left = window.screenX + (window.outerWidth - width) / 2
		const top = window.screenY + (window.outerHeight - height) / 2
		const url = `/popup-payment?amount=${amount}`

		window.open(url, 'toss_payment_popup', `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`)

		const messageListener = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return

			if (event.data === 'payment-success') {
				api.get('/social/user/my-point').then((res) => {
					setPoint(res.data.data.point)
				})
				window.removeEventListener('message', messageListener)
			}
		}

		window.addEventListener('message', messageListener)
	}

	// 📌 API - 펀딩 카운트
	useEffect(() => {
		api
			.post('/public/project/all', { tag: [], page: 0, myPageWhere: 'PROJECT' })
			.then((res) => setFundingCount(res.data.data.totalCount))
			.catch((e) => console.log(e))
	}, [])

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
		setTempUserInfo((prev) => ({ ...prev, [field]: e.target.value }))
	}

	const handleHomePhoneChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setHomePhone((prev) => ({ ...prev, [name]: value }))
	}

	const handleEditClick = (field: string) => {
		setEditFields((prev) => ({ ...prev, [field]: true }))
	}

	const handleSaveField = async (field: string) => {
		// 필드명 매핑 (UI 필드명 → API 필드명)
		const fieldMapping: { [key: string]: string } = {
			name: 'name',
			nickname: 'nickName',
			phone: 'number',
			address: 'address',
		}

		const apiFieldName = fieldMapping[field]
		if (!apiFieldName) {
			console.error('Unknown field:', field)
			return
		}

		const value = tempUserInfo[field as keyof typeof tempUserInfo]

		try {
			await updateUser({ name: apiFieldName, value: value.toString() })
			// 저장 성공 - 실제 userInfo에 반영
			setUserInfo(tempUserInfo)
			setEditFields((prev) => ({ ...prev, [field]: false }))
		} catch (error) {
			console.error('유저 정보 수정 실패:', error)
			alert('정보 수정에 실패했습니다.')
		}
	}

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setTempProfileImage(URL.createObjectURL(file))
			const imagefetch = async () => {
				const formData = new FormData()
				formData.append('img', file)
				const res = await api.put('/social/user/img', formData)
			}
			imagefetch()
		}
	}

	const handleResetClick = () => {
		setTempUserInfo(userInfo)
		setTempProfileImage(profileImage)
		setEditFields({})
	}

	useEffect(() => {
		api.get<userResponse>('/social/user').then((res) => {
			setUserInfo({
				name: res.data.data.name,
				nickname: res.data.data.nickName,
				phone: res.data.data.number,
				email: res.data.data.email,
				password: '비밀번호 변경하기',
				passwordcf: '',
			})
			if (res.data.data.img) {
				setProfileImage(res.data.data.img.uri)
			}
			setPoint(res.data.data.point)
			setHomePhone({
				area: res.data.data.areaNumber,
				number: res.data.data.number,
			})
		})
	}, [])

	useEffect(() => {
		setTempUserInfo(userInfo)
	}, [userInfo])

	return (
		<Container>
			<Sidebar
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				userInfo={userInfo}
				profileImage={profileImage}
				onOpenSettings={() => handleClick('내 정보 설정')}
				onOpenRecent={() => handleClick('최근본')}
				onOpenPoint={() => handleClick('포인트 충전')}
				onOpenLike={() => handleClick('좋아요')}
				onOpenFunding={() => handleClick('펀딩 목록')}
				onOpenFollowing={() => handleClick('팔로잉')}
				onOpenMyProjects={() => handleClick('내 프로젝트')}
			/>

			<MainContent
				userInfo={userInfo}
				fundingCount={fundingCount}
				point={point}
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				onHandleClick={(label) => handleClick(label)}
			/>

			{showSettingsOverlay && (
				<SettingsOverlay
					userInfo={userInfo}
					tempUserInfo={tempUserInfo}
					setUserInfo={setUserInfo}
					profileImage={profileImage}
					tempProfileImage={tempProfileImage}
					setTempUserInfo={setTempUserInfo}
					setTempProfileImage={setTempProfileImage}
					setProfileImage={setProfileImage}
					homePhone={homePhone}
					setHomePhone={setHomePhone}
					editFields={editFields}
					setEditFields={setEditFields}
					onReset={handleResetClick}
					onInputChange={handleInputChange}
					onHomePhoneChange={handleHomePhoneChange}
					onEditClick={handleEditClick}
					onSaveField={handleSaveField}
					onImageChange={handleImageChange}
					onClose={closeAll}
				/>
			)}

			{showRecentView && (
				<RecentOverlay
					onClose={closeAll}
					selectedFilter={selectedFilter}
					setSelectedFilter={setSelectedFilter}
					allTags={[]}
					userInfo={userInfo}
					tempUserInfo={tempUserInfo}
					profileImage={profileImage}
					tempProfileImage={tempProfileImage}
				/>
			)}

			{showLikeOverlay && <LikeOverlay onClose={closeAll} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />}

			{showPointOverlay && <PointOverlay onClose={() => setShowPointOverlay(false)} point={point} openPaymentWindow={openPaymentWindow} />}

			{showFundingOverlay && <FundingOverlay onClose={closeAll} />}
		</Container>
	)
}

export default MyPage;

/* ---------------------- Styled Components ---------------------- */
const Container = styled.div`
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  padding-left: 200px;
  padding-right: 200px;
`;
