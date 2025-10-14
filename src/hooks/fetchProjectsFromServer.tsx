import axios from 'axios';
import { api } from '../AxiosInstance';

interface ProjectItem {
  id: number;
  title: string;
  titleImg: {
    id: number
    uri: string
  }
  completionRate: number;
  recommendCount: number;
  tags: string[];
  pageCount: number;
  totalCount: number;
  userCount: number;
  createdAt: string;
  isRecommend: boolean;
  expired: string;
  isExpired: boolean;
}

interface ProjectResponse {
  message: string;
  data: {
    projects: ProjectItem[];
    totalCount: number;
    pageCount: number;
    page: number;
  };
}

export interface ProjectResponseData {
  projects: ProjectItem[];
  totalCount: number;
  pageCount: number;
  page: number;
}

interface ProjectRequest {
  order?: string;
  tag?: number;
  page?: number;
  search?: string;
  desc?: boolean;
  pageCount?: number;
  returnFullResponse?: boolean; // 전체 응답 반환 여부
  status?: string[]; // 프로젝트 상태 필터링
}

export const fetchProjectsFromServer = async (input: ProjectRequest): Promise<ProjectItem[] | ProjectResponseData> => {
  const {
    order = 'RECOMMEND',
    tag,
    page = 0,
    search = '',
    desc = true,
    pageCount = 100000,
    returnFullResponse = false,
    status,
  } = input;

  const requestData = {
    order,
    tag: tag !== null && tag !== undefined && !isNaN(Number(tag))
      ? [Number(tag)]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    page,
    search: search.trim() !== '' ? search.trim() : null,
    desc,
    pageCount,
    status: status || null, // status가 null이면 기본 ["PROGRESS", "STOPPED"]
  };

  console.log('✅ 전달된 input:', input);
  console.log('📦 요청 보낼 데이터:', JSON.stringify(requestData, null, 2));

  const response = await api.post<ProjectResponse>('/public/project/all', requestData); // ✅ 고정된 경로 사용
  
  if (returnFullResponse) {
    return response.data.data;
  } else {
    return response.data.data.projects;
  }
};


// RECOMMEND : 추천수 기준
// COMPLETION : 참여 금액 / 목표 금액 * 100
// USER : 펀딩에 참여한 인원 기준
// CREATED : 생성일 기준
// EXPIRED : 만료일 기준