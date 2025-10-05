import { useEffect, useState } from "react"
import { apiWithoutCredentials } from "../AxiosInstance"
import { communityResponse, noticeResponse, ProjectCommunityData, ProjectNoticeData, ProjectStoryData, storyResponse } from "../types/project"

interface ProjectFetchProps {
    projectId: string
}

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