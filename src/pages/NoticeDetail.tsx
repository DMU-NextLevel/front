import React from 'react';
import styled from 'styled-components';

type NoticeArticle = {
  title: string;
  date: string;
  content: string;
  image?: string;
};

type RelatedNotice = {
  title: string;
  date: string;
};

const article: NoticeArticle = {
  title: "[위드유 파이낸스] 투자서비스 종료공지 안내",
  date: "2024.01.15",
  image: "https://placehold.co/80x80?text=WY",
  content: `안녕하세요. 위드유(주)입니다.

위드유 투자서비스를 이용해주시는 분들께 진심으로 감사 말씀을 드립니다.

위드유 투자서비스는 혁신 투자정보제공(투자콘텐츠/투자분석/투자프로파일) 운영이 중단되며,
공식적으로 2024.1.18자로 투자 서비스 일체가 중단됩니다.

기존 위드유 투자 서비스 계정/자산은 위드유 내의 서비스와 아이디로 내의 투자 관리 영역에서
안전히 종료절차를 거치게 해드리며, 공지사항 사항에 대해서는 별도 FAQ로 안내드리도록 하겠습니다.

감사합니다.
위드유 드림`,
};

const relatedNotices: RelatedNotice[] = [
  {
    title: "[약관/개인] 개인정보처리방침 개정 안내 [위드유]",
    date: "2025.05.27",
  },
  {
    title: "[위드유 파이낸스] 투자서비스 종료공지 안내",
    date: "2024.01.15",
  },
];

// ================== styled components ==================

const Container = styled.div` 
  margin: 0 auto;
  padding: 40px 15%;
  font-family: 'sans-serif';
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
`;

const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  object-fit: cover;
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #1f2937;
  white-space: pre-wrap;
`;

const Divider = styled.hr`
  margin: 40px 0;
  border-color: #e5e7eb;
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const RelatedList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RelatedItem = styled.li`
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
`;

const RelatedTitle = styled.span`
  color: #2563eb;
  font-weight: 500;
`;

const RelatedDate = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const Button = styled.button`
  margin-top: 40px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

// ================== Component ==================

const NoticeDetail: React.FC = () => {
  return (
    <Container>
      <Title>{article.title}</Title>

      <Meta>
        {article.image && (
          <AuthorImage src={article.image} alt="작성자 프로필 이미지" />
        )}
        <span>와디즈</span>
        <span>{article.date}</span>
      </Meta>

      <Content>{article.content}</Content>

      <Divider />

      <SubTitle>공지 말머리에 다른 게시글</SubTitle>
      <RelatedList>
        {relatedNotices.map((notice, index) => (
          <RelatedItem key={index}>
            <RelatedTitle>{notice.title}</RelatedTitle>
            <RelatedDate>{notice.date}</RelatedDate>
          </RelatedItem>
        ))}
      </RelatedList>

      <Button>목록으로 돌아가기</Button>
    </Container>
  );
};

export default NoticeDetail;

