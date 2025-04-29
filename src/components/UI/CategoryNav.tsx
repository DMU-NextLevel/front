import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const CategoryNav: React.FC = () => {


  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // 추후 fetch로 실시간 데이터 받아오는 부분으로 확장 가능
  }, []);

  return (
    <Container>

    </Container>
  );
};

export default CategoryNav;


const Container = styled.div`
  background-color: #A66CFF;
  height: 0px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
`;
