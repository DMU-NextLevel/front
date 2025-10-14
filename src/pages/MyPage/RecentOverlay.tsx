import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import { api } from '../../AxiosInstance';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  tags: string[];
}

interface Props {
  onClose: () => void;
  selectedFilter: string;
  setSelectedFilter: (v: string) => void;
  allTags: string[];
  userInfo: any;
  tempUserInfo: any;
  profileImage: string | null;
  tempProfileImage: string | null;
}

// 카테고리 목록
const categories = ['테크 가전', '패션 잡화', '취미 DIY', '교육 키즈', '여행 레저', '라이프 스타일', '뷰티 헬스', '게임', '반려동물', '푸드 음료']

const baseUrl = process.env.REACT_APP_API_BASE_URL

const RecentOverlay: React.FC<Props> = ({
  onClose,
  selectedFilter,
  setSelectedFilter,
  allTags,
  userInfo,
  tempUserInfo,
  profileImage,
  tempProfileImage,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 표시할 카테고리 목록
  const displayedCategories = showAllCategories
    ? ['전체', ...categories]
    : ['전체', ...categories.slice(0, 5)];

  // API에서 최근 본 데이터 불러오기
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.post('/social/user/project', {
          page: 0,
          pageCount: 10,
          type: 'VIEW',
        });

        const apiProjects = res.data.data?.projects || [];

        const mapped: Product[] = apiProjects.map((p: any) => ({
					id: p.id,
					name: p.title,
					price: `${p.likeCount || 0}명이 좋아요`, // 가격이 없으므로 likeCount 대체
					image: p.titleImg?.uri,
					category: p.tags?.[0] || '기타',
					tags: p.tags || [],
				}))

        setProducts(mapped);
      } catch (err) {
        console.error('최근 본 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  // 선택된 카테고리에 따라 필터링
  const filteredProducts = selectedFilter === '전체' ? products : products.filter((product) => product.tags.includes(selectedFilter))

  // 오버레이가 열릴 때 body 스크롤 막기
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
		<>
			{/* 뒤 배경 */}
			<Backdrop />

			{/* 가운데 흰색 박스 */}
			<Overlay>
				<OverlayHeader>
					<h2>나의 활동</h2>
					<CloseButton
						onClick={() => {
							onClose()
						}}>
						×
					</CloseButton>
				</OverlayHeader>

				<ScrollableContent>
					<Tabs>
						<TabGroup>
							<ActiveTab>최근 본</ActiveTab>
						</TabGroup>

						{/* 카테고리 필터 */}
						<FilterGroup>
							{displayedCategories.map((cat) => (
								<FilterBtn key={cat} active={selectedFilter === cat} onClick={() => setSelectedFilter(cat)}>
									{cat}
								</FilterBtn>
							))}

							{/* 더보기 / 접기 버튼 */}
							<MoreBtn onClick={() => setShowAllCategories(!showAllCategories)}>{showAllCategories ? '접기 ▲' : '더보기 ▼'}</MoreBtn>
						</FilterGroup>
					</Tabs>

					{loading ? (
						<ItemCount>불러오는 중...</ItemCount>
					) : (
						<>
							<ItemCount>전체 {selectedFilter === '전체' ? products.length : filteredProducts.length}개</ItemCount>

							<ProductGrid>
								{filteredProducts.map((item: Product) => (
									<ProductCardOverlay key={item.id}>
										<img
											src={`${baseUrl}/img/${item.image}`}
											alt={item.name}
											style={{
												width: '100%',
												height: '120px',
												objectFit: 'cover',
												borderRadius: '8px',
											}}
										/>
										<CardContent>
											<Price>
												<span>{item.price}</span>
											</Price>
											<p
												style={{
													margin: '8px 0',
													fontSize: '14px',
													lineHeight: '1.4',
												}}>
												{item.name}
											</p>
											<HashtagList>
												{item.tags.map((tag: string, i: number) => (
													<Hashtag key={i}>#{tag}</Hashtag>
												))}
											</HashtagList>
										</CardContent>
									</ProductCardOverlay>
								))}
							</ProductGrid>
						</>
					)}
				</ScrollableContent>
			</Overlay>
		</>
	)
};

export default RecentOverlay;

/* ---------------------- Styled Components ---------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -55%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

// 뒤 배경 (반투명)
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
`;

const Overlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 999;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }
`;

const CloseButton = styled.button`
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  font-weight: bold;

  &:hover {
    color: #a66cff;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  padding-right: 6px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-direction: column;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const Tab = styled.div`
  font-size: 16px;
  color: #999;
  cursor: pointer;
`;

const ActiveTab = styled(Tab)`
  font-weight: bold;
  color: #000;
  border-bottom: 2px solid #000;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  border: 1px solid ${({ active }) => (active ? '#000' : '#ddd')};
  padding: 6px 12px;
  border-radius: 16px;
  background: ${({ active }) => (active ? '#000' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
    color: ${({ active }) => (active ? '#fff' : '#000')};
  }
`;

const MoreBtn = styled.button`
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  margin-left: 4px;

  &:hover {
    color: #000;
  }
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }
`;

const ProductCardOverlay = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 10px;

  p {
    font-size: 13px;
    color: #333;
    margin-top: 6px;
  }
`;

const Price = styled.div`
  font-size: 14px;
  color: #a66cff;

  span {
    font-weight: bold;
  }
`;

const HashtagList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Hashtag = styled.span`
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
`;
