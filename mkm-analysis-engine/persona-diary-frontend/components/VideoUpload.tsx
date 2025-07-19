'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Video, X, Loader2, RotateCcw, Square, Play, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const RECORDING_DURATION = 15; // 15초

  // HTTPS 체크
  const isHTTPS = () => {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  };

  // 카메라 지원 체크
  const isCameraSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  // 카메라 시작
  const startCamera = async () => {
    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      // HTTPS 체크
      if (!isHTTPS()) {
        throw new Error('HTTPS_REQUIRED');
      }

      // 카메라 지원 체크
      if (!isCameraSupported()) {
        throw new Error('CAMERA_NOT_SUPPORTED');
      }

      // 사용 가능한 카메라 확인
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('NO_CAMERA_FOUND');
      }

      console.log('사용 가능한 카메라:', videoDevices.length, '개');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setCameraError(null);
        console.log('카메라 시작 성공');
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      
      let errorMessage = '카메라 접근에 실패했습니다.';
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = '카메라 접근이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
            break;
          case 'NotFoundError':
            errorMessage = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
            break;
          case 'NotReadableError':
            errorMessage = '카메라가 다른 애플리케이션에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요.';
            break;
          case 'OverconstrainedError':
            errorMessage = '요청한 카메라 설정을 지원하지 않습니다. 다른 카메라를 사용해주세요.';
            break;
          case 'SecurityError':
            errorMessage = '보안 정책으로 인해 카메라에 접근할 수 없습니다.';
            break;
          default:
            if (error.message === 'HTTPS_REQUIRED') {
              errorMessage = '카메라 접근을 위해서는 HTTPS 연결이 필요합니다.';
            } else if (error.message === 'CAMERA_NOT_SUPPORTED') {
              errorMessage = '이 브라우저는 카메라 기능을 지원하지 않습니다.';
            } else if (error.message === 'NO_CAMERA_FOUND') {
              errorMessage = '사용 가능한 카메라가 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
            } else {
              errorMessage = '카메라 접근에 실패했습니다. 브라우저 설정을 확인해주세요.';
            }
        }
      }
      
      setCameraError(errorMessage);
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
    setCameraError(null);
  };

  // 녹화 시작
  const startRecording = () => {
    if (!streamRef.current) return;

    // iOS 호환성을 위한 MIME 타입 선택
    let mimeType = 'video/webm;codecs=vp9';
    
    // iOS Safari 호환성 체크
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = '';
    }

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
      // iOS 호환성을 위한 파일 형식 결정
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
      // iOS 호환성을 위한 파일 형식 결정
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
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
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 실시간 촬영 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            실시간 페르소나 분석
          </h2>
          <p className="text-gray-600">
            15초간 얼굴을 촬영하여 즉시 분석해보세요
          </p>
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
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">카메라 접근 오류</h4>
                      <p className="text-sm text-red-700">{cameraError}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>해결 방법:</strong></p>
                  <ul className="text-left space-y-1">
                    <li>• 브라우저 주소창의 자물쇠 아이콘을 클릭하여 카메라 권한 허용</li>
                    <li>• 다른 애플리케이션에서 카메라 사용 중인지 확인</li>
                    <li>• 브라우저를 새로고침하고 다시 시도</li>
                    <li>• 다른 브라우저로 시도 (Chrome, Firefox, Safari)</li>
                  </ul>
                  
                  <details className="mt-3">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                      브라우저별 상세 설정 방법
                    </summary>
                    <div className="mt-2 space-y-2 text-xs">
                      <div>
                        <strong>Chrome:</strong> 주소창 자물쇠 → 카메라 허용
                      </div>
                      <div>
                        <strong>Firefox:</strong> 주소창 카메라 아이콘 → 허용
                      </div>
                      <div>
                        <strong>Safari:</strong> Safari → 환경설정 → 웹사이트 → 카메라
                      </div>
                      <div>
                        <strong>Edge:</strong> 주소창 자물쇠 → 카메라 허용
                      </div>
                    </div>
                  </details>
                </div>
                
                <button
                  onClick={startCamera}
                  className="btn-primary text-lg px-8 py-4"
                  disabled={isAnalyzing}
                >
                  다시 시도하기
                </button>
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
      </motion.div>

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

      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 