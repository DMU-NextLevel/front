import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SupportLayoutProps {
  children: React.ReactNode
}

const SupportLayout: React.FC<SupportLayoutProps> = ({ children }) => {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

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
            <Link
              to="/support/notice"
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                isActive('/support/notice')
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-megaphone mr-2"></i>
              공지사항
            </Link>
            <Link
              to="/support/faq"
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                isActive('/support/faq')
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-question-circle mr-2"></i>
              자주 묻는 질문
            </Link>
            <Link
              to="/support/inquiry"
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                isActive('/support/inquiry')
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="bi bi-pencil-square mr-2"></i>
              문의 등록
            </Link>
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="mx-auto px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-12">
        <div className="animate-fadeIn">
          {children}
        </div>
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

export default SupportLayout
