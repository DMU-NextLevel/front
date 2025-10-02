import React from 'react';
import styled from 'styled-components';

interface StatisticsOverlayProps {
  project: {
    id: number;
    title: string;
    status: string;
    backers: number;
    progress: number;
    startDate: string;
    endDate: string;
    fundingGoal: number;
  };
  onClose: () => void;
}

const StatisticsOverlay: React.FC<StatisticsOverlayProps> = ({ project, onClose }) => {
  // 통계 데이터 (임시)
  const stats = {
    totalAmount: Math.round(project.fundingGoal * (project.progress / 100)),
    dailyData: [
      { date: '09-01', amount: 1200000 },
      { date: '09-05', amount: 2500000 },
      { date: '09-10', amount: 3800000 },
      { date: '09-15', amount: 4200000 },
      { date: '09-20', amount: 5800000 },
      { date: '09-25', amount: 6500000 },
    ],
    backerTrend: [
      { date: '09-01', count: 12 },
      { date: '09-05', count: 28 },
      { date: '09-10', count: 42 },
      { date: '09-15', count: 55 },
      { date: '09-20', count: 68 },
      { date: '09-25', count: 75 },
    ],
  };

  const maxAmount = Math.max(...stats.dailyData.map(item => item.amount));
  const maxBackers = Math.max(...stats.backerTrend.map(item => item.count));

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>{project.title} 통계</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <Content>
          <SummarySection>
            <StatCard>
              <StatLabel>총 모금액</StatLabel>
              <StatValue>{stats.totalAmount.toLocaleString()}원</StatValue>
              <ProgressBar>
                <ProgressFill $progress={project.progress} />
              </ProgressBar>
              <ProgressText>{project.progress}% 달성</ProgressText>
            </StatCard>
            
            <StatCard>
              <StatLabel>후원자 수</StatLabel>
              <StatValue>{project.backers.toLocaleString()}명</StatValue>
              <TrendText>지난 주 대비 +12%</TrendText>
            </StatCard>
            
            <StatCard>
              <StatLabel>프로젝트 기간</StatLabel>
              <StatValue>
                {project.startDate} ~ {project.endDate}
              </StatValue>
              <StatusBadge $status={project.status}>
                {project.status}
              </StatusBadge>
            </StatCard>
          </SummarySection>
          
          <ChartSection>
            <ChartTitle>일별 모금 현황</ChartTitle>
            <ChartContainer>
              {stats.dailyData.map((item, index) => (
                <ChartBar key={index}>
                  <Bar 
                    $height={(item.amount / maxAmount) * 150} 
                    $isMax={item.amount === maxAmount}
                  />
                  <BarLabel>{item.date}</BarLabel>
                  <BarValue>{Math.round(item.amount / 10000)}만원</BarValue>
                </ChartBar>
              ))}
            </ChartContainer>
            
            <ChartTitle>후원자 추이</ChartTitle>
            <ChartContainer>
              {stats.backerTrend.map((item, index) => (
                <ChartBar key={index}>
                  <Bar 
                    $height={(item.count / maxBackers) * 150} 
                    $isMax={item.count === maxBackers}
                    $isTrend
                  />
                  <BarLabel>{item.date}</BarLabel>
                  <BarValue>{item.count}명</BarValue>
                </ChartBar>
              ))}
            </ChartContainer>
          </ChartSection>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default StatisticsOverlay;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0 10px;
  line-height: 1;
  
  &:hover {
    color: #666;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, #a66cff, #8a4fff);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
`;

const TrendText = styled.div`
  font-size: 13px;
  color: #52c41a;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  background-color: ${({ $status }) => 
    $status === '진행 중' ? '#e6f7ff' : 
    $status === '완료' ? '#f6ffed' : '#f9f9f9'};
  color: ${({ $status }) => 
    $status === '진행 중' ? '#1890ff' : 
    $status === '완료' ? '#52c41a' : '#8c8c8c'};
`;

const ChartSection = styled.div`
  margin-top: 30px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  color: #333;
  margin: 0 0 20px 0;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  margin-bottom: 40px;
  padding: 0 10px;
`;

const ChartBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
`;

const Bar = styled.div<{ $height: number; $isMax: boolean; $isTrend?: boolean }>`
  width: 30px;
  height: ${({ $height }) => $height}px;
  background: ${({ $isMax, $isTrend }) => 
    $isMax 
      ? $isTrend 
        ? 'linear-gradient(to top, #36cfc9, #5cdbd3)' 
        : 'linear-gradient(to top, #597ef7, #85a5ff)'
      : $isTrend 
        ? '#b5f5ec' 
        : '#d6e4ff'};
  border-radius: 4px 4px 0 0;
  margin-bottom: 8px;
  transition: height 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px 4px 0 0;
  }
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

const BarValue = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
`;
