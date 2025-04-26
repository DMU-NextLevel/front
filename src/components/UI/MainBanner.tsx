import React, { useRef } from 'react'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css' // 슬릭 스타일
import 'slick-carousel/slick/slick-theme.css' // 테마 스타일
import styled from 'styled-components'
import bannerImg from '../../assets/images/withU_testBanner1.png';

const SimpleSlider: React.FC = () => {
	const sliderRef = useRef<Slider>(null) // 슬라이더 ref

	// 슬라이더 설정
	const settings = {
		arrows: false, // 기본 화살표를 끄고, custom 버튼을 사용
		infinite: true, // 무한 반복
		speed: 600, // 슬라이드 전환 속도
		slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
		slidesToScroll: 1, // 한번에 스크롤할 슬라이드 개수
		cssEase: 'ease',
	}

	return (
		<SliderWrapper>
			<Slider ref={sliderRef} {...settings}>
				<Slide><SlideImage src={bannerImg} alt="배너1" /></Slide>
				<Slide>배너 이미지 2</Slide>
				<Slide>배너 이미지 3</Slide>
			</Slider>

			{/* 커스텀 버튼 */}
			<CustomButton onClick={() => sliderRef.current?.slickPrev()}>{'<'}</CustomButton>
			<CustomButton2 onClick={() => sliderRef.current?.slickNext()}>{'>'}</CustomButton2>
		</SliderWrapper>
	)
}

export default SimpleSlider

// styled-components로 스타일링
const SliderWrapper = styled.div`
	width: 100%;
	max-width: 100%;
	height: 500px;
	position: relative;
`
const SlideImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover; /* 이미지를 비율 맞춰서 채우기 */
`

const Slide = styled.div`
	width: 100%;
	height: 500px;
	background-color: #ccc;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
	fade: true;
`

const CustomButton = styled.button`
	position: absolute;
	top: 50%;
	left: 10px;
	transform: translateY(-0%);
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 50%;
	width: 25px;
	height: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 18px;
	z-index: 10;
	&:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	&:first-child {
		left: 10px;
	}

	&:last-child {
		right: 10px;
	}
`

const CustomButton2 = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-0%);
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 50%;
	width: 25px;
	height: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 18px;
	z-index: 10;
	&:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	&:first-child {
		left: 10px;
	}

	&:last-child {
		right: 10px;
	}
`
