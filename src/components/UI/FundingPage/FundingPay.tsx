import { JSX, useState } from 'react'

const FundingPay = (): JSX.Element => {
	const termsList = ['[필수] 구매조건, 결제 진행 및 결제 대행 서비스 동의', '[필수] 개인정보 제3자 제공 동의', '[필수] 책임 규정에 대한 동의']
	const [allAgree, setAllAgree] = useState(false)
	const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))

	const handleTermChange = (index: number) => {
		const updated = [...checkedTerms]
		updated[index] = !updated[index]
		setCheckedTerms(updated)
		setAllAgree(updated.every(Boolean))
	}

	return (
		<div className='m-5'>
			<div className='border-t-4 border-b-4 border-gray-100'>
				<p className='text-purple-500 font-bold'>선택한 리워드</p>
				<p className='text-gray-500'>리워드 설명</p>
				<div className='flex justify-between'>
					<p>옵션</p>
					<p>수량 : a개 00000P</p>
				</div>
			</div>
			<div className='flex justify-between py-2.5 px-5 bg-gray-100 mt-2.5'>
				<p>쿠폰</p>
				<select>
					<option>쿠폰을 선택해주세요.</option>
				</select>
			</div>
			<div className='my-8 pb-2.5 border-b-4 border-gray-100'>
				<div className='flex justify-between my-2.5'>
					<span>리워드 금액</span>
					<span>10,000P</span>
				</div>
				<div className='flex justify-between my-2.5'>
					<span>쿠폰 금액</span>
					<span>0P</span>
				</div>
				<div className='flex justify-between my-2.5 font-bold text-xl'>
					<span>총 결제 금액</span>
					<span>10,000P</span>
				</div>
			</div>
			<div className='bg-gray-100 text-gray-500 py-1.5 px-5'>
				<p className='font-bold'>‼️후원 유의사항</p>
				<p>• 지금 결제를 한 경우에도 프로젝트가 종료되기 전까지 언제든 결제를 취소할 수 있어요.</p>
				<p>• 결제를 시도하기 전에 포인트가 충분한지 확인해주세요,</p>
			</div>
			<div className='my-8 text-base text-gray-500'>
				<p className='text-xl font-bold text-black'>약관동의</p>
				{termsList.map((text, idx) => (
					<div key={idx} className='mb-4'>
						<input type='checkbox' checked={checkedTerms[idx]} onChange={() => handleTermChange(idx)} /> {text}
					</div>
				))}
			</div>
		</div>
	)
}

export default FundingPay
