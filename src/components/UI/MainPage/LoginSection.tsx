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
        // 메인페이지에서 로그인 시 새로고침
        window.location.reload();
      }
    };
    window.addEventListener('message', messageListener);
  };

  // 로그인 상태에 따라 다른 콘텐츠 표시
  if (isLoggedIn) {
    return (
      <div className='px-4 sm:px-6 md:px-8 lg:px-[15%] py-8 sm:py-10 md:py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
        <div className='text-center mb-6 sm:mb-8'>
          <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>관심 프로젝트를 확인해보세요</h3>
          <p className='text-xs sm:text-sm text-gray-600'>좋아요한 프로젝트들을 모아보세요</p>
        </div>

        <div className='flex justify-center'>
          <button
            className='px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base'
            onClick={() => navigate('/mypage?tab=liked')}
          >
            관심 프로젝트 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-[15%] py-8 sm:py-10 md:py-12'>
      <div className='w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-900 shadow-sm'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-8 md:py-12'>
          <div className='flex-1'>
            <h3 className='text-sm sm:text-base font-medium text-gray-700'>아직 계정이 없으신가요?</h3>
            <h2 className='text-2xl sm:text-3xl font-bold leading-tight mt-2 text-gray-900'>지금 가입하고 프로젝트를 시작하세요</h2>
            <p className='mt-3 text-sm sm:text-base text-gray-700'>간편하게 소셜 로그인을 통해 시작해보세요</p>
            <div className='mt-4 flex items-center gap-3'>
              <button
                onClick={() => socialLogin('kakao')}
                className='flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 shadow-sm'
              >
                <i className='bi bi-chat-fill text-xl text-black'></i>
              </button>
              <button
                onClick={() => socialLogin('naver')}
                className='flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 shadow-sm'
              >
                <span className='text-white font-bold text-sm'>N</span>
              </button>
              <button
                onClick={() => socialLogin('google')}
                className='flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-300'
              >
                <i className='bi bi-google text-lg text-gray-700'></i>
              </button>
            </div>
          </div>
          <div className='flex items-center justify-center md:items-center md:justify-end md:w-1/3'>
            {/* Gift box icon */}
            <svg className='w-32 h-32 md:w-40 md:h-40' style={{ color: '#A66CFF' }} fill='currentColor' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
              <path d='M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z'/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSection;