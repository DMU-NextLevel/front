import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FAQItem {
  id: number
  category: string
  question: string
  answer: string
  icon: string
}

const Support: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'notice' | 'faq' | 'inquiry'>('faq')
  const [selectedCategory, setSelectedCategory] = useState('회원가입 및 계정 관리')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // 문의 등록 폼 상태
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    category: '일반 문의',
    title: '',
    content: ''
  })

  const categories = [
    '회원가입 및 계정 관리',
    '펀딩 프로젝트 이용',
    '프로젝트 창작자',
    '결제 및 환불'
  ]

  const faqData: FAQItem[] = [
    // 회원가입 및 계정 관리
    {
      id: 1,
      category: '회원가입 및 계정 관리',
      question: 'WithU에 어떻게 가입하나요?',
      answer: 'WithU는 이메일 가입과 소셜 로그인(구글, 카카오) 두 가지 방식을 모두 지원합니다. 원하는 방식을 선택하여 가입하실 수 있습니다.',
      icon: 'bi-person-circle'
    },
    {
      id: 2,
      category: '회원가입 및 계정 관리',
      question: '이메일로 가입했는데, 이메일 인증이 필요한가요?',
      answer: '네, 이메일 가입 시에는 회원님의 정보 보호를 위해 가입 시 입력하신 이메일로 인증 메일을 보내드립니다. 메일의 링크를 클릭하여 인증을 완료해야 정상적으로 서비스를 이용할 수 있습니다.',
      icon: 'bi-envelope-check'
    },
    {
      id: 3,
      category: '회원가입 및 계정 관리',
      question: '비밀번호를 잊어버렸어요.',
      answer: '이메일 가입 회원은 로그인 페이지 > 비밀번호 찾기를 통해 비밀번호를 재설정할 수 있습니다. 소셜 로그인 회원은 해당 소셜 계정의 비밀번호 찾기 기능을 이용하시면 됩니다.',
      icon: 'bi-key'
    },
    {
      id: 4,
      category: '회원가입 및 계정 관리',
      question: '계정을 삭제하고 싶어요.',
      answer: '마이페이지 > 설정 > 계정 관리에서 회원 탈퇴가 가능합니다. 탈퇴 시 모든 개인정보가 즉시 삭제되며, 진행 중인 펀딩이 있는 경우 탈퇴가 제한될 수 있습니다.',
      icon: 'bi-person-x'
    },
    {
      id: 5,
      category: '회원가입 및 계정 관리',
      question: '소셜 로그인과 이메일 계정을 연동할 수 있나요?',
      answer: '현재는 계정 연동 기능을 제공하지 않습니다. 각 로그인 방식은 독립적인 계정으로 관리됩니다.',
      icon: 'bi-link-45deg'
    },
    {
      id: 6,
      category: '회원가입 및 계정 관리',
      question: '프로필 정보를 수정하고 싶어요.',
      answer: '마이페이지에서 프로필 사진, 닉네임, 소개 등을 자유롭게 수정할 수 있습니다. 변경된 정보는 즉시 반영됩니다.',
      icon: 'bi-pencil-square'
    },

    // 펀딩 프로젝트 이용
    {
      id: 7,
      category: '펀딩 프로젝트 이용',
      question: '펀딩은 어떻게 참여하나요?',
      answer: '관심 있는 프로젝트를 선택하고 리워드를 고른 후 결제하시면 펀딩 참여가 완료됩니다. 프로젝트가 목표 금액을 달성하면 리워드를 받으실 수 있습니다.',
      icon: 'bi-heart-fill'
    },
    {
      id: 8,
      category: '펀딩 프로젝트 이용',
      question: '펀딩 후 취소나 변경이 가능한가요?',
      answer: '프로젝트 진행 중에는 마이페이지 > 펀딩 내역에서 취소 및 리워드 변경이 가능합니다. 단, 프로젝트 종료 후에는 변경이 불가능합니다.',
      icon: 'bi-arrow-repeat'
    },
    {
      id: 9,
      category: '펀딩 프로젝트 이용',
      question: '목표 금액을 달성하지 못하면 어떻게 되나요?',
      answer: 'WithU는 All or Nothing 방식을 채택하고 있습니다. 목표 금액 미달성 시 결제가 진행되지 않으며, 승인된 금액은 자동으로 취소됩니다.',
      icon: 'bi-exclamation-triangle'
    },
    {
      id: 10,
      category: '펀딩 프로젝트 이용',
      question: '리워드는 언제 받을 수 있나요?',
      answer: '각 프로젝트마다 예상 배송일이 다릅니다. 프로젝트 페이지에서 리워드별 배송 예정일을 확인하실 수 있으며, 배송이 시작되면 알림을 보내드립니다.',
      icon: 'bi-gift'
    },
    {
      id: 11,
      category: '펀딩 프로젝트 이용',
      question: '좋아요와 알림 설정은 어떻게 하나요?',
      answer: '프로젝트 페이지에서 하트 아이콘을 클릭하면 좋아요 및 알림 설정이 가능합니다. 프로젝트의 중요 소식을 알림으로 받아보실 수 있습니다.',
      icon: 'bi-bell'
    },
    {
      id: 12,
      category: '펀딩 프로젝트 이용',
      question: '프로젝트 진행 상황은 어디서 확인하나요?',
      answer: '펀딩에 참여한 프로젝트는 마이페이지 > 펀딩 내역에서 진행 상황을 실시간으로 확인할 수 있습니다. 창작자가 올린 업데이트도 함께 볼 수 있습니다.',
      icon: 'bi-graph-up'
    },

    // 프로젝트 창작자
    {
      id: 13,
      category: '프로젝트 창작자',
      question: '프로젝트를 시작하려면 어떻게 해야 하나요?',
      answer: '상단 메뉴의 "프로젝트 시작하기"를 클릭하면 프로젝트 생성 페이지로 이동합니다. 프로젝트 정보, 스토리, 리워드 등을 입력하고 심사를 신청하시면 됩니다.',
      icon: 'bi-rocket-takeoff'
    },
    {
      id: 14,
      category: '프로젝트 창작자',
      question: '프로젝트 심사는 얼마나 걸리나요?',
      answer: '심사는 보통 3~5 영업일 소요됩니다. 심사 결과는 이메일과 알림으로 안내드리며, 보완이 필요한 경우 상세한 피드백을 제공합니다.',
      icon: 'bi-clock-history'
    },
    {
      id: 15,
      category: '프로젝트 창작자',
      question: '수수료는 어떻게 되나요?',
      answer: 'WithU는 프로젝트 성공 시 모금액의 5%를 플랫폼 수수료로 책정하고 있습니다. 별도의 결제 수수료는 PG사 정책에 따릅니다.',
      icon: 'bi-percent'
    },
    {
      id: 16,
      category: '프로젝트 창작자',
      question: '펀딩 금액은 언제 정산되나요?',
      answer: '프로젝트 종료 후 7~10 영업일 내에 등록하신 계좌로 정산됩니다. 정산 내역은 창작자 대시보드에서 확인 가능합니다.',
      icon: 'bi-cash-coin'
    },
    {
      id: 17,
      category: '프로젝트 창작자',
      question: '프로젝트 진행 중 내용을 수정할 수 있나요?',
      answer: '펀딩 시작 후에는 중요 정보(리워드, 금액 등) 변경이 제한됩니다. 단, 창작자 노트를 통해 서포터들에게 업데이트 소식을 전할 수 있습니다.',
      icon: 'bi-pencil'
    },
    {
      id: 18,
      category: '프로젝트 창작자',
      question: '서포터와 소통하는 방법이 있나요?',
      answer: '창작자 노트, 댓글 답변, 개별 메시지 등 다양한 소통 채널을 제공합니다. 적극적인 소통은 프로젝트 성공률을 높이는 중요한 요소입니다.',
      icon: 'bi-chat-dots'
    },

    // 결제 및 환불
    {
      id: 19,
      category: '결제 및 환불',
      question: '어떤 결제 수단을 사용할 수 있나요?',
      answer: '신용카드, 체크카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등), WithU 포인트를 사용하실 수 있습니다.',
      icon: 'bi-credit-card'
    },
    {
      id: 20,
      category: '결제 및 환불',
      question: '결제 실패 시 어떻게 해야 하나요?',
      answer: '결제 한도 초과, 카드 정보 오류 등이 원인일 수 있습니다. 다른 결제 수단을 시도하거나 카드사에 문의해 주세요. 문제가 지속되면 고객센터로 연락 부탁드립니다.',
      icon: 'bi-exclamation-circle'
    },
    {
      id: 21,
      category: '결제 및 환불',
      question: '환불은 어떻게 받나요?',
      answer: '프로젝트 진행 중 취소 시에는 결제 승인만 취소됩니다. 프로젝트 종료 후에는 창작자와 협의하여 환불을 진행하게 됩니다.',
      icon: 'bi-arrow-counterclockwise'
    },
    {
      id: 22,
      category: '결제 및 환불',
      question: 'WithU 포인트는 어떻게 사용하나요?',
      answer: '펀딩 결제 시 포인트를 사용할 수 있으며, 1포인트는 1원으로 사용됩니다. 마이페이지에서 보유 포인트와 사용 내역을 확인하실 수 있습니다.',
      icon: 'bi-coin'
    },
    {
      id: 23,
      category: '결제 및 환불',
      question: '영수증이나 세금계산서 발급이 가능한가요?',
      answer: '마이페이지 > 펀딩 내역에서 현금영수증 및 세금계산서를 신청하실 수 있습니다. 프로젝트 종료 후 발급 가능합니다.',
      icon: 'bi-file-earmark-text'
    },
    {
      id: 24,
      category: '결제 및 환불',
      question: '분할 결제가 가능한가요?',
      answer: '신용카드 결제 시 카드사의 무이자 할부 혜택을 이용하실 수 있습니다. 할부 개월 수는 카드사 및 프로모션에 따라 다릅니다.',
      icon: 'bi-calendar-check'
    }
  ]

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryIcons: { [key: string]: string } = {
    '회원가입 및 계정 관리': 'bi-person-circle',
    '펀딩 프로젝트 이용': 'bi-heart-fill',
    '프로젝트 창작자': 'bi-rocket-takeoff',
    '결제 및 환불': 'bi-credit-card'
  }

  // 검색어 하이라이트 함수
  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900 px-1 rounded">$1</mark>')
  }

  // 검색 초기화 함수
  const clearSearch = () => {
    setSearchTerm('')
  }

  // 문의 등록 제출
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
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <div className="mx-auto px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            일상의 새로운 가능성을 그려가는 곳
          </h1>
          <p className="text-xl text-white mb-8">
            with<span className="text-purple-400">U</span> 고객센터입니다.
          </p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('notice')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notice'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-megaphone mr-2"></i>
              공지사항
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'faq'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-question-circle mr-2"></i>
              자주 묻는 질문
            </button>
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'inquiry'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-pencil-square mr-2"></i>
              문의 등록
            </button>
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="mx-auto px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-12">
        {/* 공지사항 탭 - 기존 NoticeBoard로 이동 */}
        {activeTab === 'notice' && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="mb-8">
              <i className="bi bi-megaphone text-purple-600 text-6xl mb-4"></i>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">공지사항</h2>
              <p className="text-gray-600 mb-8">
                WithU의 최신 소식과 업데이트를 확인하세요.
              </p>
              <button
                onClick={() => navigate('/notice')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
              >
                공지사항 바로가기
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* FAQ 탭 */}
        {activeTab === 'faq' && (
          <>
            {/* 자주 묻는 질문 타이틀 */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
            </div>

            {/* 검색창 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="궁금한 내용을 입력해 주세요"
                  className="w-full px-6 py-4 pr-24 rounded-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="bi bi-x-circle text-xl"></i>
                  </button>
                )}
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  <i className="bi bi-search text-gray-400 text-xl hover:text-gray-600"></i>
                </button>
              </div>
            </div>

            {/* 검색 결과 표시 */}
            {searchTerm && (
              <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-search text-purple-600"></i>
                    <span className="text-gray-700">
                      '<span className="font-semibold text-purple-600">{searchTerm}</span>' 검색 결과: 
                      <span className="font-bold text-purple-600 ml-2">{filteredFAQs.length}개</span>
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                  >
                    <i className="bi bi-x-lg"></i>
                    초기화
                  </button>
                </div>
              </div>
            )}

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSearchTerm('')
                  }}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ 리스트 */}
            {filteredFAQs.length > 0 ? (
              <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-purple-600">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <i className={`${categoryIcons[selectedCategory]} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCategory}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFAQs.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Question */}
                        <h3 
                          className="text-base font-semibold text-gray-900 mb-3 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: 'Q. ' + highlightText(faq.question, searchTerm)
                          }}
                        />
                        
                        {/* Answer Preview */}
                        <div className="flex-1 mb-4">
                          <span className="text-sm font-semibold text-gray-700 mb-2 block">A.</span>
                          <p 
                            className={`text-sm text-gray-600 leading-relaxed ${
                              expandedId === faq.id ? '' : 'line-clamp-3'
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(faq.answer, searchTerm)
                            }}
                          />
                        </div>
                        
                        {/* Toggle Button */}
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between text-purple-600 hover:text-purple-700 text-sm font-medium mt-auto pt-4 border-t border-gray-100 transition-colors"
                        >
                          <span>{expandedId === faq.id ? '접기' : '자세히 보기'}</span>
                          <i className={`bi ${expandedId === faq.id ? 'bi-chevron-up' : 'bi-chevron-down'} transition-transform`}></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="bi bi-search text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              </div>
            )}
          </>
        )}

        {/* 문의 등록 탭 */}
        {activeTab === 'inquiry' && (
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
        )}
      </div>

      {/* 하단 도움말 섹션 */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="mx-auto px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-telephone text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">전화 문의</h3>
              <p className="text-sm text-gray-600 mb-2">
                평일 10:00 ~ 18:00<br />
                (점심시간 12:00~13:00)
              </p>
              <p className="text-purple-600 font-medium">1588-0000</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-envelope text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">이메일 문의</h3>
              <p className="text-sm text-gray-600 mb-2">
                24시간 접수 가능<br />
                영업일 기준 1~2일 내 답변
              </p>
              <p className="text-purple-600 font-medium">support@withu.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-chat-dots text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">카카오톡 상담</h3>
              <p className="text-sm text-gray-600 mb-2">
                평일 10:00 ~ 18:00<br />
                실시간 채팅 상담
              </p>
              <p className="text-purple-600 font-medium">@WithU</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
