'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Video, X, Loader2, RotateCcw, Square, Play, AlertCircle, Smartphone } from 'lucide-react';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export default function VideoUpload({ onVideoSelect, isAnalyzing }: VideoUploadProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const RECORDING_DURATION = 15; // 15초

  // iOS 및 Safari 감지
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsSafari(isSafariBrowser);
    
    console.log('📱 디바이스 정보:', {
      userAgent,
      isIOS: isIOSDevice,
      isSafari: isSafariBrowser,
      isIOSSafari: isIOSDevice && isSafariBrowser
    });
  }, []);

  // HTTPS 체크 (iOS Safari는 더 엄격함)
  const isHTTPS = () => {
    const isSecure = window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname.includes('127.0.0.1');
    
    // iOS Safari는 localhost도 HTTPS를 선호함
    if (isIOS && isSafari && window.location.protocol !== 'https:') {
      console.warn('⚠️ iOS Safari는 HTTPS를 권장합니다');
    }
    
    return isSecure;
  };

  // 카메라 지원 체크
  const isCameraSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  // iOS Safari 전용 카메라 설정
  const getIOSCameraConstraints = () => {
    return {
      video: {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        facingMode: 'user',
        frameRate: { ideal: 30, min: 15 }
      },
      audio: false
    };
  };

  // 일반 카메라 설정
  const getStandardCameraConstraints = () => {
    return {
      video: {
        width: { ideal: 1280, min: 320 },
        height: { ideal: 720, min: 240 },
        facingMode: 'user',
        frameRate: { ideal: 30, min: 10 }
      },
      audio: false
    };
  };

  // 카메라 시작 (간단한 버전)
  const startCameraSimple = async () => {
    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      console.log('🔍 간단한 카메라 시작 시도...');
      
      // 가장 기본적인 설정으로 시도
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      console.log('✅ 간단한 카메라 접근 성공');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('❌ 간단한 카메라 접근 실패:', error);
      setCameraError(`간단한 카메라 접근 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  // 카메라 시작
  const startCamera = async () => {
    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      console.log('🔍 카메라 시작 시도...');
      console.log('📍 현재 URL:', window.location.href);
      console.log('🔒 HTTPS 여부:', isHTTPS());
      console.log('📱 카메라 지원 여부:', isCameraSupported());
      console.log('🌐 브라우저 정보:', navigator.userAgent);
      console.log('📱 iOS 여부:', isIOS);
      console.log('🌐 Safari 여부:', isSafari);

      // 브라우저별 특별 처리
      const userAgent = navigator.userAgent;
      const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      const isEdge = /Edge/.test(userAgent);
      
      console.log('🌐 브라우저 타입:', { isChrome, isFirefox, isEdge, isSafari });

      // iOS Safari 특별 체크
      if (isIOS && isSafari) {
        console.log('📱 iOS Safari 감지 - 특별 처리 적용');
        
        // iOS Safari는 더 엄격한 HTTPS 요구사항
        if (!isHTTPS()) {
          throw new Error('IOS_HTTPS_REQUIRED');
        }
      }

      // HTTPS 체크 (개발 환경에서는 더 유연하게)
      if (!isHTTPS()) {
        console.warn('⚠️ HTTPS가 아닌 환경에서 카메라 접근 시도');
        // 개발 환경에서는 허용하되 경고만 표시
        if (window.location.hostname !== 'localhost' && 
            !window.location.hostname.includes('127.0.0.1') &&
            !window.location.hostname.includes('0.0.0.0')) {
          console.warn('⚠️ 프로덕션 환경에서는 HTTPS가 필요합니다');
        }
      }

      // 카메라 지원 체크
      if (!isCameraSupported()) {
        console.error('❌ 카메라 API가 지원되지 않음');
        throw new Error('CAMERA_NOT_SUPPORTED');
      }

      // 미디어 장치 API 지원 체크
      if (!navigator.mediaDevices) {
        console.error('❌ mediaDevices API가 지원되지 않음');
        throw new Error('MEDIA_DEVICES_NOT_SUPPORTED');
      }

      // 사용 가능한 미디어 장치 확인
      try {
        console.log('📹 장치 열거 시작...');
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('📹 모든 장치:', devices);
        
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('📹 사용 가능한 비디오 장치:', videoDevices);
        
        if (videoDevices.length === 0) {
          console.warn('⚠️ 비디오 장치가 없습니다');
          // 장치가 없어도 계속 진행 (권한 문제일 수 있음)
        }
      } catch (deviceError) {
        console.warn('⚠️ 장치 열거 실패:', deviceError);
        // 장치 열거 실패해도 계속 진행
      }

      // 카메라 권한 체크 (선택적)
      try {
        if ('permissions' in navigator) {
          console.log('🔐 권한 API 지원됨');
          const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
          console.log('🔐 카메라 권한 상태:', permissions.state);
          
          if (permissions.state === 'denied') {
            throw new Error('PERMISSION_DENIED');
          }
        } else {
          console.log('ℹ️ 권한 API가 지원되지 않습니다');
        }
      } catch (permissionError) {
        console.log('ℹ️ 권한 확인 실패, 직접 카메라 접근을 시도합니다:', permissionError);
      }

      console.log('🎥 getUserMedia 호출 중...');
      
      // 브라우저별 다른 설정 적용
      let constraints;
      if (isIOS && isSafari) {
        constraints = getIOSCameraConstraints();
        console.log('📱 iOS Safari 설정 적용');
      } else if (isChrome) {
        constraints = {
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 },
            facingMode: 'user',
            frameRate: { ideal: 30, min: 10 }
          },
          audio: false
        };
        console.log('🌐 Chrome 설정 적용');
      } else if (isFirefox) {
        constraints = {
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 },
            facingMode: 'user'
          },
          audio: false
        };
        console.log('🦊 Firefox 설정 적용');
      } else {
        constraints = getStandardCameraConstraints();
        console.log('🌐 기본 설정 적용');
      }

      console.log('📱 적용된 카메라 설정:', constraints);

      // 여러 번 시도하는 로직
      let stream = null;
      
      // 첫 번째 시도: 기본 설정
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ 첫 번째 시도 성공');
      } catch (error) {
        console.warn('⚠️ 첫 번째 시도 실패:', error);
        
        // 두 번째 시도: 더 간단한 설정
        try {
          console.log('🔄 두 번째 시도: 간단한 설정');
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
          console.log('✅ 두 번째 시도 성공');
        } catch (error2) {
          console.warn('⚠️ 두 번째 시도 실패:', error2);
          
          // 세 번째 시도: 최소 설정
          try {
            console.log('🔄 세 번째 시도: 최소 설정');
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
            console.log('✅ 세 번째 시도 성공');
          } catch (error3) {
            console.error('❌ 모든 시도 실패:', error3);
            throw error3;
          }
        }
      }

      if (!stream) {
        throw new Error('STREAM_NOT_OBTAINED');
      }

      console.log('✅ 카메라 스트림 획득 성공');
      console.log('📹 스트림 정보:', {
        id: stream.id,
        tracks: stream.getTracks().map(track => ({
          kind: track.kind,
          label: track.label,
          enabled: track.enabled,
          readyState: track.readyState
        }))
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraError(null);
        
        // 브라우저별 특별 설정
        if (isIOS && isSafari) {
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true');
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          console.log('📱 iOS Safari 비디오 설정 적용');
        } else if (isChrome) {
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          console.log('🌐 Chrome 비디오 설정 적용');
        } else if (isFirefox) {
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          console.log('🦊 Firefox 비디오 설정 적용');
        }
        
        // 비디오 로드 이벤트 리스너 추가
        videoRef.current.onloadedmetadata = () => {
          console.log('📺 비디오 메타데이터 로드 완료');
          console.log('📹 비디오 크기:', {
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight
          });
        };
        
        videoRef.current.onerror = (e) => {
          console.error('❌ 비디오 요소 오류:', e);
        };

        videoRef.current.oncanplay = () => {
          console.log('🎬 비디오 재생 준비 완료');
        };

        videoRef.current.onplay = () => {
          console.log('▶️ 비디오 재생 시작');
        };
      } else {
        console.error('❌ videoRef가 null입니다');
        throw new Error('VIDEO_ELEMENT_NOT_FOUND');
      }
    } catch (error) {
      console.error('❌ 카메라 접근 실패:', error);
      console.error('❌ 오류 상세:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      let errorMessage = '카메라 접근에 실패했습니다.';
      let detailedInstructions = '';
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = '카메라 접근이 거부되었습니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• 브라우저 주소창의 자물쇠 아이콘을 클릭</li>
                <li>• "카메라" 권한을 "허용"으로 변경</li>
                <li>• 페이지를 새로고침하고 다시 시도</li>
                <li>• 브라우저 설정에서 사이트 권한 확인</li>
              </ul>
            `;
            break;
          case 'NotFoundError':
            errorMessage = '카메라를 찾을 수 없습니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• 카메라가 연결되어 있는지 확인</li>
                <li>• 다른 애플리케이션에서 카메라 사용 중인지 확인</li>
                <li>• 노트북의 경우 내장 카메라가 활성화되어 있는지 확인</li>
                <li>• 카메라 드라이버 업데이트</li>
              </ul>
            `;
            break;
          case 'NotReadableError':
            errorMessage = '카메라가 다른 애플리케이션에서 사용 중입니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• Zoom, Teams, Discord 등 다른 앱 종료</li>
                <li>• 브라우저를 완전히 종료하고 다시 시작</li>
                <li>• 컴퓨터를 재시작</li>
                <li>• 작업 관리자에서 카메라 사용 프로세스 종료</li>
              </ul>
            `;
            break;
          case 'OverconstrainedError':
            errorMessage = '요청한 카메라 설정을 지원하지 않습니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• 다른 브라우저로 시도 (Chrome, Firefox, Safari)</li>
                <li>• 브라우저를 최신 버전으로 업데이트</li>
                <li>• 다른 카메라가 있다면 사용</li>
                <li>• 카메라 해상도 설정 확인</li>
              </ul>
            `;
            break;
          case 'SecurityError':
            errorMessage = '보안 정책으로 인해 카메라에 접근할 수 없습니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• HTTPS 연결 확인</li>
                <li>• 브라우저 보안 설정 확인</li>
                <li>• 다른 브라우저로 시도</li>
                <li>• 방화벽 설정 확인</li>
              </ul>
            `;
            break;
          case 'AbortError':
            errorMessage = '카메라 접근이 중단되었습니다.';
            detailedInstructions = `
              <strong>해결 방법:</strong>
              <ul>
                <li>• 페이지를 새로고침하고 다시 시도</li>
                <li>• 브라우저를 재시작</li>
                <li>• 다른 브라우저로 시도</li>
              </ul>
            `;
            break;
          default:
            if (error.message === 'HTTPS_REQUIRED') {
              errorMessage = '카메라 접근을 위해서는 HTTPS 연결이 필요합니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• HTTPS로 접속하거나</li>
                  <li>• localhost 환경에서 테스트</li>
                </ul>
              `;
            } else if (error.message === 'IOS_HTTPS_REQUIRED') {
              errorMessage = '아이폰 Safari에서는 HTTPS 연결이 필수입니다.';
              detailedInstructions = `
                <strong>iOS Safari 해결 방법:</strong>
                <ul>
                  <li>• HTTPS로 접속하거나</li>
                  <li>• Safari 설정 → 고급 → 웹사이트 데이터 → 모든 웹사이트 데이터 제거</li>
                  <li>• Safari를 완전히 종료하고 다시 시작</li>
                  <li>• 다른 브라우저 앱 사용 (Chrome, Firefox)</li>
                </ul>
              `;
            } else if (error.message === 'CAMERA_NOT_SUPPORTED') {
              errorMessage = '이 브라우저는 카메라 기능을 지원하지 않습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• Chrome, Firefox, Safari 등 최신 브라우저 사용</li>
                  <li>• 브라우저를 최신 버전으로 업데이트</li>
                </ul>
              `;
            } else if (error.message === 'MEDIA_DEVICES_NOT_SUPPORTED') {
              errorMessage = '미디어 장치 API가 지원되지 않습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• 최신 브라우저로 업데이트</li>
                  <li>• 다른 브라우저 사용</li>
                </ul>
              `;
            } else if (error.message === 'PERMISSION_DENIED') {
              errorMessage = '카메라 권한이 거부되었습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• 브라우저 설정에서 카메라 권한 허용</li>
                  <li>• 사이트 설정에서 권한 재설정</li>
                  <li>• 브라우저 재시작</li>
                </ul>
              `;
            } else if (error.message === 'NO_CAMERA_FOUND') {
              errorMessage = '사용 가능한 카메라가 없습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• 카메라가 연결되어 있는지 확인</li>
                  <li>• 카메라 드라이버 업데이트</li>
                  <li>• 다른 카메라 사용</li>
                </ul>
              `;
            } else if (error.message === 'STREAM_NOT_OBTAINED') {
              errorMessage = '카메라 스트림을 획득할 수 없습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• 카메라 권한 확인</li>
                  <li>• 다른 애플리케이션에서 카메라 사용 중인지 확인</li>
                  <li>• 브라우저 재시작</li>
                  <li>• 다른 브라우저로 시도</li>
                </ul>
              `;
            } else {
              errorMessage = '카메라 접근에 실패했습니다.';
              detailedInstructions = `
                <strong>해결 방법:</strong>
                <ul>
                  <li>• 브라우저를 새로고침</li>
                  <li>• 다른 브라우저로 시도</li>
                  <li>• 컴퓨터 재시작</li>
                  <li>• 카메라 드라이버 업데이트</li>
                </ul>
              `;
            }
        }
      }
      
      setCameraError(errorMessage + '\n\n' + detailedInstructions);
      setIsCameraActive(false);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  // 카메라 중지
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

  // 녹화 시작 (iOS Safari 호환)
  const startRecording = () => {
    if (!streamRef.current) return;

    // iOS Safari 호환성을 위한 MIME 타입 선택
    let mimeType = 'video/mp4';
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp9';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = '';
    }

    console.log('📹 녹화 MIME 타입:', mimeType);

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: mimeType || undefined
    });

    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const fileType = mimeType.includes('mp4') ? 'video/mp4' : 'video/webm';
      const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
      
      const blob = new Blob(chunks, { type: fileType });
      setRecordedBlob(blob);
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    // 타이머 시작
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= RECORDING_DURATION) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // 녹화 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // 녹화된 영상 사용
  const useRecordedVideo = () => {
    if (recordedBlob) {
      const fileExtension = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File([recordedBlob], `recorded_video_${Date.now()}.${fileExtension}`, {
        type: recordedBlob.type
      });
      onVideoSelect(file);
    }
  };

  // 녹화 재시작
  const restartRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (isCameraActive) {
      startRecording();
    }
  };

  // 파일 업로드 관련 함수들
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidVideoFile(file)) {
        setSelectedFile(file);
        onVideoSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidVideoFile(file)) {
        setSelectedFile(file);
        onVideoSelect(file);
      }
    }
  };

  const isValidVideoFile = (file: File): boolean => {
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. MP4, AVI, MOV, MKV, WEBM 파일을 사용해주세요.');
      return false;
    }

    if (file.size > maxSize) {
      alert('파일 크기가 너무 큽니다. 100MB 이하의 파일을 사용해주세요.');
      return false;
    }

    return true;
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopCamera();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // 녹화된 영상이 있거나 파일이 선택된 경우
  if (recordedBlob || selectedFile) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {recordedBlob ? '녹화된 영상' : selectedFile?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {recordedBlob ? '실시간 촬영' : `${formatFileSize(selectedFile?.size || 0)} • ${selectedFile?.type}`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {recordedBlob && (
              <button
                onClick={restartRecording}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isAnalyzing}
                title="다시 촬영"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                setRecordedBlob(null);
                removeFile();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isAnalyzing}
              title="삭제"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {recordedBlob && (
          <div className="mt-4">
            <video
              src={URL.createObjectURL(recordedBlob)}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        
        {isAnalyzing ? (
          <div className="mt-4 flex items-center gap-3 text-primary-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>분석 중...</span>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            {recordedBlob && (
              <button
                onClick={useRecordedVideo}
                className="btn-primary flex-1"
              >
                이 영상으로 분석하기
              </button>
            )}
            {selectedFile && (
              <button
                onClick={() => onVideoSelect(selectedFile)}
                className="btn-primary flex-1"
              >
                이 파일로 분석하기
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* iOS Safari 경고 */}
      {isIOS && isSafari && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Smartphone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">아이폰 Safari 사용자</h4>
              <p className="text-sm text-blue-700">
                아이폰 Safari에서는 카메라 접근을 위해 HTTPS 연결이 필요할 수 있습니다. 
                문제가 발생하면 다른 브라우저 앱을 사용해보세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 실시간 촬영 섹션 */}
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            실시간 페르소나 분석
          </h2>
          <p className="text-gray-600">
            15초간 얼굴을 촬영하여 즉시 분석해보세요
          </p>
        </div>

        {/* 카메라 컨트롤 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {!isCameraActive ? (
            <>
              <button
                onClick={startCamera}
                disabled={isLoadingCamera}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isLoadingCamera ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    카메라 시작 중...
                  </span>
                ) : (
                  '📹 카메라 시작'
                )}
              </button>
              <button
                onClick={startCameraSimple}
                disabled={isLoadingCamera}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                🔧 간단한 카메라 시작
              </button>
            </>
          ) : (
            <button
              onClick={stopCamera}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              🛑 카메라 중지
            </button>
          )}
        </div>

        {isLoadingCamera ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">카메라 준비 중...</p>
          </div>
        ) : !isCameraActive ? (
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-primary-600" />
            </div>
            
            {cameraError ? (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 mb-2">카메라 접근 오류</h4>
                      <div 
                        className="text-sm text-red-700 whitespace-pre-line"
                        dangerouslySetInnerHTML={{ 
                          __html: cameraError.replace(/\n/g, '<br>') 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h5 className="font-medium text-blue-800 mb-2">브라우저별 해결 방법</h5>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div>
                      <strong>Chrome:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• 주소창의 자물쇠 아이콘 클릭</li>
                        <li>• 카메라 권한을 "허용"으로 변경</li>
                        <li>• 설정 → 개인정보 보호 및 보안 → 사이트 설정 → 카메라</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Firefox:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• 주소창의 방패 아이콘 클릭</li>
                        <li>• 카메라 권한 허용</li>
                        <li>• 설정 → 개인정보 보호 및 보안 → 권한</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Safari:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Safari → 환경설정 → 웹사이트 → 카메라</li>
                        <li>• 해당 사이트를 "허용"으로 설정</li>
                        <li>• 또는 다른 브라우저 앱 사용 (Chrome, Firefox)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="btn-primary text-lg px-8 py-4"
                    disabled={isAnalyzing}
                  >
                    다시 시도하기
                  </button>
                  
                  <button
                    onClick={() => {
                      console.log('🔍 카메라 상태 디버깅...');
                      console.log('📍 현재 URL:', window.location.href);
                      console.log('🔒 HTTPS 여부:', isHTTPS());
                      console.log('📱 카메라 지원 여부:', isCameraSupported());
                      console.log('🌐 브라우저 정보:', navigator.userAgent);
                      console.log('📹 미디어 장치:', navigator.mediaDevices);
                      console.log('📱 iOS 여부:', isIOS);
                      console.log('🌐 Safari 여부:', isSafari);
                      
                      // 사용 가능한 장치 확인
                      navigator.mediaDevices.enumerateDevices()
                        .then(devices => {
                          console.log('📹 모든 장치:', devices);
                          const videoDevices = devices.filter(d => d.kind === 'videoinput');
                          console.log('📹 비디오 장치:', videoDevices);
                        })
                        .catch(err => console.error('장치 열거 실패:', err));
                    }}
                    className="btn-outline text-sm px-4 py-2"
                    disabled={isAnalyzing}
                  >
                    디버그 정보 확인
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={startCamera}
                  className="btn-primary text-lg px-8 py-4"
                  disabled={isAnalyzing}
                >
                  카메라 시작하기
                </button>
                <p className="text-sm text-gray-500">
                  카메라 접근 권한이 필요합니다
                </p>
                
                {!isHTTPS() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <strong>참고:</strong> 카메라 접근을 위해서는 HTTPS 연결이 필요합니다.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border-2 border-gray-200"
                style={{ maxHeight: '300px' }}
              />
              
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {RECORDING_DURATION - recordingTime}초
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn-primary flex items-center gap-2"
                  disabled={isAnalyzing}
                >
                  <Play className="w-5 h-5" />
                  촬영 시작 (15초)
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isAnalyzing}
                >
                  <Square className="w-5 h-5" />
                  촬영 중지
                </button>
              )}
              
              <button
                onClick={stopCamera}
                className="btn-outline"
                disabled={isAnalyzing}
              >
                카메라 종료
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 파일 업로드 옵션 */}
      <div className="text-center">
        <button
          onClick={() => setShowFileUpload(!showFileUpload)}
          className="text-primary-600 hover:text-primary-700 text-sm underline"
          disabled={isAnalyzing}
        >
          또는, 동영상 파일 업로드
        </button>
      </div>

      {showFileUpload && (
        <div className="overflow-hidden">
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />
            
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  영상 파일 업로드
                </h3>
                <p className="text-gray-600 mb-3">
                  기존 영상을 드래그 앤 드롭하거나 클릭하여 선택하세요
                </p>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>지원 형식: MP4, AVI, MOV, MKV, WEBM</p>
                  <p>최대 크기: 100MB</p>
                  <p>권장 길이: 10-20초</p>
                </div>
              </div>
              
              <button
                type="button"
                className="btn-outline inline-flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Upload className="w-4 h-4" />
                영상 선택하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 