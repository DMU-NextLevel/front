import React from 'react'
import Swal from 'sweetalert2'

interface Product {
	id: number
	name: string
	price: string
	image: string
	tags: string[]
}

interface Props {
	onClose: () => void
	products: Product[]
	selectedFilter: string
	setSelectedFilter: (v: string) => void
	allTags: string[]
	userInfo: any
	tempUserInfo: any
	profileImage: string | null
	tempProfileImage: string | null
}

const RecentOverlay: React.FC<Props> = ({ onClose, products, selectedFilter, setSelectedFilter, allTags, userInfo, tempUserInfo, profileImage, tempProfileImage }) => {
	const filteredProducts = selectedFilter === '전체' ? products : products.filter((p) => p.tags.includes(selectedFilter))

	return (
		<div className='fixed top-1/2 left-1/2 w-[800px] h-[800px] transform -translate-x-1/2 -translate-y-1/2 bg-white z-[999] p-8 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up'>
			<div className='flex justify-between items-center mb-5'>
				<h2 className='text-2xl font-bold'>나의 활동</h2>
				<button
					className='text-2xl border-none bg-transparent cursor-pointer'
					onClick={() => {
						const hasChanges = JSON.stringify(userInfo) !== JSON.stringify(tempUserInfo) || profileImage !== tempProfileImage

						if (hasChanges) {
							Swal.fire({
								icon: 'warning',
								title: '변경 사항이 저장되지 않았습니다',
								text: '입력한 내용이 저장되지 않은 채 창이 닫힙니다.',
								confirmButtonColor: '#a66cff',
							})
						}
						onClose()
					}}>
					×
				</button>
			</div>

			<div className='flex-1 overflow-y-auto pr-1.5'>
				<div className='flex justify-between items-center mb-2.5'>
					<div className='flex gap-5'>
						<div className='text-base font-bold text-black border-b-2 border-black'>최근 본</div>
					</div>
					<div className='flex gap-2.5'>
						{['전체', ...allTags].map((cat) => (
							<button
								key={cat}
								className={`border-none px-3.5 py-1.5 rounded-3xl cursor-pointer font-medium ${selectedFilter === cat ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
								onClick={() => setSelectedFilter(cat)}>
								{cat}
							</button>
						))}
					</div>
				</div>

				<div className='text-sm text-gray-600 mb-5'>전체 {filteredProducts.length}개</div>
				<div className='grid grid-cols-2 gap-5'>
					{filteredProducts.map((item) => (
						<div key={item.id} className='bg-white border border-gray-300 rounded-xl overflow-hidden flex flex-col p-0'>
							<img src={item.image} alt={item.name} className='w-full h-[200px] object-cover' />
							<div className='p-2.5'>
								<div className='text-sm text-purple-500 font-bold'>
									<span>{item.price}</span>
								</div>
								<p className='text-xs text-gray-800 mt-1.5'>{item.name}</p>
								<div className='mt-1.5 flex flex-wrap gap-1.5'>
									{item.tags.map((tag, i) => (
										<span key={i} className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-xl'>
											#{tag}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default RecentOverlay
