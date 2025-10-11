import React, { useState, useRef, useEffect } from 'react'
import noImage from '../../../assets/images/noImage.jpg'

type BannerItem = { id: number; title: string; img: string; rate?: number }

const staticItems: BannerItem[] = [
  { id: 1, title: '혁신적인 테크', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', rate: 45 },
  { id: 2, title: '일상 속 혁신', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', rate: 22 },
  { id: 3, title: '패션 & 스타일', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80', rate: 68 },
  { id: 4, title: '뷰티 & 웰빙', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80', rate: 12 },
  { id: 5, title: '창작 & 취미', img: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80', rate: 55 },
  { id: 6, title: '게임 세계', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', rate: 80 },
  { id: 7, title: '교육 & 미래', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', rate: 30 },
  { id: 8, title: '반려동물 친구', img: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80', rate: 40 },
  { id: 9, title: '여행 & 모험', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80', rate: 18 },
  { id: 10, title: '맛있는 발견', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', rate: 62 },
]

const AnimatedBanner: React.FC = () => {
  const items = staticItems
  const count = items.length
  // Scattered positions for 10 bubbles (non-circular). Each entry can set size and labelSide.
  // x,y are offsets from center (px). labelSide: 'left'|'right'|'top'|'bottom'
  const basePositions = [
    { x: -570, y: -150, size: 200, labelSide: 'right', angle: -8 },
    { x: -440, y: -40, size: 150, labelSide: 'bottom', angle: -18 },
    { x: -270, y: -200, size: 140, labelSide: 'left', angle: 12 },
    { x: 90, y: -180, size: 160, labelSide: 'left', angle: -6 },
    { x: 310, y: -250, size: 150, labelSide: 'left', angle: 10 },
    { x: 570, y: -20, size: 170, labelSide: 'left', angle: 4 },
    { x: 470, y: 80, size: 180, labelSide: 'top', angle: -12 },
    { x: 250, y: 150, size: 160, labelSide: 'top', angle: 6 },
    { x: -90, y: 220, size: 170, labelSide: 'right', angle: -4 },
    { x: -590, y: 80, size: 180, labelSide: 'right', angle: 14 },
  ]

  const orbitRef = useRef<HTMLDivElement | null>(null)
  const [displayPositions, setDisplayPositions] = useState(basePositions)

  // clamp helper
  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v))
  }

  useEffect(() => {
    function update() {
      const el = orbitRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const halfW = rect.width / 2
      const halfH = rect.height / 2
      const margin = 24 // keep some padding from edges
      const adjusted = basePositions.map((p) => {
        const size = p.size || 140
        const maxX = Math.max(halfW - size / 2 - margin, 0)
        const maxY = Math.max(halfH - size / 2 - margin, 0)
        return {
          ...p,
          x: clamp(p.x, -maxX, maxX),
          y: clamp(p.y, -maxY, maxY),
        }
      })
      setDisplayPositions(adjusted)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return (
    <div className="w-full bg-cover bg-center bg-no-repeat rotating-background" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 80%), url(/banner-bg.jpg)', filter: 'grayscale(70%)' }}>
      <div className="relative w-full py-0">
        <style>{`
          .orbit-wrap { position: relative; width: 100%; height: 750px; overflow: hidden; }
          .center-block { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 720px; height: auto; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index: 10 }
          .center-inner { text-align:center }
          .center-inner h2 { font-size: 48px; line-height:1.02; font-weight:800; color:#ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
          .center-inner p { color:#ffffff; margin-top:12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

          .tag-pill { background:#f8fafc; color:#065f46; padding:6px 12px; border-radius:999px; font-weight:600; font-size:13px; box-shadow:0 2px 6px rgba(2,6,23,0.06) }
          .tag-pill-inline { background:#f3f4f6; color:#374151; padding:6px 10px; border-radius:6px; font-weight:700; font-size:13px; box-shadow:0 8px 20px rgba(2,6,23,0.06); white-space:nowrap; display:inline-block; transform-origin: center left; pointer-events:auto; position:relative; border:1px solid rgba(15,23,42,0.04) }
          .tag-pill-inline::after { content:''; position:absolute; left:-6px; top:50%; width:10px; height:10px; transform:translateY(-50%); background:#f3f4f6; border-radius:2px; box-shadow:0 3px 6px rgba(2,6,23,0.04); }
          .tag-draggable { position:absolute; background:transparent; color:#fff; user-select:none; touch-action:none; cursor:grab; display:inline-flex; align-items:center; justify-content:center; width:160px; height:160px }
          .tag-draggable:active { cursor:grabbing }
          .tag-back-img { width:160px; height:160px; border-radius:9999px; object-fit:cover; box-shadow:0 18px 40px rgba(2,6,23,0.12); border:12px solid rgba(16,185,129,0.14); display:block }
          .tag-label { position:absolute; color:#ffffff; font-weight:900; font-size:16px; text-shadow:0 10px 26px rgba(2,6,23,0.22); pointer-events:none; text-align:center }

          /* static layout - elliptical orbits like Saturn's rings */
          .track { display:block; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%) rotate(-15deg); width:1200px; height:400px; border:1px solid rgba(16,185,129,0.1); border-radius:50%; pointer-events:none; opacity:0.6 }
          .track.track-2 { width:1000px; height:350px; border-color:rgba(16,185,129,0.08); opacity:0.4 }
          .track.track-3 { width:800px; height:300px; border-color:rgba(16,185,129,0.06); opacity:0.3 }
          .orb-item { position:absolute; left:50%; top:50%; transform-origin:0 0; animation: orbit 20s linear infinite }
          .bubble { width:120px; height:120px; border-radius:9999px; display:flex; align-items:center; justify-content:center; background:#fff; box-shadow: 0 8px 28px rgba(2,6,23,0.06); position:relative; overflow:hidden; opacity:1; z-index:1; transition: all 0.3s ease; cursor:pointer }
          .bubble:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(2,6,23,0.15); }
          .bubble img { width:100%; height:100%; object-fit:cover; border-radius:9999px; display:block; transition: transform 0.3s ease; }
          .bubble:hover img { transform: scale(1.05); }

          .ring { position:absolute; inset:0; border-radius:9999px; padding:6px; box-sizing:content-box; pointer-events:none }
          .ring .ring-inner { width:100%; height:100%; border-radius:9999px; background: conic-gradient(#10b981 var(--deg, 120deg), rgba(229,231,235,0.45) var(--deg, 120deg)); }

          /* interactive animations */
          .interactive-bubble { animation: float 6s ease-in-out infinite; }
          .interactive-bubble:nth-child(2) { animation-delay: -1s; }
          .interactive-bubble:nth-child(3) { animation-delay: -2s; }
          .interactive-bubble:nth-child(4) { animation-delay: -3s; }
          .interactive-bubble:nth-child(5) { animation-delay: -4s; }

          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }

          .bubble-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9)); opacity: 0; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 9999px; }
          .bubble:hover .bubble-overlay { opacity: 1; }

          .bubble-title { color: white; font-weight: 700; font-size: 14px; text-align: center; margin-bottom: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
          .bubble-rate { color: white; font-weight: 600; font-size: 12px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px; }

                    .bubble-ring { position: absolute; inset: -4px; border: 2px solid transparent; border-radius: 9999px; background: linear-gradient(45deg, #10b981, #059669) border-box; opacity: 0; transition: opacity 0.3s ease; }
          .bubble:hover .bubble-ring { opacity: 0.6; }

          /* subtle background animation */
          .rotating-background {
            animation: subtle-pulse 8s ease-in-out infinite;
            transform-origin: center;
          }

          @keyframes subtle-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
          }

          @media (max-width: 768px) {
            .center-inner h2 { font-size: 24px }
            .center-inner p { font-size: 14px }
            .orbit-wrap { height: 900px }
            .tag-pill-inline { font-size:12px; padding:5px 10px }
          }
        `}</style>

  <div className="orbit-wrap" ref={orbitRef}>
          {/* Orbit details in the background */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
            {/* Two circular orbits with dashed style */}
            <circle cx="50%" cy="50%" r="300" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="2.5" strokeDasharray="15,10" opacity="0.8" />
            <circle cx="50%" cy="50%" r="200" fill="none" stroke="rgba(147,51,234,0.2)" strokeWidth="2" strokeDasharray="12,8" opacity="0.7" />
          </svg>

          {/* static layout - no dynamic tags */}

          <div className="center-block">
            <div className="center-inner">
              <h2>당신의 아이디어가 세상을 바꿉니다</h2>
              <p className="mt-4">함께 꿈을 현실로 만들어가는 곳</p>
              <p className="mt-6 text-lg text-white max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                몇 분 안에 시작하세요. 유용한 새 도구를 사용하면 그 어느 때보다 쉽게 ​​완벽한 제목을 선택하고, 매력적인 스토리를 쓰고, 전 세계와 공유할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Static bubbles with interactive animations */}
          {displayPositions.map((pos, idx) => {
            const item = staticItems[idx]
            const size = pos.size || 140

            return (
              <div
                key={`static-${item.id}`}
                className="interactive-bubble"
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${idx * 0.2}s`
                }}
              >
                <div
                  className="bubble"
                  style={{
                    width: size,
                    height: size,
                    position: 'relative',
                    transform: `rotate(${pos.angle || 0}deg)`
                  }}
                >
                  <img src={item.img} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px', filter: 'grayscale(0%)' }} />
                  <div className="bubble-overlay">
                    <div className="bubble-title">{item.title}</div>
                    <div className="bubble-rate">{item.rate}%</div>
                  </div>
                  <div className="bubble-ring"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AnimatedBanner