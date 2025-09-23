import { ThumbsUp } from "lucide-react"

interface SocialLikeButtonProps {
    like: number
}

export const SocialLikeButton = ({ like }: SocialLikeButtonProps) => {
    return (
        <button className='flex items-center justify-center gap-2 border border-[#A66CFF] bg-[f7f2fah] rounded-xl py-2 px-4 hover:cursor-pointer'>
            <ThumbsUp className='w-4 h-4 stroke-1'/>
            <p className='text-[#8a38f5] font-bold'>{like}</p>
        </button>
    )
}