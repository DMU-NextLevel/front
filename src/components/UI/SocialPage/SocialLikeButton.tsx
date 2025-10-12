import { ThumbsUp } from "lucide-react"

interface SocialLikeButtonProps {
	like: number
	likeStatus: boolean
	onClick: () => void
}

export const SocialLikeButton = ({ like, likeStatus, onClick }: SocialLikeButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`
				flex items-center justify-center gap-2 rounded-xl py-2 px-4
				transition-all duration-200 hover:scale-105 active:scale-95
				${
					likeStatus
						? 'bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-600 shadow-md hover:shadow-lg'
						: 'bg-white border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50'
				}
			`}>
			<ThumbsUp className={`w-4 h-4 transition-all duration-200 ${likeStatus ? 'fill-white text-white stroke-[1.5]' : 'text-purple-500 stroke-[1.5]'}`} />
			<p className={`font-bold transition-colors duration-200 ${likeStatus ? 'text-white' : 'text-purple-600'}`}>{like}</p>
		</button>
	)
}