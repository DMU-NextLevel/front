import { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import { useFeedDelete } from '../../../apis/social/useFeedFetch'
import { useFeedModalStore } from '../../../store/useFeedModalStore'
import Swal from 'sweetalert2'

interface SocialFeedMenuProps {
	feedId: number
	content: string
	images: string[]
}

export const SocialFeedMenu = ({ feedId, content, images }: SocialFeedMenuProps) => {
	const [showMenu, setShowMenu] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const { deleteFeed } = useFeedDelete()
	const { openEditModal } = useFeedModalStore()

	const handleEdit = () => {
		openEditModal(feedId, content, images)
		setShowMenu(false)
	}

	const handleDelete = async () => {
		const confirmResult = await Swal.fire({
			title: '정말 삭제하시겠습니까？',
			icon: 'warning',
			confirmButtonColor: '#a666ff',
			cancelButtonColor: '#9e9e9e',
			cancelButtonText: '취소',
			confirmButtonText: '확인',
		})
		if (confirmResult.isConfirmed) {
			await deleteFeed({ socialId: feedId })
			window.location.reload()
		}
		setShowMenu(false)
	}

	// 외부 클릭 시 메뉴 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowMenu(false)
			}
		}

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showMenu])

	return (
		<div className='relative' ref={menuRef}>
			<button onClick={() => setShowMenu(!showMenu)} className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'>
				<MoreVertical className='w-5 h-5 text-gray-600' />
			</button>

			{/* 드롭다운 메뉴 */}
			{showMenu && (
				<div className='absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-32 z-10 animate-fadeIn'>
					<button
						onClick={handleEdit}
						className='w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
							/>
						</svg>
						수정
					</button>
					<button onClick={handleDelete} className='w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
						삭제
					</button>
				</div>
			)}
		</div>
	)
}

