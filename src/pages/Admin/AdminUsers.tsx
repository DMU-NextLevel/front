import React, { useState, useEffect } from 'react'
import { api } from '../../AxiosInstance'
import noImage from '../../assets/images/noImage.jpg'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

interface User {
  id: number
  name: string
  nickName: string
  point: number
  role?: string
  address?: string | null
  number?: string | null
  areaNumber?: string | null
  email: string
  socialProvider: string | null
  img: {
    id: number | null
    uri: string
  }
  createdAt?: string
}

interface UserListResponse {
  message?: string
  data?: User[]
  content?: User[]
  totalElements?: number
  totalPages?: number
}

// 유저 목록 조회 API 함수
const fetchUserList = async (params: {
  page: number
  size: number
  sort: string
}): Promise<UserListResponse> => {
  try {
    const response = await api.get('/admin/user/list', { params })
    return response.data
  } catch (error: any) {
    console.error('API 호출 실패:', error)
    console.error('에러 상세:', error.response?.data || error.message)

    // API 실패 시 더미 데이터 반환 (테스트용)
    return {
      content: [
        {
          id: 1,
          name: '홍길동',
          nickName: 'hong',
          point: 15000,
          role: 'USER',
          address: '서울시 강남구',
          number: '010-1234-5678',
          areaNumber: '02',
          email: 'hong@example.com',
          socialProvider: null,
          img: { id: null, uri: '' }
        },
        {
          id: 2,
          name: '김철수',
          nickName: 'kim',
          point: 25000,
          role: 'ADMIN',
          address: '부산시 해운대구',
          number: '010-9876-5432',
          areaNumber: '051',
          email: 'kim@example.com',
          socialProvider: 'google',
          img: { id: null, uri: '' }
        },
        {
          id: 3,
          name: '이영희',
          nickName: 'lee',
          point: 5000,
          role: 'USER',
          address: '대구시 중구',
          number: '010-5555-6666',
          areaNumber: '053',
          email: 'lee@example.com',
          socialProvider: 'kakao',
          img: { id: null, uri: '' }
        }
      ],
      totalElements: 3,
      totalPages: 1
    }
  }
}

interface Project {
  id: number
  title: string
  category?: string
  tags?: string[]
  status: 'PENDING' | 'PROGRESS' | 'STOPPED' | 'SUCCESS' | 'FAIL' | 'END'
  currentFunding?: number
  targetFunding?: number
  completionRate?: number
  backers?: number
  userCount?: number
  createdDate?: string
  createdAt?: string
  author?: {
    name: string
    nickName: string
  }
  titleImg?: {
    id: number
    uri: string
  }
}

interface Coupon {
  id: number
  name: string
  percent: number
}

interface UserDetail extends User {
  projects: Project[]
  followingProjects: Project[]
  coupons?: Coupon[]
}

const AdminUsers: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [providerFilter, setProviderFilter] = useState<string>('ALL')
	const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
	const [sortField, setSortField] = useState<string>('id')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<'basic' | 'projects' | 'coupons' | 'management'>('basic')

	// 작성한 프로젝트 페이지네이션
	const [projectsPage, setProjectsPage] = useState(1)
	const projectsPerPage = 5

	// API 데이터 상태
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)

	// API에서 유저 데이터 가져오기
	const fetchUsers = async () => {
		try {
			setLoading(true)
			const response = await fetchUserList({
				page: 0,
				size: 50,
				sort: 'id,desc',
			})

			// 다양한 응답 형식 지원
			let userData: User[] = []
			if (response.content) {
				userData = response.content // Spring Boot Pageable 형식
			} else if (response.data) {
				userData = response.data // 커스텀 API 형식
			} else if (Array.isArray(response)) {
				userData = response // 직접 배열 형식
			}

			setUsers(userData)
		} catch (error) {
			console.error('유저 목록 조회 실패:', error)
			toast.error('유저 목록을 불러오는데 실패했습니다.')
			setUsers([]) // 에러 시 빈 배열로 설정
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	// 검색 및 필터 적용
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.nickName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesProvider = providerFilter === 'ALL' || user.socialProvider === providerFilter

		return matchesSearch && matchesProvider
	})

	// 정렬 핸들러
	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
		} else {
			setSortField(field)
			setSortDirection('asc')
		}
	}

	// 정렬 적용
	const sortedUsers = [...filteredUsers].sort((a, b) => {
		let aValue: any
		let bValue: any

		switch (sortField) {
			case 'id':
				aValue = a.id
				bValue = b.id
				break
			case 'name':
				aValue = a.name.toLowerCase()
				bValue = b.name.toLowerCase()
				break
			case 'nickName':
				aValue = a.nickName.toLowerCase()
				bValue = b.nickName.toLowerCase()
				break
			case 'email':
				aValue = a.email.toLowerCase()
				bValue = b.email.toLowerCase()
				break
			case 'point':
				aValue = a.point
				bValue = b.point
				break
			case 'role':
				aValue = a.role || 'USER'
				bValue = b.role || 'USER'
				break
			case 'provider':
				aValue = a.socialProvider
				bValue = b.socialProvider
				break
			case 'createdAt':
				aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
				bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
				break
			default:
				aValue = a.id
				bValue = b.id
		}

		if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
		if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
		return 0
	})

	const getSortIcon = (field: string) => {
		if (sortField !== field) return <i className='bi bi-caret-down-fill text-gray-300 text-xs ms-1'></i>
		return sortDirection === 'asc' ? <i className='bi bi-caret-up-fill text-blue-600 text-xs ms-1'></i> : <i className='bi bi-caret-down-fill text-blue-600 text-xs ms-1'></i>
	}

	const getProviderBadge = (provider: string | null) => {
		if (!provider) {
			return (
				<span className='px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded inline-flex items-center gap-1'>
					<i className='bi bi-envelope text-[10px]'></i>
					일반
				</span>
			)
		}

		const providerMap = {
			google: { class: 'bg-red-100 text-red-700', icon: 'bi-google', text: 'Google' },
			naver: { class: 'bg-green-100 text-green-700', icon: 'bi-circle-fill', text: 'Naver' },
			kakao: { class: 'bg-yellow-100 text-yellow-700', icon: 'bi-chat-fill', text: 'Kakao' },
		}
		const info = providerMap[provider as keyof typeof providerMap] || { class: 'bg-gray-100 text-gray-700', icon: 'bi-person', text: provider }
		return (
			<span className={`px-2 py-1 text-xs ${info.class} rounded inline-flex items-center gap-1`}>
				<i className={`bi ${info.icon} text-[10px]`}></i>
				{info.text}
			</span>
		)
	}

	const handleEditNickname = (userId: number, currentNickname: string) => {
		const newNickname = prompt('새로운 닉네임을 입력하세요:', currentNickname)
		if (newNickname && newNickname !== currentNickname) {
			toast.success(`${currentNickname} → ${newNickname} 변경 완료 (API 연결 후 실제 적용)`)
			// TODO: API 연결
			// await api.patch(`/admin/users/${userId}/nickname`, { nickName: newNickname })
		}
	}

	const handleDeleteUser = async (userId: number, userName: string) => {
		const confirmResult = await Swal.fire({
			title: `정말로 "${userName}" 유저를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
			icon: 'warning',
			confirmButtonColor: '#a666ff',
			confirmButtonText: '확인',
			cancelButtonColor: '#9e9e9e',
			cancelButtonText: '취소',
		})
		if (!confirmResult.isConfirmed) return

		try {
			// TODO: API 연결
			// await api.delete(`/admin/users/${userId}`)
			toast.success(`${userName} 유저 삭제 완료 (API 연결 후 실제 적용)`)
			fetchUsers()
		} catch (error) {
			console.error('유저 삭제 실패:', error)
			toast.error('유저 삭제에 실패했습니다.')
		}
	}

	const handleResetPassword = async (userId: number, userName: string) => {
		const confirmResult = await Swal.fire({
			title: `"${userName}" 유저의 비밀번호를 초기화하시겠습니까?`,
			icon: 'warning',
			confirmButtonColor: '#a666ff',
			confirmButtonText: '확인',
			cancelButtonColor: '#9e9e9e',
			cancelButtonText: '취소',
		})
		if (!confirmResult.isConfirmed) return

		try {
			// TODO: API 연결
			// await api.post(`/admin/users/${userId}/reset-password`)
			toast.success(`${userName} 비밀번호 초기화 완료 (API 연결 후 실제 적용)`)
		} catch (error) {
			console.error('비밀번호 초기화 실패:', error)
			toast.error('비밀번호 초기화에 실패했습니다.')
		}
	}

	const handleSuspendUser = async (userId: number, userName: string) => {
		const confirmResult = await Swal.fire({
			title: `"${userName}" 유저를 정지하시겠습니까?`,
			icon: 'warning',
			confirmButtonColor: '#a666ff',
			confirmButtonText: '확인',
			cancelButtonColor: '#9e9e9e',
			cancelButtonText: '취소',
		})
		if (!confirmResult.isConfirmed) return

		try {
			// TODO: API 연결
			// await api.post(`/admin/users/${userId}/suspend`)
			toast.success(`${userName} 유저 정지 완료 (API 연결 후 실제 적용)`)
		} catch (error) {
			console.error('유저 정지 실패:', error)
			toast.error('유저 정지에 실패했습니다.')
		}
	}

	// 역할 변경 핸들러
	const handleRoleChange = async (userId: number, newRole: string) => {
		try {
			const response = await api.put('/admin/user/update', {
				id: userId,
				name: 'role',
				value: newRole,
			})

			if (response.data.message === 'success') {
				toast.success('역할이 성공적으로 변경되었습니다.')
				// 사용자 목록 새로고침
				fetchUsers()
				// 선택된 사용자 정보 업데이트
				if (selectedUser && selectedUser.id === userId) {
					setSelectedUser({ ...selectedUser, role: newRole })
				}
			}
		} catch (error) {
			console.error('역할 변경 실패:', error)
			toast.error('역할 변경에 실패했습니다.')
		}
	}

	// 포인트 변경 핸들러
	const handlePointChange = async (userId: number, adjustValue: number) => {
		try {
			// 음수 포인트 검증
			const currentPoint = selectedUser?.point || 0
			const newPoint = currentPoint + adjustValue

			if (newPoint < 0) {
				toast.error('포인트가 음수가 될 수 없습니다.')
				return
			}

			// API에 조정값을 전달 (절대값이 아닌 증감값)
			const response = await api.put('/admin/user/update', {
				id: userId,
				name: 'point',
				value: adjustValue, // 증감값을 그대로 전달
			})

			if (response.data.message === 'success') {
				toast.success(`포인트가 ${adjustValue > 0 ? '+' : ''}${adjustValue.toLocaleString()}P 조정되었습니다.`)
				// 사용자 목록 새로고침
				fetchUsers()
				// 선택된 사용자 정보 업데이트
				if (selectedUser && selectedUser.id === userId) {
					setSelectedUser({ ...selectedUser, point: newPoint })
				}
			}
		} catch (error: any) {
			console.error('포인트 변경 실패:', error)
			console.error('에러 상세:', error.response?.data)
			toast.error('포인트 변경에 실패했습니다.')
		}
	}

	// 프로젝트 상태 변경 핸들러
	const handleProjectStatusChange = async (projectId: number, newStatus: string) => {
		try {
			const response = await api.post(`/admin/project/status/${projectId}?status=${newStatus}`)

			if (response.data.message === 'success') {
				toast.success('프로젝트 상태가 성공적으로 변경되었습니다.')
				// 사용자 목록 새로고침
				fetchUsers()
				// 선택된 사용자 정보 업데이트
				if (selectedUser && selectedUser.projects) {
					const updatedProjects = selectedUser.projects.map((project) => (project.id === projectId ? { ...project, status: newStatus as Project['status'] } : project))
					setSelectedUser({ ...selectedUser, projects: updatedProjects })
				}
			}
		} catch (error: any) {
			console.error('프로젝트 상태 변경 실패:', error)
			toast.error(error.response?.data?.message || '프로젝트 상태 변경에 실패했습니다.')
		}
	}

	const handleViewDetail = async (user: User) => {
		try {
			let projects: Project[] = []
			let fundingProjects: Project[] = []
			let coupons: Coupon[] = []

			// 프로젝트 조회 (에러 발생해도 계속 진행)
			try {
				const projectsRes = await api.post('/admin/project', {
					userId: user.id,
					page: 0,
					pageCount: 100,
					type: 'PROJECT',
				})

				projects =
					projectsRes.data.data?.projects?.map((item: any) => ({
						id: item.id,
						title: item.title,
						tags: item.tags || [],
						status: item.status,
						completionRate: item.completionRate || 0,
						userCount: item.userCount || 0,
						createdAt: item.createdAt,
						author: item.author,
						titleImg: item.titleImg,
					})) || []

				console.log('생성한 프로젝트:', projects)
			} catch (err: any) {
				console.error('프로젝트 조회 실패:', err)
				console.error('에러 응답:', err.response?.data)
				console.log('프로젝트를 불러올 수 없어 빈 배열로 설정합니다.')
			}

			// 펀딩한 프로젝트 조회 (에러 발생해도 계속 진행)
			try {
				const fundingRes = await api.post('/admin/project', {
					userId: user.id,
					page: 0,
					pageCount: 100,
					type: 'FUNDING',
				})

				fundingProjects =
					fundingRes.data.data?.projects?.map((item: any) => ({
						id: item.id,
						title: item.title,
						tags: item.tags || [],
						status: item.status,
						completionRate: item.completionRate || 0,
						userCount: item.userCount || 0,
						createdAt: item.createdAt,
						author: item.author,
						titleImg: item.titleImg,
					})) || []

				console.log('펀딩한 프로젝트:', fundingProjects)
			} catch (err: any) {
				console.error('펀딩한 프로젝트 조회 실패:', err)
				console.error('에러 응답:', err.response?.data)
				console.log('펀딩한 프로젝트를 불러올 수 없어 빈 배열로 설정합니다.')
			}

			// 쿠폰 조회 (에러 발생해도 계속 진행)
			try {
				const couponsRes = await api.get('/admin/coupon', {
					params: { userId: user.id },
				})

				coupons = couponsRes.data.data || []
				console.log('쿠폰 조회 결과:', coupons)
			} catch (err: any) {
				console.error('쿠폰 조회 실패:', err)
				console.error('에러 응답:', err.response?.data)
				console.log('쿠폰을 불러올 수 없어 빈 배열로 설정합니다.')
			}

			const detailUser: UserDetail = {
				...user,
				projects: projects,
				followingProjects: fundingProjects,
				coupons: coupons,
			}

			setSelectedUser(detailUser)
			setActiveTab('basic')
			setProjectsPage(1) // 페이지 초기화
			setIsModalOpen(true)
		} catch (error) {
			console.error('유저 상세 정보 조회 실패:', error)
			// API 실패 시 기본 데이터로 표시
			const detailUser: UserDetail = {
				...user,
				projects: [],
				followingProjects: [],
				coupons: [],
			}
			setSelectedUser(detailUser)
			setActiveTab('basic')
			setIsModalOpen(true)
			toast.error('일부 정보를 불러오는데 실패했습니다.')
		}
	}

	return (
		<div className='min-h-screen flex flex-col animate-fadeIn'>
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

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: backwards;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }

        @keyframes expandDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scaleY(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes collapseUp {
          from {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scaleY(0.95);
          }
        }

        .detail-row-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .detail-expand-enter {
          animation: expandDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: top;
        }

        .detail-expand-exit {
          animation: collapseUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: top;
        }
      `}</style>

			{/* 헤더 */}
			<div className='flex justify-between items-center animate-slideInDown'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>유저 관리</h1>
					<p className='text-sm text-gray-600 mt-1'>전체 {users.length}명</p>
				</div>
			</div>

			{/* 통계 카드 */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideInDown animate-delay-100'>
				<div className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 mb-1'>전체 유저</p>
							<p className='text-2xl font-bold text-gray-900'>{users.length}</p>
						</div>
						<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
							<i className='bi bi-people text-blue-600 text-xl'></i>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 mb-1'>소셜 가입</p>
							<p className='text-2xl font-bold text-purple-600'>{users.filter((u) => u.socialProvider).length}</p>
						</div>
						<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
							<i className='bi bi-share text-purple-600 text-xl'></i>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 mb-1'>일반 가입</p>
							<p className='text-2xl font-bold text-green-600'>{users.filter((u) => !u.socialProvider).length}</p>
						</div>
						<div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
							<i className='bi bi-envelope text-green-600 text-xl'></i>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 mb-1'>총 포인트</p>
							<p className='text-2xl font-bold text-orange-600'>{users.reduce((sum, u) => sum + u.point, 0).toLocaleString()}</p>
						</div>
						<div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
							<i className='bi bi-coin text-orange-600 text-xl'></i>
						</div>
					</div>
				</div>
			</div>

			{/* 검색 및 필터 */}
			<div className='bg-white rounded-lg border border-gray-200 p-4'>
				<div className='flex gap-3'>
					<div className='flex-1'>
						<input
							type='text'
							placeholder='이름, 닉네임, 이메일 검색...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
						/>
					</div>
					<select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className='px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[140px]'>
						<option value='ALL'>전체 가입경로</option>
						<option value=''>일반 가입</option>
						<option value='google'>Google</option>
						<option value='naver'>Naver</option>
						<option value='kakao'>Kakao</option>
					</select>
				</div>
			</div>

			{/* 유저 테이블 */}
			<div className='bg-white rounded-lg border border-gray-200 overflow-hidden animate-slideInDown animate-delay-200 flex-grow min-h-[600px]'>
				<div className='overflow-x-auto h-full'>
					<table className='min-w-[900px] w-full text-sm h-full'>
						<thead className='bg-gray-50 border-b border-gray-200'>
							<tr>
								<th
									onClick={() => handleSort('id')}
									className='px-4 py-2 min-w-[50px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap'>
									ID {getSortIcon('id')}
								</th>
								<th className='px-4 py-2 text-left text-xs font-semibold text-gray-700'>프로필</th>
								<th
									onClick={() => handleSort('name')}
									className='px-4 py-2 min-w-[140px] max-w-[220px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap'>
									이름 {getSortIcon('name')}
								</th>
								<th
									onClick={() => handleSort('nickName')}
									className='px-4 py-2 min-w-[100px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap'>
									닉네임 {getSortIcon('nickName')}
								</th>
								<th
									onClick={() => handleSort('email')}
									className='px-4 py-2 min-w-[180px] max-w-[260px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell'>
									이메일 {getSortIcon('email')}
								</th>
								<th
									onClick={() => handleSort('point')}
									className='px-4 py-2 min-w-[80px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap'>
									포인트 {getSortIcon('point')}
								</th>
								<th
									onClick={() => handleSort('role')}
									className='px-4 py-2 min-w-[90px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap'>
									권한 {getSortIcon('role')}
								</th>
								<th
									onClick={() => handleSort('provider')}
									className='px-4 py-2 min-w-[100px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell'>
									가입경로 {getSortIcon('provider')}
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200'>
							{loading ? (
								<tr>
									<td colSpan={8} className='px-4 py-8 text-center text-gray-500'>
										<div className='flex items-center justify-center'>
											<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2'></div>
											유저 목록을 불러오는 중...
										</div>
									</td>
								</tr>
							) : sortedUsers.length === 0 ? (
								<tr>
									<td colSpan={8} className='px-4 py-8 text-center text-gray-500'>
										{searchTerm ? '검색 결과가 없습니다.' : '등록된 유저가 없습니다.'}
									</td>
								</tr>
							) : (
								sortedUsers.map((user) => (
									<tr
										key={user.id}
										onClick={(e) => {
											// 관리 메뉴 영역 클릭 시 모달 열기 방지
											if (!(e.target as HTMLElement).closest('.action-menu')) {
												handleViewDetail(user)
											}
										}}
										className='hover:bg-gray-50 cursor-pointer transition-colors'>
										<td className='px-4 py-2 min-w-[50px] text-sm text-gray-900 whitespace-nowrap'>{user.id}</td>
										<td className='px-4 py-2 min-w-[56px]'>
											<div className='w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center'>
												{user.img?.uri ? (
													<img
														src={user.img.uri}
														alt={user.name}
														onError={(e) => {
															e.currentTarget.onerror = null
															e.currentTarget.src = noImage
														}}
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
														<span className='text-lg font-bold text-blue-600'>{user.name.charAt(0)}</span>
													</div>
												)}
											</div>
										</td>
										<td className='px-4 py-2 min-w-[140px] max-w-[220px] text-sm text-gray-900 font-medium truncate whitespace-nowrap'>{user.name}</td>
										<td className='px-4 py-2 min-w-[100px] text-sm text-gray-600 truncate whitespace-nowrap'>@{user.nickName}</td>
										<td className='px-4 py-2 min-w-[180px] max-w-[260px] text-sm text-gray-600 truncate whitespace-nowrap hidden sm:table-cell'>{user.email}</td>
										<td className='px-4 py-2 text-sm text-gray-900 font-semibold'>{user.point.toLocaleString()}P</td>
										<td className='px-4 py-2'>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${(user.role || 'USER') === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
												{(user.role || 'USER') === 'ADMIN' ? '관리자' : '유저'}
											</span>
										</td>
										<td className='px-4 py-2 hidden sm:table-cell'>{getProviderBadge(user.socialProvider || '')}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{sortedUsers.length === 0 && (
					<div className='text-center py-12 text-gray-500'>
						<i className='bi bi-inbox text-4xl mb-2'></i>
						<p className='text-sm'>검색 결과가 없습니다.</p>
					</div>
				)}
			</div>

			{/* 사용자 상세 모달 */}
			{isModalOpen && selectedUser && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl w-full max-w-[1200px] h-[85vh] max-h-[900px] overflow-hidden'>
						{/* 모달 헤더 */}
						<div className='flex items-center justify-between p-6 border-b border-gray-200'>
							<div className='flex items-center gap-4'>
								{/* 프로필 이미지 */}
								<div className='w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-sm'>
									{selectedUser.img?.uri ? (
										<img
											src={selectedUser.img.uri}
											alt={selectedUser.name}
											onError={(e) => {
												e.currentTarget.onerror = null
												e.currentTarget.src = noImage
											}}
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
											<span className='text-2xl font-bold text-blue-600'>{selectedUser.name.charAt(0)}</span>
										</div>
									)}
								</div>
								{/* 사용자 정보 */}
								<div>
									<h2 className='text-xl font-bold text-gray-900'>{selectedUser.name}</h2>
									<p className='text-sm text-gray-600'>@{selectedUser.nickName}</p>
									<div className='flex items-center gap-2 mt-1'>
										{getProviderBadge(selectedUser.socialProvider || 'LOCAL')}
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												(selectedUser.role || 'USER') === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
											}`}>
											{(selectedUser.role || 'USER') === 'ADMIN' ? '관리자' : '일반 사용자'}
										</span>
									</div>
								</div>
							</div>
							{/* 닫기 버튼 */}
							<button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
								<i className='bi bi-x-lg text-xl text-gray-500'></i>
							</button>
						</div>

						{/* 모달 콘텐츠 */}
						<div className='p-6 overflow-y-auto' style={{ height: 'calc(85vh - 120px)', maxHeight: 'calc(900px - 120px)' }}>
							{/* 탭 메뉴 */}
							<div className='flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6'>
								<button
									onClick={() => setActiveTab('basic')}
									className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
										activeTab === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
									}`}>
									기본 정보
								</button>
								<button
									onClick={() => setActiveTab('projects')}
									className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
										activeTab === 'projects' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
									}`}>
									작성한 프로젝트 ({selectedUser.projects.length})
								</button>
								<button
									onClick={() => setActiveTab('coupons')}
									className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
										activeTab === 'coupons' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
									}`}>
									보유 쿠폰 ({selectedUser.coupons?.length || 0})
								</button>
								<button
									onClick={() => setActiveTab('management')}
									className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
										activeTab === 'management' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
									}`}>
									관리
								</button>
							</div>

							{/* 탭 콘텐츠 */}
							{activeTab === 'basic' && (
								<div className='space-y-4'>
									{/* 전체 정보를 하나의 깔끔한 카드로 */}
									<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
										{/* 계정 정보 섹션 */}
										<div className='p-6 border-b border-gray-100'>
											<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>계정 정보</h3>
											<div className='grid grid-cols-3 gap-6'>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>유저 ID</label>
													<p className='text-base font-semibold text-gray-900'>#{selectedUser.id}</p>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>이름</label>
													<p className='text-base font-semibold text-gray-900'>{selectedUser.name}</p>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>닉네임</label>
													<p className='text-base font-medium text-gray-700'>@{selectedUser.nickName}</p>
												</div>
											</div>
											<div className='grid grid-cols-3 gap-6 mt-4'>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>역할</label>
													<span
														className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
															(selectedUser.role || 'USER') === 'ADMIN' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
														}`}>
														<i className={`bi ${(selectedUser.role || 'USER') === 'ADMIN' ? 'bi-shield-check' : 'bi-person'} mr-1.5`}></i>
														{(selectedUser.role || 'USER') === 'ADMIN' ? '관리자' : '일반 사용자'}
													</span>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>포인트</label>
													<p className='text-base font-bold text-gray-900'>
														{selectedUser.point.toLocaleString()}
														<span className='text-sm text-gray-500 ml-1'>P</span>
													</p>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>가입 경로</label>
													<div className='mt-0.5'>{getProviderBadge(selectedUser.socialProvider || 'LOCAL')}</div>
												</div>
											</div>
										</div>

										{/* 연락처 정보 섹션 */}
										<div className='p-6 border-b border-gray-100 bg-gray-50'>
											<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>연락처</h3>
											<div className='grid grid-cols-3 gap-6'>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>이메일</label>
													<p className='text-sm text-gray-900 flex items-center gap-2 truncate' title={selectedUser.email}>
														<i className='bi bi-envelope text-gray-400 text-xs'></i>
														{selectedUser.email}
													</p>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>전화번호</label>
													<p className='text-sm text-gray-900 flex items-center gap-2'>
														<i className='bi bi-telephone text-gray-400 text-xs'></i>
														{selectedUser.number || (selectedUser.areaNumber ? `${selectedUser.areaNumber}` : '미등록')}
													</p>
												</div>
												<div>
													<label className='block text-xs text-gray-500 mb-1'>주소</label>
													<p className='text-sm text-gray-900 flex items-center gap-2 truncate' title={selectedUser.address || '등록된 주소가 없습니다.'}>
														<i className='bi bi-geo-alt text-gray-400 text-xs'></i>
														{selectedUser.address || '미등록'}
													</p>
												</div>
											</div>
										</div>

										{/* 계정 상태 섹션 */}
										<div className='p-6'>
											<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>계정 상태</h3>
											<div className='flex items-center gap-2'>
												<i className='bi bi-calendar-check text-gray-400'></i>
												<span className='text-xs text-gray-500'>가입일</span>
												<span className='text-sm font-medium text-gray-900'>
													{selectedUser.createdAt
														? new Date(selectedUser.createdAt).toLocaleDateString('ko-KR', {
																year: 'numeric',
																month: 'long',
																day: 'numeric',
														  })
														: '정보 없음'}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === 'projects' && (
								<div className='overflow-x-auto'>
									{selectedUser.projects.length > 0 ? (
										<>
											<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
												<table className='w-full text-xs'>
													<thead className='bg-gray-50 border-b border-gray-200'>
														<tr>
															<th className='px-4 py-3 text-left font-semibold text-gray-900'>프로젝트</th>
															<th className='px-4 py-3 text-left font-semibold text-gray-900'>카테고리</th>
															<th className='px-4 py-3 text-center font-semibold text-gray-900'>상태</th>
															<th className='px-4 py-3 text-center font-semibold text-gray-900'>달성률</th>
															<th className='px-4 py-3 text-center font-semibold text-gray-900'>후원자</th>
															<th className='px-4 py-3 text-center font-semibold text-gray-900'>생성일</th>
														</tr>
													</thead>
													<tbody className='divide-y divide-gray-200'>
														{selectedUser.projects.slice((projectsPage - 1) * projectsPerPage, projectsPage * projectsPerPage).map((project) => (
															<tr key={project.id} className='hover:bg-gray-50 transition-colors'>
																<td className='px-4 py-3'>
																	<div className='flex items-center gap-3'>
																		<img
																			src={project.titleImg?.uri || noImage}
																			alt={project.title}
																			className='w-12 h-12 rounded-lg object-cover border border-gray-200'
																			onError={(e) => {
																				e.currentTarget.src = noImage
																			}}
																		/>
																		<div className='flex-1 min-w-0'>
																			<div className='font-medium text-gray-900 truncate max-w-xs' title={project.title}>
																				{project.title}
																			</div>
																			<div className='text-xs text-gray-500'>ID: #{project.id}</div>
																		</div>
																	</div>
																</td>
																<td className='px-4 py-3'>
																	<div className='flex flex-wrap gap-1'>
																		{project.tags && project.tags.length > 0 ? (
																			project.tags.map((tag, idx) => (
																				<span key={idx} className='inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded'>
																					{tag}
																				</span>
																			))
																		) : (
																			<span className='text-gray-400'>-</span>
																		)}
																	</div>
																</td>
																<td className='px-4 py-3 text-center'>
																	<select
																		value={project.status}
																		onChange={(e) => handleProjectStatusChange(project.id, e.target.value)}
																		className='px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'>
																		<option value='PENDING'>시작 전</option>
																		<option value='PROGRESS'>진행 중</option>
																		<option value='STOPPED'>중단됨</option>
																		<option value='SUCCESS'>펀딩성공</option>
																		<option value='FAIL'>펀딩실패</option>
																		<option value='END'>종료</option>
																	</select>
																</td>
																<td className='px-4 py-3 text-center'>
																	<div className='flex flex-col items-center gap-1'>
																		<span className='font-semibold text-blue-600'>{Math.round(project.completionRate || 0)}%</span>
																		<div className='w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
																			<div className='h-full bg-blue-600 rounded-full transition-all' style={{ width: `${Math.min(project.completionRate || 0, 100)}%` }}></div>
																		</div>
																	</div>
																</td>
																<td className='px-4 py-3 text-center'>
																	<span className='inline-flex items-center gap-1 text-gray-600 font-medium'>
																		<i className='bi bi-people-fill text-gray-400'></i>
																		{project.userCount || 0}명
																	</span>
																</td>
																<td className='px-4 py-3 text-center text-gray-600'>
																	{project.createdAt
																		? new Date(project.createdAt).toLocaleDateString('ko-KR', {
																				year: 'numeric',
																				month: '2-digit',
																				day: '2-digit',
																		  })
																		: '-'}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>

											{/* 페이지네이션 */}
											{selectedUser.projects.length > projectsPerPage && (
												<div className='mt-6 flex items-center justify-center gap-2'>
													<button
														onClick={() => setProjectsPage((prev) => Math.max(1, prev - 1))}
														disabled={projectsPage === 1}
														className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
															projectsPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
														}`}>
														<i className='bi bi-chevron-left'></i>
													</button>

													{Array.from({ length: Math.ceil(selectedUser.projects.length / projectsPerPage) }, (_, i) => i + 1).map((pageNum) => (
														<button
															key={pageNum}
															onClick={() => setProjectsPage(pageNum)}
															className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
																projectsPage === pageNum ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
															}`}>
															{pageNum}
														</button>
													))}

													<button
														onClick={() => setProjectsPage((prev) => Math.min(Math.ceil(selectedUser.projects.length / projectsPerPage), prev + 1))}
														disabled={projectsPage === Math.ceil(selectedUser.projects.length / projectsPerPage)}
														className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
															projectsPage === Math.ceil(selectedUser.projects.length / projectsPerPage)
																? 'bg-gray-100 text-gray-400 cursor-not-allowed'
																: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
														}`}>
														<i className='bi bi-chevron-right'></i>
													</button>
												</div>
											)}
										</>
									) : (
										<div className='text-center py-12 bg-white rounded-lg border border-gray-200'>
											<div className='flex flex-col items-center'>
												<i className='bi bi-folder-x text-4xl text-gray-400 mb-3'></i>
												<p className='text-gray-500 font-medium'>작성한 프로젝트가 없습니다.</p>
												<p className='text-sm text-gray-400 mt-1'>새로운 프로젝트를 시작해보세요.</p>
											</div>
										</div>
									)}
								</div>
							)}

							{activeTab === 'coupons' && (
								<div className='space-y-6'>
									<div className='bg-white rounded-lg border border-gray-200'>
										<div className='p-6 border-b border-gray-200'>
											<h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
												<i className='bi bi-ticket-perforated text-purple-600'></i>
												보유 쿠폰 목록
											</h3>
											<p className='text-sm text-gray-600 mt-1'>이 유저가 보유하고 있는 쿠폰 내역입니다.</p>
										</div>

										{selectedUser.coupons && selectedUser.coupons.length > 0 ? (
											<div className='p-6'>
												<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
													{selectedUser.coupons.map((coupon) => (
														<div
															key={coupon.id}
															className='relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all group'>
															{/* 쿠폰 상단 */}
															<div className='p-3 relative'>
																{/* 배경 패턴 */}
																<div className='absolute inset-0 opacity-10'>
																	<div
																		className='absolute inset-0'
																		style={{
																			backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
																			backgroundSize: '15px 15px',
																		}}></div>
																</div>

																{/* 쿠폰 내용 */}
																<div className='relative'>
																	<div className='flex items-center gap-1.5 mb-2'>
																		<i className='bi bi-ticket-perforated-fill text-white text-sm'></i>
																		<span className='text-[10px] font-semibold text-white/80 uppercase tracking-wider'>할인 쿠폰</span>
																	</div>

																	<h4 className='font-bold text-white text-sm mb-2 line-clamp-1'>{coupon.name}</h4>

																	<div className='flex items-end gap-1'>
																		<span className='text-2xl font-black text-white'>₩{coupon.percent.toLocaleString()}</span>
																		<span className='text-xs text-white/80 mb-0.5 font-medium'>할인</span>
																	</div>
																</div>
															</div>

															{/* 쿠폰 톱니 효과 */}
															<div className='h-3 relative bg-white'>
																<div
																	className='absolute top-0 left-0 right-0 h-3'
																	style={{
																		backgroundImage: 'radial-gradient(circle at 50% 0%, transparent 6px, white 6px)',
																		backgroundSize: '15px 15px',
																		backgroundPosition: '0 0',
																	}}></div>
															</div>

															{/* 쿠폰 하단 */}
															<div className='bg-white px-3 py-2 flex items-center justify-between'>
																<div className='flex items-center gap-1.5'>
																	<div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
																	<span className='text-[10px] font-medium text-gray-600'>사용 가능</span>
																</div>
																<i className='bi bi-arrow-right text-xs text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all'></i>
															</div>
														</div>
													))}
												</div>
											</div>
										) : (
											<div className='p-12 text-center'>
												<div className='flex flex-col items-center'>
													<i className='bi bi-ticket-perforated text-4xl text-gray-400 mb-3'></i>
													<p className='text-gray-500 font-medium'>보유 중인 쿠폰이 없습니다.</p>
													<p className='text-sm text-gray-400 mt-1'>쿠폰 관리 메뉴에서 쿠폰을 발급할 수 있습니다.</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)}

							{activeTab === 'management' && (
								<div className='space-y-4'>
									<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
										{/* 2열 그리드 레이아웃 */}
										<div className='grid grid-cols-2 gap-px bg-gray-200'>
											{/* 권한 관리 */}
											<div className='bg-white p-6'>
												<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>권한 관리</h3>
												<div className='space-y-4'>
													<div>
														<label className='block text-xs text-gray-500 mb-2'>현재 역할</label>
														<span
															className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
																(selectedUser.role || 'USER') === 'ADMIN' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
															}`}>
															<i className={`bi ${(selectedUser.role || 'USER') === 'ADMIN' ? 'bi-shield-fill' : 'bi-person-fill'} mr-2`}></i>
															{(selectedUser.role || 'USER') === 'ADMIN' ? '관리자' : '일반 사용자'}
														</span>
													</div>
													<div>
														<label className='block text-xs text-gray-500 mb-2'>역할 변경</label>
														<select
															value={selectedUser.role || 'USER'}
															onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
															className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900'>
															<option value='USER'>일반 사용자</option>
															<option value='ADMIN'>관리자</option>
														</select>
													</div>
												</div>
											</div>

											{/* 포인트 관리 */}
											<div className='bg-white p-6'>
												<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>포인트 관리</h3>
												<div className='space-y-4'>
													<div>
														<label className='block text-xs text-gray-500 mb-1'>현재 포인트</label>
														<p className='text-2xl font-bold text-gray-900'>
															{selectedUser.point.toLocaleString()}
															<span className='text-base text-gray-500 ml-1'>P</span>
														</p>
													</div>
													<div>
														<label className='block text-xs text-gray-500 mb-2'>포인트 증감</label>
														<div className='flex gap-2'>
															<input
																type='number'
																placeholder='증감값 (양수: 증가, 음수: 감소)'
																className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900'
																id='pointAdjustInput'
																onKeyPress={(e) => {
																	if (e.key === 'Enter') {
																		const value = parseInt((e.target as HTMLInputElement).value)
																		if (!isNaN(value)) {
																			handlePointChange(selectedUser.id, value)
																			;(e.target as HTMLInputElement).value = ''
																		}
																	}
																}}
															/>
															<button
																onClick={() => {
																	const input = document.getElementById('pointAdjustInput') as HTMLInputElement
																	const value = parseInt(input.value)
																	if (!isNaN(value)) {
																		handlePointChange(selectedUser.id, value)
																		input.value = ''
																	}
																}}
																className='px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors'>
																적용
															</button>
														</div>
													</div>
													<div className='grid grid-cols-3 gap-2'>
														<button
															onClick={() => handlePointChange(selectedUser.id, 1000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															+1K
														</button>
														<button
															onClick={() => handlePointChange(selectedUser.id, 5000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															+5K
														</button>
														<button
															onClick={() => handlePointChange(selectedUser.id, 10000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															+10K
														</button>
														<button
															onClick={() => handlePointChange(selectedUser.id, -1000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															-1K
														</button>
														<button
															onClick={() => handlePointChange(selectedUser.id, -5000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															-5K
														</button>
														<button
															onClick={() => handlePointChange(selectedUser.id, -10000)}
															className='px-3 py-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors'>
															-10K
														</button>
													</div>
												</div>
											</div>

											{/* 계정 설정 */}
											<div className='bg-gray-50 p-6'>
												<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>계정 설정</h3>
												<div className='space-y-2'>
													<button
														onClick={() => handleEditNickname(selectedUser.id, selectedUser.nickName)}
														className='w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-left'>
														<i className='bi bi-pencil-square text-gray-600'></i>
														<div className='flex-1'>
															<div className='text-sm font-medium text-gray-900'>닉네임 변경</div>
															<div className='text-xs text-gray-500'>사용자 닉네임 수정</div>
														</div>
														<i className='bi bi-chevron-right text-gray-400'></i>
													</button>
													{!selectedUser.socialProvider && (
														<button
															onClick={() => handleResetPassword(selectedUser.id, selectedUser.name)}
															className='w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-left'>
															<i className='bi bi-key-fill text-gray-600'></i>
															<div className='flex-1'>
																<div className='text-sm font-medium text-gray-900'>비밀번호 초기화</div>
																<div className='text-xs text-gray-500'>임시 비밀번호 발급</div>
															</div>
															<i className='bi bi-chevron-right text-gray-400'></i>
														</button>
													)}
												</div>
											</div>

											{/* 위험 구역 */}
											<div className='bg-gray-50 p-6'>
												<h3 className='text-sm font-semibold text-red-600 uppercase tracking-wide mb-4'>위험 구역</h3>
												<div className='space-y-2'>
													<button
														onClick={() => handleSuspendUser(selectedUser.id, selectedUser.name)}
														className='w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors text-left'>
														<i className='bi bi-pause-circle-fill text-red-600'></i>
														<div className='flex-1'>
															<div className='text-sm font-medium text-red-900'>계정 정지</div>
															<div className='text-xs text-red-600'>사용자 활동 제한</div>
														</div>
														<i className='bi bi-chevron-right text-red-400'></i>
													</button>
													<button
														onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
														className='w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors'>
														<i className='bi bi-trash-fill'></i>
														<div className='flex-1 text-left'>
															<div className='text-sm font-medium'>계정 삭제</div>
															<div className='text-xs opacity-80'>되돌릴 수 없습니다</div>
														</div>
														<i className='bi bi-exclamation-triangle-fill'></i>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminUsers