import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as BaseImage } from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TextStyle from '@tiptap/extension-text-style'
import { Mark, mergeAttributes } from '@tiptap/core'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useUserRole } from '../hooks/useUserRole'
import { api } from '../AxiosInstance'

// ✅ CustomImage 확장 (data-filename 유지)
const CustomImage = BaseImage.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			'data-filename': {
				default: null,
				parseHTML: (element) => element.getAttribute('data-filename'),
				renderHTML: (attributes) => {
					if (!attributes['data-filename']) return {}
					return {
						'data-filename': attributes['data-filename'],
					}
				},
			},
		}
	},
})

// ✅ 폰트 사이즈 Mark
const FontSize = Mark.create({
	name: 'fontSize',

	addAttributes() {
		return {
			fontSize: {
				default: null,
				parseHTML: element => element.style.fontSize,
				renderHTML: attributes => {
					if (!attributes.fontSize) return {}
					return {
						style: `font-size: ${attributes.fontSize}`,
					}
				},
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'span[style*="font-size"]',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes), 0]
	},
})

// ✅ 텍스트 색상 Mark
const TextColor = Mark.create({
	name: 'textColor',

	addAttributes() {
		return {
			color: {
				default: null,
				parseHTML: element => element.style.color,
				renderHTML: attributes => {
					if (!attributes.color) return {}
					return {
						style: `color: ${attributes.color}`,
					}
				},
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'span[style*="color"]',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes), 0]
	},
})

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
	const { role, loading } = useUserRole()

	const article = location.state?.article as NoticeArticle | undefined

	const [title, setTitle] = useState(article?.title || '')
	const [uploadedImages, setUploadedImages] = useState<{ file: File; name: string }[]>([])
	const [currentFontSize, setCurrentFontSize] = useState<string>('16px')
	const [currentColor, setCurrentColor] = useState<string>('#000000')

	const editor = useEditor({
		extensions: [
			StarterKit,
			CustomImage.configure({ inline: false, allowBase64: true }),
			Underline,
			Strike,
			TextStyle,
			FontSize,
			TextColor,
			HorizontalRule,
		],
		content: generateEditorContentWithImages(article),
	})

	useEffect(() => {
		if (!article) {
			alert('게시글 정보를 불러오지 못했습니다.')
			navigate('/notice')
		}
	}, [article, navigate])

	const executeCommand = (command: () => void) => {
		try {
			command()
		} catch (error) {
			console.error('Editor command failed:', error)
		}
	}

	const changeTextSize = (size: string) => {
		setCurrentFontSize(size)
		executeCommand(() => {
			const { from, to } = editor?.state.selection || { from: 0, to: 0 }
			editor?.chain().focus().setMark('fontSize', { fontSize: size }).setTextSelection({ from, to }).run()
		})
	}

	const changeTextColor = (color: string) => {
		setCurrentColor(color)
		executeCommand(() => {
			const { from, to } = editor?.state.selection || { from: 0, to: 0 }
			editor?.chain().focus().setMark('textColor', { color }).setTextSelection({ from, to }).run()
		})
	}

	const insertImage = (file: File) => {
		const fileName = file.name
		const reader = new FileReader()
		reader.onload = () => {
			editor?.commands.insertContent(`<img src="${reader.result}" data-filename="${fileName}" />`)
			setUploadedImages((prev) => [...prev, { file, name: fileName }])
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

		uploadedImages.forEach(({ file }) => {
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

	// 로딩 중이면 로딩 표시
	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-lg text-gray-600">로딩중...</div>
			</div>
		)
	}

	// 권한이 없으면 접근 거부
	if (role !== 'ADMIN') {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
					<p className="text-gray-600 mb-6">공지사항 수정은 관리자만 가능합니다.</p>
					<button 
						onClick={() => window.history.back()} 
						className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
					>
						돌아가기
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen'>
			{/* Header Section */}
			<div className='mb-8'>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-3xl font-bold text-gray-900'>공지사항 수정</h1>
				</div>
				<hr className='border-gray-200' />
			</div>

			{/* Form Section */}
			<div className='bg-white'>
				{/* Title Input */}
				<div className='mb-8'>
					<label htmlFor='title' className='block mb-3 text-lg font-semibold text-gray-900'>
						제목
					</label>
					<input
						id='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='공지 제목을 입력하세요'
						className='w-full py-4 px-4 text-base bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200'
					/>
				</div>

				{/* Content Editor */}
				<div className='mb-8'>
					<label className='block mb-3 text-lg font-semibold text-gray-900'>본문 내용</label>
					
					{/* Toolbar */}
					<div className='flex flex-wrap gap-2 p-4 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0'>
						<button
							type='button'
							onClick={() => executeCommand(() => editor?.chain().focus().toggleBold().run())}
							className={`flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
								editor?.isActive('bold') 
									? 'bg-blue-600 text-white border-blue-600 shadow-md' 
									: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
							}`}
							title="굵게">
							<span className='font-bold'>B</span>
						</button>
						<button
							type='button'
							onClick={() => executeCommand(() => editor?.chain().focus().toggleItalic().run())}
							className={`flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
								editor?.isActive('italic') 
									? 'bg-blue-600 text-white border-blue-600 shadow-md' 
									: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
							}`}
							title="기울임">
							<span className='italic'>I</span>
						</button>
						<button
							type='button'
							onClick={() => executeCommand(() => editor?.chain().focus().toggleUnderline().run())}
							className={`flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
								editor?.isActive('underline') 
									? 'bg-blue-600 text-white border-blue-600 shadow-md' 
									: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
							}`}
							title="밑줄">
							<span className='underline'>U</span>
						</button>
						<button
							type='button'
							onClick={() => executeCommand(() => editor?.chain().focus().toggleStrike().run())}
							className={`flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
								editor?.isActive('strike') 
									? 'bg-blue-600 text-white border-blue-600 shadow-md' 
									: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
							}`}
							title="취소선">
							<span className='line-through'>S</span>
						</button>
						
						<div className='w-px h-10 bg-gray-200 mx-2'></div>
						
						{/* 텍스트 사이즈 버튼들 */}
						<div className="flex items-center space-x-1">
							<span className="text-xs text-gray-500 mr-2">크기</span>
							{['12px', '14px', '16px', '18px', '20px', '24px'].map((size) => (
								<button
									key={size}
									type="button"
									onClick={() => changeTextSize(size)}
									className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
										currentFontSize === size
											? 'bg-blue-600 text-white border-blue-600 shadow-md'
											: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
									}`}
									title={`글자 크기 ${size}`}
								>
									{size}
								</button>
							))}
						</div>

						<div className="w-px h-10 bg-gray-200 mx-2"></div>

						{/* 색상 팔레트 버튼들 */}
						<div className="flex items-center space-x-1">
							<span className="text-xs text-gray-500 mr-2">색상</span>
							{[
								{ color: '#000000', name: '검정' },
								{ color: '#ef4444', name: '빨강' },
								{ color: '#3b82f6', name: '파랑' },
								{ color: '#22c55e', name: '초록' },
								{ color: '#f59e0b', name: '노랑' },
								{ color: '#8b5cf6', name: '보라' },
								{ color: '#ec4899', name: '분홍' },
								{ color: '#6b7280', name: '회색' }
							].map(({ color, name }) => (
								<button
									key={color}
									type="button"
									onClick={() => changeTextColor(color)}
									className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
										currentColor === color
											? 'border-gray-800 shadow-lg scale-110'
											: 'border-gray-300 hover:border-gray-500 hover:scale-105'
									}`}
									style={{ backgroundColor: color }}
									title={`글자 색상: ${name}`}
								/>
							))}
						</div>

						<div className='w-px h-10 bg-gray-200 mx-2'></div>
						

						
						
						<button
							type='button'
							onClick={() => {
								console.log('Horizontal rule button clicked');
								console.log('Editor available:', !!editor);
								executeCommand(() => editor?.chain().focus().setHorizontalRule().run());
							}}
							className='flex items-center justify-center w-10 h-10 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
							title="구분선">
							—
						</button>
						<button
							type='button'
							onClick={() => {
								console.log('Image upload button clicked');
								handleImageUpload();
							}}
							className='flex items-center justify-center w-10 h-10 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
							title="이미지 업로드">
							📷
						</button>
						
						<div className='w-px h-10 bg-gray-200 mx-2'></div>
						
						<button
							type='button'
							onClick={() => {
								console.log('Undo button clicked');
								console.log('Editor available:', !!editor);
								executeCommand(() => editor?.chain().focus().undo().run());
							}}
							className='flex items-center justify-center w-10 h-10 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
							title="실행 취소">
							↶
						</button>
						<button
							type='button'
							onClick={() => {
								console.log('Redo button clicked');
								console.log('Editor available:', !!editor);
								executeCommand(() => editor?.chain().focus().redo().run());
							}}
							className='flex items-center justify-center w-10 h-10 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
							title="다시 실행">
							↷
						</button>

						<input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
					</div>

					{/* Editor Content */}
					<div className='border border-gray-200 rounded-b-lg bg-white'>
						<EditorContent
							editor={editor}
							className='min-h-96 p-6 
								[&_.ProseMirror]:min-h-80 [&_.ProseMirror]:outline-none [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-base 
								[&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_img]:border [&_img]:border-gray-200
								[&_span[style*="font-size"]]:inline
								[&_span[style*="color"]]:inline'
						/>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='flex items-center justify-between pt-8 border-t border-gray-200'>
					<button
						onClick={() => window.history.back()}
						className='inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
						</svg>
						취소
					</button>
					
					<button
						onClick={handleSave}
						className='inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
						</svg>
						공지사항 수정
					</button>
				</div>
			</div>
		</div>
	)
}

export default NoticeEdit