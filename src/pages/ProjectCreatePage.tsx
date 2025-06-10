import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import Swal from 'sweetalert2';


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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("프로젝트 생성 데이터:", formData);

    const { isConfirmed } = await Swal.fire({
      title: '개인정보 수집 및 이용 동의',
      html: `
        <div style="text-align: left; padding: 0 10px;">
          

          <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <p style="font-weight: bold; margin-bottom: 10px;">개인정보 수집 및 이용 동의</p>
            
            <div style="max-height: 400px; overflow-y: auto; margin-bottom: 15px; padding: 10px; background: white; border: 1px solid #eee; border-radius: 4px;">
              <h3>1. 수집하는 개인정보 항목</h3>
              <div>
                <h4><개인 메이커></h4>
                <ul>
                  <li>필수항목: 대표자 정보 (이름, 이메일주소, 휴대전화 번호, 본인인증값(DI)), 정산대금 입금 계좌정보(은행명, 예금주명, 계좌번호), 뒷자리 마스킹된 신분증 사본(생년월일, 주소), 담당자정보(이메일, 전화번호, 담당자와 대표자가 다른 경우에 한함)</li>
                </ul>
                
                <h4><개인사업자 메이커 / 법인사업자 메이커></h4>
                <ul>
                  <li>필수항목: 대표자 정보 (이름, 이메일주소, 휴대전화 번호, 본인인증정보(DI), 생년월일, 사업장 소재지, 성별, 공동대표인 경우 대표 전부의 정보를 의미), 정산대금 입금 계좌정보(은행명, 예금주명, 계좌번호), 담당자정보(이메일, 전화번호, 담당자와 대표자가 다른 경우에 한함)</li>
                </ul>
                
                <p>회사는 부가가치세법 제16조에 따른 세금계산서 교부를 위해 개인 메이커에 대해 아래와 같은 개인정보를 수집합니다.</p>
                <ul>
                  <li>주민등록번호</li>
                </ul>
                
                <p>또한 서비스 이용 과정에서 서비스 이용기록, 접속로그, 쿠키, IP주소, 기기정보 등이 생성되어 저장될 수 있습니다.</p>
              </div>

              <h3>2. 개인정보의 수집 및 이용 목적</h3>
              <ul>
                <li>서비스 개설 관련 신청/문의 및 상담</li>
                <li>서비스 이용 메이커 회원 관리</li>
                <li>서비스 제공에 관한 계약 이행</li>
                <li>서비스 제공에 따른 정산금 지급 및 사후 관리</li>
              </ul>

              <h3>3. 개인정보의 보유 및 이용기간</h3>
              <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
              <p>관련 법령에 의해 일정기간 보관이 필요한 개인정보의 경우, 해당 법령의 규정에 따라 보관합니다.</p>
              <p>아래 법령에서 일정기간 정보의 보관을 규정하는 경우, 표시된 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다.</p>
              <ul>
                <li>국세기본법 : 거래에 관한 장부 및 증거서류 (5년)</li>
              </ul>
              <p>그 밖의 사항은 회사의 개인정보 처리방침에 따릅니다.</p>
            </div>
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#a66bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '동의하고 계속하기',
      cancelButtonText: '취소',
      reverseButtons: true
    });

    if (!isConfirmed) {
      return; // 사용자가 취소한 경우
    }
    
    setIsLoading(true);
    
    // ✅ 여기서 라벨 값 찾아서 함께 넘김
    const selectedCategory = categories.find(cat => cat.value === formData.category);
    const categoryLabel = selectedCategory?.label || formData.category;
    
    // 1초 대기 (로딩 효과를 보여주기 위함)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>프로젝트 생성 중...</LoadingText>
        </LoadingOverlay>
      )}
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
                 type="button"
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
          제출하기
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

// 로딩 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #a66bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
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
