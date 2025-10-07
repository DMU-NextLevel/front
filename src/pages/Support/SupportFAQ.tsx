import React, { useState, useRef } from 'react'
import SupportLayout from './SupportLayout'
import { FAQ_DATA, FAQ_CATEGORIES, CATEGORY_ICONS } from './faqData'

const SupportFAQ: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(FAQ_CATEGORIES[0])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // 카테고리 토글
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  // 카테고리 버튼 클릭 시
  const handleCategoryClick = (category: string) => {
    setSearchTerm('')
    
    // 이미 열려있으면 닫고, 닫혀있으면 열기
    const newExpandedCategory = expandedCategory === category ? null : category
    setExpandedCategory(newExpandedCategory)
    
    // 열릴 경우 스크롤 (아코디언 애니메이션 완료 후)
    if (newExpandedCategory === category) {
      // 아코디언 애니메이션이 완료될 때까지 대기 (300ms transition)
      setTimeout(() => {
        if (categoryRefs.current[category]) {
          const element = categoryRefs.current[category]
          const headerHeight = 64 // 헤더 높이
          const tabHeight = 80 // 탭 메뉴 높이
          const extraPadding = 20 // 추가 여백
          const offset = headerHeight + tabHeight + extraPadding
          
          const elementPosition = element?.getBoundingClientRect().top || 0
          const offsetPosition = elementPosition + window.pageYOffset - offset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 350) // 300ms 애니메이션 + 50ms 여유
    }
  }

  // 카테고리별 FAQ 그룹화
  const getFAQsByCategory = (category: string) => {
    return FAQ_DATA.filter(faq => {
      const matchesCategory = faq.category === category
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
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

  return (
    <SupportLayout>
      <div>
        {/* 자주 묻는 질문 타이틀 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
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

        {/* 카테고리 필터 버튼 */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                expandedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 카테고리별 아코디언 */}
        <div>
          {FAQ_CATEGORIES.map((category, index) => {
            const categoryFAQs = getFAQsByCategory(category)
            
            return (
              <div
                key={category}
                ref={(el) => {
                  categoryRefs.current[category] = el
                }}
                className={index === 0 ? '' : 'mt-8'}
              >
                {/* 카테고리 헤더 */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full py-4 flex items-center justify-between border-b-2 transition-colors duration-300 ${
                    expandedCategory === category
                      ? 'border-purple-600'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      expandedCategory === category
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        : 'bg-gray-100'
                    }`}>
                      <i className={`${CATEGORY_ICONS[category]} text-lg transition-colors duration-300 ${
                        expandedCategory === category ? 'text-white' : 'text-gray-600'
                      }`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {category}
                    </h3>
                  </div>
                  <i className={`bi ${
                    expandedCategory === category ? 'bi-chevron-up' : 'bi-chevron-down'
                  } text-lg text-gray-400`}></i>
                </button>

                {/* FAQ 리스트 (아코디언 콘텐츠) */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCategory === category ? 'max-h-[2000px] mt-6' : 'max-h-0'
                  }`}
                >
                  <div className="pb-6">
                    {categoryFAQs.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryFAQs.map(faq => (
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
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SupportLayout>
  )
}

export default SupportFAQ
