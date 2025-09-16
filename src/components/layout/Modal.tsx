import React, { JSX } from 'react'

interface props {
	children: React.ReactNode
	onClose: () => void
}

const Modal = ({ children, onClose }: props): JSX.Element => {
	const handleOverlayClick = () => {
		onClose()
	}

	const handleContentClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]' onClick={handleOverlayClick}>
			<div className='z-[1001]' onClick={handleContentClick}>
				{children}
			</div>
		</div>
	)
}

export default Modal
