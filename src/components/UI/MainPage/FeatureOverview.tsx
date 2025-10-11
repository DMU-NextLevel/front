import React, { useState, useEffect, useRef } from 'react'

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
  const [active, setActive] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevActive, setPrevActive] = useState<number | null>(null)
  const [nextActive, setNextActive] = useState<number | null>(null)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const [enteringStarted, setEnteringStarted] = useState(false)
  const [exitingStarted, setExitingStarted] = useState(false)
  const [autoplayProgress, setAutoplayProgress] = useState(0) // 0..100
  const autoplayIntervalRef = useRef<number | null>(null)
  const activeRef = useRef(active)
  const isAnimatingRef = useRef(isAnimating)
  const pendingNextRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const isPlayingRef = useRef(isPlaying)

  function setActiveWithAnimation(newActive: number, options?: { force?: boolean }) {
    // use refs to get the latest values (avoid stale closure)
    if (newActive === activeRef.current) return

    // if an animation is running and caller hasn't forced it, queue the desired next
    if (!options?.force && isAnimatingRef.current) {
      pendingNextRef.current = newActive
      return
    }

    // immediately switch active so the step button updates at click
    setPrevActive(active)
    setNextActive(newActive)
    setActive(newActive)
    // reset autoplay progress when user manually changes
    setAutoplayProgress(0)
    setIsAnimating(true)
    setAnimationPhase('exiting')
    setExitingStarted(false)
    setEnteringStarted(false)

    // start exiting transition on next tick
    setTimeout(() => {
      setExitingStarted(true)
    }, 10)

    // after 300ms switch to entering phase and trigger entering transition
    setTimeout(() => {
      setAnimationPhase('entering')
      setExitingStarted(false)
      setEnteringStarted(false)
      setTimeout(() => {
        setEnteringStarted(true)
      }, 10)
    }, 300)

    // finalize after full animation (600ms)
    setTimeout(() => {
      setPrevActive(null)
      setNextActive(null)
      setAnimationPhase('idle')
      setExitingStarted(false)
      setEnteringStarted(false)
      setIsAnimating(false)
    }, 600)
  }

  // autoplay: fill progress from 0 to 100 over 5s, then advance
  useEffect(() => {
    activeRef.current = active
  }, [active])

  // keep a ref for isAnimating so interval callback can see current value
  useEffect(() => {
    isAnimatingRef.current = isAnimating
  }, [isAnimating])

  // keep a ref for isPlaying
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // if autoplay wanted to advance while animating, consume pending when animation ends
  useEffect(() => {
    if (!isAnimating && pendingNextRef.current !== null) {
      const to = pendingNextRef.current
      pendingNextRef.current = null
      setAutoplayProgress(0)
      // force: ensure the queued change runs even if state appears to match
      // useful when closures/ref timing cause early returns
      setActiveWithAnimation(to, { force: true })
    }
  }, [isAnimating])

  useEffect(() => {
    const totalMs = 5000
    const stepMs = 100
    elapsedRef.current = 0

    function tick() {
      // if paused, don't advance elapsed
      if (!isPlayingRef.current) return

      elapsedRef.current += stepMs
      const pct = Math.min(100, Math.round((elapsedRef.current / totalMs) * 100))
      setAutoplayProgress(pct)
      if (elapsedRef.current >= totalMs) {
        // advance
        const count = STEPS.length || 3
        const next = (activeRef.current % count) + 1

        // call with force to ensure autoplay advances even if an animation is still running
        setActiveWithAnimation(next, { force: true })
        elapsedRef.current = 0
        setAutoplayProgress(0)
      }
    }

    autoplayIntervalRef.current = window.setInterval(tick, stepMs)
    return () => {
      if (autoplayIntervalRef.current) window.clearInterval(autoplayIntervalRef.current)
    }
  }, [])

  

  /* Inline icon components (simple, lightweight SVGs) */
  const IconInstagram = () => (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <defs>ㄴ
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
    const cardContents = [
      // Card 1 content
      {
        title: "프로젝트 만들기",
        content: (
          <div className="space-y-4">
            {/* top: (thumbnail and title removed per request) */}

            {/* title input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">프로젝트 제목</label>
              <input
                type="text"
                placeholder="예: 함께 만드는 단편영화 제작비 지원"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* goal */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">목표 금액</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₩</span>
                <input
                  type="text"
                  placeholder="1,000,000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">카테고리</label>
              <div className="flex gap-2 flex-wrap">
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-700">기술</button>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-700">예술</button>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-700">교육</button>
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-700">환경</button>
              </div>
            </div>

            {/* description with hint */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">프로젝트 설명</label>
              <textarea
                placeholder="프로젝트의 핵심을 1-2문장으로 요약해보세요"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none"
              />
              <div className="text-xs text-gray-400 mt-1">권장 길이: 50-150자</div>
            </div>
          </div>
        )
      },
      // Card 2 content
      {
        title: "프로젝트 홍보",
        content: (
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-semibold text-gray-800">소셜 홍보 예시</h5>
              <p className="text-xs text-gray-500">짧게 공유해 관심을 불러일으키세요 — 지금 바로 다른 사람과 나누세요.</p>
            </div>

            <div className="space-y-2">
              {socialIcons.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-start gap-3 bg-white rounded-lg p-2 shadow-sm">
                    <div className="flex-shrink-0">
                      <div style={{ width: 32, height: 32 }} className="rounded-full overflow-hidden flex items-center justify-center">
                        {s.id === 'fb' ? (
                          <img src="https://cdn-icons-png.flaticon.com/256/124/124010.png" alt="facebook" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                        ) : s.id === 'ig' ? (
                          <img src="https://i.namu.wiki/i/kq-4Vs_9gtXMUjSK-l14rqK0Uy_9V8EEY0qpZBXWc2hPScACDTflz6ssUp0FAqEbDpR7g7PLsP4xLBOxbuk9Ug.webp" alt="instagram" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                        ) : s.id === 'wa' ? (
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdWbISBt1IvfpyFOSlubFzWBFdNoZdj-X-wQ&s" alt="messenger" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                        ) : (
                          React.cloneElement(s.svg, { width: 20, height: 20 })
                        )}
                      </div>
                    </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-800">
                        {s.id === 'ig' ? 'Instagram' : s.id === 'fb' ? 'Facebook' : s.id === 'wa' ? 'Messenger' : s.id === 'mail' ? 'Email' : s.id === 'x' ? 'X' : 'Messenger'}
                      </div>
                      <div className="text-xs text-gray-400">예시</div>
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                      {s.id === 'ig' && '공유해 더 많은 사람들에게 알려보세요.'}
                      {s.id === 'fb' && '친구들과 공유해 프로젝트를 응원해 주세요.'}
                      {s.id === 'wa' && '메시지로 공유해 참여를 초대하세요.'}
                      {s.id === 'mail' && '이메일로 공유해 관심을 모아보세요.'}
                      {s.id === 'x' && '지금 공유해 소식을 퍼뜨려 보세요.'}
                      {s.id === 'msgr' && '메시지로 공유해 참여를 초대하세요.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      // Card 3 content
      {
        title: "팬들과 소통하기",
        content: (
          <>
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">팬</div>
                  <span className="text-xs font-medium">김민수</span>
                </div>
                <p className="text-xs text-gray-700">프로젝트가 정말 기대돼요!</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">팬</div>
                  <span className="text-xs font-medium">박지우</span>
                </div>
                <p className="text-xs text-gray-700">응원합니다! 작은 기부라도 도울게요.</p>
              </div>
              
              <div className="accent-bg-50 rounded-lg p-2 ml-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 accent-bg rounded-full flex items-center justify-center text-white text-xs">창</div>
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
              <button className="px-3 py-1 active-accent text-white rounded text-xs">보내기</button>
            </div>
          </>
        )
      }
    ]

    const currentCard = cardContents[active - 1]

    return (
      <div className="flex justify-center lg:justify-start"> 
  <div className="relative accent-bg rounded-2xl px-6 pt-20 pb-0 w-[400px] h-[440px] flex items-center justify-center shadow-lg overflow-hidden">
          {/* 정상 상태 */}
          {animationPhase === 'idle' && (
            <div 
              key={`card-${active}`}
              className="device-card bg-white rounded-t-2xl w-[280px] p-6 mb-[-10px] shadow-inner relative"
            >
              <h4 className="text-lg font-semibold mb-4">{currentCard.title}</h4>
              {currentCard.content}
            </div>
          )}
          
          {/* 이전 카드가 내려가는 중 */}
            {animationPhase === 'exiting' && prevActive !== null && (
            <div 
              key={`card-${prevActive}-exiting`}
              className={`device-card bg-white rounded-t-2xl w-[280px] p-6 mb-[-10px] shadow-inner relative transition-all duration-300 ease-in-out ${
                exitingStarted ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
              }`}
            >
              <h4 className="text-lg font-semibold mb-4">{cardContents[prevActive - 1].title}</h4>
              {cardContents[prevActive - 1].content}
            </div>
          )}
          
          {/* 다음 카드가 올라오는 중 */}
          {animationPhase === 'entering' && nextActive !== null && (
            <div 
              key={`card-${nextActive}-entering`}
              className={`device-card bg-white rounded-t-2xl w-[280px] p-6 mb-[-10px] shadow-inner relative transition-all duration-300 ease-in-out ${
                enteringStarted ? 'transform translate-y-0 opacity-100' : 'transform translate-y-full opacity-0'
              }`}
            >
              <h4 className="text-lg font-semibold mb-4">{cardContents[nextActive - 1].title}</h4>
              {cardContents[nextActive - 1].content}
            </div>
          )}
          
          <button
            aria-label={isPlaying ? '일시정지' : '재생'}
            onClick={() => {
              const next = !isPlaying
              setIsPlaying(next)
              isPlayingRef.current = next
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-transparent flex items-center justify-center text-white"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="6" y="5" width="3" height="14" rx="1" fill="#fff" />
                <rect x="15" y="5" width="3" height="14" rx="1" fill="#fff" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 3v18l15-9L5 3z" fill="#fff" />
              </svg>
            )}
          </button>
          {/* autoplay progress bar (single clean fill, no faint background) */}
          <div className="absolute bottom-0 left-0 w-full px-0">
            <div style={{ height: 6, background: 'transparent', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ height: 6, width: `${autoplayProgress}%`, background: '#6A2ED5', transition: 'width 100ms linear', borderRadius: 9999 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full bg-gray-50 py-12 feature-overview">
      <style>{`
        .device-card { width: 280px; height: 400px }
        /* custom accent color */
        .feature-overview .accent-bg { background: #A66CFF !important; }
        .feature-overview .accent-bg-50 { background: rgba(166,108,255,0.08); }
        .feature-overview .accent-border { border-color: #A66CFF !important; }
        .feature-overview .active-accent { background: #A66CFF !important; color: #fff !important; border-color: #A66CFF !important; box-shadow: 0 6px 18px rgba(166,108,255,0.18); }
        .feature-overview .hover-accent-border:hover { border-color: #A66CFF !important; }
        .feature-overview input:focus, .feature-overview textarea:focus { box-shadow: 0 0 0 4px rgba(166,108,255,0.12); outline: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-center text-3xl font-bold mb-4">WithU에서 펀딩하기는 쉽고, 강력하며, 신뢰할 수 있습니다</h3>
        <p className="text-center text-lg text-gray-600 mb-12">WithU와 함께라면 당신의 아이디어는 현실이 됩니다. 아래 3단계에 따라 쉽게 프로젝트를 시작하고 성공을 경험하세요.</p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left: visual that changes per step */}
          <div className="flex-1">{renderLeft()}</div>

          {/* Right: steps */}
          <div className="flex-1">
            <div className="max-w-xl mx-auto lg:mx-0">
              <div className="space-y-8">
                {STEPS.map((s) => (
                  <div key={s.id} className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          // user clicked: reset autoplay timer and progress
                          elapsedRef.current = 0
                          setAutoplayProgress(0)
                          setActiveWithAnimation(s.id)
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 text-lg font-bold transition-all ${
                          s.id === active 
                            ? 'active-accent' 
                            : 'bg-white text-gray-600 border-gray-300 hover-accent-border'
                        }`}
                      >
                        {s.id}
                      </button>
                      {s.id < STEPS.length && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-4"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h4 className={`text-xl font-bold mb-2 ${s.id === active ? 'text-gray-900' : 'text-gray-700'}`}>
                        {s.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
