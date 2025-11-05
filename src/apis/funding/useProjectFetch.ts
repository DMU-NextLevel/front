import { useEffect, useState } from "react"
import { api, apiWithoutCredentials } from '../../AxiosInstance'
import {
	communityResponse,
	detailResponse,
	noticeResponse,
	ProjectCommunityData,
	ProjectDetailData,
	ProjectNoticeData,
	ProjectStoryData,
	storyResponse,
} from '../../types/project'
import { useProjectStore } from '../../store/useProjectStore'

interface ProjectFetchProps {
	projectId: string
}

// 프로젝트 정보 조회
export const useProjectDetailFetch = ({ projectId }: ProjectFetchProps) => {
	const [projectInfo, setProjectInfo] = useState<ProjectDetailData | null>(null)
	const { setIsAuthor } = useProjectStore()

	useEffect(() => {
		// projectId가 없거나 빈 문자열이면 요청하지 않음
		if (!projectId || projectId === '') {
			return
		}

		api.get<detailResponse<ProjectDetailData>>(`/public/project/${projectId}`).then((res) => {
			setProjectInfo(res.data.data)
			setIsAuthor(res.data.data.isAuthor)
		}).catch((error) => {
			console.error('프로젝트 정보 조회 실패:', error)
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
		api.get<storyResponse<ProjectStoryData>>(`/public/project/${projectId}/story`).then((res) => {
			setStory(res.data.data)
		})

		api.get<noticeResponse<ProjectNoticeData>>(`/public/project/${projectId}/notice`).then((res) => {
			setNotice(res.data.data)
		})

		api.get<communityResponse<ProjectCommunityData>>(`/public/project/${projectId}/community`).then((res) => {
			setCommunity(res.data.data)
		})
	}, [projectId])

	return { story, notice, community }
}