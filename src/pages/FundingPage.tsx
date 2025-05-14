import React, { JSX, useState } from 'react'
import styled from 'styled-components'
import FundingInfo from '../components/UI/FundingPage/FundingInfo'
import StarterInfo from '../components/UI/FundingPage/StarterInfo'
import FundingContent from '../components/UI/FundingPage/FundingContent'
import FundingModal from '../components/UI/FundingPage/FundingModal'
import Modal from '../components/layout/Modal'

const FundingPage = (): JSX.Element => {
	const [payOpen, setPayOpen] = useState<boolean>(false)

	return (
		<FundingPageWrapper>
			<ColumBox>
				<FundingInfo setPayOpen={setPayOpen} />
				<StarterInfo />
			</ColumBox>
			<FundingContent />
			{payOpen && (
				<Modal onClose={() => setPayOpen(false)}>
					<FundingModal />
				</Modal>
			)}
		</FundingPageWrapper>
	)
}

export default FundingPage

const FundingPageWrapper = styled.div`
	display: flex;
	padding-left: 2%;
	gap: 2%;
	margin: 0px 15%;
`

const ColumBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 26%;
	min-width: 380px;
	gap: 2%;
`