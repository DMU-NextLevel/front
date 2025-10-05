interface ProjectImage {
    id: number
    uri: string
}

export interface ProjectStoryData {
    imgs: ProjectImage[]
}

export type storyResponse<T> = {
    message: string
    data: T
}

export interface ProjectNoticeData {
    noticeCount: number
    notices: ProjectNotice[]
}

interface ProjectNotice {
    id: number
    title: string
    content: string
    createdTime: Date
    imgs: ProjectImage[]
}

export type noticeResponse<T> = {
    message: string
    data: T
}

export interface UserProfileDto {
    id: number
    nickName: string
    img: ProjectImage
}

export interface Ask {
    id: number
    content: string
    userProfileDto: UserProfileDto
    createdAt: string
}

export interface Answer {
    id: number
    content: string
    createdAt: string
    userProfileDto: UserProfileDto
}

export interface Community {
    ask: Ask
    answer: Answer | null
}

export interface ProjectCommunityData {
    communities: Community[]
    communityCount: number
}

export type communityResponse<T> = {
    message: string
    data: T
}