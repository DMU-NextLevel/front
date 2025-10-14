export interface ProjectDetailData {
    id: number
    title: string
    content: string
    titleImg: ProjectImage
    createdAt: Date
    expiredAt: Date
    isAuthor: boolean
    goal: number
    sum: number
    completionRate: number
    likeCount: number
    fundingCount: number
    viewCount: number
    status: string
    tag: []
    user: {
        followCount: number
        id: number
        img: {
            id: number
            uri: string
        }
        isFollow: boolean
        name: string
        nickName: string
    }
}

export type detailResponse<T> = {
    message: string
    data: T
}

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

export interface NoticeAddData {
    title: string
    content: string
    img: File | null
}