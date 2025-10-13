import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../AxiosInstance';
import { useAuth } from '../../../hooks/AuthContext';

const LoginSection: React.FC = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const { refreshAuth, isLoggedIn } = useAuth();

  const socialLogin = (type: string) => {
    const width = 700;
    const height = 900;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url = `${baseUrl}/oauth2/authorization/${type}`;

    window.open(url, 'social_login_popup', `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`);

    const messageListener = (event: MessageEvent) => {
      // 신뢰할 수 있는 도메인인지 확인 (XSS 방어)
      if (event.origin !== window.location.origin) return;

      if (event.data === 'social-success') {
        window.removeEventListener('message', messageListener);
        refreshAuth();
        navigate('/');
      }
    };
    window.addEventListener('message', messageListener);
  };

  // 로그인 상태에 따라 다른 콘텐츠 표시
  if (isLoggedIn) {
    return (
      <div className='px-4 sm:px-6 md:px-8 lg:px-[15%] py-8 sm:py-10 md:py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
        <div className='text-center mb-6 sm:mb-8'>
          <h3 className='text-base sm:text-lg font-semibold text-white mb-2'>관심 프로젝트를 확인해보세요</h3>
          <p className='text-xs sm:text-sm text-gray-300'>좋아요한 프로젝트들을 모아보세요</p>
        </div>

        <div className='flex justify-center'>
          <button
            className='px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base'
            onClick={() => navigate('/mypage?tab=liked')}
          >
            관심 프로젝트 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='px-[15%] py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
      <div className='text-center mb-8'>
        <h3 className='text-lg font-semibold text-white mb-2'>이미 계정이 있나요?</h3>
        <p className='text-sm text-gray-300'>간편하게 소셜 로그인을 통해 시작해보세요</p>
      </div>

      <div className='flex justify-center gap-6'>
        <button
          className='flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 shadow-md'
          onClick={() => socialLogin('kakao')}
        >
          <i className='bi bi-chat-fill text-2xl text-black'></i>
        </button>
        <button
          className='flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-md'
          onClick={() => socialLogin('naver')}
        >
          <span className='text-white font-bold text-sm'>N</span>
        </button>
        <button
          className='flex items-center justify-center w-14 h-14 rounded-full bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md border border-gray-300'
          onClick={() => socialLogin('google')}
        >
          <i className='bi bi-google text-xl text-gray-700'></i>
        </button>
      </div>

      <div className='text-center mt-6'>
        <button
          className='text-white hover:text-gray-300 font-medium text-sm underline'
          onClick={() => navigate('/login')}
        >
          이메일로 로그인
        </button>
      </div>
    </div>
  );
};

export default LoginSection;