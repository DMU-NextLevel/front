import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IDFindPage = () => {
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };


  //이게 비밀번호 변경 api로 적음..되겠지?
  const handleChangePassword = async () => {
    if (currentPassword === newPassword) {
      alert('새로운 비밀번호와 기존 비밀번호가 같습니다.');
      return;
    }
    if (newPassword !== newPasswordCheck) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
  
    try {
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });
  
      if (response.status === 400) {
        alert('모든 값을 입력해 주세요.');
        return;
      }
  
      if (response.status === 404) {
        alert('기존 비밀번호가 일치하지 않습니다.');
        return;
      }
  
      const result = await response.json();
  
      if (result.message === 'success') {
        alert('비밀번호 변경이 완료되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordCheck('');
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('서버 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };
  

  return (
    <div
      style={{
        fontFamily: 'Noto Sans KR, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '0 20px 60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '50px',
        }}
      >
        <button
          onClick={handleLoginClick}
          style={{
            padding: '16px 40px',
            fontSize: '20px',
            fontWeight: '700',
            backgroundColor: '#A66CFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginRight: '20px',
            cursor: 'pointer',
            width: '200px',
          }}
        >
          로그인
        </button>
        <button
          onClick={handleSignupClick}
          style={{
            padding: '16px 40px',
            fontSize: '20px',
            fontWeight: '700',
            backgroundColor: '#A66CFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '200px',
          }}
        >
          회원가입
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 700,
          backgroundColor: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          padding: '50px 40px',
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40 }}>
          아이디·비밀번호 찾기
        </h2>

        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #ddd',
            marginBottom: 32,
          }}
        >
          <div
            onClick={() => setActiveTab('id')}
            style={{
              padding: '14px 20px',
              fontSize: 18,
              fontWeight: 700,
              borderBottom: activeTab === 'id' ? '4px solid #A66CFF' : 'none',
              color: activeTab === 'id' ? '#A66CFF' : '#999',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            아이디 찾기
          </div>
          <div
            onClick={() => setActiveTab('password')}
            style={{
              padding: '14px 20px',
              fontSize: 18,
              fontWeight: 700,
              borderBottom:
                activeTab === 'password' ? '4px solid #A66CFF' : 'none',
              color: activeTab === 'password' ? '#A66CFF' : '#999',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            비밀번호 변경
          </div>
        </div>

        {activeTab === 'id' && (
          <>
            <p
              style={{
                fontSize: 16,
                color: '#666',
                lineHeight: '1.7',
                marginBottom: 32,
              }}
            >
              위드유는 이메일을 아이디로 사용합니다.
              <br />
              소유하고 계신 계정을 입력해보세요.
              <br />
              가입여부를 확인해드립니다.
            </p>

            <input
              type="email"
              placeholder="이메일 계정"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 6,
                marginBottom: 28,
                boxSizing: 'border-box',
              }}
            />

            <button
              style={{
                width: '100%',
                padding: '16px',
                fontSize: 18,
                fontWeight: 700,
                backgroundColor: '#A66CFF',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </>
        )}

        {activeTab === 'password' && (
          <>
            <p
              style={{
                fontSize: 16,
                color: '#666',
                lineHeight: '1.7',
                marginBottom: 32,
              }}
            >
              기존 비밀번호를 입력하고, 새 비밀번호로 변경하세요.
            </p>

            <input
              type="password"
              placeholder="기존 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 6,
                marginBottom: 20,
                boxSizing: 'border-box',
              }}
            />

            <input
              type="password"
              placeholder="변경할 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 6,
                marginBottom: 20,
                boxSizing: 'border-box',
              }}
            />

            <input
              type="password"
              placeholder="변경할 비밀번호 확인"
              value={newPasswordCheck}
              onChange={(e) => setNewPasswordCheck(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 18px',
                fontSize: 16,
                border: '1px solid #ccc',
                borderRadius: 6,
                marginBottom: 28,
                boxSizing: 'border-box',
              }}
            />

            <button
              onClick={handleChangePassword}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: 18,
                fontWeight: 700,
                backgroundColor: '#A66CFF',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              비밀번호 변경
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IDFindPage;
