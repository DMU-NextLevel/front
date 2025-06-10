import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCreateStore } from '../store/store';
import { api } from '../AxiosInstance';

// css 스타트
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
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  transition: all 0.3s;

  &:focus {
    border-color: #a66bff;
    box-shadow: 0 0 0 2px rgba(166, 107, 255, 0.2);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
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

const NextButton = styled(Button)<{ disabled: boolean }>`
  background: #a66bff;
  color: white;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background: ${props => props.disabled ? '#a66bff' : '#8a5cff'};
  }
`;

const RequiredBadge = styled.span`
  color: #ff4d4f;
  font-size: 1em;
  margin-left: 0.25rem;
  font-weight: bold;
`;

const ProjectIntroductionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {title, content, tag1, tag2, titleImg, imgs, expired, goal} = useCreateStore()

  const [formData, setFormData] = useState({
    overview: state?.overview || '',
    reason: state?.reason || '',
    background: state?.background || '',
    targetAudience: state?.targetAudience || '',
    uniqueValue: state?.uniqueValue || '',
    executionPlan: state?.executionPlan || '',
    schedule: state?.schedule || '',
    budgetPlan: state?.budgetPlan || '',
    team: state?.team || '',
    teamExpertise: state?.teamExpertise || '',
    teamRoles: state?.teamRoles || '',
    future: state?.future || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: 'error',
        title: '필수 항목 누락',
        text: '모든 필수 항목을 작성해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    // 최종 확인 다이얼로그 표시
    const result = await Swal.fire({
      title: '프로젝트를 제출하시겠습니까?',
      text: '제출 후에는 내용을 수정할 수 없습니다.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#a66bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '네, 제출할게요',
      cancelButtonText: '취소',
      reverseButtons: true
    });

    // 사용자가 확인을 누른 경우에만 제출 처리
    if (result.isConfirmed) {
      try {
        // 제출 로딩 시작
        Swal.fire({
          title: '제출 중...',
          text: '잠시만 기다려주세요.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const projectData = new FormData()
        projectData.append('title', title)
        projectData.append('content', content)
        if (titleImg !== null)
          projectData.append('titleImg', titleImg)
        projectData.append('tags', String(tag1))
        if (tag2 !== null)
          projectData.append('tags', String(tag2))
        imgs.forEach((img) => projectData.append('imgs', img))
        projectData.append('expired', expired)
        projectData.append('goal', String(goal))

        console.log(projectData)
        // 제출 로직 (API 호출 등)
        await api.post('/api1/project', projectData)

        // 제출 성공 시
        await Swal.fire({
          icon: 'success',
          title: '제출 완료',
          text: '프로젝트가 성공적으로 제출되었습니다.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인',
          timer: 1500,
          timerProgressBar: true
        });

        // 메인 페이지로 이동
        navigate('/');
      } catch (error) {
        // 오류 처리
        Swal.fire({
          icon: 'error',
          title: '제출 실패',
          text: '제출 중 오류가 발생했습니다. 다시 시도해주세요.',
          confirmButtonColor: '#a66bff',
          confirmButtonText: '확인'
        });
      }
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>프로젝트 소개</Title>

        <Section>
          <SectionTitle>1. 프로젝트 개요 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>프로젝트의 목적, 주요 기능, 타겟 고객 등 프로젝트를 소개해주세요.</SectionDescription>
          <TextArea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            placeholder="예: 이 프로젝트는 ~~~을 목표로 하는 프로젝트입니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>2. 프로젝트 선정 이유 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>이 프로젝트를 왜 진행하게 되었는지, 어떤 문제를 해결하고자 하는지 설명해주세요.</SectionDescription>
          <TextArea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="예: 기존 서비스의 ~~~한 문제점을 해결하고자 시작하게 되었습니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>3. 프로젝트 배경 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>이 프로젝트를 시작하게 된 배경과 동기에 대해 설명해주세요.</SectionDescription>
          <TextArea
            name="background"
            value={formData.background}
            onChange={handleChange}
            placeholder="예: 최근 ~~~한 문제를 해결하기 위해 이 프로젝트를 기획하게 되었습니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>4. 타겟 고객 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>이 프로젝트의 주요 고객층은 누구인가요?</SectionDescription>
          <TextArea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="예: 20-30대 직장인, 소상공인 등"
            required
          />
        </Section>

        <Section>
          <SectionTitle>5. 차별화 포인트 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>기존 서비스와 차별화된 점이 무엇인가요?</SectionDescription>
          <TextArea
            name="uniqueValue"
            value={formData.uniqueValue}
            onChange={handleChange}
            placeholder="예: 기존 서비스와 달리 ~~~한 점이 특징입니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>6. 실행 계획 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>프로젝트를 어떻게 진행할 계획인가요?</SectionDescription>
          <TextArea
            name="executionPlan"
            value={formData.executionPlan}
            onChange={handleChange}
            placeholder="예: 1단계: ~~~, 2단계: ~~~"
            required
          />
        </Section>

        <Section>
          <SectionTitle>7. 일정 계획 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>주요 마일스톤과 일정을 알려주세요.</SectionDescription>
          <TextArea
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            placeholder="예: 6월: 기획 완료, 7월: 개발 시작, 8월: 테스트"
            required
          />
        </Section>

        <Section>
          <SectionTitle>8. 예산 계획 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>예산을 어떻게 사용할 계획인가요?</SectionDescription>
          <TextArea
            name="budgetPlan"
            value={formData.budgetPlan}
            onChange={handleChange}
            placeholder="예: 개발 비용 50%, 마케팅 30%, 운영 비용 20%"
            required
          />
        </Section>

        <Section>
          <SectionTitle>9. 팀 소개 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>프로젝트를 진행하는 팀을 소개해주세요.</SectionDescription>
          <TextArea
            name="team"
            value={formData.team}
            onChange={handleChange}
            placeholder="예: 저희 팀은 ~~~한 경험을 가진 인원들로 구성되어 있습니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>10. 팀 역량 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>팀의 강점과 보유 역량은 무엇인가요?</SectionDescription>
          <TextArea
            name="teamExpertise"
            value={formData.teamExpertise}
            onChange={handleChange}
            placeholder="예: 저희 팀은 ~~~ 분야에서 5년 이상의 경험을 가지고 있습니다."
            required
          />
        </Section>

        <Section>
          <SectionTitle>11. 팀원별 역할 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>각 팀원의 역할을 설명해주세요.</SectionDescription>
          <TextArea
            name="teamRoles"
            value={formData.teamRoles}
            onChange={handleChange}
            placeholder="예: 홍길동: 기획 및 디자인, 김철수: 프론트엔드 개발"
            required
          />
        </Section>

        <Section>
          <SectionTitle>12. 향후 계획 <RequiredBadge>*</RequiredBadge></SectionTitle>
          <SectionDescription>프로젝트 완료 후 계획이 있으신가요?</SectionDescription>
          <TextArea
            name="future"
            value={formData.future}
            onChange={handleChange}
            placeholder="예: 지속적인 유지보수와 추가 기능 개발을 계획 중입니다."
            required
          />
        </Section>

        <ButtonGroup>
          <BackButton type="button" onClick={() => navigate(-1)}>
            이전
          </BackButton>
          <NextButton type="submit" disabled={!isFormValid()}>
            제출하기
          </NextButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default ProjectIntroductionPage;
