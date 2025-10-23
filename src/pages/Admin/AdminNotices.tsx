import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../AxiosInstance'
import Swal from 'sweetalert2'

type NoticeArticle = {
  id: number
  title: string
  content: string
  createdAt: string
  imgs?: string[]
}

const AdminNotices: React.FC = () => {
  const navigate = useNavigate()
  const [notices, setNotices] = useState<NoticeArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await api.get('/public/notice')
      if (response.data.message === 'success') {
        setNotices(response.data.data)
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '잠시 후 다시 시도해주세요. 계속 발생시 관리자에게 문의해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate)
    return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await api.post(`/admin/notice/${id}`)
      if (res.data.message === 'success') {
        alert('삭제가 완료되었습니다.')
        fetchNotices()
      } else {
        alert('삭제 실패: ' + res.data.message)
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleCreate = () => {
    navigate('/notice/create')
  }

  const handleEdit = (notice: NoticeArticle) => {
    navigate(`/notice/edit/${notice.id}`, { state: { article: notice } })
  }

  const handleView = (notice: NoticeArticle) => {
    navigate(`/support/notice/${notice.id}`, { state: notice })
  }

  // 필터링 및 정렬
  const filteredAndSortedNotices = notices
    .filter(notice => notice.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
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

      {/* Header */}
      <div className="flex justify-between items-center animate-slideInDown">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-sm text-gray-600 mt-1">전체 {filteredAndSortedNotices.length}개</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
          <i className="bi bi-plus-lg"></i>
          새 공지 작성
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-slideInDown animate-delay-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              총 <span className="font-semibold text-blue-600">{filteredAndSortedNotices.length}</span>개
            </span>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder('newest')}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${
                  sortOrder === 'newest'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                최신순
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${
                  sortOrder === 'oldest'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                과거순
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Notice List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-slideInDown animate-delay-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-16">
                번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                제목
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-32">
                작성일
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-48">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedNotices.length > 0 ? (
              filteredAndSortedNotices.map((notice, index) => (
                <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {filteredAndSortedNotices.length - index}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleView(notice)}
                      className="text-sm text-gray-900 hover:text-blue-600 font-medium text-left transition-colors">
                      {notice.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(notice.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(notice)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all border border-gray-200 hover:border-blue-200">
                        <i className="bi bi-eye mr-1"></i>
                        보기
                      </button>
                      <button
                        onClick={() => handleEdit(notice)}
                        className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all border border-blue-200">
                        <i className="bi bi-pencil mr-1"></i>
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all border border-red-200">
                        <i className="bi bi-trash mr-1"></i>
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                  <i className="bi bi-inbox text-4xl mb-2 block text-gray-300"></i>
                  <p className="text-sm">등록된 공지사항이 없습니다</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminNotices
