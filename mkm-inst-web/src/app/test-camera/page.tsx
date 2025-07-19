'use client';

import { useState, useRef, useEffect } from 'react';

export default function TestCameraPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 브라우저 정보 수집
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edge/.test(userAgent);
    
    setDebugInfo({
      userAgent,
      isIOS,
      isSafari,
      isChrome,
      isFirefox,
      isEdge,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      href: window.location.href,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      permissions: 'permissions' in navigator
    });
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    
    try {
      console.log('🔍 카메라 테스트 시작...');
      
      // 기본 체크
      if (!navigator.mediaDevices) {
        throw new Error('mediaDevices API가 지원되지 않습니다');
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia API가 지원되지 않습니다');
      }

      // 모바일 디바이스 감지
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('📱 모바일 디바이스:', isMobile);

      // 장치 열거
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('📹 모든 장치:', devices);
        
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        console.log('📹 비디오 장치:', videoDevices);
        
        setDebugInfo(prev => ({
          ...prev,
          allDevices: devices,
          videoDevices: videoDevices,
          isMobile: isMobile
        }));
      } catch (error) {
        console.warn('장치 열거 실패:', error);
      }

      // 권한 체크
      try {
        if ('permissions' in navigator) {
          const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
          console.log('🔐 카메라 권한:', permissions.state);
          setDebugInfo(prev => ({
            ...prev,
            cameraPermission: permissions.state
          }));
        }
      } catch (error) {
        console.warn('권한 체크 실패:', error);
      }

      // 카메라 접근 시도
      console.log('🎥 getUserMedia 호출...');
      
      // 모바일 최적화된 설정
      const constraints = isMobile ? {
        video: {
          width: { ideal: 1280, min: 320 },
          height: { ideal: 720, min: 240 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 10 }
        },
        audio: false
      } : {
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user'
        },
        audio: false
      };

      console.log('📱 적용된 카메라 설정:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log('✅ 카메라 스트림 획득 성공:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        // 모바일 최적화된 비디오 설정
        if (isMobile) {
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          console.log('📱 모바일 비디오 설정 적용');
        }
        
        // 비디오 이벤트 리스너
        videoRef.current.onloadedmetadata = () => {
          console.log('📺 비디오 메타데이터 로드 완료');
          setDebugInfo(prev => ({
            ...prev,
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight
          }));
        };
        
        videoRef.current.onerror = (e) => {
          console.error('❌ 비디오 오류:', e);
        };

        videoRef.current.oncanplay = () => {
          console.log('🎬 비디오 재생 준비 완료');
        };

        videoRef.current.onplay = () => {
          console.log('▶️ 비디오 재생 시작');
        };
      }
      
    } catch (error) {
      console.error('❌ 카메라 접근 실패:', error);
      setCameraError(error instanceof Error ? error.message : String(error));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📹 카메라 테스트 페이지
          </h1>
          <p className="text-gray-600">
            카메라 접근 문제를 진단하고 해결해보세요
          </p>
        </div>

        {/* 디버그 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔍 디버그 정보
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">브라우저 정보</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• iOS: {debugInfo.isIOS ? '✅' : '❌'}</li>
                <li>• Safari: {debugInfo.isSafari ? '✅' : '❌'}</li>
                <li>• Chrome: {debugInfo.isChrome ? '✅' : '❌'}</li>
                <li>• Firefox: {debugInfo.isFirefox ? '✅' : '❌'}</li>
                <li>• Edge: {debugInfo.isEdge ? '✅' : '❌'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">API 지원</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• mediaDevices: {debugInfo.mediaDevices ? '✅' : '❌'}</li>
                <li>• getUserMedia: {debugInfo.getUserMedia ? '✅' : '❌'}</li>
                <li>• permissions: {debugInfo.permissions ? '✅' : '❌'}</li>
                <li>• 카메라 권한: {debugInfo.cameraPermission || '알 수 없음'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">URL 정보</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 프로토콜: {debugInfo.protocol}</li>
                <li>• 호스트: {debugInfo.hostname}</li>
                <li>• 전체 URL: {debugInfo.href}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">비디오 정보</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 비디오 장치 수: {debugInfo.videoDevices?.length || 0}</li>
                <li>• 비디오 크기: {debugInfo.videoWidth} x {debugInfo.videoHeight}</li>
                <li>• 모바일 디바이스: {debugInfo.isMobile ? '✅' : '❌'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 카메라 컨트롤 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎥 카메라 컨트롤
          </h2>
          
          <div className="flex justify-center gap-4 mb-4">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                카메라 시작
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                카메라 중지
              </button>
            )}
          </div>

          {/* 비디오 요소 */}
          <div className="flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md rounded-lg border-2 border-gray-200"
              style={{ maxHeight: '300px' }}
            />
          </div>

          {/* 오류 메시지 */}
          {cameraError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">오류 발생</h3>
              <p className="text-sm text-red-700">{cameraError}</p>
            </div>
          )}
        </div>

        {/* 해결 방법 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            💡 문제 해결 방법
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">권한 문제</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 브라우저 주소창의 자물쇠 아이콘 클릭</li>
                <li>• 카메라 권한을 "허용"으로 변경</li>
                <li>• 페이지 새로고침</li>
                <li>• 브라우저 설정에서 사이트 권한 확인</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">하드웨어 문제</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 카메라가 연결되어 있는지 확인</li>
                <li>• 다른 앱에서 카메라 사용 중인지 확인</li>
                <li>• 카메라 드라이버 업데이트</li>
                <li>• 다른 카메라 사용</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">브라우저 문제</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 브라우저를 최신 버전으로 업데이트</li>
                <li>• 다른 브라우저로 시도</li>
                <li>• 브라우저 캐시 및 쿠키 삭제</li>
                <li>• 브라우저 재시작</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">보안 문제</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HTTPS 연결 확인</li>
                <li>• 방화벽 설정 확인</li>
                <li>• 보안 소프트웨어 설정 확인</li>
                <li>• localhost 환경에서 테스트</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 