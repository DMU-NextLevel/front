import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Modal from '../../layout/Modal'
import NoticeModal from './modals/NoticeModal'
import { useNoticeDelete } from '../../../apis/funding/useNoticeFetch'

interface NewsContentProps {
	title: string
	content: string
	id: number
	createTime: string
	img: {
		id: number
		uri: string
	}
}

const baseUrl = process.env.REACT_APP_API_BASE_URL

const NewsContent: React.FC<NewsContentProps> = ({ title, content, id, createTime, img }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
	const { deleteNotice } = useNoticeDelete()

	const handleClick = () => {
		setIsOpen((prev) => !prev)
	}

	const handleDelete = async () => {
		await deleteNotice({ noticeId: String(id) })
		setDeleteModalOpen(false)
		window.location.reload()
	}

	return (
		<div className='w-full mb-4 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg'>
			<div
				className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${
					isOpen ? 'bg-purple-50 border-b border-purple-100' : 'bg-white hover:bg-gray-50'
				}`}
				onClick={handleClick}>
				<div>
					<h3 className='text-lg font-semibold text-gray-800 pr-4 leading-relaxed'>{title}</h3>
					<p className='text-sm text-gray-500'>{createTime.split('T')[0]}</p>
				</div>
				<div className='flex items-center gap-4'>
					<button
						className='text-gray-500 hover:text-purple-700'
						onClick={(e) => {
							e.stopPropagation()
							setEditModalOpen(true)
						}}>
						수정
					</button>
					<button
						className='text-gray-500 hover:text-red-700'
						onClick={(e) => {
							e.stopPropagation()
							setDeleteModalOpen(true)
						}}>
						삭제
					</button>
					<div className='flex-shrink-0'>
						{isOpen ? (
							<ChevronUp className='w-5 h-5 text-purple-500 transition-transform duration-200' />
						) : (
							<ChevronDown className='w-5 h-5 text-gray-400 transition-transform duration-200' />
						)}
					</div>
				</div>
			</div>
			{isOpen && (
				<div className='px-4 py-4 bg-gray-50'>
					<div className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{content}</div>
					{img && (
						<div className='flex flex-wrap gap-2'>
							<img src={`${baseUrl}/img/${img.uri}`} className='max-w-[400px]' alt='' />
						</div>
					)}
				</div>
			)}

			{deleteModalOpen && (
				<Modal onClose={() => setDeleteModalOpen(false)}>
					<div className='bg-white rounded-xl p-6 w-[400px] max-w-2xl max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center gap-4'>
							<h2 className='text-xl font-bold'>공지를 삭제하시겠습니까?</h2>
							<button onClick={() => setDeleteModalOpen(false)} className='text-gray-500 hover:text-gray-700 text-2xl'>
								×
							</button>
						</div>
						<button onClick={handleDelete} className='bg-red-500 hover:bg-red-600 transition-all duration-200 text-white px-4 py-2 rounded-md w-full mt-12'>
							삭제
						</button>
					</div>
				</Modal>
			)}

			<NoticeModal
				isOpen={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				mode='edit'
				editData={{
					id: id,
					title: title,
					content: content,
					img: null,
				}}
			/>
		</div>
	)
}

export default NewsContent
