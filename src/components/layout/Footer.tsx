import React from 'react'
import styled from 'styled-components'

const Footer: React.FC = () => {
	return (
		<FooterLayout>
			<Line />
			<FooterHeader>
				<a href='/'>정책 & 약관 <i className="bi bi-chevron-down"></i></a>
				<a href='/'><b>개인정보처리방침 <i className="bi bi-box-arrow-up-right"></i></b></a>
			</FooterHeader>
			<Line />

			<FooterBody>
				<FooterBaro>
					<h2><i className="bi bi-info-circle-fill"></i> 위드유 고객센터</h2>
					<a href='/'>공지사항</a>
					<a href='/'>고객센터</a>
					<a href='/'>이용약관</a>
					<a href='/'>정책 & 약관</a>
				</FooterBaro>
				<FooterContent>
					<FooterText>
						위드유 대표: 홍길동 | 사업자등록번호: 123-45-67890 | 
						주소: 서울특별시 강남구 테헤란로 123, 위드유타워 5층 <br />
						고객센터: 02-1234-5678 | 이메일: support@withu.co.kr
					</FooterText>
					<FooterNotice>
						※ 일부 상품의 경우 위드유는 통신판매중개자이며 통신판매 당사자가 아닙니다.<br />
						해당 상품의 거래 책임은 판매자에게 있으며, 자세한 내용은 각 상품 페이지를 참고해 주세요.
					</FooterNotice>
					
				</FooterContent>
			</FooterBody>
			<FooterFooter>
				<FooterCopy>ⓒ 2025 WITHU CORP. All RIGHT RESERVED.</FooterCopy>
			</FooterFooter>
		</FooterLayout>
	)
}

export default Footer

const FooterLayout = styled.div`
	
	background-color:rgb(255, 255, 255);
	margin-top: 10vh;
	padding: 20px 15%;
	@media (max-width: 1500px) {
		padding: 20px 10%;
	}
	@media (max-width: 1200px) {
		padding: 20px 2%;
	}
`

const FooterHeader = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	height: 50px;
	padding: 0 10px;

	a {
		color: rgb(99, 99, 99);
		text-decoration: none;
		font-size: 14px;
		margin-right: 20px;
		&:hover {
			color: #000;
			
		}

`
const FooterBody = styled.div`
	display: flex;
	margin: 40px 0;
`

const FooterBaro = styled.div`
	display: flex;
	flex-direction: column;
	width: 300px;
	font-weight: bold;
	h2{
		}
	p {
		font-size: 14px;
		margin: 10px 0;
		
		&:hover {
			cursor: pointer;
		}
	}
	a {
		color: rgb(99, 99, 99);
		text-decoration: none;
		font-size: 16px;
		margin: 10px 0;
		&:hover {
			color: #000;
			text-decoration: underline;
		}

`

const FooterText = styled.p`
	color:rgb(99, 99, 99);
`

const FooterContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 40px;
	color: #777;
	font-size: 14px;
	line-height: 1.6;
`

const FooterNotice = styled.p`
	margin-top: 10px;
	color: #9a9a9a;
`

const FooterCopy = styled.p`
	margin-top: auto;
	font-size: 13px;
	color: #bbb;
	test-align: center;
`
const FooterFooter = styled.div`
	justify-content: center;
	align-items: center;
	
	height: 50px;
	background-color: #fff;
	margin-top: 20px;
`
const Line = styled.hr`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgb(246, 246, 246);
  border: none;
  margin: 0 auto;
`;