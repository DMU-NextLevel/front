import React, { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer, ProjectResponseData } from '../../hooks/fetchProjectsFromServer'
import noImage from '../../assets/images/noImage.jpg'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useProjectDetailFetch } from '../../apis/funding/useProjectFetch'

interface Project {
  id: number
  title: string
  titleImg: {
    id: number
    uri: string
  }
  author: {
    name: string
    nickName: string
  }
  status: 'PENDING' | 'PROGRESS' | 'STOPPED' | 'SUCCESS' | 'FAIL' | 'END'
  completionRate: number
  startAt: string
  expiredAt: string
  tags: string[]
  userCount: number
  viewCount: number
  likeCount: number
  isLiked: boolean
  createdAt: string
}

const AdminProjects: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 카테고리 매핑
  const categoryMap: { [key: string]: string } = {
    '테크 가전': '테크/가전',
    '테크/가전': '테크/가전',
    '라이프 스타일': '라이프스타일',
    '라이프스타일': '라이프스타일',
    '패션 잡화': '패션/잡화',
    '패션/잡화': '패션/잡화',
    '뷰티 헬스': '뷰티/헬스',
    '뷰티/헬스': '뷰티/헬스',
    '취미 DIY': '취미/DIY',
    '취미/DIY': '취미/DIY',
    '게임': '게임',
    '교육 키즈': '교육/키즈',
    '교육/키즈': '교육/키즈',
    '반려동물': '반려동물',
    '여행 레저': '여행/레저',
    '여행/레저': '여행/레저',
    '푸드 음료': '푸드/음료',
    '푸드/음료': '푸드/음료',
  }

  const categories = ['ALL', '테크/가전', '라이프스타일', '패션/잡화', '뷰티/헬스', '취미/DIY', '게임', '교육/키즈', '반려동물', '여행/레저', '푸드/음료', '기타']

  useEffect(() => {
    fetchProjects()
  }, [statusFilter, categoryFilter])

  const fetchProjects = async () => {
    try {
      setLoading(true)

      // Admin API를 사용해서 프로젝트 목록 조회
      let url = '/public/project/all'
      const params: any = {
        page: 0,
        size: 1000,
        sort: 'id,desc'
      }

            console.log('API 요청 파라미터:', params) // 디버깅용

      let projectsData: any[] = []

      // 상태 필터에 따라 API 요청
      const requestBody: any = {
        page: 0,
        pageCount: 1000,
        order: 'id',
        desc: true
      }

      // 상태 필터에 따라 status 설정
      if (statusFilter === 'ALL') {
        // 'ALL'일 때는 status 파라미터를 아예 보내지 않음 (백엔드가 모든 상태 반환)
        // requestBody.status를 설정하지 않음
      } else {
        // 특정 상태만 조회
        requestBody.status = [statusFilter]
      }

      console.log('API 요청:', url, requestBody)

      try {
        const response = await api.post(url, requestBody)
        console.log('API 응답 전체:', response.data)
        console.log('프로젝트 데이터 구조:', response.data?.data?.projects?.[0] || response.data?.data?.[0])

        // API 응답 형식에 따라 데이터 추출
        if (response.data?.data?.projects) {
          projectsData = response.data.data.projects
        } else if (response.data?.data) {
          projectsData = response.data.data
        } else {
          projectsData = []
        }

        // 샘플 데이터 확인 (userCount 및 다른 가능한 필드명 확인용)
        if (projectsData.length > 0) {
          const sample = projectsData[0]
          console.log('샘플 프로젝트 모든 필드:', Object.keys(sample))
          console.log('userCount 값:', sample.userCount)
          console.log('supporterCount 값:', sample.supporterCount)
          console.log('participantCount 값:', sample.participantCount)
          console.log('backerCount 값:', sample.backerCount)
          console.log('funderCount 값:', sample.funderCount)
          console.log('전체 샘플 데이터:', sample)
        }
      } catch (apiError: any) {
        console.error('API 요청 실패:', apiError)
        console.error('에러 응답:', apiError.response?.data)
        toast.error('프로젝트 목록을 불러오는데 실패했습니다.')
        projectsData = []
      }

      // 카테고리 필터 적용 (클라이언트 사이드)
      const filteredProjects = projectsData.filter((project: any) => {
        if (categoryFilter !== 'ALL') {
          // 프로젝트의 모든 태그를 확인해서 필터 카테고리에 해당하는 태그가 있는지 확인
          const hasMatchingTag = project.tags && project.tags.some((tag: string) => {
            const mappedCategory = categoryMap[tag] || tag
            return mappedCategory === categoryFilter
          })

          if (!hasMatchingTag) {
            return false
          }
        }
        return true
      })

      setProjects(filteredProjects)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '잠시 후 다시 시도해주세요. 계속 발생시 관리자에게 문의해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인',
      })
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  // 유저 목록 조회 함수
  const handleViewDetail = (project: any) => {
    setSelectedProject(project)
    setShowDetailModal(true)
  }

  // 프로젝트 상세 데이터 가져오기 (모달이 열릴 때만)
  const { projectInfo } = useProjectDetailFetch({
    projectId: selectedProject?.id ? selectedProject.id.toString() : ''
  })

  const handleDeleteProject = async (projectId: number) => {
    const confirmResult = await Swal.fire({
      title: '정말 이 프로젝트를 삭제하시겠습니까?',
      icon: 'warning',
      confirmButtonColor: '#a666ff',
      confirmButtonText: '확인',
      cancelButtonColor: '#9e9e9e',
      cancelButtonText: '취소',
    })
    if (!confirmResult.isConfirmed) return

    try {
      await api.delete(`/admin/projects/${projectId}`)
      toast.success('프로젝트가 삭제되었습니다.')
      fetchProjects()
      setShowActionMenu(null)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '프로젝트 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인',
      })
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.author?.name && project.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 헬퍼 함수들
  const getCategoryDisplay = (tags: string[]) => {
    if (!tags || tags.length === 0) return '-'
    return tags.map(tag => categoryMap[tag] || tag).join(', ')
  }

  const getSupporterCount = (project: any) => {
    return project.userCount || project.supporterCount || project.participantCount || project.backerCount || 0
  }

  const getRemainingDays = (expiredAt: string) => {
    const now = new Date()
    const expired = new Date(expiredAt)
    const diffTime = expired.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 정렬 함수
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // 정렬된 프로젝트 목록
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case 'id':
        aValue = a.id
        bValue = b.id
        break
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'author':
        aValue = a.author?.name?.toLowerCase() || ''
        bValue = b.author?.name?.toLowerCase() || ''
        break
      case 'category':
        aValue = getCategoryDisplay(a.tags)
        bValue = getCategoryDisplay(b.tags)
        break
      case 'completionRate':
        aValue = a.completionRate
        bValue = b.completionRate
        break
      case 'userCount':
        aValue = getSupporterCount(a)
        bValue = getSupporterCount(b)
        break
      case 'remainingDays':
        aValue = getRemainingDays(a.expiredAt)
        bValue = getRemainingDays(b.expiredAt)
        break
      case 'startAt':
        aValue = new Date(a.startAt).getTime()
        bValue = new Date(b.startAt).getTime()
        break
      default:
        aValue = a.id
        bValue = b.id
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = sortedProjects.slice(startIndex, endIndex)

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // 필터나 검색 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <i className="bi bi-caret-down-fill text-gray-300 text-xs ms-1"></i>
    return sortDirection === 'asc'
      ? <i className="bi bi-caret-up-fill text-blue-600 text-xs ms-1"></i>
      : <i className="bi bi-caret-down-fill text-blue-600 text-xs ms-1"></i>
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING': { class: 'text-gray-600', text: '시작 전' },
      'PROGRESS': { class: 'text-blue-600', text: '진행 중' },
      'STOPPED': { class: 'text-orange-600', text: '중단됨' },
      'SUCCESS': { class: 'text-green-600', text: '성공' },
      'FAIL': { class: 'text-red-600', text: '실패' },
      'END': { class: 'text-gray-600', text: '종료' },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['PENDING']
    return <span className={`text-sm font-medium ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  // 프로젝트 상태 변경 핸들러
  const handleProjectStatusChange = async (projectId: number, newStatus: string) => {
    try {
      // 변경 전 원래 상태 저장
      const targetProject = projects.find(p => p.id === projectId)
      const originalStatus = targetProject?.status

      // 먼저 로컬 상태 업데이트 (UI 즉시 반영)
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, status: newStatus as Project['status'] }
            : project
        )
      )

      // 선택된 프로젝트 정보 업데이트
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, status: newStatus as Project['status'] })
      }

      const response = await api.post(`/admin/project/status/${projectId}?status=${newStatus}`)

      if (response.data.message === 'success') {
        toast.success('프로젝트 상태가 성공적으로 변경되었습니다.')

        // 상태 필터가 변경된 상태와 일치하지 않으면 필터를 'ALL'로 변경하여 변경된 프로젝트가 보이도록 함
        if (statusFilter !== 'ALL' && statusFilter !== newStatus) {
          setStatusFilter('ALL')
        }

        // 서버 데이터와 동기화
        fetchProjects()
      } else {
        // API 호출 실패 시 로컬 상태 롤백
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId
              ? { ...project, status: originalStatus || project.status }
              : project
          )
        )
        if (selectedProject && selectedProject.id === projectId) {
          setSelectedProject({ ...selectedProject, status: originalStatus || selectedProject.status })
        }
        toast.error('프로젝트 상태 변경에 실패했습니다.')
      }
    } catch (error: any) {
      console.error('프로젝트 상태 변경 실패:', error)
      // 변경 전 원래 상태로 롤백
      const targetProject = projects.find(p => p.id === projectId)
      const originalStatus = targetProject?.status

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, status: originalStatus || project.status }
            : project
        )
      )
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, status: originalStatus || selectedProject.status })
      }
      toast.error(error.response?.data?.message || '프로젝트 상태 변경에 실패했습니다.')
    }
  }

  // 프로젝트 상태 표시 텍스트 변환
  const getStatusDisplayText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': '시작 전',
      'PROGRESS': '진행 중',
      'STOPPED': '중단됨',
      'SUCCESS': '펀딩성공',
      'FAIL': '펀딩실패',
      'END': '종료'
    }
    return statusMap[status] || status
  }

  const getStatusApiValue = (displayText: string) => {
    const statusMap: { [key: string]: string } = {
      '시작 전': 'PENDING',
      '진행 중': 'PROGRESS',
      '중단됨': 'STOPPED',
      '펀딩성공': 'SUCCESS',
      '펀딩실패': 'FAIL',
      '종료': 'END'
    }
    return statusMap[displayText] || displayText
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            프로젝트 목록을 불러오는 중...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
      `}</style>

      {/* 헤더 */}
      <div className="flex justify-between items-center animate-slideInDown">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
          <p className="text-sm text-gray-600 mt-1">
            프로젝트 {projects.length}개
          </p>
        </div>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          새로고침
        </button>
      </div>

      {/* 필터 바 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-slideInDown animate-delay-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* 검색 */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400 text-lg"></i>
              </div>
              <input
                type="text"
                placeholder="프로젝트 제목, 창작자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* 필터들 */}
          <div className="flex gap-6 flex-wrap">
            {/* 상태 필터 */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-5 py-4 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-300 text-gray-700 hover:bg-gray-100"
              >
                <option value="ALL">전체 상태</option>
                <option value="PENDING">시작 전</option>
                <option value="PROGRESS">진행 중</option>
                <option value="STOPPED">중단됨</option>
                <option value="SUCCESS">성공</option>
                <option value="FAIL">실패</option>
                <option value="END">종료</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <i className="bi bi-chevron-down text-gray-500"></i>
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none px-5 py-4 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-300 text-gray-700 hover:bg-gray-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? '전체 카테고리' : category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <i className="bi bi-chevron-down text-gray-500"></i>
              </div>
            </div>

            {/* 정렬 */}
            <div className="relative">
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-')
                  setSortField(field)
                  setSortDirection(direction as 'asc' | 'desc')
                }}
                className="appearance-none px-5 py-4 pr-10 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-300 text-gray-700 hover:bg-gray-100"
              >
                <option value="id-desc">최신순</option>
                <option value="id-asc">오래된순</option>
                <option value="completionRate-desc">달성률 높은순</option>
                <option value="completionRate-asc">달성률 낮은순</option>
                <option value="userCount-desc">후원자 많은순</option>
                <option value="userCount-asc">후원자 적은순</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <i className="bi bi-chevron-down text-gray-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프로젝트 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-slideInDown animate-delay-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 min-w-[60px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {getSortIcon('id')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[240px] max-w-[420px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    제목
                    {getSortIcon('title')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[120px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    창작자
                    {getSortIcon('author')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[120px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden md:table-cell"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    카테고리
                    {getSortIcon('category')}
                  </div>
                </th>
                <th className="px-4 py-3 min-w-[80px] text-left text-xs font-semibold text-gray-700 hidden sm:table-cell">상태</th>
                <th
                  className="px-4 py-3 min-w-[80px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort('completionRate')}
                >
                  <div className="flex items-center">
                    달성률
                    {getSortIcon('completionRate')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[80px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden sm:table-cell"
                  onClick={() => handleSort('userCount')}
                >
                  <div className="flex items-center">
                    후원자
                    {getSortIcon('userCount')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[90px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden md:table-cell"
                  onClick={() => handleSort('remainingDays')}
                >
                  <div className="flex items-center">
                    남은 일수
                    {getSortIcon('remainingDays')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 min-w-[110px] text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden md:table-cell"
                  onClick={() => handleSort('startAt')}
                >
                  <div className="flex items-center">
                    시작일
                    {getSortIcon('startAt')}
                  </div>
                </th>
                <th className="px-4 py-3 min-w-[80px] text-center text-xs font-semibold text-gray-700">관리</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">프로젝트를 불러오는 중...</p>
                      <p className="text-sm">잠시만 기다려주세요</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="bi bi-folder-x text-2xl text-gray-400"></i>
                    </div>
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">프로젝트가 없습니다</p>
                      <p className="text-sm">검색 조건에 맞는 프로젝트가 존재하지 않습니다</p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('ALL')
                        setCategoryFilter('ALL')
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      필터 초기화
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              currentProjects.map((project) => {
                const remainingDays = getRemainingDays(project.expiredAt)
                return (
                  <tr key={project.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-100 transition-all duration-200">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">#{project.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={project.titleImg?.uri || noImage}
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = noImage
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleViewDetail(project)}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate text-left block transition-colors"
                          >
                            {project.title.trim()}
                          </button>
                          <div className="flex items-center gap-2 mt-1">
                            <i className="bi bi-calendar-event text-xs text-gray-400"></i>
                            <span className="text-xs text-gray-500">{project.startAt}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-700 font-medium">{project.author?.name || '-'}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags && project.tags.length > 0 ? (
                          project.tags.map((tag: string, index: number) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {categoryMap[tag] || tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === `status-${project.id}` ? null : `status-${project.id}`)}
                          className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          {getStatusBadge(project.status)}
                          <i className="bi bi-chevron-down text-xs text-gray-400 transition-transform duration-200"
                             style={{ transform: showActionMenu === `status-${project.id}` ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                        </button>

                        {showActionMenu === `status-${project.id}` && (
                          <>
                            {/* 배경 클릭 시 닫기 */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionMenu(null)}
                            ></div>

                            {/* 상태 변경 드롭다운 */}
                            <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] min-w-[160px] overflow-hidden">
                              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-100 bg-gray-50">
                                <i className="bi bi-flag-fill me-2 text-blue-500"></i>
                                상태 변경
                              </div>
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'PENDING')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'PENDING' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                                  <span className="font-medium">시작 전</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'PROGRESS')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'PROGRESS' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                  <span className="font-medium">진행 중</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'STOPPED')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'STOPPED' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                  <span className="font-medium">중단됨</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'SUCCESS')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'SUCCESS' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                  <span className="font-medium">성공</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'FAIL')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'FAIL' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                  <span className="font-medium">실패</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleProjectStatusChange(project.id, 'END')
                                    setShowActionMenu(null)
                                  }}
                                  className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                    project.status === 'END' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-700'
                                  }`}
                                >
                                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                                  <span className="font-medium">종료</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-900">{project.completionRate}%</span>
                            <span className="text-xs text-gray-500">목표</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                project.completionRate >= 100 ? 'bg-green-500' :
                                project.completionRate >= 75 ? 'bg-blue-500' :
                                project.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(project.completionRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-people-fill text-blue-500"></i>
                        <span className="text-sm font-semibold text-gray-900">{getSupporterCount(project)}</span>
                        <span className="text-xs text-gray-500">명</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <i className={`bi ${
                          remainingDays < 0 ? 'bi-calendar-x text-red-500' :
                          remainingDays <= 7 ? 'bi-calendar-event text-orange-500' :
                          'bi-calendar-check text-green-500'
                        }`}></i>
                        <span className={`text-sm font-medium ${
                          remainingDays < 0 ? 'text-red-600' :
                          remainingDays <= 7 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {remainingDays < 0 ? '종료' : `${remainingDays}일`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{project.startAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === `action-${project.id}` ? null : `action-${project.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                          <i className="bi bi-three-dots-vertical text-lg"></i>
                        </button>

                        {showActionMenu === `action-${project.id}` && (
                          <>
                            {/* 배경 클릭 시 닫기 */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionMenu(null)}
                            ></div>

                            {/* 액션 메뉴 */}
                            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] min-w-[160px] overflow-hidden">
                              <div className="py-2">
                                <button
                                  onClick={() => {
                                    navigate(`/project/${project.id}`)
                                    setShowActionMenu(null)
                                  }}
                                  className="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors"
                                >
                                  <i className="bi bi-eye text-blue-500"></i>
                                  <span className="font-medium">프로젝트 보기</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
                                      handleDeleteProject(project.id)
                                    }
                                    setShowActionMenu(null)
                                  }}
                                  className="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors"
                                >
                                  <i className="bi bi-trash text-red-500"></i>
                                  <span className="font-medium">프로젝트 삭제</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {sortedProjects.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              전체 <span className="font-semibold text-gray-900">{sortedProjects.length}</span>개 중{' '}
              <span className="font-semibold text-gray-900">{startIndex + 1}</span>-
              <span className="font-semibold text-gray-900">{Math.min(endIndex, sortedProjects.length)}</span>개 표시
            </div>
            
            <div className="flex items-center gap-2">
              {/* 처음으로 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>

              {/* 이전 */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {/* 페이지 번호 */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              {/* 다음 */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className="bi bi-chevron-right"></i>
              </button>

              {/* 마지막으로 */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {showDetailModal && selectedProject && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4" style={{ margin: 0, padding: '1rem' }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-gray-100" style={{ margin: 0 }}>
          {/* 헤더 섹션 */}
          <div className="bg-white border-b border-gray-100">
            <div className="px-8 py-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-6">
                    {/* 프로젝트 이미지 */}
                    <div className="flex-shrink-0">
                      <img
                        src={selectedProject.titleImg?.uri || noImage}
                        alt={selectedProject.title}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = noImage
                        }}
                      />
                    </div>

                    {/* 타이틀과 기본 정보 */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-2">
                          <i className="bi bi-person-circle"></i>
                          {selectedProject.author?.name || 'N/A'}
                        </span>
                        <span className="flex items-center gap-2">
                          <i className="bi bi-hash"></i>
                          #{selectedProject.id}
                        </span>
                      </div>

                      {/* 프로젝트 소개 */}
                      {projectInfo?.content && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                          {projectInfo.content}
                        </p>
                      )}

                      {/* 카테고리 */}
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags && selectedProject.tags.length > 0 ? (
                          selectedProject.tags.map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                              <i className="bi bi-tag text-gray-500 mr-1"></i>
                              {categoryMap[tag] || tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">카테고리 없음</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all duration-200 border border-gray-200 ml-6"
                >
                  <i className="bi bi-x-lg text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>

          {/* 컨텐츠 영역 */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="grid grid-cols-2 gap-6">
              {/* 프로젝트 상태 및 기간 */}
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">프로젝트 정보</h4>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedProject.status === 'PENDING' ? 'bg-gray-100 text-gray-700' :
                    selectedProject.status === 'PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    selectedProject.status === 'STOPPED' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    selectedProject.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' :
                    selectedProject.status === 'FAIL' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedProject.status === 'PENDING' ? '시작 전' :
                     selectedProject.status === 'PROGRESS' ? '진행 중' :
                     selectedProject.status === 'STOPPED' ? '중단됨' :
                     selectedProject.status === 'SUCCESS' ? '성공' :
                     selectedProject.status === 'FAIL' ? '실패' :
                     selectedProject.status === 'END' ? '종료' :
                     selectedProject.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>시작일</span>
                    <span className="font-medium text-gray-900">{selectedProject.startAt || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>종료일</span>
                    <span className="font-medium text-gray-900">{selectedProject.expiredAt || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>등록일</span>
                    <span className="font-medium text-gray-900">
                      {projectInfo?.createdAt ? new Date(projectInfo.createdAt).toLocaleDateString('ko-KR') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span>진행일수</span>
                    <span className="font-medium text-gray-900">
                      {selectedProject.startAt && selectedProject.expiredAt
                        ? Math.ceil((new Date(selectedProject.expiredAt).getTime() - new Date(selectedProject.startAt).getTime()) / (1000 * 60 * 60 * 24)) + '일'
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 통계 정보 */}
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-4">통계</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-0.5">{selectedProject.completionRate || 0}%</div>
                    <div className="text-xs text-gray-600">달성률</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-0.5">{getSupporterCount(selectedProject)}</div>
                    <div className="text-xs text-gray-600">후원자</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-0.5">{selectedProject.viewCount || 0}</div>
                    <div className="text-xs text-gray-600">조회수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-0.5">{projectInfo?.likeCount || 0}</div>
                    <div className="text-xs text-gray-600">좋아요</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 액션 */}
          <div className="bg-white px-8 py-6 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
              >
                닫기
              </button>
              <button
                onClick={() => navigate(`/project/${selectedProject.id}`)}
                className="px-8 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
              >
                <i className="bi bi-eye-fill"></i>
                프로젝트 페이지 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default AdminProjects