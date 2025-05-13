import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../AxiosInstance';
import noImage from '../assets/images/noImage.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

interface ProjectItem {
  id: number;
  title: string;
  titleImg: string;
  completionRate: number;
  recommendCount: number;
  tags: string[];
  pageCount: number;
  totalCount: number;
  userCount: number;
  createdAt: string;
  isRecommend: boolean;
  expired: string;
  isExpired: boolean;
}

interface ProjectResponse {
  message: string;
  data: ProjectItem[];
}

const categories = [
  { label: '전체', icon: 'bi bi-circle', tag: '' },
  { label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
  { label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
  { label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
  { label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
  { label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
  { label: '게임', icon: 'bi bi-controller', tag: '6' },
  { label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
  { label: '반려동물', icon: 'bi bi-star', tag: '8' },
  { label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
  { label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
];

const orderOptions = [
  { value: 'RECOMMEND', label: '추천순' },
  { value: 'COMPLETION', label: '달성률순' },
  { value: 'USER', label: '유저순' },
  { value: 'CREATED', label: '생성일순' }
];

const Search: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [order, setOrder] = useState('RECOMMEND');
  const [page, setPage] = useState('1');
  const [tag, setTag] = useState('');
  const orderIndex = orderOptions.findIndex(opt => opt.value === order);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // const fetchProjects = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const query = `/public/project/all?order=${order}&page=${page}&tag=${tag}`;
  //     const response = await api.get<ProjectResponse>(query);
  //     setProjects(response.data.data);
  //   } catch {
  //     setError('프로젝트 불러오기 실패');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
///////////////////////////////////////////////////////////////////////////////////////
const fetchProjects = () => {
  setLoading(true);
  setError(null);

  // 더미 데이터 삽입
  const dummyData: ProjectItem[] = [
    {
      "id": 1,
      "title": "판타지역사소설 <바라다라의 시간>",
      "titleImg": "/src/여운1.png",
      "completionRate": 30,
      "recommendCount": 0,
      "tags": [
        "라이프 스타일",
        "패션 잡화"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 30,
      "createdAt": "2025-05-11T07:43:09.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 2,
      "title": "[이불6장압축] 압파의 금의환향",
      "titleImg": "/src/-01 오후 7.59.421.png",
      "completionRate": 80,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "라이프 스타일"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:11.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 3,
      "title": "project title",
      "titleImg": "/src/-01 오후 7.59.422.png",
      "completionRate": 60,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "라이프 스타일"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:15.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 4,
      "title": "project title",
      "titleImg": "/src/-01 오후 7.59.423.png",
      "completionRate": 20,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "라이프 스타일"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:17.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 5,
      "title": "project title",
      "titleImg": "/src/-01 오후 7.59.424.png",
      "completionRate": 1980,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "라이프 스타일"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:18.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 6,
      "title": "project title",
      "titleImg": "/src/-01 오후 7.59.425.png",
      "completionRate": 128,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "뷰티 헬스"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:23.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 7,
      "title": "project title2",
      "titleImg": "/src/-01 오후 7.59.426.png",
      "completionRate": 75,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "뷰티 헬스"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T02:31:26.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 8,
      "title": "자유자재 데포르메 3D \u003C머슬&커비바디\u003E",
      "titleImg": "/src/-01 오후 7.59.427.png",
      "completionRate": 5,
      "recommendCount": 0,
      "tags": [
        "테크 가전",
        "게임"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T07:13:06.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    },
    {
      "id": 9,
      "title": "어디서든 누를 수 있는 \u003C키보드 키링\u003E",
      "titleImg": "/src/-01 오후 7.59.428.png",
      "completionRate": 45,
      "recommendCount": 0,
      "tags": [
        "테크 가전"
      ],
      "pageCount": 1,
      "totalCount": 9,
      "userCount": 0,
      "createdAt": "2025-05-13T07:17:54.000+00:00",
      "isRecommend": false,
      "expired": "2025-03-03T00:00:00.000+00:00",
      "isExpired": true
    }
  
  ];

  setProjects(dummyData);
  setLoading(false);
};

//////////////////////////////////////////////////////////////////////////////////
  
  const handleLikeToggle = async (projectId: number, current: boolean) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      if (current) {
        await api.delete(`/project/like/${projectId}`);
      } else {
        await api.post(`/project/like/${projectId}`);
      }
      fetchProjects();
    } catch (e) {
      console.error('좋아요 실패', e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [tag]);

  return (
    <Container>
      <CategoryRow>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.tag}
            onClick={() => setTag(cat.tag)}
            className={tag === cat.tag ? 'active' : ''}
          >
            <i className={cat.icon}></i>
            <span>{cat.label}</span>
          </CategoryItem>
        ))}
      </CategoryRow>
      <OrderTabWrapper>
        <OrderSlider style={{ transform: `translateX(${orderIndex * 100}%)` }} />
        {orderOptions.map((opt) => (
          <OrderButton
            key={opt.value}
            onClick={() => setOrder(opt.value)}
            className={order === opt.value ? 'active' : ''}
          >
            {opt.label}
          </OrderButton>
        ))}
      </OrderTabWrapper>
      {loading && (
        <LoadingOverlay>
          <DotWaveWrapper>
            <Dot /> <Dot /> <Dot />
          </DotWaveWrapper>
        </LoadingOverlay>
      )}
      {projects.length === 0 && !loading && <div>검색 결과가 없습니다.</div>}
      {error && <ErrorText>{error}</ErrorText>}

      <CardList>
        {projects.map((item) => (
            <Card key={item.id}>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <CardTopWrapper>
                    <Thumbnail
                      src={`https://api.nextlevel.r-e.kr/img/${item.titleImg}`}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = noImage;
                      }}
                    />
                    
                    <HeartIcon
                      className={item.isRecommend ? 'bi bi-heart-fill' : 'bi bi-heart'}
                      onClick={() => handleLikeToggle(item.id, item.isRecommend)}
                    />
                  </CardTopWrapper>
                  
                  <CardContent>
                    <InfoRow>{item.completionRate}% 달성</InfoRow>
                    <TitleRow>{item.title}</TitleRow>
                    <CreaterRow>회사이름</CreaterRow>
                    {/* <InfoRow>추천 수: {item.recommendCount}</InfoRow> */}
                    <TagLow>
                    {item.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                    </TagLow>
                  </CardContent>
                  </div> 
                  <ProgressSection>
                    <ProgressBarWrapper>
                      <ProgressBar percent={item.completionRate}><Tooltip percent={item.completionRate} className="tooltip" >{item.userCount}명이 참여!</Tooltip></ProgressBar>
                      
                    </ProgressBarWrapper>
                    
                  </ProgressSection>
              </div>
            </Card>
          
        ))}
      </CardList>
    </Container>
  );
};

export default Search;



const HeartIcon = styled.i`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #a66cff;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const CardTopWrapper = styled.div`
  position: relative;
`;


const Container = styled.div`
  padding: 0 15%;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
`;


const CategoryRow = styled.div`
  display: flex;
  overflow-x: auto;
  height: 80px;
  padding: 12px 20px;
  
  align-items: center;
  justify-content: space-between;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  min-width: 80px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  i {
    font-size: 22px;
    margin-bottom: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    
  }
    &:hover {
        color: #A66CFF;
        font-weight: bold;
        transition: all 0.2s ease;
      }

  &.active {
    color: #A66CFF;
    font-weight: bold;
    transition: all 0.2s ease;
    margin: 0 10px;
    i {
      transition: all 0.2s ease;
      background: #A66CFF;
      color: white;
      border-radius: 50%;
      padding: 6px;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const SelectedTagText = styled.p`
  font-size: 16px;
  margin-bottom: 12px;
  color: #555;
`;
const SearchForm = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
`;
const Select = styled.select`
  padding: 8px;
  margin-left: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;
const OrderTabWrapper = styled.div`
  position: relative;
  display: flex;
  background: #f2f2f2;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const OrderSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 25%; /* 버튼 개수만큼 나눠야 함: 4개면 25% */
  height: 100%;
  background: #A66CFF;
  border: 2px solid #3fa9f5;
  border-radius: 20px;
  transition: transform 0.3s ease;
  z-index: 0;
`;

const OrderButton = styled.button`
  flex: 1;
  padding: 12px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #999;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  z-index: 1;
  position: relative;

  &.active {
    color: white;
  }
`;


const Input = styled.input`
  padding: 8px;
  margin-left: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background: #A66CFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #944dff;
  }
`;

const ErrorText = styled.h3`
  color: red;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 50px;
  justify-content: space-between;
  overflow: visible;
  position: relative;
  z-index: 0;
`;


const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 280px;
  margin: 20px 0;
  overflow: visible;
  position: relative;
  z-index: 3;

  &:hover {
    z-index: 5;
  }
`;
const Thumbnail = styled.img`
  height: 160px;
  cursor: pointer;
  border-radius: 12px;
  border : 1px solid #ddd;
  object-fit: cover;
  width: 260px;
  z-index: 1;
  &:hover{
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      transform: scale(1.005);
      transition: all 0.2s ease;  
    } 

  img {
    height: 180px;
    width: 100%;
    object-fit: cover;
    z-index: 1;
    transition: transform 0.3s ease;
      hover{
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      transform: scale(1.005);
      transition: all 0.2s ease;  
    }
 
    }
`;

const CardContent = styled.div`
  
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 18px;
    margin : 0 0;
    font-weight: bold;
  }
`;

const TitleRow = styled.div`
  font-size: 16px;
  color: #333;
  margin: 4px 0 0 0;
  font-weight: 500;
  cursor: pointer;
`;
const InfoRow = styled.div`
  font-size: 12px;
  color: #A66CFF;
  margin: 4px 0 0 0;
`;

const CreaterRow = styled.div`
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
  cursor: pointer;
  hover {
    color: #A66CFF;
    font-weight: bold;
    transition: all 0.2s ease;
  }
`;  
const ProgressSection = styled.div`
  width: 10px;
  height: 100%;
  margin-left: 5px;
  position: relative;
  overflow: visible;
  border-radius: 10px;
  padding: 0;
  z-index: 2;
  transition: all 0.5s ease;
  &:hover {
      box-shadow: 0 0 6px rgba(166, 108, 255, 0.5); /* 보라색 계열 그림자 */
      transform: scale(1.01); /* 살짝 확대 */
    }
`;
const Tooltip = styled.div<{ percent: number }>`
  position: absolute;
  z-index: 9999;
  right: -100px;
  transform: translateY(-50%);
  padding: 10px;
  background: ${({ percent }) => {
    if (percent >= 80) return '#A66CFF'; // MainColor
    if (percent >= 60) return '#9C9EFE'; // SubColor 1
    if (percent >= 40) return '#AFB4FF'; // SubColor 2
    if (percent >= 20) return '#B1E1FF'; // SubColor 3
    return '#9A9A9A';                    // SubColor 4
  }};
  border-radius: 10px;
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: white;
  opacity: 0;
  transition: opacity 0s ease;
  transition-delay: 0s;
  pointer-events: none;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: -9px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid ${({ percent }) => {
    if (percent >= 80) return '#A66CFF'; // MainColor
    if (percent >= 60) return '#9C9EFE'; // SubColor 1
    if (percent >= 40) return '#AFB4FF'; // SubColor 2
    if (percent >= 20) return '#B1E1FF'; // SubColor 3
    return '#9A9A9A';                    // SubColor 4
  }}; 
  }

  ${ProgressSection}:hover & {
    opacity: 1;
    transition: opacity 0.3s ease;
    transition-delay: 0.5s;
    
  }
`;

const ProgressBarWrapper = styled.div`
  background: #eee;
  position: relative;
  border-radius: 10px;
  width: 10px;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  transition: all 0.3s ease;  
`;



const ProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: ${({ percent }) => percent}%;
  background: ${({ percent }) => {
    if (percent >= 80) return '#A66CFF'; // MainColor
    if (percent >= 60) return '#9C9EFE'; // SubColor 1
    if (percent >= 40) return '#AFB4FF'; // SubColor 2
    if (percent >= 20) return '#B1E1FF'; // SubColor 3
    return '#9A9A9A';                    // SubColor 4
  }};
  transition: height 0.3s ease;
  border-radius: 10px;
`;



const TagLow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #f2f2f2;
  padding: 4px 6px;
  font-size: 10px;
  border-radius: 6px;
  color: #555;
  
`;


const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;



const DotWaveWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  background-color: #A66CFF;
  border-radius: 50%;
  margin: 0 5px;
  animation: wave 0.8s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.15s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes wave {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;
