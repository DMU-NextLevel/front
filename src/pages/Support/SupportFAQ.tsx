import React, { useState } from 'react'
import SupportLayout from './SupportLayout'
import { FAQ_DATA, FAQ_CATEGORIES, CATEGORY_ICONS, FAQItem } from './faqData'

const SupportFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(FAQ_CATEGORIES[0])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory = faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
      <div className="max-w-7xl mx-auto">
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
          {FAQ_CATEGORIES.map((category) => (
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
                <i className={`${CATEGORY_ICONS[selectedCategory]} text-white text-xl`}></i>
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
      </div>
    </SupportLayout>
  )
}

export default SupportFAQ
