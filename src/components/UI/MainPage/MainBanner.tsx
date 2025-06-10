import React, { useRef } from 'react'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import bannerImg from '../../../assets/images/withU_testBanner1.jpg';
import bannerMov2 from '../../../assets/images/withU_testBanner2.mp4';
import bannerMov3 from '../../../assets/images/withU_testBanner3.mp4';
import banner1 from '../../../assets/images/withU_Banner1.mp4';	
import banner2 from '../../../assets/images/withU_Banner2.mp4';
import banner3 from '../../../assets/images/withU_Banner3.mp4';


const SimpleSlider: React.FC = () => {
	const sliderRef = useRef<Slider>(null);

	const settings = {
		arrows: false,
		infinite: true,
		speed: 600,
		slidesToShow: 1,
		slidesToScroll: 1,
		cssEase: 'ease',
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		afterChange: (current: number) => {
			const videos = document.querySelectorAll('video');
			videos.forEach((video, index) => {
				if (index === current) {
					video.play().catch(() => {}); // play 실패 무시
				} else {
					video.pause();
					video.currentTime = 0; // 처음으로 되돌림
				}
			});
		}
	};
	
	
	return (
		<SliderWrapper>
			{/* 좌우 클릭 영역 */}
			<ClickAreaLeft onClick={() => sliderRef.current?.slickPrev()} />
			<ClickAreaRight onClick={() => sliderRef.current?.slickNext()} />

			<Slider ref={sliderRef} {...settings}>
				<Slide><SlideImage src={bannerImg} alt="배너1" /></Slide>
				<Slide><SlideVideo src={bannerMov3} autoPlay  muted playsInline /></Slide>
				<Slide><SlideVideo src={banner2} autoPlay muted playsInline /></Slide>
				{/* <Slide><SlideVideo src={banner1} autoPlay muted playsInline /></Slide> */}
				<Slide><SlideVideo src={banner3} autoPlay muted playsInline /></Slide>
			</Slider>

			{/* 커스텀 버튼 */}
			<CustomButton onClick={() => sliderRef.current?.slickPrev()}>{'<'}</CustomButton>
			<CustomButtonRight onClick={() => sliderRef.current?.slickNext()}>{'>'}</CustomButtonRight>
		
		</SliderWrapper>
	)
}

export default SimpleSlider

// styled-components
const SliderWrapper = styled.div`
	width: 100%;
	max-width: 100%;
	height: 600px;
	max-height: 600px;
	position: relative;
	overflow: hidden;
`

const SlideImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`


const SlideVideo = styled.video`
	width: 100%;
	height: 100%;
	object-fit: cover;
	pointer-events: none;
`

const Slide = styled.div`
	width: 100%;
	height: 600px;
	display: flex;
	justify-content: center;
	align-items: center;
`

// 좌우 클릭 영역
const ClickAreaLeft = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 15%;
	height: 100%;
	z-index: 5;
	cursor: pointer;
`

const ClickAreaRight = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 15%;
	height: 100%;
	z-index: 5;
	cursor: pointer;
`

// 커스텀 버튼
const CustomButton = styled.button`
	position: absolute;
	top: 50%;
	left: 20px;
	transform: translateY(-50%);
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 18px;
	z-index: 10;
	&:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}
`

const CustomButtonRight = styled(CustomButton)`
	left: auto;
	right: 20px;
`

