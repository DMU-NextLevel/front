import styled, { keyframes, css } from 'styled-components';
import React from 'react';

// 애니메이션 키프레임
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 컨테이너 컴포넌트
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

// 헤더 컴포넌트
export const Header = styled.header`
  text-align: center;
  color: white;
  animation: ${fadeInUp} 0.8s ease-out;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${rotate} 5s linear infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

// 카드 그리드
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

interface CardProps {
  variant?: 'primary' | 'secondary' | 'accent';
  hover?: boolean;
}

export const Card = styled.div<CardProps>`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;
  
  ${props => props.variant === 'primary' && css`
    border-left: 5px solid #3b82f6;
  `}
  
  ${props => props.variant === 'secondary' && css`
    border-left: 5px solid #10b981;
  `}
  
  ${props => props.variant === 'accent' && css`
    border-left: 5px solid #f59e0b;
  `}
  
  ${props => props.hover && css`
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
  `}
`;

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
`;

export const CardContent = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

// 버튼 컴포넌트들
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
          &:hover {
            background: linear-gradient(45deg, #2563eb, #1e40af);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return css`
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          &:hover {
            background: linear-gradient(45deg, #059669, #047857);
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: 2px solid #3b82f6;
          color: #3b82f6;
          &:hover {
            background: #3b82f6;
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #6b7280;
          &:hover {
            background: #f3f4f6;
            color: #374151;
          }
        `;
      default:
        return css`
          background: #3b82f6;
          color: white;
          &:hover {
            background: #2563eb;
          }
        `;
    }
  }}
  
  ${props => props.loading && css`
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      margin: auto;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: ${rotate} 1s linear infinite;
    }
  `}
`;

// 입력 컴포넌트들
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

// 뱃지 컴포넌트
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return css`
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'warning':
        return css`
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'error':
        return css`
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case 'info':
        return css`
          background-color: #dbeafe;
          color: #1e40af;
        `;
      default:
        return css`
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

// 로딩 스피너
export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin: 2rem auto;
`;

// 펄스 효과가 있는 아바타
export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
  animation: ${pulse} 2s infinite;
`;

// 알림 컴포넌트
interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const Alert = styled.div<AlertProps>`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  border-left: 4px solid;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return css`
          background-color: #f0fdf4;
          border-color: #22c55e;
          color: #15803d;
        `;
      case 'warning':
        return css`
          background-color: #fffbeb;
          border-color: #f59e0b;
          color: #d97706;
        `;
      case 'error':
        return css`
          background-color: #fef2f2;
          border-color: #ef4444;
          color: #dc2626;
        `;
      default:
        return css`
          background-color: #eff6ff;
          border-color: #3b82f6;
          color: #1d4ed8;
        `;
    }
  }}
`;
