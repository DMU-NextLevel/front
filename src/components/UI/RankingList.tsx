import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 더미 데이터
const projects = [
  {
    id: 1,
    title: 'HoverAir X1: 셀프 비행 카메라',
    percent: 40,
    image: 'https://i.ebayimg.com/images/g/T9UAAOSweV9lXHQs/s-l400.jpg'
  },
  {
    id: 2,
    title: 'Drumi: 발로 작동하는 세탁기',
    percent: 20,
    image: 'https://img1.daumcdn.net/thumb/R800x0/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F255A414858B3CB532C&scode=mtistory2'
  },
  {
    id: 3,
    title: 'Nomad 에너지 드링크',
    percent: 100,
    image: 'https://www.yankodesign.com/images/design_news/2025/04/draft-coffeejack/coffeejack_v2_3.jpg'
  },
  {
    id: 4,
    title: 'COFFEEJACK V2: 휴대용 에스프레소 머신',
    percent: 55,
    image: 'https://cdn.homecrux.com/wp-content/uploads/2025/04/COFFEEJACK-V2-Portable-Espresso-machine-2.jpg'
  },
  {
    id: 5,
    title: 'Pebble Time: 스마트워치',
    percent: 75,
    image: 'https://i.kickstarter.com/assets/012/032/069/46817a8c099133d5bf8b64aad282a696_original.png?anim=false&fit=cover&gravity=auto&height=576&origin=ugc&q=92&sig=rOTB6R5uOmKTlUpnqYLqKALPN0hricwUTf950LCIVrI%3D&v=1463725702&width=1024'
  },
  {
    id: 6,
    title: 'Glyph: 몰입형 헤드셋',
    percent: 90,
    image: 'https://kr.aving.net/news/photo/201702/1375955_549261_1410.jpg'
  }
];


const ArrowRightCircleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = 'currentColor',
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" style={{ verticalAlign: 'middle' }} className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
);


const RankingList:React.FC = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/funding')
  }

  return (
    <Wrapper>
      <Title>실시간 랭킹</Title>
      
      <List>
        {projects.map((item, index) => (
          <ImageTextItem onClick={handleClick} key={item.id}>
            <RankNumber>{index + 1}</RankNumber>
            <Info>
              <ProjectTitle>{item.title}</ProjectTitle>
              <Percent>{item.percent}% 달성</Percent>
            </Info>
            <ImageWrapper>
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <NoImage>이미지 없음</NoImage>
              )}
            </ImageWrapper>
          </ImageTextItem>
          
          
        ))}
      </List>
      <div style={{ textAlign: 'right', marginBottom: '10px', margin: '0' }}>
        <LinkToRecommand href="/">실시간 랭킹 더보기  <ArrowRightCircleIcon size={15} color="#" />
        </LinkToRecommand>
      </div>
    </Wrapper>
  );
};



// 전체 컨테이너
const Wrapper = styled.div` 
  width: 30%;
  background: #fff;
  padding: 40px 0px 0px 20px;
  border-left: 1px solid #eaeaea;
  margin-left : 40px;
`;

// 랭킹 박스
const ImageTextItem = styled.div`
  display: flex;
  align-items: flex-start;  
  margin-bottom: 12px;
  justify-content: space-between;
  margin-bottom: 12px;
  `;

// 랭킹 숫자
const RankNumber = styled.div`
  font-weight: bold;
  font-size: 22px;
  width: 20px;
  color: #333;
  margin-top: 6px;
`;


// 제목
const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  margin: 0;
`;

// 리스트 전체
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
`;

// 개별 아이템
const Item = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

// 이미지 감싸는 박스
const ImageWrapper = styled.div`
  width: 100px;
  height: 70px;
  background-color: #f0f0f0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  margin-right: 12px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }
  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
    filter: brightness(1.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;


const NoImage = styled.div`
  text-align: center;
`;

// 텍스트 영역
const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
`;

// 달성률
const Percent = styled.span`
  color: #7b61ff;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

// 제목
const ProjectTitle = styled.span`
  font-size: 14px;
  line-height: 1.3;
`;





const LinkToRecommand = styled.a`
  font-size: 14px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.6em 0.6em;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  background-image: linear-gradient(45deg,rgb(89, 50, 147) 50%, transparent 50%);
  background-position: 100%;
  background-size: 400%;
  transition: background-position 300ms ease-in-out, color 300ms ease-in-out;
  border-radius: 50px;

  &:hover {
    background-position: 0;
    color: #fff;
    text-decoration: none;
  }
`;

export default RankingList;
