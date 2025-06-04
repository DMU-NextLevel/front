import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';


interface ProjectFormData {
  title: string;
  category: string;
}

const categories = [
  { value: "1", label: "테크/가전", icon: "bi-cpu" },
  { value: "2", label: "라이프스타일", icon: "bi-house" },
  { value: "3", label: "패션/잡화", icon: "bi-bag" },
  { value: "4", label: "뷰티/헬스", icon: "bi-heart-pulse" },
  { value: "5", label: "취미/DIY", icon: "bi-brush" },
  { value: "6", label: "게임", icon: "bi-controller" },
  { value: "7", label: "교육/키즈", icon: "bi-book" },
  { value: "8", label: "반려동물", icon: "bi-star" },
  { value: "9", label: "여행/레저", icon: "bi-airplane" },
  { value: "10", label: "푸드/음료", icon: "bi-cup-straw" },
];

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    category: ""
  });

  const isFormValid = formData.title.trim() !== '' && formData.category !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("프로젝트 생성 데이터:", formData);

  // ✅ 여기서 라벨 값 찾아서 함께 넘김
  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const categoryLabel = selectedCategory?.label || formData.category;

  navigate('/projectinfo', {
    state: {
      ...formData,
      categoryLabel: categoryLabel
    }
  });
};


  const [userName, setUserName] = useState<string>('사용자');
  
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  return (
    <Container>
      <WelcomeMessage>{userName}님, 환영합니다!</WelcomeMessage>
      <Form onSubmit={handleSubmit}>
        <Title>프로젝트 생성</Title>
        
        <FormGroup>
          <Label>
            프로젝트 제목<RequiredAsterisk>*</RequiredAsterisk>
          </Label>
          <InputWrapper>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="프로젝트 제목을 입력해주세요!"
              maxLength={40}
              required
            />
            <CharCount>
              {formData.title.length}/40
            </CharCount>
          </InputWrapper>
        </FormGroup>
        
        <FormGroup>
          <Label>
            카테고리<RequiredAsterisk>*</RequiredAsterisk>
          </Label>
          <InputWrapper>
            <CategoryList>
             {categories.map(cat => (
                <CategoryListItem
                 key={cat.value}
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                 $selected={formData.category === cat.value}
      >
        <i className={`bi ${cat.icon}`}></i>
        <span>{cat.label}</span>
      </CategoryListItem>
    ))}
  </CategoryList>
</InputWrapper>

          
           
          
          <CategoryHelpText>
            <InfoIcon>i</InfoIcon>
            <span>프로젝트 성격에 맞는 카테고리를 선택해주세요.</span>
          </CategoryHelpText>
        </FormGroup>
        
        <SubmitButton 
          type="submit" 
          disabled={!isFormValid}
          $isActive={isFormValid}
        >
          다음
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default ProjectCreatePage;

const CategoryHelpText = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-color: #a66bff;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
`;





const Container = styled.div`
  max-width: 800px;
  margin: 3rem auto;
  padding: 3rem 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  gap: 2rem;
`;

const WelcomeMessage = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 32px 0;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
  text-align: left;
`;

const RequiredAsterisk = styled.span`
  color: #ff4d4f;
  margin-left: 4px;
  font-size: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

const CharCount = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #666;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
`;

const CategoryListItem = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid ${({ $selected }) => ($selected ? '#a66bff' : '#ddd')};
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? '#f3e9ff' : '#fff')};
  color: #333;
  font-size: 16px;
  cursor: pointer;
  gap: 10px;
  width: 100%;
  transition: 0.2s;

  i {
    font-size: 18px;
  }

  &:hover {
    background: #f3e9ff;
  }
`;


const InputWrapper = styled.div`
  position: relative;
  width: 600px;
  margin: 0 auto;
`;

const inputStyles = `
  width: 100%;
  height: 70px;
  padding: 0 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  transition: border-color 0.2s;
  background-color: #fff;
  box-sizing: border-box;`;

const Input = styled.input`
  ${inputStyles}
  padding-right: 80px; // 글자 수 표시를 위한 공간 확보
  
  &:focus {
    outline: none;
    border-color: #a66bff;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  ${inputStyles}
  appearance: none;
  appearance: none;
  background: #fff url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 20px center/16px;
  cursor: pointer;
  appearance: none;
  background: #fff url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center/16px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #a66bff;
  }
`;

const SubmitButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  height: 64px;
  background-color: ${props => props.$isActive ? '#a66bff' : '#f0f0f0'};
  color: ${props => props.$isActive ? 'white' : '#999'};
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    ${props => props.$isActive && `
      background-color: #a66bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(166, 107, 255, 0.3);
    `}
  }
  
  &:focus {
    outline: none;
  }
  
  &:active {
    background-color: ${props => props.$isActive ? '#8c4dff' : '#f0f0f0'};
    transform: ${props => props.$isActive ? 'translateY(0)' : 'none'};
    outline: none;
  }
`;
