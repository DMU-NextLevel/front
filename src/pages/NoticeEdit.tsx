import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../AxiosInstance'

type NoticeArticle = {
	id: number
	title: string
	content: string
	createdAt: string
	imgs?: string[]
}

function generateEditorContentWithImages(article?: NoticeArticle): string {
	if (!article) return '<p></p>'
	const content = article.content || '<p></p>'
	const imagesHtml = (article.imgs || []).map((src) => `<img src="${src}" />`).join('')
	return `${content}${imagesHtml}`
}

const NoticeEdit: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const { id } = useParams()
	const navigate = useNavigate()
	const location = useLocation()

	const article = location.state?.article as NoticeArticle | undefined

	const [title, setTitle] = useState(article?.title || '')
	const [uploadedImages, setUploadedImages] = useState<File[]>([])

	const editor = useEditor({
		extensions: [StarterKit, Image.configure({ inline: false, allowBase64: true }), Underline, Strike, Blockquote, HorizontalRule],
		content: generateEditorContentWithImages(article),
	})

	useEffect(() => {
		if (!article) {
			alert('게시글 정보를 불러오지 못했습니다.')
			navigate('/notice')
		}
	}, [article, navigate])

	const insertImage = (file: File) => {
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = () => {
			editor?.commands.insertContent(`<img src="${api.defaults.baseURL}img/${reader.result}" data-filename="${fileName}" />`)
			setUploadedImages((prev) => [...prev, file])
		}
		reader.readAsDataURL(file)
	}

	const handleImageUpload = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) insertImage(file)
	}

	const handleSave = async () => {
		if (!editor) return

		const rawContent = editor.getHTML()
		const parser = new DOMParser()
		const doc = parser.parseFromString(rawContent, 'text/html')
		const imgTags = doc.querySelectorAll('img')

		imgTags.forEach((img, index) => {
			const filename = img.getAttribute('data-filename') || `image-${index}.png`
			img.setAttribute('src', '')
			img.removeAttribute('data-filename')
		})

		const processedContent = doc.body.innerHTML

		const formData = new FormData()
		formData.append('title', title)
		formData.append('content', processedContent)

		uploadedImages.forEach((file) => {
			formData.append('imgs', file)
		})

		try {
			console.log('전송 폼 데이터:', formData)
			const res = await api.post(`/admin/notice/${id}`, formData, {
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			if (res.data.message === 'success') {
				alert('공지사항이 성공적으로 수정되었습니다.')
				navigate(`/notice/${id}`, {
					state: { ...article, title, content: processedContent },
				})
			} else {
				alert(`수정 실패: ${res.data.message}`)
			}
		} catch (err) {
			console.error('수정 중 오류:', err)
			alert('수정 중 오류가 발생했습니다.')
		}
	}

	return (
		<div className='max-w-4xl mx-auto mt-10 px-[15%]'>
			<h1 className='text-3xl font-bold mb-10'>공지사항 수정</h1>

			<div className='mb-8'>
				<label htmlFor='title' className='block mb-2.5 text-sm font-semibold text-gray-800'>
					제목
				</label>
				<input
					id='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className='w-full box-border py-3 px-3.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-gray-400'
				/>
			</div>

			<div className='mb-8'>
				<label className='block mb-2.5 text-sm font-semibold text-gray-800'>본문 내용</label>
				<div className='flex flex-wrap gap-2.5 py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-t-lg'>
					<button
						onClick={() => editor?.chain().focus().toggleBold().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('bold') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						<i className='bi bi-type-bold'></i>
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleItalic().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('italic') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						<i className='bi bi-type-italic'></i>
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleUnderline().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('underline') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						<i className='bi bi-type-underline'></i>
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleStrike().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('strike') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						<i className='bi bi-type-strikethrough'></i>
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						H1
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						H2
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						H3
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleBulletList().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('bulletList') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						List
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleBlockquote().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('blockquote') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						Quote
					</button>
					<button
						onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
						className={`py-2 px-3.5 text-sm font-medium border rounded-md cursor-pointer transition-colors duration-200 ${
							editor?.isActive('codeBlock') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
						}`}>
						Code
					</button>
					<button
						onClick={() => editor?.chain().focus().setHorizontalRule().run()}
						className='py-2 px-3.5 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
						구분선
					</button>
					<button
						onClick={handleImageUpload}
						className='py-2 px-3.5 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
						🖼 이미지 삽입
					</button>
					<button
						onClick={() => editor?.chain().focus().undo().run()}
						className='py-2 px-3.5 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
						↺
					</button>
					<button
						onClick={() => editor?.chain().focus().redo().run()}
						className='py-2 px-3.5 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
						↻
					</button>

					<input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
				</div>

				<div className='border border-gray-300 border-t-0 rounded-b-lg bg-white p-4 h-96 overflow-y-auto'>
					<EditorContent
						editor={editor}
						className='w-full h-full [&_.ProseMirror]:min-h-72 [&_.ProseMirror]:outline-none [&_.ProseMirror]:py-2 [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-base [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2.5'
					/>
				</div>
			</div>

			<button
				onClick={handleSave}
				className='mt-10 w-full py-3.5 text-base font-semibold bg-blue-600 text-white border-none rounded-lg cursor-pointer hover:bg-blue-700 active:scale-98 transition-all duration-200'>
				수정 완료
			</button>
		</div>
	)
}

export default NoticeEdit