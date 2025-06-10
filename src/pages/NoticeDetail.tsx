import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUserRole } from '../hooks/useUserRole';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../AxiosInstance';

type NoticeArticle = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  imgs?: string[];
};

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

const ArticleOption = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  justify-content: space-between;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const ArticleOptionItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #2563eb;
  }
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

const NoticeDetail: React.FC = () => {
  const { role, loading: roleLoading } = useUserRole();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state as NoticeArticle | undefined;

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
  };

  if (!article) {
    return <Container>공지 정보를 불러올 수 없습니다.</Container>;
  }
  
  //삭제 함수
  const handleDelete = async () => {
    if (!id) return;
    console.log(id);
    const confirm = window.confirm('정말 삭제하시겠습니까?');
    if (!confirm) return;
    
    try {
      const res = await api.post(`/admin/notice/${id}`);
      if (res.data.message === 'success') {
        alert('삭제가 완료되었습니다.');
        navigate('/notice');
      } else {
        alert('삭제 실패: ' + res.data.message);
      }
    } catch (err) {
      console.error('삭제 중 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  // 🧩 이미지 삽입된 content HTML에 실제 이미지 경로 삽입
  const getProcessedContent = () => {
    const parser = new DOMParser(); 
    const doc = parser.parseFromString(article.content, 'text/html');
    const imgTags = doc.querySelectorAll('img');

    imgTags.forEach((img, idx) => {
      if (article.imgs && article.imgs[idx]) {
        img.setAttribute('src', `${api.defaults.baseURL}img/${article.imgs[idx]}`);
      }
    });

    return { __html: doc.body.innerHTML };
  };

  return (
    <Container>
      <Title>{article.title}</Title>
      <ArticleOption>
        <Meta>
          {article.imgs && article.imgs.length > 0 && (
            <AuthorImage src={`https://placehold.co/80x80?text=WU`} alt="작성자 이미지" />
          )}
          <span>위드유</span>
          <span>{formatDate(article.createdAt)}</span>
        </Meta>

        {!roleLoading && role === 'ADMIN' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <ArticleOptionItem onClick={() => navigate(`/notice/edit/${article.id}`, {
              state: {
                article,
              },
            })}>수정</ArticleOptionItem>
            <ArticleOptionItem onClick={() => handleDelete()}>삭제</ArticleOptionItem>
          </div>
        )}
      </ArticleOption>


      <div style={{ margin: '40px 0' }} dangerouslySetInnerHTML={getProcessedContent()} />
      <hr/>
      { // 원본 content 보여주기
      /* <Content>{article.content}</Content> */}

  

      <Button onClick={() => navigate('/notice')}>목록으로 돌아가기</Button>
    </Container>
  );
};


export default NoticeDetail;
