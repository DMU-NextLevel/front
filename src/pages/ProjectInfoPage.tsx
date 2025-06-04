import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// 스타일드 컴포넌트 정의
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 2rem 0;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: #a66bff;
    border-radius: 2px;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 2rem 0 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background-color: #a66bff;
    border-radius: 2px;
  }
`;

const SectionDescription = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0 auto 2rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;

  &[required]:after {
    content: ' *';
    color: #ff4d4f;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    border-color: #a66bff;
    box-shadow: 0 0 0 2px rgba(166, 107, 255, 0.2);
    outline: none;
  }

  &[readonly] {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s;

  &:focus {
    border-color: #a66bff;
    box-shadow: 0 0 0 2px rgba(166, 107, 255, 0.2);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
`;

const BackButton = styled(Button)`
  background: #f5f5f5;
  color: #666;

  &:hover {
    background: #e8e8e8;
  }
`;

const NextButton = styled(Button)`
  background: #a66bff;
  color: white;

  &:hover {
    background: #8a5cff;
  }
`;

const HelperText = styled.span`
  display: block;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #a66bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #8a5cff;
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const categories = [
  { value: "1", label: "테크/가전" },
  { value: "2", label: "라이프스타일" },
  { value: "3", label: "패션/잡화" },
  { value: "4", label: "뷰티/헬스" },
  { value: "5", label: "취미/DIY" },
  { value: "6", label: "게임" },
  { value: "7", label: "교육/키즈" },
  { value: "8", label: "반려동물" },
  { value: "9", label: "여행/레저" },
  { value: "10", label: "푸드/음료" },
];


const ProjectInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const categoryLabel = categories.find(c => c.value === state?.category)?.label || state?.categoryLabel || state?.category || '';
  const [formData, setFormData] = useState({
    title: state?.title || '',
    category: categoryLabel,
    startDate: '',
    endDate: '',
    targetAmount: '',
    location: '',
    
    // 프로젝트 소개 섹션
    overview: '',
    reason: '',
    
    // 프로젝트 상세 섹션
    background: '',
    targetAudience: '',
    uniqueValue: '',
    
    // 프로젝트 계획 섹션
    executionPlan: '',
    schedule: '',
    budgetPlan: '',
    
    // 팀 소개 섹션
    team: '',
    teamExpertise: '',
    teamRoles: '',
    
    // 기타
    future: ''
  });

  useEffect(() => {
    if (!state?.title || !state?.category) {
      navigate('/create-project');
    }
  }, [navigate, state]);

  const formatNumber = (num: string) => {
    let numString = num.replace(/[^0-9]/g, '');
    if (numString.length > 9) {
      numString = numString.slice(0, 9);
    }
    return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (formattedNum: string) => {
    return parseInt(formattedNum.replace(/,/g, '')) || 0;
  };

  const validateAmount = (amount: string) => {
    const numAmount = parseNumber(amount);
    if (numAmount < 300000) {
      alert('최소 30만 원 이상 입력해주세요.');
      return false;
    }
    if (numAmount > 100000000) {
      alert('최대 1억 원 이하로 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleConfirmClick = () => {
    const numAmount = parseNumber(formData.targetAmount);
    if (numAmount === 0) {
      alert('금액을 입력해주세요.');
      return;
    }

    if (validateAmount(formData.targetAmount)) {
      const formattedAmount = formatNumber(formData.targetAmount);
      if (window.confirm(`${formattedAmount}원으로 설정하시겠습니까?`)) {
        // 확인 버튼을 누르면 입력된 금액을 유지하고 포커스를 제거
        const input = document.querySelector('input[name="targetAmount"]') as HTMLInputElement;
        if (input) {
          input.blur();
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'targetAmount') {
      const formattedValue = formatNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setFormData(prev => {
      let newEndDate = prev.endDate;
      if (startDate && newEndDate && new Date(newEndDate) <= new Date(startDate)) {
        const minEndDate = new Date(startDate);
        minEndDate.setDate(minEndDate.getDate() + 7);
        newEndDate = minEndDate.toISOString().split('T')[0];
      }
      return { ...prev, startDate, endDate: newEndDate };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('프로젝트 정보 제출:', { ...state, ...formData });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>프로젝트 기본 정보</Title>

        <Section>
          <FormGroup>
            <Label>프로젝트 제목 *</Label>
            <Input type="text" name="title" value={formData.title} readOnly required />
          </FormGroup>

          <FormGroup>
            <Label>카테고리 *</Label>
            <Input type="text" name="category" value={formData.category} readOnly required />
          </FormGroup>

          <FormGroup>
            <Label>시작일 *</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleStartDateChange} min={new Date().toISOString().split('T')[0]} required />
          </FormGroup>

          <FormGroup>
            <Label>마감일 *</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate ? (() => {
              const minDate = new Date(formData.startDate);
              minDate.setDate(minDate.getDate() + 7);
              return minDate.toISOString().split('T')[0];
            })() : ''} required disabled={!formData.startDate} />
            <HelperText>시작일로부터 최소 7일 뒤로 설정해주세요.</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>목표 금액 *</Label>
            <InputWrapper>
              <Input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9,]*" 
                name="targetAmount" 
                value={formData.targetAmount} 
                onChange={handleChange} 
                placeholder="300,000원 ~ 100,000,000원" 
                required 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirmClick();
                  }
                }}
              />
              <ConfirmButton 
                type="button" 
                onClick={handleConfirmClick}
                disabled={!formData.targetAmount}
              >
                확인
              </ConfirmButton>
            </InputWrapper>
            <HelperText>최소 30만 원 ~ 최대 1억 원 사이에서 설정해 주세요.</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>위치</Label>
            <Input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="예: 서울시 강남구" />
          </FormGroup>
        </Section>

        <Title>프로젝트 소개</Title>

        <Section>
          <SectionTitle>1. 프로젝트 개요</SectionTitle>
          <SectionDescription>프로젝트의 목적, 주요 기능, 타겟 고객 등 프로젝트를 소개해주세요.</SectionDescription>
          <TextArea name="overview" value={formData.overview} onChange={handleChange} placeholder="예: 이 프로젝트는 ~~~을 목표로 하는 프로젝트입니다." required />
        </Section>

        <Section>
          <SectionTitle>2. 프로젝트 선정 이유</SectionTitle>
          <SectionDescription>이 프로젝트를 왜 진행하게 되었는지, 어떤 문제를 해결하고자 하는지 설명해주세요.</SectionDescription>
          <TextArea name="reason" value={formData.reason} onChange={handleChange} placeholder="예: 기존 서비스의 ~~~한 문제점을 해결하고자 시작하게 되었습니다." required />
        </Section>
        
        <Section>
          <SectionTitle>3. 프로젝트 배경</SectionTitle>
          <SectionDescription>이 프로젝트를 시작하게 된 배경과 동기에 대해 설명해주세요.</SectionDescription>
          <TextArea name="background" value={formData.background} onChange={handleChange} placeholder="예: 최근 ~~~한 문제를 해결하기 위해 이 프로젝트를 기획하게 되었습니다." required />
        </Section>
        
        <Section>
          <SectionTitle>4. 타겟 고객</SectionTitle>
          <SectionDescription>이 프로젝트의 주요 고객층은 누구인가요?</SectionDescription>
          <TextArea name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="예: 20-30대 직장인, 소상공인 등" required />
        </Section>
        
        <Section>
          <SectionTitle>5. 차별화 포인트</SectionTitle>
          <SectionDescription>기존 서비스와 차별화된 점이 무엇인가요?</SectionDescription>
          <TextArea name="uniqueValue" value={formData.uniqueValue} onChange={handleChange} placeholder="예: 기존 서비스와 달리 ~~~한 점이 특징입니다." required />
        </Section>
        
        <Section>
          <SectionTitle>6. 실행 계획</SectionTitle>
          <SectionDescription>프로젝트를 어떻게 진행할 계획인가요?</SectionDescription>
          <TextArea name="executionPlan" value={formData.executionPlan} onChange={handleChange} placeholder="예: 1단계: ~~~, 2단계: ~~~" required />
        </Section>
        
        <Section>
          <SectionTitle>7. 일정 계획</SectionTitle>
          <SectionDescription>주요 마일스톤과 일정을 알려주세요.</SectionDescription>
          <TextArea name="schedule" value={formData.schedule} onChange={handleChange} placeholder="예: 6월: 기획 완료, 7월: 개발 시작, 8월: 테스트" required />
        </Section>
        
        <Section>
          <SectionTitle>8. 예산 계획</SectionTitle>
          <SectionDescription>예산을 어떻게 사용할 계획인가요?</SectionDescription>
          <TextArea name="budgetPlan" value={formData.budgetPlan} onChange={handleChange} placeholder="예: 개발 비용 50%, 마케팅 30%, 운영 비용 20%" required />
        </Section>
        
        <Section>
          <SectionTitle>9. 팀 소개</SectionTitle>
          <SectionDescription>프로젝트를 진행하는 팀을 소개해주세요.</SectionDescription>
          <TextArea name="team" value={formData.team} onChange={handleChange} placeholder="예: 저희 팀은 ~~~한 경험을 가진 인원들로 구성되어 있습니다." required />
        </Section>
        
        <Section>
          <SectionTitle>10. 팀 역량</SectionTitle>
          <SectionDescription>팀의 강점과 보유 역량은 무엇인가요?</SectionDescription>
          <TextArea name="teamExpertise" value={formData.teamExpertise} onChange={handleChange} placeholder="예: 저희 팀은 ~~~ 분야에서 5년 이상의 경험을 가지고 있습니다." required />
        </Section>
        
        <Section>
          <SectionTitle>11. 팀원별 역할</SectionTitle>
          <SectionDescription>각 팀원의 역할을 설명해주세요.</SectionDescription>
          <TextArea name="teamRoles" value={formData.teamRoles} onChange={handleChange} placeholder="예: 홍길동: 기획 및 디자인, 김철수: 프론트엔드 개발" required />
        </Section>
        
        <Section>
          <SectionTitle>12. 향후 계획</SectionTitle>
          <SectionDescription>프로젝트 완료 후 계획이 있으신가요?</SectionDescription>
          <TextArea name="future" value={formData.future} onChange={handleChange} placeholder="예: 지속적인 유지보수와 추가 기능 개발을 계획 중입니다." required />
        </Section>
      </Form>
    </Container>
  );
};

export default ProjectInfoPage;
