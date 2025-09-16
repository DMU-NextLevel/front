import React, { useEffect, useState } from 'react'
import { useUserRole } from '../hooks/useUserRole'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../AxiosInstance'

type NoticeArticle = {
	id: number
	title: string
	content: string
	createdAt: string
	imgs?: string[]
}

const NoticeDetail: React.FC = () => {
	const { role, loading: roleLoading } = useUserRole()
	const { id } = useParams<{ id: string }>()
	const location = useLocation()
	const navigate = useNavigate()

	const article = location.state as NoticeArticle | undefined

	const formatDate = (isoDate: string) => {
		const d = new Date(isoDate)
		return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
	}

	if (!article) {
		return <div className='max-w-4xl mx-auto p-8'>공지 정보를 불러올 수 없습니다.</div>
	}

	//삭제 함수
	const handleDelete = async () => {
		if (!id) return
		console.log(id)
		const confirm = window.confirm('정말 삭제하시겠습니까?')
		if (!confirm) return

		try {
			const res = await api.post(`/admin/notice/${id}`)
			if (res.data.message === 'success') {
				alert('삭제가 완료되었습니다.')
				navigate('/notice')
			} else {
				alert('삭제 실패: ' + res.data.message)
			}
		} catch (err) {
			console.error('삭제 중 오류:', err)
			alert('삭제 중 오류가 발생했습니다.')
		}
	}
	// 🧩 이미지 삽입된 content HTML에 실제 이미지 경로 삽입
	const getProcessedContent = () => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(article.content, 'text/html')
		const imgTags = doc.querySelectorAll('img')

		imgTags.forEach((img, idx) => {
			if (article.imgs && article.imgs[idx]) {
				img.setAttribute('src', `${api.defaults.baseURL}img/${article.imgs[idx]}`)
			}
		})

		return { __html: doc.body.innerHTML }
	}

	return (
		<div className='max-w-4xl mx-auto p-8'>
			<h1 className='text-xl font-bold mb-3'>{article.title}</h1>
			<div className='flex gap-3 mb-6 border-b border-gray-200 justify-between'>
				<div className='flex items-center gap-3 text-sm text-gray-500 mb-3'>
					{article.imgs && article.imgs.length > 0 && <img src={`https://placehold.co/80x80?text=WU`} alt='작성자 이미지' className='w-8 h-8 rounded-full object-cover' />}
					<span>위드유</span>
					<span>{formatDate(article.createdAt)}</span>
				</div>

				{!roleLoading && role === 'ADMIN' && (
					<div className='flex gap-2'>
						<div
							className='py-2 px-3 text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors duration-200'
							onClick={() =>
								navigate(`/notice/edit/${article.id}`, {
									state: {
										article,
									},
								})
							}>
							수정
						</div>
						<div className='py-2 px-3 text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors duration-200' onClick={() => handleDelete()}>
							삭제
						</div>
					</div>
				)}
			</div>

			<div className='my-10' dangerouslySetInnerHTML={getProcessedContent()} />
			<hr className='my-10 border-gray-200' />
			{
				// 원본 content 보여주기
				/* <Content>{article.content}</Content> */
			}

			<button
				className='mt-10 bg-gray-50 border border-gray-300 py-2.5 px-5 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-200'
				onClick={() => navigate('/notice')}>
				목록으로 돌아가기
			</button>
		</div>
	)
}

export default NoticeDetail
