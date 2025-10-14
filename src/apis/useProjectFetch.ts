import { useEffect, useState } from "react"
import { apiWithoutCredentials } from '../AxiosInstance'
import {
	communityResponse,
	detailResponse,
	noticeResponse,
	ProjectCommunityData,
	ProjectDetailData,
	ProjectNoticeData,
	ProjectStoryData,
	storyResponse,
} from '../types/project'
import { useProjectStore } from '../store/useProjectStore'

interface ProjectFetchProps {
	projectId: string
}

// 프로젝트 정보 조회
export const useProjectDetailFetch = ({ projectId }: ProjectFetchProps) => {
	const [projectInfo, setProjectInfo] = useState<ProjectDetailData | null>(null)
	const { setIsAuthor } = useProjectStore()

	useEffect(() => {
		apiWithoutCredentials.get<detailResponse<ProjectDetailData>>(`/public/project/${projectId}`).then((res) => {
			setProjectInfo(res.data.data)
			console.log(res.data.data)
			setIsAuthor(res.data.data.isAuthor)
		})
	}, [projectId])

	return { projectInfo }
}

// 프로젝트 스토리, 새 소식, 커뮤니티 조회
export const useProjectFetch = ({ projectId }: ProjectFetchProps) => {
	const [story, setStory] = useState<ProjectStoryData | null>(null)
	const [notice, setNotice] = useState<ProjectNoticeData | null>(null)
	const [community, setCommunity] = useState<ProjectCommunityData | null>(null)

	useEffect(() => {
		apiWithoutCredentials.get<storyResponse<ProjectStoryData>>(`/public/project/${projectId}/story`).then((res) => {
			setStory(res.data.data)
		})

		apiWithoutCredentials.get<noticeResponse<ProjectNoticeData>>(`/public/project/${projectId}/notice`).then((res) => {
			setNotice(res.data.data)
		})

		apiWithoutCredentials.get<communityResponse<ProjectCommunityData>>(`/public/project/${projectId}/community`).then((res) => {
			setCommunity(res.data.data)
		})
	}, [projectId])

	return { story, notice, community }
}