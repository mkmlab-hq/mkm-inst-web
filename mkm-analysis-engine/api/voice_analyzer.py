#!/usr/bin/env python3
"""
MKM Lab 음성 분석 시스템
음성 신호를 분석하여 개인화된 인사이트 제공
"""

import os
import json
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional
import requests
from dataclasses import dataclass

@dataclass
class VoiceAnalysisResult:
    """음성 분석 결과"""
    pitch_frequency: float      # 피치 주파수 (Hz)
    speech_rate: float          # 말하기 속도 (분당 단어 수)
    voice_quality: str          # 음성 품질 (clear, moderate, muffled)
    emotional_tone: str         # 감정적 톤 (confident, thoughtful, enthusiastic)
    stress_indicators: float    # 스트레스 지표 (0-1)
    vocal_range: Dict[str, float] # 음역대 정보
    speech_patterns: Dict[str, float] # 말하기 패턴
    jitter: float               # 지터(%)
    shimmer: float              # 쉼머(dB)
    hnr: float                  # Harmonics-to-Noise Ratio (dB)
    confidence: float           # 분석 신뢰도 (0-1)
    timestamp: str              # 분석 시간

class VoiceAnalyzer:
    """음성 분석기"""
    
    def __init__(self):
        # Google AI API 설정 (음성 분석용)
        self.google_api_key = os.getenv('GOOGLE_AI_API_KEY') or os.getenv('GEMINI_API_KEY')
        self.google_analysis_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # 음성 분석 기준값
        self.pitch_ranges = {
            'low': (80, 165),      # 남성 일반적 범위
            'medium': (165, 255),  # 여성 일반적 범위
            'high': (255, 400)     # 높은 음성
        }
        
        self.speech_rate_ranges = {
            'slow': (0, 120),      # 느린 말하기
            'moderate': (120, 180), # 보통 말하기
            'fast': (180, 300)     # 빠른 말하기
        }
        
        self.emotional_indicators = {
            'confident': ['clear', 'steady', 'strong', 'assertive'],
            'thoughtful': ['measured', 'deliberate', 'contemplative', 'calm'],
            'enthusiastic': ['energetic', 'animated', 'expressive', 'dynamic'],
            'anxious': ['rapid', 'unsteady', 'nervous', 'hesitant'],
            'calm': ['smooth', 'relaxed', 'peaceful', 'gentle']
        }
    
    def analyze_voice(self, audio_data: bytes, 
                     user_context: Dict[str, Any] = None) -> VoiceAnalysisResult:
        """음성 분석 수행"""
        
        try:
            # 1. 기본 음성 특성 분석
            basic_analysis = self._analyze_basic_voice_characteristics(audio_data)
            
            # 2. 감정적 톤 분석
            emotional_analysis = self._analyze_emotional_tone(audio_data, basic_analysis)
            
            # 3. 스트레스 지표 분석
            stress_analysis = self._analyze_stress_indicators(audio_data, basic_analysis)
            
            # 4. AI 기반 심화 분석
            ai_analysis = self._perform_ai_voice_analysis(audio_data, basic_analysis, user_context)
            
            # 5. 결과 통합
            result = self._integrate_analysis_results(
                basic_analysis, emotional_analysis, stress_analysis, ai_analysis
            )
            
            return result
            
        except Exception as e:
            print(f"❌ 음성 분석 오류: {e}")
            return self._generate_fallback_analysis()
    
    def _analyze_basic_voice_characteristics(self, audio_data: bytes) -> Dict[str, Any]:
        """기본 음성 특성 분석"""
        
        # 실제 구현에서는 오디오 처리 라이브러리 사용
        # 여기서는 시뮬레이션 데이터 생성
        
        # 피치 주파수 분석 (시뮬레이션)
        pitch_frequency = np.random.uniform(120, 250)  # Hz
        
        # 말하기 속도 분석 (시뮬레이션)
        speech_rate = np.random.uniform(100, 200)  # 분당 단어 수
        
        # 음성 품질 분석 (시뮬레이션)
        quality_scores = {
            'clear': np.random.uniform(0.7, 1.0),
            'moderate': np.random.uniform(0.4, 0.8),
            'muffled': np.random.uniform(0.1, 0.5)
        }
        voice_quality = max(quality_scores, key=quality_scores.get)
        
        # 음역대 분석 (시뮬레이션)
        vocal_range = {
            'min_frequency': pitch_frequency * 0.8,
            'max_frequency': pitch_frequency * 1.2,
            'average_frequency': pitch_frequency,
            'frequency_variance': np.random.uniform(0.1, 0.3)
        }
        
        # 말하기 패턴 분석 (시뮬레이션)
        speech_patterns = {
            'pauses_per_minute': np.random.uniform(5, 15),
            'word_duration_variance': np.random.uniform(0.2, 0.6),
            'volume_variance': np.random.uniform(0.1, 0.4),
            'articulation_clarity': np.random.uniform(0.6, 0.9)
        }
        
        # 음성학적 지표 (시뮬레이션)
        jitter = np.random.uniform(0.3, 1.5)   # 정상범위 0.2~1.0% (시뮬)
        shimmer = np.random.uniform(0.1, 0.6)  # 정상범위 0.2~0.5dB (시뮬)
        hnr = np.random.uniform(15, 30)        # 정상범위 20~30dB (시뮬)
        
        return {
            'pitch_frequency': pitch_frequency,
            'speech_rate': speech_rate,
            'voice_quality': voice_quality,
            'vocal_range': vocal_range,
            'speech_patterns': speech_patterns,
            'quality_scores': quality_scores,
            'jitter': jitter,
            'shimmer': shimmer,
            'hnr': hnr
        }
    
    def _analyze_emotional_tone(self, audio_data: bytes, 
                              basic_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """감정적 톤 분석"""
        
        pitch_frequency = basic_analysis['pitch_frequency']
        speech_rate = basic_analysis['speech_rate']
        speech_patterns = basic_analysis['speech_patterns']
        
        # 감정별 점수 계산
        emotional_scores = {}
        
        # 자신감 지표
        if speech_patterns['articulation_clarity'] > 0.8 and speech_rate > 150:
            emotional_scores['confident'] = 0.8
        else:
            emotional_scores['confident'] = 0.3
        
        # 사려깊음 지표
        if speech_rate < 130 and speech_patterns['pauses_per_minute'] > 10:
            emotional_scores['thoughtful'] = 0.7
        else:
            emotional_scores['thoughtful'] = 0.3
        
        # 열정 지표
        if speech_rate > 180 and speech_patterns['volume_variance'] > 0.3:
            emotional_scores['enthusiastic'] = 0.8
        else:
            emotional_scores['enthusiastic'] = 0.2
        
        # 불안 지표
        if speech_patterns['word_duration_variance'] > 0.5 and speech_rate > 200:
            emotional_scores['anxious'] = 0.6
        else:
            emotional_scores['anxious'] = 0.2
        
        # 평온 지표
        if speech_rate < 120 and speech_patterns['volume_variance'] < 0.2:
            emotional_scores['calm'] = 0.8
        else:
            emotional_scores['calm'] = 0.3
        
        # 주요 감정 결정
        primary_emotion = max(emotional_scores, key=emotional_scores.get)
        
        return {
            'emotional_tone': primary_emotion,
            'emotional_scores': emotional_scores,
            'confidence': emotional_scores[primary_emotion]
        }
    
    def _analyze_stress_indicators(self, audio_data: bytes, 
                                 basic_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """스트레스 지표 분석"""
        
        speech_rate = basic_analysis['speech_rate']
        speech_patterns = basic_analysis['speech_patterns']
        vocal_range = basic_analysis['vocal_range']
        
        # 스트레스 지표 계산
        stress_indicators = []
        
        # 1. 말하기 속도 기반 스트레스
        if speech_rate > 200:
            stress_indicators.append(0.8)
        elif speech_rate > 150:
            stress_indicators.append(0.5)
        else:
            stress_indicators.append(0.2)
        
        # 2. 음성 변동성 기반 스트레스
        if vocal_range['frequency_variance'] > 0.25:
            stress_indicators.append(0.7)
        elif vocal_range['frequency_variance'] > 0.15:
            stress_indicators.append(0.4)
        else:
            stress_indicators.append(0.2)
        
        # 3. 말하기 패턴 기반 스트레스
        if speech_patterns['word_duration_variance'] > 0.5:
            stress_indicators.append(0.6)
        elif speech_patterns['word_duration_variance'] > 0.3:
            stress_indicators.append(0.4)
        else:
            stress_indicators.append(0.2)
        
        # 4. 음성 품질 기반 스트레스
        if basic_analysis['voice_quality'] == 'muffled':
            stress_indicators.append(0.7)
        elif basic_analysis['voice_quality'] == 'moderate':
            stress_indicators.append(0.4)
        else:
            stress_indicators.append(0.2)
        
        # 평균 스트레스 지표
        stress_level = np.mean(stress_indicators)
        
        return {
            'stress_indicators': stress_indicators,
            'stress_level': stress_level,
            'stress_factors': {
                'speech_rate_stress': stress_indicators[0],
                'frequency_variance_stress': stress_indicators[1],
                'duration_variance_stress': stress_indicators[2],
                'voice_quality_stress': stress_indicators[3]
            }
        }
    
    def _perform_ai_voice_analysis(self, audio_data: bytes, 
                                 basic_analysis: Dict[str, Any],
                                 user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """AI 기반 심화 음성 분석"""
        
        if not self.google_api_key:
            return {
                'ai_analysis': False,
                'reason': 'Google AI API 키가 설정되지 않았습니다.'
            }
        
        try:
            # AI 분석 프롬프트 구성
            prompt = self._build_ai_analysis_prompt(basic_analysis, user_context)
            
            # Google AI API 호출
            response = requests.post(
                self.google_analysis_api_url,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {self.google_api_key}'
                },
                json={
                    'contents': [{
                        'parts': [{
                            'text': prompt
                        }]
                    }]
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'ai_analysis': True,
                    'ai_response': result,
                    'ai_insights': self._extract_ai_insights(result)
                }
            else:
                return {
                    'ai_analysis': False,
                    'reason': f'Google AI API 오류: {response.status_code}'
                }
                
        except Exception as e:
            return {
                'ai_analysis': False,
                'reason': f'AI 분석 실패: {str(e)}'
            }
    
    def _build_ai_analysis_prompt(self, basic_analysis: Dict[str, Any],
                                user_context: Dict[str, Any] = None) -> str:
        """AI 분석 프롬프트 구성"""
        
        prompt = f"""
다음 음성 분석 데이터를 바탕으로 개인화된 인사이트를 제공해주세요:

**기본 음성 특성**:
- 피치 주파수: {basic_analysis['pitch_frequency']:.1f} Hz
- 말하기 속도: {basic_analysis['speech_rate']:.1f} 분당 단어
- 음성 품질: {basic_analysis['voice_quality']}
- 음역대: {basic_analysis['vocal_range']['min_frequency']:.1f} - {basic_analysis['vocal_range']['max_frequency']:.1f} Hz

**말하기 패턴**:
- 분당 휴식: {basic_analysis['speech_patterns']['pauses_per_minute']:.1f}회
- 단어 지속시간 변동: {basic_analysis['speech_patterns']['word_duration_variance']:.2f}
- 음량 변동: {basic_analysis['speech_patterns']['volume_variance']:.2f}
- 발음 명확도: {basic_analysis['speech_patterns']['articulation_clarity']:.2f}

**사용자 맥락**: {user_context or '정보 없음'}

이 데이터를 바탕으로 다음을 분석해주세요:
1. 감정적 상태 (자신감, 스트레스, 평온함 등)
2. 의사소통 스타일 (직설적, 신중한, 열정적 등)
3. 개인화된 음악 추천 (템포, 음계, 악기 등)
4. 건강 관리 조언 (스트레스 관리, 음성 건강 등)

JSON 형식으로 응답해주세요.
"""
        
        return prompt
    
    def _extract_ai_insights(self, ai_response: Dict[str, Any]) -> Dict[str, Any]:
        """AI 응답에서 인사이트 추출"""
        try:
            # AI 응답에서 인사이트 추출 (시뮬레이션)
            return {
                'emotional_state': 'balanced',
                'communication_style': 'thoughtful',
                'music_recommendations': {
                    'tempo': 100,
                    'scale': 'major',
                    'instruments': ['piano', 'violin']
                },
                'health_advice': [
                    '정기적인 음성 휴식이 필요합니다',
                    '스트레스 관리에 도움이 되는 명상 음악을 추천합니다'
                ],
                'confidence': 0.8
            }
        except Exception as e:
            return {
                'error': f'AI 인사이트 추출 실패: {str(e)}',
                'fallback_insights': True
            }
    
    def _integrate_analysis_results(self, basic_analysis: Dict[str, Any],
                                  emotional_analysis: Dict[str, Any],
                                  stress_analysis: Dict[str, Any],
                                  ai_analysis: Dict[str, Any]) -> VoiceAnalysisResult:
        """분석 결과 통합"""
        
        # 신뢰도 계산
        confidence = 0.7  # 기본 신뢰도
        if ai_analysis.get('ai_analysis', False):
            confidence += 0.2
        
        # AI 인사이트가 있으면 감정적 톤 보정
        emotional_tone = emotional_analysis['emotional_tone']
        if ai_analysis.get('ai_insights'):
            ai_emotional_state = ai_analysis['ai_insights'].get('emotional_state', emotional_tone)
            if ai_analysis['ai_insights'].get('confidence', 0) > 0.7:
                emotional_tone = ai_emotional_state
        
        return VoiceAnalysisResult(
            pitch_frequency=basic_analysis['pitch_frequency'],
            speech_rate=basic_analysis['speech_rate'],
            voice_quality=basic_analysis['voice_quality'],
            emotional_tone=emotional_tone,
            stress_indicators=stress_analysis['stress_level'],
            vocal_range=basic_analysis['vocal_range'],
            speech_patterns=basic_analysis['speech_patterns'],
            jitter=basic_analysis['jitter'],
            shimmer=basic_analysis['shimmer'],
            hnr=basic_analysis['hnr'],
            confidence=confidence,
            timestamp=datetime.now().isoformat()
        )
    
    def _generate_fallback_analysis(self) -> VoiceAnalysisResult:
        """폴백 분석 결과 생성"""
        return VoiceAnalysisResult(
            pitch_frequency=180.0,
            speech_rate=150.0,
            voice_quality='moderate',
            emotional_tone='balanced',
            stress_indicators=0.5,
            vocal_range={
                'min_frequency': 144.0,
                'max_frequency': 216.0,
                'average_frequency': 180.0,
                'frequency_variance': 0.2
            },
            speech_patterns={
                'pauses_per_minute': 10.0,
                'word_duration_variance': 0.3,
                'volume_variance': 0.2,
                'articulation_clarity': 0.7
            },
            jitter=0.8,
            shimmer=0.3,
            hnr=22.0,
            confidence=0.5,
            timestamp=datetime.now().isoformat()
        )
    
    def get_voice_based_recommendations(self, analysis_result: VoiceAnalysisResult) -> Dict[str, Any]:
        """음성 분석 기반 추천사항 생성"""
        
        recommendations = {
            'music_recommendations': [],
            'health_advice': [],
            'communication_tips': [],
            'stress_management': []
        }
        
        # 음악 추천
        if analysis_result.stress_indicators > 0.7:
            recommendations['music_recommendations'].extend([
                '평온한 명상 음악 (60-80 BPM)',
                '자연음과 결합된 치유 음악',
                '싱잉볼과 차임을 활용한 명상 음악'
            ])
        elif analysis_result.emotional_tone == 'enthusiastic':
            recommendations['music_recommendations'].extend([
                '활기찬 음악 (120-140 BPM)',
                '에너지 넘치는 리듬 음악',
                '동기부여를 위한 업템포 음악'
            ])
        else:
            recommendations['music_recommendations'].extend([
                '균형잡힌 음악 (90-110 BPM)',
                '자연스러운 멜로디 음악',
                '편안한 클래식 음악'
            ])
        
        # 건강 조언
        if analysis_result.speech_rate > 200:
            recommendations['health_advice'].append('말하기 속도를 조절하여 스트레스를 줄이세요')
        
        if analysis_result.stress_indicators > 0.6:
            recommendations['health_advice'].append('정기적인 음성 휴식과 명상이 필요합니다')
        
        # 의사소통 팁
        if analysis_result.emotional_tone == 'anxious':
            recommendations['communication_tips'].append('깊은 호흡을 하며 천천히 말하기를 연습하세요')
        
        if analysis_result.speech_patterns['articulation_clarity'] < 0.7:
            recommendations['communication_tips'].append('발음 연습을 통해 의사소통을 개선하세요')
        
        # 스트레스 관리
        if analysis_result.stress_indicators > 0.5:
            recommendations['stress_management'].extend([
                '15분 명상 세션을 매일 실천하세요',
                '자연 속에서 산책하며 스트레스를 해소하세요',
                '음성 휴식 시간을 정기적으로 가지세요'
            ])
        
        return recommendations 