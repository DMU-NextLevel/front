import React from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  tags: string[];
}

interface Props {
  onClose: () => void;
  products: Product[];
  selectedFilter: string;
  setSelectedFilter: (v: string) => void;
  allTags: string[];
  userInfo: any;
  tempUserInfo: any;
  profileImage: string | null;
  tempProfileImage: string | null;
}

const RecentOverlay: React.FC<Props> = ({
  onClose,
  products,
  selectedFilter,
  setSelectedFilter,
  allTags,
  userInfo,
  tempUserInfo,
  profileImage,
  tempProfileImage,
}) => {
  const filteredProducts =
    selectedFilter === '전체'
      ? products
      : products.filter((p) => p.tags.includes(selectedFilter));

  return (
    <Overlay>
      <OverlayHeader>
        <h2>나의 활동</h2>
        <CloseButton
          onClick={() => {
            const hasChanges =
              JSON.stringify(userInfo) !== JSON.stringify(tempUserInfo) ||
              profileImage !== tempProfileImage;

            if (hasChanges) {
              Swal.fire({
                icon: 'warning',
                title: '변경 사항이 저장되지 않았습니다',
                text: '입력한 내용이 저장되지 않은 채 창이 닫힙니다.',
                confirmButtonColor: '#a66cff',
              });
            }
            onClose();
          }}
        >
          ×
        </CloseButton>
      </OverlayHeader>

      <ScrollableContent>
        <Tabs>
          <TabGroup>
            <ActiveTab>최근 본</ActiveTab>
          </TabGroup>
          <FilterGroup>
            {['전체', ...allTags].map((cat) => (
              <FilterBtn
                key={cat}
                active={selectedFilter === cat}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat}
              </FilterBtn>
            ))}
          </FilterGroup>
        </Tabs>

        <ItemCount>전체 {filteredProducts.length}개</ItemCount>
        <ProductColumn>
          {filteredProducts.map((item) => (
            <ProductCardOverlay key={item.id}>
              <img src={item.image} alt={item.name} />
              <CardContent>
                <Price>
                  <span>{item.price}</span>
                </Price>
                <p>{item.name}</p>
                <HashtagList>
                  {item.tags.map((tag, i) => (
                    <Hashtag key={i}>#{tag}</Hashtag>
                  ))}
                </HashtagList>
              </CardContent>
            </ProductCardOverlay>
          ))}
        </ProductColumn>
      </ScrollableContent>
    </Overlay>
  );
};

export default RecentOverlay;

/* ---------------------- Styled Components ---------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -55%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
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
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 20px;
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
  gap: 10px;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  background: ${({ active }) => (active ? '#000' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  cursor: pointer;
  font-weight: 500;
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const ProductCardOverlay = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0px;

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
