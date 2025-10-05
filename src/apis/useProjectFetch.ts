import { useEffect, useState } from "react"
import { api, apiWithoutCredentials } from '../AxiosInstance'
import {
	communityResponse,
	detailResponse,
	NoticeAddData,
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

interface QuestionAddProps {
	projectId: string
	content: string
}

export const useQuestionAdd = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addQuestion = async ({ projectId, content }: QuestionAddProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.post(`/api1/project/${projectId}/community`, {
				content: content,
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '질문 추가에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { addQuestion, isLoading, error }
}

interface AnswerAddProps {
	askId: string
	content: string
}

export const useAnswerAdd = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const addAnswer = async ({ askId, content }: AnswerAddProps) => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.post(`/api1/project/${askId}/community/answer`, {
				content: content,
			})

			return response.data
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : '답변 추가에 실패했습니다.'
			setError(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return { addAnswer, isLoading, error }
}
