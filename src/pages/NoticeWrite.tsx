import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as BaseImage } from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TextStyle from '@tiptap/extension-text-style'
import { Mark, mergeAttributes } from '@tiptap/core'
import { useUserRole } from '../hooks/useUserRole'
import { api } from '../AxiosInstance'
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

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

const NoticeWrite: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	// ✅ 파일 + 이름 같이 저장
	const [uploadedImages, setUploadedImages] = useState<{ file: File; name: string }[]>([])
	// 현재 적용할 스타일 상태
	const [currentFontSize, setCurrentFontSize] = useState('')
	const [currentColor, setCurrentColor] = useState('')
	const { role, loading } = useUserRole()

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // 헤딩 기능 비활성화
			}),
			CustomImage.configure({
				inline: false,
				allowBase64: true
			}),
			Underline,
			Strike,
			Blockquote,
			HorizontalRule,
			TextStyle, // 기본 TextStyle 유지
			FontSize,  // 커스텀 폰트 사이즈 Mark
			TextColor, // 커스텀 색상 Mark
		],
		content: '',
		editorProps: {
			attributes: {
				class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
			},
		},
		parseOptions: {
			preserveWhitespace: 'full',
		},
		onCreate: ({ editor }) => {
			// Editor created
		},
		onUpdate: ({ editor }) => {
			// Editor updated
		},
	})

	// 에디터 명령 실행 함수들
	const executeCommand = (command: () => any) => {
		if (!editor) {
			return;
		}
		try {
			const result = command();
			return result;
		} catch (error) {
			console.error('Editor command failed:', error);
		}
	}

	// 텍스트 색상 변경 함수
	const changeTextColor = (color: string) => {
		if (!editor) {
			return;
		}

		const { from, to } = editor.state.selection

		if (from === to) {
			// 선택된 텍스트가 없으면 다음에 입력할 텍스트의 색상을 설정
			setCurrentColor(color)
			if (color) {
				editor.chain().focus().setMark('textColor', { color }).run()
			} else {
				editor.chain().focus().unsetMark('textColor').run()
			}
		} else {
			// 선택된 텍스트가 있으면 해당 텍스트의 색상을 변경
			if (color) {
				editor.chain().focus().setMark('textColor', { color }).run()
			} else {
				editor.chain().focus().unsetMark('textColor').run()
			}
		}
	}

	// 텍스트 사이즈 변경 함수
	const changeTextSize = (size: string) => {
		if (!editor) {
			return;
		}

		const { from, to } = editor.state.selection

		if (from === to) {
			// 선택된 텍스트가 없으면 다음에 입력할 텍스트의 크기를 설정
			setCurrentFontSize(size)
			if (size) {
				editor.chain().focus().setMark('fontSize', { fontSize: size }).run()
			} else {
				editor.chain().focus().unsetMark('fontSize').run()
			}
		} else {
			// 선택된 텍스트가 있으면 해당 텍스트의 크기를 변경
			if (size) {
				editor.chain().focus().setMark('fontSize', { fontSize: size }).run()
			} else {
				editor.chain().focus().unsetMark('fontSize').run()
			}
		}
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
		const title = (document.getElementById('title') as HTMLInputElement)?.value
		const rawContent = editor?.getHTML()

		if (!title || !rawContent) {
			Swal.fire({
				title: '경고',
				text: '제목과 내용을 모두 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (role !== 'ADMIN' && !loading) {
			Swal.fire({
				title: '경고',
				text: '관리자만 공지사항을 작성할 수 있습니다.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		const parser = new DOMParser()
		const doc = parser.parseFromString(rawContent, 'text/html')
		const imgTags = doc.querySelectorAll('img')

		const usedFilenames: string[] = []

		imgTags.forEach((img, index) => {
			const filename = img.getAttribute('data-filename') || `image-${index}.png`
			usedFilenames.push(filename)
			img.setAttribute('src', '')
			img.removeAttribute('data-filename')
		})

		const finalContent = doc.body.innerHTML

		const formData = new FormData()
		formData.append('title', title)
		formData.append('content', finalContent)

		uploadedImages.forEach(({ file, name }) => {
			if (usedFilenames.includes(name)) {
				formData.append('imgs', file)
			}
		})

		try {
			const res = await api.post('/admin/notice', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})

			if (res.data.message === 'success') {
				Swal.fire({
					title: '공지사항이 성공적으로 등록되었습니다!',
					icon: 'success',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				window.location.href = '/support/notice'
			} else {
				toast.error(`등록 실패: ${res.data.message}`)
			}
		} catch (err) {
			Swal.fire({
				title: '공지사항 등록 중 오류가 발생했습니다.',
				icon: 'error',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-white min-h-screen'>
			{/* Header Section - Responsive */}
			<div className='mb-6 sm:mb-8'>
				<div className='flex items-center justify-between mb-4 sm:mb-6'>
					<h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>공지사항 작성</h1>
				</div>
				<hr className='border-gray-200' />
			</div>

			{/* Form Section */}
			<div className='bg-white'>
				{/* Title Input - Responsive */}
				<div className='mb-6 sm:mb-8'>
					<label htmlFor='title' className='block mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-gray-900'>
						제목
					</label>
					<input
						id='title'
						placeholder='공지 제목을 입력하세요'
						className='w-full py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200'
					/>
				</div>

				{/* Content Editor - Responsive */}
				<div className='mb-6 sm:mb-8'>
					<label className='block mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-gray-900'>본문 내용</label>

					{/* Toolbar - Responsive */}
					<div className='flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-4 bg-gray-50 border border-gray-200 rounded-t-lg border-b-0 overflow-x-auto'>
						{/* Basic Formatting */}
						<div className='flex gap-1 sm:gap-2'>
							<button
								type='button'
								onClick={() => executeCommand(() => editor?.chain().focus().toggleBold().run())}
								className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
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
								className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
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
								className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
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
								className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${
									editor?.isActive('strike')
										? 'bg-blue-600 text-white border-blue-600 shadow-md'
										: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
								}`}
								title="취소선">
								<span className='line-through'>S</span>
							</button>
						</div>

						<div className='w-px h-6 sm:h-10 bg-gray-200 mx-1 sm:mx-2'></div>

						{/* Text Size Controls - Responsive */}
						<div className="flex items-center space-x-1">
							<span className="hidden sm:inline text-xs text-gray-500 mr-1 sm:mr-2">크기</span>
							<div className="flex gap-1">
								{['12px', '14px', '16px', '18px', '20px', '24px'].map((size) => (
									<button
										key={size}
										type="button"
										onClick={() => changeTextSize(size)}
										className={`px-1 sm:px-2 py-1 text-xs border rounded transition-all duration-200 ${
											currentFontSize === size
												? 'bg-blue-600 text-white border-blue-600 shadow-md'
												: 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
										}`}
										title={`글자 크기 ${size}`}
									>
										<span className="hidden sm:inline">{size}</span>
										<span className="sm:hidden">{size.replace('px', '')}</span>
									</button>
								))}
							</div>
						</div>

						<div className="w-px h-6 sm:h-10 bg-gray-200 mx-1 sm:mx-2"></div>

						{/* Color Palette - Responsive */}
						<div className="flex items-center space-x-1">
							<span className="hidden sm:inline text-xs text-gray-500 mr-1 sm:mr-2">색상</span>
							<div className="flex gap-1">
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
										className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 ${
											currentColor === color
												? 'border-gray-800 shadow-lg scale-110'
												: 'border-gray-300 hover:border-gray-500 hover:scale-105'
										}`}
										style={{ backgroundColor: color }}
										title={`글자 색상: ${name}`}
									/>
								))}
							</div>
						</div>

						<div className='w-px h-6 sm:h-10 bg-gray-200 mx-1 sm:mx-2'></div>

						{/* Additional Tools */}
						<div className="flex gap-1 sm:gap-2">
							<button
								type='button'
								onClick={() => {
									executeCommand(() => editor?.chain().focus().setHorizontalRule().run());
								}}
								className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
								title="구분선">
								—
							</button>
							<button
								type='button'
								onClick={() => {
									handleImageUpload();
								}}
								className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
								title="이미지 업로드">
								📷
							</button>
						</div>

						<div className='w-px h-6 sm:h-10 bg-gray-200 mx-1 sm:mx-2'></div>

						{/* Undo/Redo */}
						<div className="flex gap-1 sm:gap-2">
							<button
								type='button'
								onClick={() => {
									executeCommand(() => editor?.chain().focus().undo().run());
								}}
								className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
								title="실행 취소">
								↶
							</button>
							<button
								type='button'
								onClick={() => {
									executeCommand(() => editor?.chain().focus().redo().run());
								}}
								className='flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200'
								title="다시 실행">
								↷
							</button>
						</div>

						<input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
					</div>

					{/* Editor Content - Responsive */}
					<div className='border border-gray-200 rounded-b-lg bg-white'>
						<EditorContent
							editor={editor}
							className='min-h-64 sm:min-h-96 p-3 sm:p-6
								[&_.ProseMirror]:min-h-56 sm:[&_.ProseMirror]:min-h-80 [&_.ProseMirror]:outline-none [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-sm sm:[&_.ProseMirror]:text-base
								[&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 sm:[&_img]:my-4 [&_img]:border [&_img]:border-gray-200
								[&_span[style*="font-size"]]:inline
								[&_span[style*="color"]]:inline'
						/>
					</div>
				</div>

				{/* Action Buttons - Responsive */}
				<div className='flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-200'>
					<button
						onClick={() => window.history.back()}
						className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
						</svg>
						취소
					</button>

					<button
						onClick={handleSave}
						className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
						</svg>
						공지사항 저장
					</button>
				</div>
			</div>
		</div>
	)
}

export default NoticeWrite