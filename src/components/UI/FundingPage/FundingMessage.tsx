import React from 'react'

interface ChatMessageProps {
	isSender: boolean // true면 보낸 사람(왼쪽), false면 받은 사람(오른쪽)
	userName: string
	date: string
	message: string
}

const FundingMessage: React.FC<ChatMessageProps> = ({ isSender, userName, date, message }) => {
	return (
		<div className={`flex ${isSender ? 'flex-row' : 'flex-row-reverse'} items-end my-5`}>
			<div className={`w-10 h-10 rounded-full flex-shrink-0 ${isSender ? 'bg-purple-400' : 'bg-gray-300'}`} />
			<div className={`flex flex-col ${isSender ? 'items-start' : 'items-end'} mx-2.5`}>
				<div
					className={`max-w-[20vw] py-4 px-5 border-4 ${isSender ? 'border-purple-400' : 'border-gray-300'} rounded-3xl bg-white relative text-base leading-relaxed break-words`}>
					{message}
				</div>
				<div className='mt-2'>
					<div className='font-bold text-sm text-gray-800'>{userName}</div>
					<div className='text-xs text-gray-500'>{date}</div>
				</div>
			</div>
		</div>
	)
}

export default FundingMessage
