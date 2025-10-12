interface SocialCreateButtonProps {
	onClick: () => void
}

export const SocialCreateButton = ({ onClick }: SocialCreateButtonProps) => {
	return (
		<button onClick={onClick} className='mx-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 transition-all duration-200'>
			<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
				<path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
			</svg>
		</button>
	)
}