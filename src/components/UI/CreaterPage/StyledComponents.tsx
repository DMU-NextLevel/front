import React from 'react'

// 애니메이션 클래스 정의
const animations = {
	fadeInUp: 'animate-fade-in-up',
	pulse: 'animate-pulse',
	rotate: 'animate-spin',
}

// 컨테이너 컴포넌트
interface ContainerProps {
	children: React.ReactNode
	className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => (
	<div className={`max-w-6xl mx-auto p-8 min-h-screen flex flex-col gap-8 bg-gradient-to-br from-indigo-500 to-purple-600 ${className}`}>{children}</div>
)

// 헤더 컴포넌트
interface HeaderProps {
	children: React.ReactNode
	className?: string
}

export const Header: React.FC<HeaderProps> = ({ children, className = '' }) => <header className={`text-center text-white animate-fade-in-up ${className}`}>{children}</header>

interface TitleProps {
	children: React.ReactNode
	className?: string
}

export const Title: React.FC<TitleProps> = ({ children, className = '' }) => (
	<h1
		className={`text-6xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent animate-spin ${className}`}>
		{children}
	</h1>
)

interface SubtitleProps {
	children: React.ReactNode
	className?: string
}

export const Subtitle: React.FC<SubtitleProps> = ({ children, className = '' }) => <p className={`text-xl opacity-90 max-w-2xl mx-auto ${className}`}>{children}</p>

// 카드 그리드
interface CardGridProps {
	children: React.ReactNode
	className?: string
}

export const CardGrid: React.FC<CardGridProps> = ({ children, className = '' }) => (
	<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8 ${className}`}>{children}</div>
)

interface CardProps {
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'accent'
	hover?: boolean
	className?: string
}

export const Card: React.FC<CardProps> = ({ children, variant, hover, className = '' }) => {
	const variantClasses = {
		primary: 'border-l-4 border-blue-500',
		secondary: 'border-l-4 border-green-500',
		accent: 'border-l-4 border-yellow-500',
	}

	const hoverClasses = hover ? 'hover:-translate-y-2 hover:shadow-2xl' : ''
	const variantClass = variant ? variantClasses[variant] : ''

	return <div className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 animate-fade-in-up ${variantClass} ${hoverClasses} ${className}`}>{children}</div>
}

interface CardTitleProps {
	children: React.ReactNode
	className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => <h3 className={`text-2xl font-bold mb-4 text-gray-800 ${className}`}>{children}</h3>

interface CardContentProps {
	children: React.ReactNode
	className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => <p className={`text-gray-600 leading-relaxed mb-6 ${className}`}>{children}</p>

// 버튼 컴포넌트들
interface ButtonProps {
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
	size?: 'sm' | 'md' | 'lg'
	loading?: boolean
	className?: string
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', loading = false, className = '', onClick, type = 'button' }) => {
	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg',
	}

	const variantClasses = {
		primary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800',
		secondary: 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800',
		outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
		ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800',
	}

	return (
		<button
			type={type}
			onClick={onClick}
			className={`
        border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${loading ? 'cursor-not-allowed' : 'hover:-translate-y-1'}
        ${className}
      `}>
			{loading && (
				<span className='absolute inset-0 flex items-center justify-center'>
					<div className='w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin'></div>
				</span>
			)}
			<span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
		</button>
	)
}

// 입력 컴포넌트들
interface InputGroupProps {
	children: React.ReactNode
	className?: string
}

export const InputGroup: React.FC<InputGroupProps> = ({ children, className = '' }) => <div className={`flex flex-col gap-2 mb-4 ${className}`}>{children}</div>

interface LabelProps {
	children: React.ReactNode
	className?: string
	htmlFor?: string
}

export const Label: React.FC<LabelProps> = ({ children, className = '', htmlFor }) => (
	<label htmlFor={htmlFor} className={`font-semibold text-gray-700 text-sm ${className}`}>
		{children}
	</label>
)

interface InputProps {
	type?: string
	placeholder?: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	className?: string
	id?: string
}

export const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, onChange, className = '', id }) => (
	<input
		id={id}
		type={type}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
		className={`
      px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300
      focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
      placeholder:text-gray-400
      ${className}
    `}
	/>
)

interface TextAreaProps {
	placeholder?: string
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	className?: string
	id?: string
	rows?: number
}

export const TextArea: React.FC<TextAreaProps> = ({ placeholder, value, onChange, className = '', id, rows = 4 }) => (
	<textarea
		id={id}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
		rows={rows}
		className={`
      px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 resize-y min-h-[100px]
      focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
      placeholder:text-gray-400
      ${className}
    `}
	/>
)

// 뱃지 컴포넌트
interface BadgeProps {
	children: React.ReactNode
	variant?: 'success' | 'warning' | 'error' | 'info'
	className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, className = '' }) => {
	const variantClasses = {
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		error: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800',
	}

	const variantClass = variant ? variantClasses[variant] : 'bg-gray-100 text-gray-800'

	return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${variantClass} ${className}`}>{children}</span>
}

// 로딩 스피너
interface SpinnerProps {
	className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => (
	<div className={`w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto my-8 ${className}`}></div>
)

// 펄스 효과가 있는 아바타
interface AvatarProps {
	children: React.ReactNode
	className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ children, className = '' }) => (
	<div
		className={`w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-pulse ${className}`}>
		{children}
	</div>
)

// 알림 컴포넌트
interface AlertProps {
	children: React.ReactNode
	type?: 'info' | 'success' | 'warning' | 'error'
	className?: string
}

export const Alert: React.FC<AlertProps> = ({ children, type = 'info', className = '' }) => {
	const typeClasses = {
		success: 'bg-green-50 border-green-500 text-green-700',
		warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
		error: 'bg-red-50 border-red-500 text-red-700',
		info: 'bg-blue-50 border-blue-500 text-blue-700',
	}

	return <div className={`px-6 py-4 rounded-xl my-4 border-l-4 ${typeClasses[type]} ${className}`}>{children}</div>
}
