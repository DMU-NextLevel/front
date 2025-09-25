import React, { useRef } from 'react'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import bannerImg from '../../../assets/images/withU_testBanner1.jpg'
import bannerMov2 from '../../../assets/images/withU_testBanner2.mp4'
import bannerMov3 from '../../../assets/images/withU_testBanner3.mp4'
import banner1 from '../../../assets/images/withU_Banner1.mp4'
import banner2 from '../../../assets/images/withU_Banner2.mp4'
import banner3 from '../../../assets/images/withU_Banner3.mp4'

const SimpleSlider: React.FC = () => {
	const sliderRef = useRef<Slider>(null)

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
			const videos = document.querySelectorAll('video')
			videos.forEach((video, index) => {
				if (index === current) {
					video.play().catch(() => {}) // play 실패 무시
				} else {
					video.pause()
					video.currentTime = 0 // 처음으로 되돌림
				}
			})
		},
	}

	return (
		<div className='w-full max-w-full relative overflow-hidden h-[240px] sm:h-[300px] md:h-[420px] lg:h-[560px] xl:h-[630px]'>
			{/* 좌우 클릭 영역 */}
			<div className='absolute top-0 left-0 w-[25%] sm:w-[20%] lg:w-[15%] h-full z-[5] cursor-pointer' onClick={() => sliderRef.current?.slickPrev()} />
			<div className='absolute top-0 right-0 w-[25%] sm:w-[20%] lg:w-[15%] h-full z-[5] cursor-pointer' onClick={() => sliderRef.current?.slickNext()} />

			<Slider ref={sliderRef} {...settings}>
				<div className='w-full h-[240px] sm:h-[300px] md:h-[420px] lg:h-[560px] xl:h-[630px] flex justify-center items-center'>
					<img src={bannerImg} alt='배너1' className='w-full h-full object-cover' />
				</div>
				<div className='w-full h-[240px] sm:h-[300px] md:h-[420px] lg:h-[560px] xl:h-[630px] flex justify-center items-center'>
					<video src={bannerMov3} autoPlay muted playsInline className='w-full h-full object-cover pointer-events-none' />
				</div>
				<div className='w-full h-[240px] sm:h-[300px] md:h-[420px] lg:h-[560px] xl:h-[630px] flex justify-center items-center'>
					<video src={banner2} autoPlay muted playsInline className='w-full h-full object-cover pointer-events-none' />
				</div>
				{/* <div className="w-full h-[630px] flex justify-center items-center">
					<video src={banner1} autoPlay muted playsInline className="w-full h-full object-cover pointer-events-none" />
				</div> */}
				<div className='w-full h-[240px] sm:h-[300px] md:h-[420px] lg:h-[560px] xl:h-[630px] flex justify-center items-center'>
					<video src={banner3} autoPlay muted playsInline className='w-full h-full object-cover pointer-events-none' />
				</div>
			</Slider>

			{/* 커스텀 버튼 */}
			<button
				className='absolute top-1/2 left-3 sm:left-5 -translate-y-1/2 bg-black bg-opacity-50 text-white border-none rounded-full w-7 h-7 sm:w-[30px] sm:h-[30px] flex justify-center items-center cursor-pointer text-base sm:text-lg z-10 hover:bg-opacity-70'
				onClick={() => sliderRef.current?.slickPrev()}>
				{'<'}
			</button>
			<button
				className='absolute top-1/2 right-3 sm:right-5 -translate-y-1/2 bg-black bg-opacity-50 text-white border-none rounded-full w-7 h-7 sm:w-[30px] sm:h-[30px] flex justify-center items-center cursor-pointer text-base sm:text-lg z-10 hover:bg-opacity-70'
				onClick={() => sliderRef.current?.slickNext()}>
				{'>'}
			</button>
		</div>
	)
}

export default SimpleSlider

