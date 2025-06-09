import React from 'react';
import styled from 'styled-components';

// active prop 타입 정의
interface TabProps {
  active?: boolean;
}

const Wrapper = styled.div`
  font-family: 'Pretendard', sans-serif;
  background-color: #ffffff;
  color: #1a1a1a;
  text-align: center;
  padding: 60px 20px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #8d94a0;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const Highlight = styled.span`
  color: #00c4c4;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0 30px;
  border-bottom: 1px solid #e5e5e5;
`;

const Tab = styled.div<TabProps>`
  font-size: 16px;
  font-weight: ${props => (props.active ? '700' : '500')};
  color: ${props => (props.active ? '#1a1a1a' : '#8d94a0')};
  margin: 0 20px;
  padding-bottom: 12px;
  border-bottom: ${props => (props.active ? '3px solid #1a1a1a' : 'none')};
  cursor: pointer;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: #f9fafa;
  border-radius: 20px;
  padding: 40px 30px;
  width: 300px;
  text-align: center;
`;

const Badge = styled.div<{ color: string }>`
  display: inline-block;
  background-color: ${props => props.color};
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  font-size: 15px;
  color: #444;
  line-height: 1.5;
`;

const FooterNote = styled.p`
  font-size: 13px;
  color: #8d94a0;
  margin-top: 40px;
`;

const LinkText = styled.span`
  color: #1a1a1a;
  font-weight: 600;
  margin-left: 8px;
  cursor: pointer;
`;

const PricingPage: React.FC = () => {
  return (
    <Wrapper>
      <Subtitle>위드유의 도움을 받을 수 있나요?</Subtitle>
      <Title>
        메이커 회원님의 필요에 따라 <br />
        적합한 <Highlight>요금제</Highlight>를 선택하여 진행할 수 있습니다.
      </Title>

      <Tabs>
        <Tab active>펀딩·프리오더 요금제</Tab>
        <Tab>스토어 요금제(준비중)</Tab>
      </Tabs>

      <CardContainer>
        <Card>
          <Badge color="#2b2d30">Expert</Badge>
          <CardTitle>엑스퍼트 요금제</CardTitle>
          <CardDescription>
            전문가의 컨설팅을 통해서 <br />
            최상의 서비스를 안내받을 수 있어요
          </CardDescription>
        </Card>

        <Card>
          <Badge color="#00c4c4">Pro</Badge>
          <CardTitle>프로 요금제</CardTitle>
          <CardDescription>
            위드유 전담 매니저를 통해서 <br />
            필요한 서비스를 제공받을 수 있어요.
          </CardDescription>
        </Card>

        <Card>
          <Badge color="#a5f0e3">Basic</Badge>
          <CardTitle>베이직 요금제</CardTitle>
          <CardDescription>
            <strong>직접</strong> 위드유 서비스를 선택하여 <br />
            프로젝트를 진행할 수 있어요.
          </CardDescription>
        </Card>
      </CardContainer>

      <FooterNote>
        * 각 요금제의 혜택, 수수료 등에 대한 상세한 정보는 프로젝트 만들기 단계에서 확인할 수 있습니다.
        <LinkText><a href="/project/create">프로젝트 시작하기 {'>'}</a></LinkText>
      </FooterNote>
    </Wrapper>
  );
};

export default PricingPage;
