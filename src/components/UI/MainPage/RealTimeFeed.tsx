import React, { useEffect, useRef, useState } from 'react'

// 아이콘 컴포넌트
const FeedIcon = ({ type }: { type: string }) => {
	const getIconStyle = (color: string) => ({
		backgroundColor: `${color}15`,
	})

	switch (type) {
		case 'donation':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#FF5722')}>
					🔥
				</span>
			)
		case 'new':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#4CAF50')}>
					✨
				</span>
			)
		case 'deadline':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#FF9800')}>
					⏰
				</span>
			)
		case 'milestone':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#9C27B0')}>
					🎉
				</span>
			)
		case 'achievement':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#2196F3')}>
					📈
				</span>
			)
		case 'popular':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#E91E63')}>
					❤️
				</span>
			)
		case 'update':
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#607D8B')}>
					📝
				</span>
			)
		default:
			return (
				<span className='text-lg mr-2.5 flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0' style={getIconStyle('#795548')}>
					📌
				</span>
			)
	}
}

// 피드 아이템 타입 정의
interface FeedItem {
	id: number
	type: string
	message: string
	timestamp: Date
}

const RealTimeFeed: React.FC = () => {
	const [feeds, setFeeds] = useState<FeedItem[]>([
		{ id: 1, type: 'donation', message: "사용자 민준님이 프로젝트 '꿈꾸는 바다'에 50,000원 후원!", timestamp: new Date() },
		{ id: 2, type: 'new', message: "새로운 프로젝트 '도시 정원 가꾸기' 등록 완료!", timestamp: new Date() },
		{ id: 3, type: 'deadline', message: "프로젝트 '움직이는 그림책' 마감까지 3시간 남음!", timestamp: new Date() },
		{ id: 4, type: 'milestone', message: "프로젝트 '친환경 텀블러'의 첫번째 후원자가 등장했어요!", timestamp: new Date() },
		{ id: 5, type: 'achievement', message: "프로젝트 '제주 바다 지키기' 목표치 120% 달성!", timestamp: new Date() },
		{ id: 6, type: 'popular', message: "지금 인기 급상승! '영화 제작 프로젝트'를 확인해보세요", timestamp: new Date() },
		{ id: 7, type: 'update', message: "프로젝트 '친환경 패키지'가 새 소식을 업데이트했어요", timestamp: new Date() },
		{ id: 8, type: 'donation', message: "사용자 지수님이 프로젝트 '음악 교실'에 30,000원 후원!", timestamp: new Date() },
		{ id: 9, type: 'milestone', message: "프로젝트 '동물 보호소'가 100번째 후원자를 맞이했어요!", timestamp: new Date() },
		{ id: 10, type: 'new', message: "주목할 만한 신규 프로젝트 '미래 기술 전시회' 오픈!", timestamp: new Date() },
		{ id: 11, type: 'popular', message: "오늘의 HOT 프로젝트: '전통 공예 살리기'", timestamp: new Date() },
		{ id: 12, type: 'achievement', message: "프로젝트 '어린이 도서관'이 목표 금액 달성까지 98% 진행 중!", timestamp: new Date() },
	])

	const listRef = useRef<HTMLUListElement>(null)
	const [isPaused, setIsPaused] = useState(false)

	useEffect(() => {
		// 시간 경과에 따라 새 피드 추가하는 시뮬레이션 (실제 서비스에서는 WebSocket 등으로 대체)
		const interval = setInterval(() => {
			if (!isPaused) {
				const newTypes = ['donation', 'new', 'deadline', 'milestone', 'achievement', 'popular', 'update']
				const newMessages = [
					"사용자 서연님이 프로젝트 '유기견 보호소'에 후원했어요!",
					"프로젝트 '독립 영화제'가 마감 임박! 지금 확인하세요",
					"축하합니다! '청년 창업 지원' 프로젝트가 목표 달성!",
					"새로운 프로젝트 '가상현실 체험관'이 론칭했어요",
					"프로젝트 '도시 숲 만들기'에 100번째 후원자 등장!",
					"지금 주목받는 프로젝트 '전통 음식 보존하기'",
					"사용자 현우님이 프로젝트 '환경 다큐멘터리'에 후원!",
				]

				const randomType = newTypes[Math.floor(Math.random() * newTypes.length)]
				const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)]

				setFeeds((prev) => [
					...prev,
					{
						id: Date.now(),
						type: randomType,
						message: randomMessage,
						timestamp: new Date(),
					},
				])
			}
		}, 5000) // 5초마다 새 피드 추가

		return () => clearInterval(interval)
	}, [isPaused])

	// 현재 시간 기준 상대적 시간 표시 함수
	const getRelativeTime = (date: Date) => {
		const now = new Date()
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

		if (diffInSeconds < 60) return '방금 전'
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
		return `${Math.floor(diffInSeconds / 86400)}일 전`
	}

	return (
		<div className='bg-white border border-indigo-100 rounded-2xl p-5 my-8 shadow-lg relative overflow-hidden h-40'>
			<div className='flex justify-between items-center mb-4'>
				<h3 className='text-xl font-bold text-gray-800 m-0'>실시간 피드</h3>
				<span className='text-base cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100 hover:rotate-180'>🔄</span>
			</div>
			<div className='h-45 overflow-hidden relative' onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
				<ul ref={listRef} className={`list-none m-0 p-0 animate-scroll-up ${isPaused ? '[animation-play-state:paused]' : '[animation-play-state:running]'}`}>
					{feeds.map((feed) => (
						<li key={feed.id} className='py-3 px-2 flex items-start transition-all duration-200 rounded-lg mb-1 hover:bg-slate-50 hover:translate-x-1'>
							<FeedIcon type={feed.type} />
							<div className='flex flex-col flex-1'>
								<p className='m-0 text-sm font-medium text-gray-700 leading-snug'>{feed.message}</p>
								<span className='text-xs text-gray-400 mt-0.5'>{getRelativeTime(feed.timestamp)}</span>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none'></div>
		</div>
	)
}

export default RealTimeFeed
