import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../AxiosInstance'

interface FundingActivity {
  projectTitle: string
  userNickName: string
  price: number
  type: string
  createdAt: string
}

const AdminFundingHistory: React.FC = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<FundingActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // 0부터 시작
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 20 // 한 페이지당 20개 표시
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchFundingActivities()
  }, [currentPage])

  // 30초마다 자동 새로고침 (첫 페이지에서만)
  useEffect(() => {
    if (currentPage !== 0) return // 첫 페이지가 아니면 자동 새로고침 안 함
    
    const interval = setInterval(() => {
      fetchFundingActivities(true) // true = 자동 새로고침
    }, 30000) // 30초

    return () => clearInterval(interval)
  }, [currentPage])

  const fetchFundingActivities = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      
      console.log('API 요청:', { pageCount: itemsPerPage, page: currentPage })
      
      const response = await api.get('/admin/project/funding', {
        params: {
          pageCount: itemsPerPage, // 20개 요청
          page: currentPage
        }
      })
      
      console.log('API 응답:', response.data)
      
      if (response.data.message === 'success' && response.data.data) {
        setActivities(response.data.data)
        setLastUpdated(new Date())
        
        console.log('받은 데이터 개수:', response.data.data.length)
        
        // 전체 아이템 수가 응답에 있다면 설정 (없으면 임시로 계산)
        if (response.data.totalCount !== undefined) {
          setTotalItems(response.data.totalCount)
        } else {
          // totalCount가 없으면 현재 데이터 기반으로 추정
          setTotalItems(response.data.data.length < itemsPerPage ? 
            currentPage * itemsPerPage + response.data.data.length : 
            (currentPage + 1) * itemsPerPage + 1
          )
        }
      }
    } catch (error) {
      console.error('펀딩 내역 로딩 실패:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    // 새로고침 시 첫 페이지로 이동
    if (currentPage !== 0) {
      setCurrentPage(0)
    } else {
      fetchFundingActivities()
    }
  }

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + activities.length

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">펀딩 내역</h1>
            <p className="text-orange-100">전체 펀딩 활동을 확인하고 관리할 수 있습니다.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-200 mb-1">전체 내역</p>
            <p className="text-3xl font-bold">{totalItems.toLocaleString()}건</p>
          </div>
        </div>
      </div>

      {/* 펀딩 내역 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">펀딩 활동 목록</h2>
              <button
                onClick={handleManualRefresh}
                disabled={loading || refreshing}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                  loading || refreshing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
              >
                <i className={`bi bi-arrow-clockwise ${refreshing ? 'animate-spin' : ''}`}></i>
                새로고침
              </button>
              {refreshing && (
                <span className="text-xs text-gray-500 animate-pulse">업데이트 중...</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">
                마지막 업데이트: {formatTime(lastUpdated)}
              </div>
              <div className="text-sm text-gray-500">
                총 <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span>건
              </div>
            </div>
          </div>

          {activities.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        일시
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        닉네임
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        프로젝트
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        타입
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                              <i className="bi bi-receipt text-orange-600 text-sm"></i>
                            </div>
                            <span className="text-sm text-gray-900">{formatDate(activity.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.userNickName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={activity.projectTitle}>
                            {activity.projectTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {activity.price.toLocaleString()}원
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                    const displayPage = page + 1
                    // 현재 페이지 주변만 표시
                    if (
                      page === 0 ||
                      page === totalPages - 1 ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-orange-600 text-white shadow-lg'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {displayPage}
                        </button>
                      )
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}

              {/* 페이지 정보 */}
              <div className="mt-4 text-center text-sm text-gray-600">
                {startIndex + 1} - {endIndex} / {totalItems}건
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-inbox text-3xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 mb-2">펀딩 내역이 없습니다.</p>
              <p className="text-sm text-gray-400">펀딩 활동이 발생하면 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminFundingHistory
