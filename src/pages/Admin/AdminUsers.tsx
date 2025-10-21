import React, { useState } from 'react'
import noImage from '../../assets/images/noImage.jpg'

interface User {
  id: number
  name: string
  nickName: string
  email: string
  point: number
  socialProvider: string
  img?: {
    id: number
    uri: string
  }
  createdAt: string
}

interface Project {
  id: number
  title: string
  category: string
  status: '펀딩중' | '펀딩성공' | '펀딩실패'
  currentFunding: number
  targetFunding: number
  backers: number
  createdDate: string
}

interface UserDetail extends User {
  address?: string | null
  number?: string | null
  areaNumber?: string | null
  projects: Project[]
  followingProjects: Project[]
}

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [providerFilter, setProviderFilter] = useState<string>('ALL')
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'following'>('info')

  // 더미 데이터 10개
  const dummyUsers: User[] = [
    {
      id: 1,
      name: '하송',
      nickName: '송',
      email: 'ssongsyj0203@gmail.com',
      point: 0,
      socialProvider: 'google',
      img: { id: 1, uri: 'https://lh3.googleusercontent.com/a/default-user' },
      createdAt: '2024-01-15T09:30:00'
    },
    {
      id: 2,
      name: '김철수',
      nickName: '철수',
      email: 'chulsu@naver.com',
      point: 15000,
      socialProvider: 'naver',
      img: { id: 2, uri: 'https://ssl.pstatic.net/static/pwe/address/img_profile.png' },
      createdAt: '2024-02-20T14:20:00'
    },
    {
      id: 3,
      name: '이영희',
      nickName: '영희',
      email: 'younghee@kakao.com',
      point: 5000,
      socialProvider: 'kakao',
      img: undefined,
      createdAt: '2024-03-10T11:45:00'
    },
    {
      id: 4,
      name: '박민수',
      nickName: '민수',
      email: 'minsu@gmail.com',
      point: 25000,
      socialProvider: 'google',
      img: { id: 4, uri: 'https://lh3.googleusercontent.com/a/user-4' },
      createdAt: '2024-01-25T16:10:00'
    },
    {
      id: 5,
      name: '정수진',
      nickName: '수진',
      email: 'sujin@nextlevel.com',
      point: 0,
      socialProvider: '',
      img: undefined,
      createdAt: '2024-04-05T10:00:00'
    },
    {
      id: 6,
      name: '최동욱',
      nickName: '동욱',
      email: 'dongwook@kakao.com',
      point: 50000,
      socialProvider: 'kakao',
      img: { id: 6, uri: 'https://k.kakaocdn.net/dn/profile_default.png' },
      createdAt: '2023-12-20T13:30:00'
    },
    {
      id: 7,
      name: '강서연',
      nickName: '서연',
      email: 'seoyeon@nextlevel.com',
      point: 12000,
      socialProvider: '',
      img: undefined,
      createdAt: '2024-02-14T08:20:00'
    },
    {
      id: 8,
      name: '윤재호',
      nickName: '재호',
      email: 'jaeho@naver.com',
      point: 8000,
      socialProvider: 'naver',
      img: { id: 8, uri: 'https://ssl.pstatic.net/static/pwe/address/img_profile.png' },
      createdAt: '2024-03-25T15:45:00'
    },
    {
      id: 9,
      name: '임혜진',
      nickName: '혜진',
      email: 'hyejin@nextlevel.com',
      point: 30000,
      socialProvider: '',
      img: { id: 9, uri: 'https://k.kakaocdn.net/dn/profile_default.png' },
      createdAt: '2024-01-08T12:00:00'
    },
    {
      id: 10,
      name: '오준석',
      nickName: '준석',
      email: 'junseok@gmail.com',
      point: 0,
      socialProvider: 'google',
      img: undefined,
      createdAt: '2024-04-12T09:15:00'
    },{
      id: 13,
      name: '오준석',
      nickName: '준석',
      email: 'junseok@gmail.com',
      point: 0,
      socialProvider: 'google',
      img: undefined,
      createdAt: '2024-04-12T09:15:00'
    }
    
  ]

  const [users] = useState<User[]>(dummyUsers)


  // 검색 및 필터 적용
  const filteredUsers = users.filter(user => {
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
      case 'provider':
        aValue = a.socialProvider
        bValue = b.socialProvider
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
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
    if (sortField !== field) return <i className="bi bi-caret-down-fill text-gray-300 text-xs ms-1"></i>
    return sortDirection === 'asc' 
      ? <i className="bi bi-caret-up-fill text-blue-600 text-xs ms-1"></i>
      : <i className="bi bi-caret-down-fill text-blue-600 text-xs ms-1"></i>
  }

  const getProviderBadge = (provider: string) => {
    if (!provider) {
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded inline-flex items-center gap-1">
          <i className="bi bi-envelope text-[10px]"></i>
          일반
        </span>
      )
    }
    
    const providerMap = {
      'google': { class: 'bg-red-100 text-red-700', icon: 'bi-google', text: 'Google' },
      'naver': { class: 'bg-green-100 text-green-700', icon: 'bi-circle-fill', text: 'Naver' },
      'kakao': { class: 'bg-yellow-100 text-yellow-700', icon: 'bi-chat-fill', text: 'Kakao' },
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
      alert(`${currentNickname} → ${newNickname} 변경 완료 (API 연결 후 실제 적용)`)
      // TODO: API 연결
      // await api.patch(`/admin/users/${userId}/nickname`, { nickName: newNickname })
    }
    setOpenMenuId(null)
  }

  const handleDeleteUser = (userId: number, userName: string) => {
    if (window.confirm(`정말로 "${userName}" 유저를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      alert(`${userName} 유저 삭제 완료 (API 연결 후 실제 적용)`)
      // TODO: API 연결
      // await api.delete(`/admin/users/${userId}`)
    }
    setOpenMenuId(null)
  }

  const handleResetPassword = (userId: number, userName: string) => {
    if (window.confirm(`"${userName}" 유저의 비밀번호를 초기화하시겠습니까?`)) {
      alert(`${userName} 비밀번호 초기화 완료 (API 연결 후 실제 적용)`)
      // TODO: API 연결
      // await api.post(`/admin/users/${userId}/reset-password`)
    }
    setOpenMenuId(null)
  }

  const handleSuspendUser = (userId: number, userName: string) => {
    if (window.confirm(`"${userName}" 유저를 정지하시겠습니까?`)) {
      alert(`${userName} 유저 정지 완료 (API 연결 후 실제 적용)`)
      // TODO: API 연결
      // await api.patch(`/admin/users/${userId}/status`, { status: 'SUSPENDED' })
    }
    setOpenMenuId(null)
  }

  const handleViewDetail = (user: User) => {
    if (expandedUserId === user.id) {
      // 닫을 때 애니매이션 시작
      setIsClosing(true)
      setTimeout(() => {
        setExpandedUserId(null)
        setSelectedUser(null)
        setIsClosing(false)
      }, 300) // 애니매이션 시간과 동일
    } else {
      // 열 때
      setIsClosing(false)
      // 실제 API에서 상세 정보 가져오기 (더미 데이터로 시뮬레이션)
      const detailUser: UserDetail = {
        ...user,
        address: '서울특별시 강남구 테헤란로 123',
        number: '010-1234-5678',
        areaNumber: '02-1234-5678',
        projects: [
          {
            id: 101,
            title: '스마트 홈 IoT 디바이스',
            category: '테크/가전',
            status: '펀딩중',
            currentFunding: 1200000,
            targetFunding: 2000000,
            backers: 45,
            createdDate: '2024-10-01'
          },
          {
            id: 102,
            title: '에코 프렌들리 텀블러',
            category: '라이프스타일',
            status: '펀딩성공',
            currentFunding: 800000,
            targetFunding: 500000,
            backers: 32,
            createdDate: '2024-08-15'
          }
        ],
        followingProjects: [
          {
            id: 201,
            title: 'VR 교육 플랫폼',
            category: '교육/키즈',
            status: '펀딩중',
            currentFunding: 950000,
            targetFunding: 1500000,
            backers: 67,
            createdDate: '2024-09-10'
          },
          {
            id: 202,
            title: '천연 화장품 라인',
            category: '뷰티/헬스',
            status: '펀딩성공',
            currentFunding: 650000,
            targetFunding: 600000,
            backers: 28,
            createdDate: '2024-07-05'
          },
          {
            id: 203,
            title: '보드게임 세트',
            category: '취미/DIY',
            status: '펀딩중',
            currentFunding: 500000,
            targetFunding: 800000,
            backers: 25,
            createdDate: '2024-09-25'
          }
        ]
      }
      setSelectedUser(detailUser)
      setExpandedUserId(user.id)
      setActiveTab('info') // 유저 선택 시 기본 정보 탭으로 리셋
    }
  }

  return (
    <div className="space-y-4 animate-fadeIn">
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
      <div className="flex justify-between items-center animate-slideInDown">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">유저 관리</h1>
          <p className="text-sm text-gray-600 mt-1">전체 {users.length}명</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideInDown animate-delay-100">
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">전체 유저</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-people text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">소셜 가입</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.socialProvider).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-share text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">일반 가입</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => !u.socialProvider).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-envelope text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">총 포인트</p>
              <p className="text-2xl font-bold text-orange-600">
                {users.reduce((sum, u) => sum + u.point, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="bi bi-coin text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="이름, 닉네임, 이메일 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[140px]"
          >
            <option value="ALL">전체 가입경로</option>
            <option value="">일반 가입</option>
            <option value="google">Google</option>
            <option value="naver">Naver</option>
            <option value="kakao">Kakao</option>
          </select>
        </div>
      </div>

      {/* 유저 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-slideInDown animate-delay-200">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('id')}
                  className="px-4 py-2 min-w-[50px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  ID {getSortIcon('id')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  프로필
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-4 py-2 min-w-[140px] max-w-[220px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  이름 {getSortIcon('name')}
                </th>
                <th 
                  onClick={() => handleSort('nickName')}
                  className="px-4 py-2 min-w-[100px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  닉네임 {getSortIcon('nickName')}
                </th>
                <th 
                  onClick={() => handleSort('email')}
                  className="px-4 py-2 min-w-[180px] max-w-[260px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell"
                >
                  이메일 {getSortIcon('email')}
                </th>
                <th 
                  onClick={() => handleSort('point')}
                  className="px-4 py-2 min-w-[80px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  포인트 {getSortIcon('point')}
                </th>
                <th 
                  onClick={() => handleSort('provider')}
                  className="px-4 py-2 min-w-[100px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell"
                >
                  가입경로 {getSortIcon('provider')}
                </th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className="px-4 py-2 min-w-[120px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell"
                >
                  가입일 {getSortIcon('createdAt')}
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 w-32">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <>
                  <tr
                    key={user.id} 
                    onClick={(e) => {
                      // 관리 메뉴 영역 클릭 시 확장 방지
                      if (!(e.target as HTMLElement).closest('.action-menu')) {
                        handleViewDetail(user)
                      }
                    }}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      expandedUserId === user.id ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-2 min-w-[50px] text-sm text-gray-900 whitespace-nowrap">
                      {user.id}
                    </td>
                    <td className="px-4 py-2 min-w-[56px]">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {user.img?.uri ? (
                          <img 
                            src={user.img.uri} 
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = noImage
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 min-w-[140px] max-w-[220px] text-sm text-gray-900 font-medium truncate whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 min-w-[100px] text-sm text-gray-600 truncate whitespace-nowrap">
                      @{user.nickName}
                    </td>
                    <td className="px-4 py-2 min-w-[180px] max-w-[260px] text-sm text-gray-600 truncate whitespace-nowrap hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-semibold">
                      {user.point.toLocaleString()}P
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell">
                      {getProviderBadge(user.socialProvider)}
                    </td>
                    <td className="px-4 py-2 hidden sm:table-cell text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-2 text-center relative action-menu">
                      <div className="flex items-center justify-center gap-1">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(openMenuId === user.id ? null : user.id)
                            }}
                            className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                            title="관리 메뉴"
                          >
                            <i className="bi bi-three-dots-vertical text-base"></i>
                          </button>
                          
                          {openMenuId === user.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              ></div>
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => handleEditNickname(user.id, user.nickName)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <i className="bi bi-pencil text-blue-600"></i>
                                  닉네임 변경
                                </button>
                                {!user.socialProvider && (
                                  <button
                                    onClick={() => handleResetPassword(user.id, user.name)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <i className="bi bi-key text-yellow-600"></i>
                                    비밀번호 초기화
                                  </button>
                                )}
                                <button
                                  onClick={() => handleSuspendUser(user.id, user.name)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <i className="bi bi-pause-circle text-orange-600"></i>
                                  유저 정지
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <i className="bi bi-trash"></i>
                                  유저 삭제
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  
                  {/* 확장된 상세 정보 행 */}
                  {expandedUserId === user.id && selectedUser && (
                    <tr key={`${user.id}-detail`}>
                      <td colSpan={9} className="p-0">
                        <div 
                          className={`overflow-hidden ${isClosing ? 'detail-expand-exit' : 'detail-expand-enter'}`}
                        >
                          <div className="px-4 py-3 bg-gradient-to-b from-blue-50/30 to-transparent border-l-4 border-blue-500">
                            <div className="flex items-start gap-6">
                              {/* 왼쪽: 프로필 이미지 */}
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-sm">
                                  {selectedUser.img?.uri ? (
                                    <img 
                                      src={selectedUser.img.uri} 
                                      alt={selectedUser.name}
                                      onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.src = noImage
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                      <span className="text-3xl font-bold text-blue-600">
                                        {selectedUser.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 오른쪽: 상세 정보 */}
                              <div className="flex-1">
                                {/* 탭 메뉴 */}
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-4">
                                  <button
                                    onClick={() => setActiveTab('info')}
                                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                                      activeTab === 'info'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                  >
                                    기본 정보
                                  </button>
                                  <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                                      activeTab === 'projects'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                  >
                                    작성한 프로젝트 ({selectedUser.projects.length})
                                  </button>
                                  <button
                                    onClick={() => setActiveTab('following')}
                                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                                      activeTab === 'following'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                  >
                                    팔로우한 프로젝트 ({selectedUser.followingProjects.length})
                                  </button>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                  <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                                  <span className="text-sm text-gray-600">@{selectedUser.nickName}</span>
                                  {getProviderBadge(selectedUser.socialProvider)}
                                </div>

                                {/* 탭 콘텐츠 */}
                                {activeTab === 'info' && (
                                  <div>
                                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">유저 ID</p>
                                      <p className="text-sm font-medium text-gray-900">#{selectedUser.id}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">포인트</p>
                                      <p className="text-sm font-semibold text-blue-600">{selectedUser.point.toLocaleString()}P</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">가입일</p>
                                      <p className="text-sm text-gray-900">
                                        {new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}
                                      </p>
                                    </div>
                                    <div className="col-span-3">
                                      <p className="text-xs text-gray-500 mb-0.5">이메일</p>
                                      <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                                    </div>
                                    <div className="col-span-3">
                                      <p className="text-xs text-gray-500 mb-0.5">주소</p>
                                      <p className="text-sm text-gray-700">{selectedUser.address || '등록된 주소가 없습니다.'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">휴대폰</p>
                                      <p className="text-sm text-gray-700">{selectedUser.number || '-'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">지역번호</p>
                                      <p className="text-sm text-gray-700">{selectedUser.areaNumber || '-'}</p>
                                    </div>
                                    </div>
                                  </div>
                                )}

                                {activeTab === 'projects' && (
                                  <div className="overflow-x-auto">
                                    {selectedUser.projects.length > 0 ? (
                                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <table className="w-full text-xs">
                                          <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-900">프로젝트명</th>
                                              <th className="px-4 py-3 text-left font-semibold text-gray-900">카테고리</th>
                                              <th className="px-4 py-3 text-center font-semibold text-gray-900">상태</th>
                                              <th className="px-4 py-3 text-center font-semibold text-gray-900">후원자</th>
                                              <th className="px-4 py-3 text-right font-semibold text-gray-900">현재금액</th>
                                              <th className="px-4 py-3 text-right font-semibold text-gray-900">목표금액</th>
                                              <th className="px-4 py-3 text-center font-semibold text-gray-900">달성률</th>
                                              <th className="px-4 py-3 text-center font-semibold text-gray-900">관리</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-200">
                                            {selectedUser.projects.map((project) => (
                                              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900 max-w-md">
                                                  <div className="truncate" title={project.title}>
                                                    {project.title}
                                                  </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{project.category}</td>
                                                <td className="px-4 py-3 text-center">
                                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    project.status === '펀딩성공' 
                                                      ? 'bg-green-100 text-green-800'
                                                      : project.status === '펀딩중'
                                                      ? 'bg-blue-100 text-blue-800'
                                                      : 'bg-red-100 text-red-800'
                                                  }`}>
                                                    {project.status}
                                                  </span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-600 font-medium">{project.backers}명</td>
                                                <td className="px-4 py-3 text-right font-medium text-gray-900">{project.currentFunding.toLocaleString()}원</td>
                                                <td className="px-4 py-3 text-right font-medium text-gray-900">{project.targetFunding.toLocaleString()}원</td>
                                                <td className="px-4 py-3 text-center">
                                                  <span className="font-semibold text-blue-600">
                                                    {Math.round((project.currentFunding / project.targetFunding) * 100)}%
                                                  </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                  <button className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                                    <i className="bi bi-gear text-xs"></i>
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                        <div className="flex flex-col items-center">
                                          <i className="bi bi-folder-x text-4xl text-gray-400 mb-3"></i>
                                          <p className="text-gray-500 font-medium">작성한 프로젝트가 없습니다.</p>
                                          <p className="text-sm text-gray-400 mt-1">새로운 프로젝트를 시작해보세요.</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {activeTab === 'following' && (
                                  <div className="overflow-x-auto">
                                    {selectedUser.followingProjects.length > 0 ? (
                                      <div className="py-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {selectedUser.followingProjects.map((project) => {
                                          const rate = Math.round((project.currentFunding / project.targetFunding) * 100);
                                          return (
                                            <div key={project.id} className="group block rounded-xl ring-1 ring-gray-200 overflow-hidden bg-white hover:ring-purple-300 hover:shadow-lg transition">
                                              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                  <i className="bi bi-image text-2xl text-gray-400"></i>
                                                </div>
                                                <button className="absolute top-2 right-2 z-10 grid place-items-center w-7 h-7 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow">
                                                  <i className="bi bi-gear text-xs"></i>
                                                </button>
                                                <div className="absolute inset-x-0 bottom-0 p-2 flex items-center gap-2">
                                                  <span className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 backdrop-blur ${
                                                    project.status === '펀딩성공' 
                                                      ? 'bg-green-500/90 text-white'
                                                      : project.status === '펀딩중'
                                                      ? 'bg-blue-500/90 text-white'
                                                      : 'bg-red-500/90 text-white'
                                                  }`}>
                                                    {project.status}
                                                  </span>
                                                </div>
                                                {/* 프로그래스바를 이미지 하단 테두리처럼 */}
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                                                  <div 
                                                    className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 transition-all duration-300" 
                                                    style={{ width: `${Math.min(rate, 100)}%` }}
                                                  />
                                                </div>
                                              </div>
                                              <div className="px-3 pt-2 pb-3">
                                                <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-1" title={project.title}>
                                                  {project.title}
                                                </h3>
                                                <div className="text-xs font-semibold text-purple-600">
                                                  {rate}% 달성
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      </div>
                                    ) : (
                                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                        <div className="flex flex-col items-center">
                                          <i className="bi bi-heart text-4xl text-gray-400 mb-3"></i>
                                          <p className="text-gray-500 font-medium">팔로우한 프로젝트가 없습니다.</p>
                                          <p className="text-sm text-gray-400 mt-1">관심 있는 프로젝트를 팔로우해보세요.</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {sortedUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="bi bi-inbox text-4xl mb-2"></i>
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
