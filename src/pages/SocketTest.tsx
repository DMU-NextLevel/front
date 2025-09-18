import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext'; // 기존 AuthContext 파일 경로로 수정하세요.

// 백엔드 SocketController의 엔드포인트
const SSE_ENDPOINT = 'http://localhost:8080/socket';

const IntegratedSseTestComponent: React.FC = () => {
  const { isLoggedIn, refreshAuth } = useAuth();

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<string[]>([]);

  // 컴포넌트 마운트 시 인증 상태를 새로고침하고,
  // 이후 로그인 상태가 되면 SSE 연결을 시도합니다.
  useEffect(() => {
    // 1. 컴포넌트가 마운트될 때만 실행
    console.log('--- 컴포넌트 마운트 ---');

    // AuthProvider의 초기 인증 상태를 확인합니다.
    refreshAuth();

    let eventSource: EventSource | null = null;

    // 2. 로그인 상태일 경우에만 연결 로직 실행
    if (isLoggedIn) {
      console.log('🔗 로그인 상태 감지! SSE 연결을 시작합니다...');
      setConnectionStatus('connecting');

      try {
        eventSource = new EventSource(SSE_ENDPOINT);

        eventSource.onopen = () => {
          console.log('✅ SSE 연결 성공');
          setConnectionStatus('connected');
        };

        eventSource.onmessage = (event) => {
          console.log('➡️ 새로운 메시지 수신:', event.data);
          setMessages(prevMessages => [...prevMessages, event.data]);
        };

        eventSource.onerror = (error) => {
          console.error('❌ SSE 연결 오류 발생:', error);
          setConnectionStatus('error');
        };
      } catch (e) {
        console.error('EventSource 객체 생성 중 오류 발생:', e);
        setConnectionStatus('error');
      }
    } else {
      console.log('❌ 로그아웃 상태이므로 SSE 연결을 시작하지 않습니다.');
      setConnectionStatus('disconnected');
    }

    // 3. 컴포넌트 언마운트 시에만 정리
    return () => {
      if (eventSource) {
        console.log('🔌 컴포넌트 정리 작업: SSE 연결을 종료합니다.');
        eventSource.close();
        eventSource = null;
      }
    };
  // 의존성 배열을 비워 최초 렌더링 시에만 실행되도록 합니다.
  }, [isLoggedIn]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>SSE 연결 테스트 (수정 버전)</h2>
      <p>
        <strong>현재 로그인 상태:</strong> {isLoggedIn ? '로그인됨' : '로그아웃됨'}
      </p>

      <p><strong>SSE 연결 상태:</strong> {connectionStatus}</p>

      <hr style={{ margin: '20px 0' }} />

      <h3>수신된 메시지</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <li key={index} style={{ borderBottom: '1px dotted #eee', padding: '5px 0' }}>
              {msg}
            </li>
          ))
        ) : (
          <li>{connectionStatus === 'connected' ? '메시지 대기 중...' : '연결이 끊겨 있습니다.'}</li>
        )}
      </ul>
    </div>
  );
};

export default IntegratedSseTestComponent;