import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { api, testApi } from '../AxiosInstance';
import noImage from '../assets/images/noImage.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useSearchParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchProjectsFromServer } from '../components/UI/fetchProjectsFromServer';
import NewProject from '../components/UI/NewProject';



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
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tagFromState = location.state as string | undefined;
  const initialTag = tagFromState || searchParams.get('tag') || '';
  const [tag, setTag] = useState(initialTag);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [order, setOrder] = useState('RECOMMEND');
  const [page, setPage] = useState('0');
  //const [tag, setTag] = useState('');
  const orderIndex = orderOptions.findIndex(opt => opt.value === order);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProjectRef = useCallback((node: HTMLDivElement | null) => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();



  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      // Prevent duplicate calls to page 1
      const nextPage = parseInt(page) + 1;
      if (page !== '0' || nextPage > 1) {
        setPage(prev => (parseInt(prev) + 1).toString());
      }
    }
  });

  if (node) observer.current.observe(node);}, [loading, hasMore]);

  // 검색 키워드 저장
  useEffect(() => {
    const keyword = searchParams.get('search');
    setSearchTerm(keyword ?? '');
  }, [searchParams]);

  
  useEffect(() => {
    const newTag = searchParams.get('tag');
    if (newTag !== tag) {
      setTag(newTag || '');
    }
  }, [searchParams]);

  useEffect(() => {
    // tag나 order가 변경될 때만 fetchProjects 호출
    if (tag || order || searchTerm) {
      setProjects([]);
      setHasMore(true);
      fetchProjects();
    }
  }, [tag, order, searchTerm]);

  useEffect(() => {
    // 페이지가 변경될 때만 fetchProjects 호출
    if (page && page !== '0') {
      fetchProjects();
    }
  }, [page]);

  const getRemainingDays = (expiredDateStr: string, createdDateStr: string): string => {
    const today = new Date();
    const expiredDate = new Date(expiredDateStr);
    const createdDate = new Date(createdDateStr);

    // 남은 일수 계산 (현재 시간 기준)
    const diffTime = expiredDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 생성일로부터 24시간 이내면 NEW
    const createdDiff = today.getTime() - createdDate.getTime();
    const createdHours = Math.floor(createdDiff / (1000 * 60 * 60));

    return createdHours <=24 ? 'New' : diffDays < 0 ? '마감' : `${diffDays}일 남음`;
  };


  const fetchProjects = async () => {
    try {
      setLoading(true); // 🔐 로딩 시작
      const loadProjects = async () => {
        const data = await fetchProjectsFromServer({ 
          order: order || 'RECOMMEND',
          page: 0,
          search: searchTerm,
          desc: false,
          tag: tag !== null && tag !== undefined && !isNaN(parseInt(tag))
            ? parseInt(tag)
            : undefined,
        });
        console.log("📦 서버에서 받아온 프로젝트:", data);
        if (Array.isArray(data)) {
          setProjects(data);
        }
      };
      await Promise.all([
        loadProjects(),
        new Promise((resolve) => setTimeout(resolve, 500))
      ]);
      
    } catch (error) {
      console.error('프로젝트 불러오기 실패:', error);
      setError('프로젝트 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };
  
  //좋아요 기능 추후 추가 예정
  const handleLikeToggle = async (projectId: number, current: boolean) => {
    // if (!isLoggedIn) {
    //   navigate('/login');
    //   return;
    // }
    // try {
    //   if (current) {
    //     await api.delete(`/project/like/${projectId}`);
    //   } else {
    //     await api.post(`/project/like/${projectId}`);
    //   }
    //   fetchProjects();
    // } catch (e) {
    //   console.error('좋아요 실패', e);
    // }
  };


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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {searchTerm && (
          <SearchTermWrapper>
            <SearchTerm>{searchTerm}</SearchTerm> 검색 결과
            <CloseButton onClick={() => setSearchTerm('')}>
              <i className="bi bi-x"></i>
            </CloseButton>
          </SearchTermWrapper>
        )}
        </div>
      {projects.length === 0 && !loading && <NoResult><i className="bi bi-search"></i><p>검색 결과가 없습니다.</p></NoResult>}
      {projects.length > 0 && <div>총 <strong>{projects.length}</strong>개의 프로젝트가 있습니다.</div>}
      {/* {error && <ErrorText>{error}</ErrorText>} */}
      
      
      

      <CardList>
        {projects.map((item, index) => {
          const isLast = index === projects.length - 1;
          return (
            <Card key={item.id} ref={isLast ? lastProjectRef : undefined}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                <a href={`/project/${item.id}`}>  
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
                  </a>
                  {/* id:{item.id} */}
                  <CardContent>
                    <InfoRow>{item.completionRate}% 달성</InfoRow>
                    <a href={`/project/${item.id}`}>  
                    <TitleRow>{item.title}</TitleRow>
                    </a>
                    <CreaterRow>회사이름</CreaterRow>
                    {/* <InfoRow>추천 수: {item.recommendCount}</InfoRow> */}
                    <TagLow>
                      <Tag>{item.tags[0]}</Tag>
                      {item.tags[0] && <Tag>{item.tags[1]}</Tag>}
                    </TagLow>
                    
                  </CardContent>
                  </div> 
                  <ProgressSection percent={item.completionRate}>
                    <ProgressBarWrapper>
                      <ProgressBar percent={item.completionRate}>
                        <Tooltip percent={item.completionRate} className="tooltip" >{item.userCount}명 참여</Tooltip>
                        </ProgressBar>
                      
                    </ProgressBarWrapper>
                    
                  </ProgressSection>
              </div>
            </Card>
          );
        })}
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
  margin: 0 15%;

  @media (max-width: 1500px) {
    margin: 0 10%;
  }
  @media (max-width: 1200px) {
    margin: 0 5%;
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

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  column-gap: 50px;
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
  a{
    text-decoration: none;
    color: inherit;
  }
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
  transition: all 0.5s ease;  
  &:hover{
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      transform: scale(1.005);
      transition: all 0.5s ease;  
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
  min-height: 40px;
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
const ProgressSection = styled.div<{ percent: number }>`
  width: 10px;
  height: 100%;
  margin-left: 10px;
  position: relative;
  overflow: visible;
  border-radius: 10px;
  padding: 0;
  z-index: 2;
  transition: all 0.5s ease;
  &:hover {
      box-shadow: 0 0 6px ${({ percent }) => {
    if (percent >= 80) return '#A66CFF'; // MainColor
    if (percent >= 60) return '#9C9EFE'; // SubColor 1
    if (percent >= 40) return '#AFB4FF'; // SubColor 2
    if (percent >= 20) return '#B1E1FF'; // SubColor 3
    return '#9A9A9A';                    // SubColor 4
  }};; /* 보라색 계열 그림자 */
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
  &:hover {
    background: #A66CFF;
    color: white;
    font-weight: bold;
    transition: all 0.2s ease;
  }
`;


const LoadingOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
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

const NoResult = styled.div`
  text-align: center; 
  padding: 130px;
  color: #888;
  p {
    font-size: 32px;
    color: #888;
    font-weight: bold;
  } 

  i {
    font-weight: bold;
    font-size: 64px;
  }
`;



const SearchTermWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
  color:#888;
`;

const SearchTerm = styled.span`
  margin-right: 8px;
  color: #000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
  
