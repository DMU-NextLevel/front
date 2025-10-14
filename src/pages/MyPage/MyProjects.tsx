import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import StatisticsOverlay from './StatisticsOverlay'

type ProjectStatus = '전체' | '진행 중' | '완료' | '준비 중'

interface Project {
  id: number
  title: string
  status: string
  userCount: number
  completionRate: number
  startAt: string
  expiredAt: string
  fundingGoal: number
}

const MyProjects: React.FC = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<ProjectStatus>('전체')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // ✅ API 기본 URL
  const baseUrl = process.env.REACT_APP_API_BASE_URL

  // ✅ 상태 필터 매핑
  const statusMap: Record<ProjectStatus, string | undefined> = {
    전체: undefined,
    '진행 중': 'PROGRESS',
    완료: 'SUCCESS',
    '준비 중': 'PENDING',
  }

  // ✅ 프로젝트 데이터 불러오기
  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/project/list`,
        {
          page: 0,
          pageCount: 10,
          type: 'PROJECT',
          status: statusMap[activeFilter],
        },
        { withCredentials: true }
      )

      setProjects(response.data.data.projects)
    } catch (error) {
      console.error('❌ 프로젝트 리스트 불러오기 실패:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [activeFilter])

  return (
    <>
      <Container>
        <Header>
          <Title>내 프로젝트</Title>
          <CreateButton onClick={() => navigate('/project/create')}>
            새 프로젝트 만들기
          </CreateButton>
        </Header>

        {/* 상태 필터 탭 */}
        <FilterTabs>
          {(['전체', '진행 중', '완료', '준비 중'] as ProjectStatus[]).map((status) => (
            <FilterTab
              key={status}
              active={activeFilter === status}
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </FilterTab>
          ))}
        </FilterTabs>

        <ProjectList>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id}>
                <ProjectInfo>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectStatusBadge status={project.status}>
                    {project.status}
                  </ProjectStatusBadge>
                  <ProjectDetails>
                    <div>
                      <span>시작일: {project.startAt}</span>
                      <span>종료일: {project.expiredAt}</span>
                    </div>
                    <div>
                      <span>후원자: {project.userCount}명</span>
                      <span>달성률: {project.completionRate}%</span>
                    </div>
                  </ProjectDetails>
                </ProjectInfo>
                <ProjectActions>
                  <ActionButton>수정</ActionButton>
                  <ActionButton onClick={() => setSelectedProject(project.id)}>
                    통계 보기
                  </ActionButton>
                </ProjectActions>
              </ProjectCard>
            ))
          ) : (
            <EmptyMessage>현재 표시할 프로젝트가 없습니다.</EmptyMessage>
          )}
        </ProjectList>
      </Container>

      {/* ✅ 통계 오버레이 */}
      {selectedProject !== null && (() => {
        const p = projects.find((p) => p.id === selectedProject)!
        return (
          <StatisticsOverlay
            project={{
              id: p.id,
              title: p.title,
              status: p.status,
              backers: p.userCount,
              progress: p.completionRate,
              startDate: p.startAt,
              endDate: p.expiredAt,
              fundingGoal: p.fundingGoal,
            }}
            onClose={() => setSelectedProject(null)}
          />
        )
      })()}
    </>
  )
}

export default MyProjects

/* ---------------------- Styled Components ---------------------- */
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #a66cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #8a4fff;
  }
`

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`

const FilterTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: ${({ active }) => (active ? '#a66cff' : '#f5f5f5')};
  color: ${({ active }) => (active ? '#fff' : '#666')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  &:hover {
    background: ${({ active }) => (active ? '#8a4fff' : '#e9e9e9')};
  }
`

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`

const ProjectCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const ProjectInfo = styled.div`
  margin-bottom: 16px;
`

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`

const ProjectStatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  background-color: ${({ status }) =>
    status === 'PROGRESS'
      ? '#e6f7ff'
      : status === 'SUCCESS'
      ? '#f6ffed'
      : status === 'PENDING'
      ? '#fffbe6'
      : '#f9f9f9'};
  color: ${({ status }) =>
    status === 'PROGRESS'
      ? '#1890ff'
      : status === 'SUCCESS'
      ? '#52c41a'
      : status === 'PENDING'
      ? '#faad14'
      : '#8c8c8c'};
`

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  & > div {
    display: flex;
    gap: 16px;
  }
  span {
    display: inline-flex;
    align-items: center;
    &::before {
      content: '•';
      margin-right: 4px;
      color: #999;
    }
    &:first-child::before {
      display: none;
    }
  }
`

const ProjectActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e6e6e6;
    border-color: #bfbfbf;
  }
`

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: #888;
  font-size: 15px;
  padding: 40px 0;
`
