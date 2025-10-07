import React, { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer } from '../../hooks/fetchProjectsFromServer'
import noImage from '../../assets/images/noImage.jpg'

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
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [sortField, setSortField] = useState<string>('id')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // 카테고리 매핑
  const categoryMap: { [key: string]: string } = {
    '테크 가전': '테크/가전',
    '라이프 스타일': '라이프스타일',
    '패션 잡화': '패션/잡화',
    '뷰티 헬스': '뷰티/헬스',
    '취미 DIY': '취미/DIY',
    '게임': '게임',
    '교육 키즈': '교육/키즈',
    '반려동물': '반려동물',
    '여행 레저': '여행/레저',
    '푸드 음료': '푸드/음료',
  }

  const categories = ['ALL', '테크/가전', '라이프스타일', '패션/잡화', '뷰티/헬스', '취미/DIY', '게임', '교육/키즈', '반려동물', '여행/레저', '푸드/음료']

  useEffect(() => {
    fetchProjects()
  }, [statusFilter, categoryFilter])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      const projectsData = await fetchProjectsFromServer({
        order: 'CREATED',
        page: 0,
        pageCount: 1000,
        desc: true,
      })

      const filteredProjects = projectsData.filter((project: any) => {
        // 상태 필터
        if (statusFilter !== 'ALL' && project.status !== statusFilter) {
          return false
        }
        
        // 카테고리 필터
        if (categoryFilter !== 'ALL') {
          const projectCategory = getProjectCategory(project.tags)
          if (projectCategory !== categoryFilter) {
            return false
          }
        }
        
        return true
      })

      setProjects(filteredProjects)
    } catch (error) {
      console.error('프로젝트 목록 로딩 실패:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (project: any) => {
    setSelectedProject(project)
    setShowDetailModal(true)
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) return

    try {
      await api.delete(`/admin/projects/${projectId}`)
      alert('프로젝트가 삭제되었습니다.')
      fetchProjects()
      setShowActionMenu(null)
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error)
      alert('프로젝트 삭제에 실패했습니다.')
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.author?.name && project.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
        aValue = a.userCount
        bValue = b.userCount
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

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <i className="bi bi-caret-down-fill text-gray-300 text-xs ms-1"></i>
    return sortDirection === 'asc' 
      ? <i className="bi bi-caret-up-fill text-blue-600 text-xs ms-1"></i>
      : <i className="bi bi-caret-down-fill text-blue-600 text-xs ms-1"></i>
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'PENDING': { class: 'bg-gray-100 text-gray-700', text: '시작 전' },
      'PROGRESS': { class: 'bg-blue-100 text-blue-700', text: '진행중' },
      'STOPPED': { class: 'bg-orange-100 text-orange-700', text: '중단됨' },
      'SUCCESS': { class: 'bg-green-100 text-green-700', text: '성공' },
      'FAIL': { class: 'bg-red-100 text-red-700', text: '실패' },
      'END': { class: 'bg-gray-100 text-gray-700', text: '종료' },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['PENDING']
    return <span className={`px-2 py-1 text-xs ${statusInfo.class} rounded`}>{statusInfo.text}</span>
  }

  const getCategoryDisplay = (tags: string[]) => {
    if (!tags || tags.length === 0) return '-'
    return tags.map(tag => categoryMap[tag] || tag).join(', ')
  }

  const getProjectCategory = (tags: string[]) => {
    if (!tags || tags.length === 0) return '기타'
    const firstTag = tags[0]
    return categoryMap[firstTag] || firstTag
  }

  const getRemainingDays = (expiredAt: string) => {
    const now = new Date()
    const expired = new Date(expiredAt)
    const diffTime = expired.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
          <p className="text-sm text-gray-600 mt-1">전체 {projects.length}개</p>
        </div>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          새로고침
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="프로젝트 제목 또는 창작자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[120px]"
            >
              <option value="ALL">전체 상태</option>
              <option value="PENDING">시작 전</option>
              <option value="PROGRESS">진행중</option>
              <option value="STOPPED">중단됨</option>
              <option value="SUCCESS">성공</option>
              <option value="FAIL">실패</option>
              <option value="END">종료</option>
            </select>
          </div>
          
          {/* 카테고리 필터 */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  categoryFilter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'ALL' ? '전체 카테고리' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 프로젝트 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  제목
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('author')}
              >
                <div className="flex items-center">
                  창작자
                  {getSortIcon('author')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  카테고리
                  {getSortIcon('category')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">상태</th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('completionRate')}
              >
                <div className="flex items-center">
                  달성률
                  {getSortIcon('completionRate')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('userCount')}
              >
                <div className="flex items-center">
                  후원자
                  {getSortIcon('userCount')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('remainingDays')}
              >
                <div className="flex items-center">
                  남은 일수
                  {getSortIcon('remainingDays')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('startAt')}
              >
                <div className="flex items-center">
                  시작일
                  {getSortIcon('startAt')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500 text-sm">
                  프로젝트가 없습니다.
                </td>
              </tr>
            ) : (
              sortedProjects.map((project) => {
                const remainingDays = getRemainingDays(project.expiredAt)
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">#{project.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.titleImg?.uri || noImage}
                          alt={project.title}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = noImage
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleViewDetail(project)}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate text-left"
                          >
                            {project.title.trim()}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.author?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getCategoryDisplay(project.tags)}</td>
                    <td className="px-4 py-3">{getStatusBadge(project.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{project.completionRate}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{project.userCount}명</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {remainingDays < 0 ? (
                        <span className="text-red-600">종료</span>
                      ) : (
                        `${remainingDays}일`
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{project.startAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === project.id ? null : project.id)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <i className="bi bi-gear text-lg"></i>
                        </button>
                        
                        {showActionMenu === project.id && (
                          <>
                            {/* 배경 클릭 시 닫기 */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowActionMenu(null)}
                            ></div>
                            
                            {/* 액션 메뉴 */}
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                              <button
                                onClick={() => {
                                  navigate(`/project/${project.id}`)
                                  setShowActionMenu(null)
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <i className="bi bi-eye"></i>
                                보기
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteProject(project.id)
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2 border-t"
                              >
                                <i className="bi bi-trash"></i>
                                삭제
                              </button>
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

      {/* 상세 모달 */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">프로젝트 상세</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={selectedProject.titleImg?.uri || noImage}
                  alt={selectedProject.title}
                  className="w-32 h-32 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = noImage
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedProject.title.trim()}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">ID: #{selectedProject.id}</p>
                    <p className="text-gray-600">
                      창작자: {selectedProject.author?.name || '-'} 
                      {selectedProject.author?.nickName && ` (@${selectedProject.author.nickName})`}
                    </p>
                    <p className="text-gray-600">카테고리: {getCategoryDisplay(selectedProject.tags)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">상태:</span>
                      {getStatusBadge(selectedProject.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500 mb-1">달성률</p>
                  <p className="text-lg font-semibold">{selectedProject.completionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">후원자 수</p>
                  <p className="text-lg font-semibold">{selectedProject.userCount}명</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">조회수</p>
                  <p className="text-lg font-semibold">{selectedProject.viewCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">좋아요</p>
                  <p className="text-lg font-semibold">{selectedProject.likeCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">시작일</p>
                  <p className="text-sm">{selectedProject.startAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">종료일</p>
                  <p className="text-sm">{selectedProject.expiredAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">남은 일수</p>
                  <p className="text-sm">
                    {getRemainingDays(selectedProject.expiredAt) < 0 ? (
                      <span className="text-red-600">종료됨</span>
                    ) : (
                      `${getRemainingDays(selectedProject.expiredAt)}일`
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">생성일</p>
                  <p className="text-sm">{selectedProject.createdAt?.split('T')[0] || '-'}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => navigate(`/project/${selectedProject.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  프로젝트 페이지 보기
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  닫기
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
