import React from 'react'

const Footer: React.FC = () => {
	return (
		<div className="bg-white px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-5">
			<hr className="absolute left-0 right-0 h-px bg-gray-200 border-none mx-auto" />
			<div className="flex items-center w-full h-[50px] px-2.5">
				<a href='/' className="text-gray-600 no-underline text-sm mr-5 hover:text-gray-900 transition-colors">정책 & 약관 <i className="bi bi-chevron-down ml-1 text-xs"></i></a>
				<a href='/' className="text-gray-600 no-underline text-sm mr-5 hover:text-gray-900 transition-colors font-medium">개인정보처리방침 <i className="bi bi-box-arrow-up-right ml-1 text-xs"></i></a>
			</div>
			<hr className="absolute left-0 right-0 h-px bg-gray-200 border-none mx-auto" />

			<div className="flex my-10">
				<div className="flex flex-col w-[300px] font-bold">
					<h2 className="text-lg text-gray-900 mb-4 flex items-center">
						<i className="bi bi-info-circle-fill mr-2 text-gray-600"></i> 위드유 고객센터
					</h2>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-gray-900 hover:underline transition-colors">공지사항</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-gray-900 hover:underline transition-colors">고객센터</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-gray-900 hover:underline transition-colors">이용약관</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-gray-900 hover:underline transition-colors">정책 & 약관</a>
				</div>
				<div className="flex flex-col justify-center pl-10 text-gray-600 text-sm leading-relaxed">
					<p className="text-gray-700 mb-3">
						위드유 대표: 홍길동 | 사업자등록번호: 123-45-67890 |
						주소: 서울특별시 강남구 테헤란로 123, 위드유타워 5층
					</p>
					<div className="flex items-center space-x-6 text-sm mb-3">
						<div className="flex items-center">
							<i className="bi bi-telephone mr-2"></i>
							<span>02-1234-5678</span>
						</div>
						<div className="flex items-center">
							<i className="bi bi-envelope mr-2"></i>
							<span>support@withu.co.kr</span>
						</div>
					</div>
					<p className="text-gray-500 text-xs">
						※ 일부 상품의 경우 위드유는 통신판매중개자이며 통신판매 당사자가 아닙니다.
						해당 상품의 거래 책임은 판매자에게 있으며, 자세한 내용은 각 상품 페이지를 참고해 주세요.
					</p>
				</div>
			</div>
			<hr className="absolute left-0 right-0 h-px bg-gray-200 border-none mx-auto" />
			<div className="justify-center items-center h-[50px] bg-white">
				<p className="text-sm text-gray-500 text-center py-3">ⓒ 2025 WITHU CORP. All RIGHTS RESERVED.</p>
			</div>
		</div>
	)
}

export default Footer