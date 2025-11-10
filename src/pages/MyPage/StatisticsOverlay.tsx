import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {api} from '../../AxiosInstance';
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

interface MonthlyStat {
  month: number;
  userCount: number;
  fundingPrice: number;
}

// --- 유틸: 날짜를 "YYYY년 M월" 형식으로 변환 ---
const formatMonth = (year: number, month: number) => `${year}년 ${month}월`;

// --- 유틸: 기준 년/월에서 ±2개월 구간 생성 ---
const getFiveMonthRange = (year: number, month: number) => {
  const months: { year: number; month: number }[] = [];
  for (let i = -2; i <= 2; i++) {
    const date = new Date(year, month - 1 + i);
    months.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }
  return months;
};

const StatisticsOverlay: React.FC<StatisticsOverlayProps> = ({ project, onClose }) => {
  useEffect(() => {
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.width = originalStyle.width;
    };
  }, []);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // ✅ API
  const [allMonthlyData, setAllMonthlyData] = useState<
    Record<string, { amount: number; backers: number }>
  >({});

  const [data, setData] = useState<{month: number, userCount: number, fundingPrice: number, year: number}[]>([])

  // ✅ API 연동
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get(`/public/summery/project/${project.id}`);
        if (response.data?.message === 'success' && Array.isArray(response.data.data)) {
          const formatted: Record<string, { amount: number; backers: number }> = {};
          setData(response.data.data)
          response.data.data.forEach((item: MonthlyStat) => {
            const label = formatMonth(selectedYear, item.month);
            formatted[label] = {
              amount: item.fundingPrice || 0,
              backers: item.userCount || 0,
            };
          });
          setAllMonthlyData(formatted);
        } else {
          console.warn('⚠️ 예상치 못한 응답 구조:', response.data);
        }
      } catch (error) {
        console.error('📉 통계 데이터 불러오기 실패:', error);
      }
    };

    fetchStatistics();
  }, [project.id, selectedYear]);

  // ✅ 선택된 년/월 기준 ±2개월 구간 계산
  const displayedMonths = useMemo(
    () => getFiveMonthRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  // ✅ 표시용 데이터 구성 (없으면 0 처리)
  const monthlyData = displayedMonths.map(({ year, month }) => {
    const key = formatMonth(year, month);
    return {
      month: key,
      amount: allMonthlyData[key]?.amount || 0,
      backers: allMonthlyData[key]?.backers || 0,
    };
  });

  const maxAmount = Math.max(...monthlyData.map((item) => item.amount), 1);
  const maxBackers = Math.max(...monthlyData.map((item) => item.backers), 1);

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>{project.title} 통계</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          {/* 요약 섹션 */}
          <SummarySection>
            <StatCard>
              <StatLabel>총 모금액</StatLabel>
              <StatValue>
                {data.reduce((acc: number, curr: { fundingPrice: number }) => acc + curr.fundingPrice, 0).toLocaleString()}원
              </StatValue>
              <ProgressBar>
                <ProgressFill $progress={project.progress} />
              </ProgressBar>
              <ProgressText>{project.progress}% 달성</ProgressText>
            </StatCard>

            <StatCard>
              <StatLabel>후원자 수</StatLabel>
              <StatValue>{project.backers.toLocaleString()}명</StatValue>
              <TrendText>지난 달 대비 +8%</TrendText>
            </StatCard>

            <StatCard>
              <StatLabel>프로젝트 기간</StatLabel>
              <StatValue>
                {project.startDate} ~ {project.endDate}
              </StatValue>
              <StatusBadge $status={project.status}>{project.status}</StatusBadge>
            </StatCard>
          </SummarySection>

          {/* 월별 차트 섹션 */}
          <ChartSection>
            <ChartTitleRow>
              <ChartTitle>월별 모금 현황</ChartTitle>
              <SelectGroup>
                <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </Select>
                <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </Select>
              </SelectGroup>
            </ChartTitleRow>

            {/* 월별 모금액 차트 */}
            <ChartContainer>
              {monthlyData.map((item, index) => (
                <ChartBar key={index}>
                  <Bar $height={(item.amount / maxAmount) * 150} $isMax={item.amount === maxAmount} />
                  <BarLabel>{item.month}</BarLabel>
                  <BarValue>{Math.round(item.amount / 10000)}만원</BarValue>
                </ChartBar>
              ))}
            </ChartContainer>

            {/* 월별 후원자 추이 */}
            <ChartTitle>월별 후원자 추이</ChartTitle>
            <ChartContainer>
              {monthlyData.map((item, index) => (
                <ChartBar key={index}>
                  <Bar
                    $height={(item.backers / maxBackers) * 150}
                    $isMax={item.backers === maxBackers}
                    $isTrend
                  />
                  <BarLabel>{item.month}</BarLabel>
                  <BarValue>{item.backers}명</BarValue>
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

/* ---------------------- Styled Components ---------------------- */
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
    $status === '진행 중' ? '#e6f7ff' : $status === '완료' ? '#f6ffed' : '#f9f9f9'};
  color: ${({ $status }) =>
    $status === '진행 중' ? '#1890ff' : $status === '완료' ? '#52c41a' : '#8c8c8c'};
`;

const ChartSection = styled.div`
  margin-top: 30px;
`;

const ChartTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  color: #333;
  margin: 0 0 20px 0;
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #555;
  cursor: pointer;

  &:hover {
    border-color: #a66cff;
  }
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
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: center;
`;

const BarValue = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: center;
`;
