import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../AxiosInstance'
import defaultProfile from '../../assets/images/default_profile.png'
import Swal from 'sweetalert2'

const AdminLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  // 권한 체크
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await api.get('/public/login/token')

        if (response.data.message === 'success' && response.data.data === 'ADMIN') {
          setIsAuthorized(true)
        } else {
          Swal.fire({
            icon: 'error',
            title: '관리자 권한이 필요합니다.',
            confirmButtonColor: '#a66bff',
            confirmButtonText: '확인',
          })
          navigate('/') // 메인 페이지로 리다이렉트
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '로그인이 필요합니다.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인',
        })
        navigate('/login') // 로그인 페이지로 리다이렉트
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAuth()
  }, [navigate])

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">권한 확인 중...</p>
        </div>
      </div>
    )
  }

  // 권한이 없으면 아무것도 렌더링하지 않음
  if (!isAuthorized) {
    return null
  }

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: 'bi-speedometer2' },
    { path: '/admin/dashboard', label: '통계 상세', icon: 'bi-graph-up' },
    { path: '/admin/users', label: '유저 관리', icon: 'bi-people' },
    { path: '/admin/projects', label: '프로젝트 관리', icon: 'bi-folder' },
    { path: '/admin/notices', label: '공지사항 관리', icon: 'bi-megaphone' },
  ]

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col">
        {/* 로고 영역 */}
        <div className="p-6 flex items-center gap-3">

          <div>
            <Link to="/" className="text-white font-bold text-lg hover:text-blue-100 transition-colors">
              WithU
            </Link>
          </div>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 px-4 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/20 text-white backdrop-blur-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={`bi ${item.icon} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 하단 프로필 영역 */}
        <div className="p-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={defaultProfile}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">관리자</p>
                <p className="text-white/60 text-xs"></p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i>
              메인으로
            </button>
          </div>
        </div>
      </aside>

      {/* 오른쪽 메인 컨텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
