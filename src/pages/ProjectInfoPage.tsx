import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCreateStore } from '../store/store';

// css 시작!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

interface LabelProps {
  required?: boolean;
}

const Label = styled.label<LabelProps>`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::after {
    content: ${({ required }) => (required ? '"*"' : '""')};
    color: #a66bff;
    margin-left: 0.25rem;
  }
`;

const RequiredBadge = styled.span`
  color: #a66bff;
  font-size: 1.1em;
  line-height: 1;
  margin-left: 0.25rem;
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

const SubmitButton = styled(Button)<{ $isActive: boolean }>`
  background: ${props => props.$isActive ? '#a66bff' : '#f0f0f0'};
  color: ${props => props.$isActive ? 'white' : '#999'};
  cursor: ${props => props.$isActive ? 'pointer' : 'not-allowed'};
  opacity: 1;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isActive ? '#8a5cff' : '#f0f0f0'};
    transform: ${props => props.$isActive ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.$isActive ? '0 4px 12px rgba(166, 107, 255, 0.3)' : 'none'};
  }

  &:active {
    transform: ${props => props.$isActive ? 'translateY(0)' : 'none'};
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
    const {setExpired, setGoal} = useCreateStore()

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

    // 기타..
    future: ''
  });

  useEffect(() => {
    if (!state?.title || !state?.category) {
      navigate('/project/create');
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
    if (numAmount < 5000) {
      alert('최소 5천 원 이상 입력해주세요.');
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
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '금액을 입력해주세요.',
        confirmButtonColor: '#a66bff',
        confirmButtonText: '확인'
      });
      return;
    }

    if (validateAmount(formData.targetAmount)) {
      const formattedAmount = formatNumber(formData.targetAmount);
      Swal.fire({
        title: '확인',
        text: `${formattedAmount}원으로 설정하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#a66bff',
        cancelButtonColor: '#d33',
        confirmButtonText: '예, 설정합니다',
        cancelButtonText: '취소'
      }).then((result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {

          const input = document.querySelector('input[name="targetAmount"]') as HTMLInputElement;
          if (input) {
            input.blur();
          }


          Swal.fire({
            icon: 'success',
            title: '설정 완료',
            text: `${formattedAmount}원으로 설정되었습니다.`,
            confirmButtonColor: '#a66bff',
            confirmButtonText: '확인'
          });
        }
      });
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

  const isFormValid = () => {
    const requiredFields = [
      'title',
      'category',
      'startDate',
      'endDate',
      'targetAmount'
    ];

    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate('/project/introduction', {
      state: {
        ...state,
        ...formData
      }
    });
  };

  const nextClick = () => {
    setExpired(formData.endDate)
    setGoal(parseNumber(formData.targetAmount))

    navigate('/project/media', { state: formData })
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>프로젝트 기본 정보</Title>

        <Section>
          <FormGroup>
            <Label required>프로젝트 제목</Label>
            <Input type="text" name="title" value={formData.title} readOnly required />
          </FormGroup>

          <FormGroup>
            <Label required>카테고리</Label>
            <Input type="text" name="category" value={formData.category} readOnly required />
          </FormGroup>

          <FormGroup>
            <Label required>시작일</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleStartDateChange} min={new Date().toISOString().split('T')[0]} required />
          </FormGroup>

          <FormGroup>
            <Label required>마감일</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate ? (() => {
              const minDate = new Date(formData.startDate);
              minDate.setDate(minDate.getDate() + 7);
              return minDate.toISOString().split('T')[0];
            })() : ''} required disabled={!formData.startDate} />
            <HelperText>시작일로부터 최소 7일 뒤로 설정해주세요.</HelperText>
          </FormGroup>

          <FormGroup>
            <Label required>목표 금액</Label>
            <InputWrapper>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="5,000원 ~ 100,000,000원"
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
            <HelperText>최소 5천 원 ~ 최대 1억 원 사이에서 설정해 주세요.</HelperText>
          </FormGroup>

          <FormGroup>
            <Label>위치</Label>
            <Input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="예: 서울시 강남구" />
          </FormGroup>
        </Section>





        <ButtonGroup>
          <BackButton type="button" onClick={() => navigate(-1)}>이전</BackButton>
          <SubmitButton
            type="button"
            onClick={nextClick}
            $isActive={isFormValid()}
            disabled={!isFormValid()}
          >
            다음 단계로
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default ProjectInfoPage;
