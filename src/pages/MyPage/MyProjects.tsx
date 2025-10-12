import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import StatisticsOverlay from './StatisticsOverlay';

type ProjectStatus = '전체' | '진행 중' | '완료' | '준비 중';

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ProjectStatus>('전체');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // 임시 프로젝트 데이터
  const allProjects = [
    { 
      id: 1, 
      title: '첫 번째 프로젝트', 
      status: '진행 중', 
      backers: 42, 
      progress: 65,
      startDate: '2025-09-01',
      endDate: '2025-10-15',
      fundingGoal: 10000000
    },
    { 
      id: 2, 
      title: '두 번째 프로젝트', 
      status: '완료', 
      backers: 120, 
      progress: 100,
      startDate: '2025-07-01',
      endDate: '2025-08-30',
      fundingGoal: 5000000
    },
    { 
      id: 3, 
      title: '세 번째 프로젝트', 
      status: '준비 중', 
      backers: 0, 
      progress: 0,
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      fundingGoal: 3000000
    },
    { 
      id: 4, 
      title: '네 번째 프로젝트', 
      status: '진행 중', 
      backers: 35, 
      progress: 45,
      startDate: '2025-09-10',
      endDate: '2025-10-20',
      fundingGoal: 8000000
    },
    { 
      id: 5, 
      title: '다섯 번째 프로젝트', 
      status: '완료', 
      backers: 200, 
      progress: 100,
      startDate: '2025-06-15',
      endDate: '2025-08-15',
      fundingGoal: 15000000
    },
  ];

  // 필터링된 프로젝트 목록
  const projects = activeFilter === '전체' 
    ? allProjects 
    : allProjects.filter(project => project.status === activeFilter);

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
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectInfo>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectStatus status={project.status.toLowerCase()}>
                {project.status}
              </ProjectStatus>
              <ProjectDetails>
                <div>
                  {project.status === '준비 중' ? (
                    <span>시작 예정: {project.startDate}</span>
                  ) : project.status === '진행 중' ? (
                    <span>종료일: {project.endDate} (D-{Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))})</span>
                  ) : (
                    <span>종료일: {project.endDate}</span>
                  )}
                </div>
                <div>
                  <span>후원자: {project.backers}명</span>
                  <span>달성률: {project.progress}%</span>
                </div>
              </ProjectDetails>
            </ProjectInfo>
            <ProjectActions>
              <ActionButton>수정</ActionButton>
              <ActionButton onClick={() => setSelectedProject(project.id)}>통계 보기</ActionButton>
            </ProjectActions>
          </ProjectCard>
        ))}
        </ProjectList>
      </Container>
      
      {/* 통계 오버레이 */}
      {selectedProject !== null && (
        <StatisticsOverlay
          project={allProjects.find(p => p.id === selectedProject)!}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default MyProjects;

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 200px); // 푸터와의 간격 조정
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

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
`;

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

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
`;

const ProjectInfo = styled.div`
  margin-bottom: 16px;
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
`;

const ProjectStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  background-color: ${({ status }) => 
    status === '진행 중' ? '#e6f7ff' : 
    status === '완료' ? '#f6ffed' : '#f9f9f9'};
  color: ${({ status }) => 
    status === '진행 중' ? '#1890ff' : 
    status === '완료' ? '#52c41a' : '#8c8c8c'};
`;

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
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

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
`;
