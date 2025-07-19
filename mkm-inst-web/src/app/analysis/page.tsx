'use client';

import { useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function AnalysisPage() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const startAnalysis = async () => {
    if (!selectedVideo) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // 실제 분석 API 호출 (현재는 시뮬레이션)
      console.log('🔍 분석 시작:', selectedVideo.name);
      
      // 분석 시뮬레이션 (3초 대기)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 시뮬레이션 결과
      const result = {
        persona: {
          code: 'P2',
          name: '균형 조성가',
          confidence: 0.85,
          scores: {
            visionary: 0.3,
            balanced: 0.8,
            dynamic: 0.4,
            mindful: 0.6
          }
        },
        healthIndicators: {
          stressLevel: '보통',
          energyLevel: '양호',
          sleepQuality: '좋음',
          overallHealth: '건강함'
        },
        recommendations: [
          '규칙적인 생활 리듬을 유지하세요',
          '균형잡힌 식단으로 안정적인 에너지를 확보하세요',
          '스트레스 관리를 위해 산책이나 독서를 즐겨보세요'
        ],
        timestamp: new Date().toISOString()
      };

      setAnalysisResult(result);
    } catch (error) {
      console.error('❌ 분석 오류:', error);
      setAnalysisError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎭 페르소나 정밀검사
          </h1>
          <p className="text-gray-600">
            AI 기반 얼굴 분석으로 당신만의 고유한 페르소나를 발견하세요
          </p>
        </div>

        {/* 분석 결과가 있는 경우 */}
        {analysisResult && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  분석 완료
                </h2>
              </div>

              {/* 페르소나 정보 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  🎭 당신의 페르소나
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-blue-900">
                      {analysisResult.persona.name}
                    </h4>
                    <span className="text-sm text-blue-600">
                      신뢰도: {Math.round(analysisResult.persona.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-blue-800">
                    균형잡힌 접근 방식을 선호하며, 안정성과 체계성을 중시하는 성향을 보입니다.
                  </p>
                </div>
              </div>

              {/* 건강 지표 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  💚 건강 지표
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisResult.healthIndicators).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        {key === 'stressLevel' && '스트레스 수준'}
                        {key === 'energyLevel' && '에너지 수준'}
                        {key === 'sleepQuality' && '수면 품질'}
                        {key === 'overallHealth' && '전체 건강'}
                      </div>
                      <div className="font-medium text-gray-900">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 추천사항 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  💡 맞춤 추천사항
                </h3>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 다시 분석하기 버튼 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setSelectedVideo(null);
                  }}
                  className="btn-outline"
                >
                  새로운 분석 시작하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 오류 메시지 */}
        {analysisError && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">분석 오류</h4>
                  <p className="text-sm text-red-700">{analysisError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 비디오 업로드 컴포넌트 */}
        {!analysisResult && (
          <VideoUpload 
            onVideoSelect={handleVideoSelect}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* 분석 시작 버튼 */}
        {selectedVideo && !analysisResult && !isAnalyzing && (
          <div className="mt-8 text-center">
            <button
              onClick={startAnalysis}
              className="btn-primary text-lg px-8 py-4"
            >
              🚀 페르소나 분석 시작하기
            </button>
          </div>
        )}

        {/* 분석 중 표시 */}
        {isAnalyzing && (
          <div className="mt-8 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI 페르소나 분석 중...
              </h3>
              <p className="text-gray-600">
                당신의 고유한 특성을 분석하고 있습니다.
                잠시만 기다려주세요.
              </p>
            </div>
          </div>
        )}

        {/* 안내 정보 */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ℹ️ 정밀검사 안내
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📹 촬영 방법</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 밝은 곳에서 정면을 향해 촬영</li>
                <li>• 15초간 자연스러운 표정 유지</li>
                <li>• 안경이나 마스크는 제거 권장</li>
                <li>• 카메라와 30-50cm 거리 유지</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔒 개인정보 보호</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 모든 데이터는 로컬에서만 처리</li>
                <li>• 서버에 업로드되지 않음</li>
                <li>• 분석 후 즉시 삭제</li>
                <li>• 완전한 개인정보 보호</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 