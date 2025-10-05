import React from 'react'

const Footer: React.FC = () => {
	return (
		<div className="bg-white mt-[10vh] px-[15%] py-5 xl:px-[10%] lg:px-[2%]">
			<hr className="absolute left-0 right-0 h-px bg-gray-100 border-none mx-auto" />
			<div className="flex items-center w-full h-[50px] px-2.5">
				<a href='/' className="text-gray-600 no-underline text-sm mr-5 hover:text-black">정책 & 약관 <i className="bi bi-chevron-down"></i></a>
				<a href='/' className="text-gray-600 no-underline text-sm mr-5 hover:text-black"><b>개인정보처리방침 <i className="bi bi-box-arrow-up-right"></i></b></a>
			</div>
			<hr className="absolute left-0 right-0 h-px bg-gray-100 border-none mx-auto" />

			<div className="flex my-10">
				<div className="flex flex-col w-[300px] font-bold">
					<h2><i className="bi bi-info-circle-fill"></i> 위드유 고객센터</h2>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-black hover:underline">공지사항</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-black hover:underline">고객센터</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-black hover:underline">이용약관</a>
					<a href='/' className="text-gray-600 no-underline text-base my-2.5 hover:text-black hover:underline">정책 & 약관</a>
				</div>
				<div className="flex flex-col justify-center pl-10 text-gray-500 text-sm leading-relaxed">
					<p className="text-gray-600">
						위드유 대표: 홍길동 | 사업자등록번호: 123-45-67890 |
						주소: 서울특별시 강남구 테헤란로 123, 위드유타워 5층 <br />
						고객센터: 02-1234-5678 | 이메일: support@withu.co.kr
					</p>
					<p className="mt-2.5 text-gray-400">
						※ 일부 상품의 경우 위드유는 통신판매중개자이며 통신판매 당사자가 아닙니다.<br />
						해당 상품의 거래 책임은 판매자에게 있으며, 자세한 내용은 각 상품 페이지를 참고해 주세요.
					</p>
				</div>
			</div>
			<div className="justify-center items-center h-[50px] bg-white mt-5">
				<p className="mt-auto text-[13px] text-gray-300">ⓒ 2025 WITHU CORP. All RIGHT RESERVED.</p>
			</div>
		</div>
	)
}

export default Footer