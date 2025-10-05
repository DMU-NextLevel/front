import React, { JSX, useState } from 'react'
import FundingInfo from '../components/UI/FundingPage/FundingInfo'
import StarterInfo from '../components/UI/FundingPage/StarterInfo'
import FundingContent from '../components/UI/FundingPage/FundingContent'
import FundingModal from '../components/UI/FundingPage/modals/FundingModal'
import Modal from '../components/layout/Modal'
import { useParams } from 'react-router-dom'
import { useProjectDetailFetch, useProjectFetch } from '../apis/useProjectFetch'

const FundingPage = (): JSX.Element => {
	const { no } = useParams<{ no: string }>()
	const [payOpen, setPayOpen] = useState<boolean>(false)
	const { story, notice, community } = useProjectFetch({ projectId: no ?? '' })
	const { projectInfo } = useProjectDetailFetch({ projectId: no ?? '' })

	return (
		<div className='flex pl-[2%] gap-[2%] mx-[15%] mt-10'>
			<div className='flex flex-col items-center w-[26%] min-w-[380px] gap-[2%]'>
				<FundingInfo
					setPayOpen={setPayOpen}
					title={projectInfo?.title ?? ''}
					percent={projectInfo?.completionRate ?? 0}
					image={projectInfo?.titleImg?.uri ?? ''}
					description={projectInfo?.content ?? ''}
					amount={projectInfo?.sum ?? 0}
					peopleNum={projectInfo?.fundingCount ?? 0}
					likeNum={projectInfo?.recommendCount ?? 0}
				/>
				<StarterInfo starter={projectInfo?.authorNickName ?? ''} />
			</div>
			<FundingContent projectData={{ story, notice, community }} />
			{payOpen && (
				<Modal onClose={() => setPayOpen(false)}>
					<FundingModal />
				</Modal>
			)}
		</div>
	)
}

export default FundingPage
