import React from 'react'
import styled from 'styled-components'

const Footer: React.FC = () => {
	return (
		<FooterLayout>
			<FooterBaro>
				<p>공지사항</p>
				<p>고객센터</p>
			</FooterBaro>
			<FooterText>
				일부 상품의 경우 위드유는 통신판매중개자이며 통신판매 당사자가 아닙니다.
				<br />
				해당되는 상품의 경우 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있으므로, 각 상품 페이지에서 구체적인 내용을 확인하시기 바랍니다.
			</FooterText>
		</FooterLayout>
	)
}

export default Footer

const FooterLayout = styled.div`
	display: flex;
	width: 100%;
	height: 200px;
	background-color: #f3f3f3;
	margin-top: 10vh;
	padding: 20px 40px;
`

const FooterBaro = styled.div`
	display: flex;
	flex-direction: column;
	border-right: 1px solid #aaaaaa;
	width: 140px;
	font-weight: bold;
	p {
		&:hover {
			cursor: pointer;
		}
	}
`

const FooterText = styled.p`
	padding-left: 40px;
	color: #9a9a9a;
`
