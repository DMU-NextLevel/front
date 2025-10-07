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

interface UserDetail extends User {
  address?: string | null
  number?: string | null
  areaNumber?: string | null
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
        areaNumber: '02-1234-5678'
      }
      setSelectedUser(detailUser)
      setExpandedUserId(user.id)
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('id')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  ID {getSortIcon('id')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  프로필
                </th>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  이름 {getSortIcon('name')}
                </th>
                <th 
                  onClick={() => handleSort('nickName')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  닉네임 {getSortIcon('nickName')}
                </th>
                <th 
                  onClick={() => handleSort('email')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  이메일 {getSortIcon('email')}
                </th>
                <th 
                  onClick={() => handleSort('point')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  포인트 {getSortIcon('point')}
                </th>
                <th 
                  onClick={() => handleSort('provider')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  가입경로 {getSortIcon('provider')}
                </th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
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
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      @{user.nickName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 font-semibold">
                      {user.point.toLocaleString()}P
                    </td>
                    <td className="px-4 py-2">
                      {getProviderBadge(user.socialProvider)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
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
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                                  <span className="text-sm text-gray-600">@{selectedUser.nickName}</span>
                                  {getProviderBadge(selectedUser.socialProvider)}
                                </div>

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
