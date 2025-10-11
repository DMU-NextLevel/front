import React, { useState } from 'react'

type Step = {
  id: number
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: '아이디어를 프로젝트로 만들어 보세요',
    desc: '프로젝트 목표, 리워드 등 상세 정보를 쉽게 추가할 수 있는 가이드라인을 제공합니다. 언제든지 프로젝트 내용을 수정하고 업데이트할 수 있습니다.',
  },
  {
    id: 2,
    title: '공유를 통해 잠재적 후원자들에게 다가가세요',
    desc: '프로젝트 링크를 소셜 미디어에 공유하고, \'WithU\'가 제공하는 리소스를 활용해 더 많은 사람들의 관심을 얻으세요.',
  },
  {
    id: 3,
    title: '팬과 소통하며 꿈을 완성하세요',
    desc: '펀딩 기간 동안 후원자들과 소통하고, 피드백을 받으며 프로젝트를 발전시켜 보세요. 펀딩이 성공적으로 마무리되면, 당신의 꿈은 현실이 됩니다.',
  },
]

export default function FeatureOverview() {
  const [active, setActive] = useState(2)

  function prev() {
    setActive((v) => Math.max(1, v - 1))
  }

  function next() {
    setActive((v) => Math.min(STEPS.length, v + 1))
  }

  

  /* Inline icon components (simple, lightweight SVGs) */
  const IconInstagram = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <defs>
        <linearGradient id="igGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#ff5f6d" />
          <stop offset="1" stopColor="#ffc371" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igGrad)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="rgba(255,255,255,0.9)" />
      <circle cx="16.5" cy="7.5" r="1" fill="#fff" />
    </svg>
  )

  const IconFacebook = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path d="M14.5 8.5h-1.3c-.3 0-.6.3-.6.6v1h1.8l-.3 1.9h-1.5v5h-2v-5h-1.4v-1.9h1.4v-1.3c0-1.2.8-2.3 2.2-2.3h1.4v2z" fill="#fff" />
    </svg>
  )

  const IconWhatsApp = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path d="M17 15.5c-.5-.2-1.1-.4-1.6-.5-.4-.1-.8 0-1.1.2-.7.4-1.8.9-3.7-.9-1.6-1.6-2.1-2.7-2.5-3.4-.3-.6 0-1 .2-1.4.2-.3.5-.7.7-.9.2-.2.3-.4.5-.7.1-.2.2-.4 0-.6-.2-.2-.8-2-1.1-2.7-.2-.5-.5-.4-.7-.4-.2 0-.4 0-.6 0-.4 0-1 .1-1.6.7-.6.6-1.6 1.7-1.6 4.1 0 2.4 1.6 4.7 1.9 5.1.3.4 3.3 5 8.1 6.5 4.8 1.5 4.8-1.6 5.4-1.7.6-.1 2.3-.9 2.6-3.4.3-2.5-1.1-3.6-1.6-3.9z" fill="#fff" />
    </svg>
  )

  const IconMail = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#4A90E2" />
      <path d="M6 8l6 4 6-4v8H6V8z" fill="#fff" />
    </svg>
  )

  const IconX = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#000" />
      <path d="M7 7l10 10M17 7L7 17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const IconMessenger = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <defs>
        <linearGradient id="msgr" x1="0" x2="1">
          <stop offset="0" stopColor="#FF5DA2" />
          <stop offset="1" stopColor="#7CE3B1" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#msgr)" />
      <path d="M7 12l3 2 2-2 5 3-3-5-4 3-3-3v2z" fill="#fff" />
    </svg>
  )

  // now define social icons with svg
  const socialIcons = [
    { id: 'ig', svg: <IconInstagram />, bg: 'linear-gradient(45deg,#ff5f6d,#ffc371)' },
    { id: 'fb', svg: <IconFacebook />, bg: '#1877F2' },
    { id: 'wa', svg: <IconWhatsApp />, bg: '#25D366' },
    { id: 'mail', svg: <IconMail />, bg: '#3B82F6' },
    { id: 'x', svg: <IconX />, bg: '#000' },
    { id: 'msgr', svg: <IconMessenger />, bg: 'linear-gradient(45deg,#FF5DA2,#7CE3B1)' },
  ]

  function renderLeft() {
    if (active === 1) {
      return (
        <div className="flex justify-center lg:justify-start"> 
          <div className="relative bg-green-600 rounded-2xl p-8 w-[400px] h-[440px] flex items-center justify-center shadow-lg overflow-hidden">
            <div className="device-card bg-white rounded-2xl w-[280px] h-[400px] p-6 shadow-inner relative">
              <h4 className="text-lg font-semibold mb-4">프로젝트 만들기</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">프로젝트 제목</label>
                  <input 
                    type="text" 
                    placeholder="프로젝트 제목을 입력하세요" 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">목표 금액</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₩</span>
                    <input 
                      type="text" 
                      placeholder="1,000,000" 
                      className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">카테고리</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>기술</option>
                    <option>예술</option>
                    <option>교육</option>
                    <option>환경</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">프로젝트 설명</label>
                  <textarea 
                    placeholder="프로젝트에 대해 자세히 설명해주세요" 
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                  />
                </div>
              </div>

            </div>
            <div className="absolute top-4 right-4 text-white opacity-90">||</div>
          </div>
        </div>
      )
    }

    if (active === 2) {
      return (
        <div className="flex justify-center lg:justify-start">
          <div className="relative bg-green-600 rounded-2xl p-8 w-[400px] h-[440px] flex items-center justify-center shadow-lg overflow-hidden">
            <div className="device-card bg-white rounded-2xl w-[280px] h-[400px] p-6 shadow-inner relative">
              <h4 className="text-lg font-semibold mb-4">프로젝트 공유하기</h4>
              <p className="text-sm text-gray-600 mb-4">소셜 미디어로 더 많은 사람들에게 알리세요</p>
              
              <div className="grid grid-cols-2 gap-3">
                {socialIcons.slice(0, 4).map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div
                      className="flex items-center justify-center rounded-full shadow-sm"
                      style={{
                        background: s.bg,
                        width: '32px',
                        height: '32px'
                      }}
                    >
                      {React.cloneElement(s.svg, { width: 20, height: 20 })}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {s.id === 'ig' ? 'Instagram' : 
                       s.id === 'fb' ? 'Facebook' : 
                       s.id === 'wa' ? 'WhatsApp' : 
                       s.id === 'mail' ? 'Email' : 
                       s.id === 'x' ? 'X (Twitter)' : 'Messenger'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-gray-400 text-sm mt-4">아이콘을 탭해서 공유하기</div>
            </div>
            <div className="absolute top-4 right-4 text-white opacity-90">||</div>
          </div>
        </div>
      )
    }

    // active === 3
    return (
      <div className="flex justify-center lg:justify-start">
        <div className="relative bg-green-600 rounded-2xl p-8 w-[400px] h-[440px] flex items-center justify-center shadow-lg overflow-hidden">
          <div className="device-card bg-white rounded-2xl w-[280px] h-[400px] p-6 shadow-inner relative">
            <h4 className="text-lg font-semibold mb-4">팬들과 소통하기</h4>
            
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">팬</div>
                  <span className="text-xs font-medium">김민수</span>
                </div>
                <p className="text-xs text-gray-700">프로젝트가 정말 기대돼요!</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-2 ml-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">창</div>
                  <span className="text-xs font-medium">창작자</span>
                </div>
                <p className="text-xs text-gray-700">감사합니다! 곧 공유드릴게요!</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="메시지 입력..." 
                className="flex-1 px-2 py-1 border rounded text-xs"
              />
              <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">보내기</button>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-white opacity-90">||</div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full bg-white py-12">
      <style>{`
        .device-card { width: 280px; height: 400px }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-center text-2xl font-extrabold mb-8">'WithU'에서 당신의 꿈을 펼쳐보세요</h3>
        <p className="text-center text-lg text-gray-600 mb-12">'WithU'와 함께라면 당신의 아이디어는 현실이 됩니다. 아래 3단계에 따라 쉽게 프로젝트를 시작하고 성공을 경험하세요.</p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left: visual that changes per step */}
          <div className="flex-1">{renderLeft()}</div>

          {/* Right: steps */}
          <div className="flex-1">
            <div className="max-w-xl mx-auto lg:mx-0">
              <div className="space-y-6">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex items-start gap-4">
                    <button
                      onClick={() => setActive(s.id)}
                      className={`flex-none w-10 h-10 rounded-full flex items-center justify-center border ${s.id === active ? 'bg-black text-white' : 'bg-white text-gray-600 border-gray-200'}`}
                      aria-current={s.id === active}
                      aria-label={`Step ${s.id}`}
                    >
                      {s.id}
                    </button>

                    <div className="flex-1">
                      <h4 className={`text-base font-semibold ${s.id === active ? 'text-black' : 'text-gray-700'}`}>{s.title}</h4>
                      <p className="text-sm text-gray-500 mt-2">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button onClick={prev} className="px-3 py-2 border rounded-md text-sm bg-white">Prev</button>
                <button onClick={next} className="px-3 py-2 bg-green-800 text-white rounded-md text-sm">Next</button>

                <div className="ml-auto text-sm text-gray-500">{active} / {STEPS.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
