import React from 'react'

interface SidebarProps {
	activeTab: '서포터' | '메이커'
	setActiveTab: (tab: '서포터' | '메이커') => void
	userInfo: any
	profileImage: string | null
	onOpenSettings: () => void
	onOpenRecent: () => void
	onOpenPoint: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userInfo, profileImage, onOpenSettings, onOpenRecent, onOpenPoint }) => {
	return (
		<aside className='w-65 bg-white py-7 px-5 border-r border-gray-200'>
			{/* 탭 버튼 */}
			<div className='flex w-full mb-7'>
				<button
					className={`flex-1 py-2 px-4 border-none rounded-2xl font-bold cursor-pointer transition-colors duration-200 ${
						activeTab === '서포터' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
					}`}
					onClick={() => setActiveTab('서포터')}>
					서포터
				</button>
				<button
					className={`flex-1 py-2 px-4 border-none rounded-2xl font-bold cursor-pointer transition-colors duration-200 ${
						activeTab === '메이커' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
					}`}
					onClick={() => setActiveTab('메이커')}>
					메이커
				</button>
			</div>

			{/* 프로필 섹션 */}
			<div className='text-center my-7'>
				<img src={profileImage || 'https://via.placeholder.com/100'} alt='프로필' className='w-[105px] h-[105px] rounded-full object-cover mx-auto' />
				<div className='font-bold my-2.5 text-base'>{userInfo.name}</div>
				<button className='py-1.5 px-3.5 rounded-2xl border border-gray-300 bg-white text-xs cursor-pointer hover:bg-gray-50' onClick={onOpenSettings}>
					설정
				</button>
			</div>

			{/* 메뉴 섹션 */}
			<div className='mb-6'>
				<div className='text-sm font-semibold text-gray-800 mb-3 pl-1'>서포터 메뉴</div>
				<div className='flex flex-col gap-2'>
					<button
						className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'
						onClick={onOpenRecent}>
						최근 본 프로젝트
					</button>
					<button
						className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'
						onClick={onOpenPoint}>
						포인트 충전
					</button>
					<button
						className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						좋아요
					</button>
					<button
						className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						팔로잉
					</button>
					<button
						className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						펀딩목록
					</button>
				</div>
			</div>

			{/* 메이커 메뉴 */}
			{activeTab === '메이커' && (
				<div className='flex flex-col gap-2'>
					<button className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						내 프로젝트
					</button>
					<button className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						정산 관리
					</button>
					<button className='w-full py-3 px-4 border-none bg-transparent text-left text-sm text-gray-600 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-800'>
						문의 답변
					</button>
				</div>
			)}
		</aside>
	)
}

export default Sidebar
