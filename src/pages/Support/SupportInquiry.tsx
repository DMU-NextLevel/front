import React, { useState } from 'react'
import SupportLayout from './SupportLayout'

const SupportInquiry: React.FC = () => {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    category: '일반 문의',
    title: '',
    content: ''
  })

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('문의 등록:', inquiryForm)
    alert('문의가 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.')
    setInquiryForm({
      name: '',
      email: '',
      category: '일반 문의',
      title: '',
      content: ''
    })
  }

  return (
    <SupportLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">1:1 문의하기</h2>
        <p className="text-gray-600 mb-8">
          궁금하신 사항을 남겨주시면 빠르게 답변드리겠습니다. (영업일 기준 1~2일 소요)
        </p>

        <form onSubmit={handleInquirySubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="답변 받으실 이메일을 입력해주세요"
              />
            </div>

            {/* 문의 유형 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문의 유형 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={inquiryForm.category}
                onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="일반 문의">일반 문의</option>
                <option value="회원 정보">회원 정보</option>
                <option value="펀딩 문의">펀딩 문의</option>
                <option value="프로젝트 문의">프로젝트 문의</option>
                <option value="결제/환불">결제/환불</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={inquiryForm.title}
                onChange={(e) => setInquiryForm({ ...inquiryForm, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="문의 제목을 입력해주세요"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={inquiryForm.content}
                onChange={(e) => setInquiryForm({ ...inquiryForm, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="문의하실 내용을 상세히 입력해주세요"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                문의 등록하기
              </button>
            </div>
          </div>
        </form>

        {/* 추가 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <i className="bi bi-info-circle text-blue-600 text-xl flex-shrink-0 mt-0.5"></i>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium text-gray-900">문의 전 확인해주세요</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>FAQ에서 자주 묻는 질문에 대한 답변을 먼저 확인해보세요.</li>
                <li>문의 접수 후 영업일 기준 1~2일 내 답변드립니다.</li>
                <li>주말 및 공휴일에는 답변이 지연될 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SupportLayout>
  )
}

export default SupportInquiry
