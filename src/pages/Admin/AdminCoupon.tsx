import React, { useState, useEffect } from 'react'
import { api } from '../../AxiosInstance'
import toast from 'react-hot-toast'

interface Coupon {
  id: number
  name: string
  percent: number
}

interface CouponFormData {
  userId: number | null
  name: string
  price: number
}

const AdminCoupon: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [couponType, setCouponType] = useState<'individual' | 'all' | null>(null) // 쿠폰 타입 선택
  const [searchUserId, setSearchUserId] = useState<string>('')
  const [currentSearchedUserId, setCurrentSearchedUserId] = useState<string>('') // 실제 검색된 유저 ID
  const [formData, setFormData] = useState<CouponFormData>({
    userId: null,
    name: '',
    price: 0
  })

  // 쿠폰 목록 조회 (전체 또는 특정 유저)
  const fetchCoupons = async (userId?: number) => {
    try {
      setLoading(true)
      let response
      
      if (userId) {
        // 특정 유저의 쿠폰 조회
        response = await api.get<{ message: string; data: Coupon[] }>('/admin/coupon', {
          params: { userId }
        })
      } else {
        // 전체 쿠폰 조회
        response = await api.get<{ message: string; data: Coupon[] }>('/social/coupon')
      }
      
      setCoupons(response.data.data)
    } catch (error) {
      console.error('쿠폰 조회 실패:', error)
      toast.error('쿠폰 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 유저 ID로 검색
  const handleSearchByUserId = () => {
    const userId = parseInt(searchUserId)
    if (isNaN(userId) || userId <= 0) {
      toast.error('올바른 유저 ID를 입력해주세요.')
      return
    }
    setCurrentSearchedUserId(searchUserId) // 검색한 유저 ID 저장
    fetchCoupons(userId)
  }

  // 검색 초기화
  const handleShowAllCoupons = () => {
    setSearchUserId('')
    setCurrentSearchedUserId('') // 검색된 유저 ID도 초기화
    setCoupons([])
  }

  // 개인 쿠폰 발급
  const handleAddIndividualCoupon = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userId) {
      toast.error('유저 ID를 입력해주세요.')
      return
    }

    if (!formData.name || formData.price <= 0) {
      toast.error('쿠폰 이름과 할인 가격을 입력해주세요.')
      return
    }

    try {
      const requestData = {
        userId: formData.userId,
        name: formData.name,
        price: formData.price
      }

      await api.post('/admin/coupon', requestData)
      toast.success('개인 쿠폰이 발급되었습니다.')
      handleCloseModal()
    } catch (error: any) {
      console.error('쿠폰 발급 실패:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('쿠폰 발급에 실패했습니다.')
      }
    }
  }

  // 전체 쿠폰 발급
  const handleAddAllCoupon = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.price <= 0) {
      toast.error('쿠폰 이름과 할인 가격을 입력해주세요.')
      return
    }

    try {
      const requestData = {
        name: formData.name,
        price: formData.price
      }

      await api.post('/admin/coupon/all', requestData)
      toast.success('전체 쿠폰이 발급되었습니다.')
      handleCloseModal()
    } catch (error: any) {
      console.error('전체 쿠폰 발급 실패:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('전체 쿠폰 발급에 실패했습니다.')
      }
    }
  }

  // 모달 닫기 및 초기화
  const handleCloseModal = () => {
    setShowAddModal(false)
    setCouponType(null)
    setFormData({ userId: null, name: '', price: 0 })
  }

  useEffect(() => {
    // 초기 로드 시 쿠폰 목록을 가져오지 않음 (유저 검색을 통해서만 조회)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">쿠폰 관리</h1>
              <p className="mt-2 text-sm text-gray-600">유저별 쿠폰을 조회하고 새로운 쿠폰을 발급할 수 있습니다.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              <i className="bi bi-plus-lg"></i>
              쿠폰 발급
            </button>
          </div>

          {/* 유저 ID 검색 */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 max-w-md">
              <input
                type="number"
                placeholder="유저 ID를 입력하세요"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchByUserId()
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleSearchByUserId}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 font-semibold"
            >
              <i className="bi bi-search"></i>
              조회
            </button>
            {searchUserId && (
              <button
                onClick={handleShowAllCoupons}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 font-semibold"
              >
                <i className="bi bi-x-lg"></i>
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 통계 카드 제거 - 유저별 조회이므로 불필요 */}
        {currentSearchedUserId && coupons.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <i className="bi bi-info-circle-fill"></i>
              <span className="font-medium">유저 ID {currentSearchedUserId}의 보유 쿠폰: {coupons.length}개</span>
            </div>
          </div>
        )}

        {/* 쿠폰 목록 테이블 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">쿠폰 목록</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    쿠폰 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    쿠폰 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    할인 금액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-gray-500">
                        <i className="bi bi-search text-4xl mb-3"></i>
                        <p className="font-medium">
                          {currentSearchedUserId ? '해당 유저의 쿠폰이 없습니다.' : '유저 ID를 입력하여 쿠폰을 조회하세요.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">#{coupon.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{coupon.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₩{coupon.percent.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 쿠폰 발급 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative z-10">
            {/* 모달 헤더 */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">쿠폰 발급</h3>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <i className="bi bi-x-lg text-gray-600"></i>
                </button>
              </div>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {!couponType ? (
                /* 쿠폰 타입 선택 */
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">발급할 쿠폰 유형을 선택하세요</p>
                  <button
                    onClick={() => setCouponType('individual')}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">개인 쿠폰 발급</h4>
                        <p className="text-sm text-gray-600 mt-1">특정 유저에게 쿠폰을 발급합니다</p>
                      </div>
                      <i className="bi bi-person-fill text-2xl text-gray-400 group-hover:text-blue-500"></i>
                    </div>
                  </button>
                  <button
                    onClick={() => setCouponType('all')}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">전체 쿠폰 발급</h4>
                        <p className="text-sm text-gray-600 mt-1">모든 유저에게 쿠폰을 발급합니다</p>
                      </div>
                      <i className="bi bi-people-fill text-2xl text-gray-400 group-hover:text-purple-500"></i>
                    </div>
                  </button>
                </div>
              ) : couponType === 'individual' ? (
                /* 개인 쿠폰 발급 폼 */
                <form onSubmit={handleAddIndividualCoupon} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setCouponType(null)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <i className="bi bi-arrow-left text-gray-600"></i>
                    </button>
                    <h4 className="font-semibold text-gray-900">개인 쿠폰 발급</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      사용자 ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="쿠폰을 발급할 유저 ID를 입력하세요"
                      value={formData.userId || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value ? Number(e.target.value) : null })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      쿠폰 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="쿠폰 이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      할인 가격 (원) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="할인 가격을 입력하세요"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                      min="1"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-all duration-200"
                    >
                      발급하기
                    </button>
                  </div>
                </form>
              ) : (
                /* 전체 쿠폰 발급 폼 */
                <form onSubmit={handleAddAllCoupon} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setCouponType(null)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <i className="bi bi-arrow-left text-gray-600"></i>
                    </button>
                    <h4 className="font-semibold text-gray-900">전체 쿠폰 발급</h4>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-purple-800">
                      <i className="bi bi-info-circle-fill mr-1"></i>
                      모든 유저에게 동일한 쿠폰이 발급됩니다.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      쿠폰 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="쿠폰 이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      할인 가격 (원) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="할인 가격을 입력하세요"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      required
                      min="1"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-200"
                    >
                      전체 발급하기
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCoupon
