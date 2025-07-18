#!/usr/bin/env python3
"""
MKM Lab AI 음악 생성 시스템
개인화된 음악 생성의 핵심 엔진
"""

import os
import json
import time
import hashlib
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional
import requests
from dataclasses import dataclass

@dataclass
class VoiceAnalysisData:
    """음성 분석 데이터"""
    pitch_frequency: float  # 피치 주파수 (Hz)
    speech_rate: float      # 말하기 속도 (분당 단어 수)
    voice_quality: str      # 음성 품질 (clear, moderate, muffled)
    emotional_tone: str     # 감정적 톤 (confident, thoughtful, enthusiastic)
    stress_indicators: float # 스트레스 지표 (0-1)
    vocal_range: Dict[str, float] # 음역대 정보
    speech_patterns: Dict[str, float] # 말하기 패턴

@dataclass
class BiometricData:
    """생체 데이터"""
    heart_rate: float       # 심박수 (BPM)
    hrv: float             # 심박변이도
    stress_level: float    # 스트레스 레벨 (0-1)
    energy_level: float    # 에너지 레벨 (0-1)
    sleep_quality: float   # 수면 품질 (0-1)

@dataclass
class CulturalData:
    """문화적 배경 데이터"""
    nationality: str       # 국적
    cultural_heritage: List[str] # 문화유산
    traditional_instruments: List[str] # 전통 악기
    spiritual_beliefs: List[str] # 영적 신념

@dataclass
class SocialContext:
    """사회적 맥락 데이터"""
    age_group: str         # 연령대
    occupation: str        # 직업
    education_level: str   # 교육수준
    social_status: str     # 사회적 지위
    life_stage: str        # 생애주기

class AIMusicGenerator:
    """AI 음악 생성기"""
    
    def __init__(self):
        # Google AI API 설정
        self.google_api_key = os.getenv('GOOGLE_AI_API_KEY') or os.getenv('GEMINI_API_KEY')
        self.google_music_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # 음악 스타일 정의
        self.musical_scales = {
            'korean': {
                'pyeongjo': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                'gyemyeonjo': ['C', 'D', 'E#', 'F#', 'G', 'A', 'B']
            },
            'western': {
                'major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                'minor': ['C', 'D', 'E#', 'F', 'G', 'A#', 'B']
            },
            'eastern': {
                'raga': ['C', 'D', 'E#', 'F#', 'G', 'A', 'B'],
                'pentatonic': ['C', 'D', 'E', 'G', 'A']
            },
            'meditative': {
                'natural': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
                'drone': ['C', 'D', 'E', 'F', 'A', 'B']
            }
        }
        
        # 악기 매핑
        self.instruments = {
            'korean': {
                'gayageum': {'range': (48, 84), 'character': 'deep_natural'},
                'daegeum': {'range': (60, 84), 'character': 'bright_clear'},
                'janggu': {'range': (36, 48), 'character': 'rhythmic'},
                'piri': {'range': (60, 84), 'character': 'tonal'}
            },
            'western': {
                'piano': {'range': (21, 108), 'character': 'versatile'},
                'violin': {'range': (55, 84), 'character': 'warm_emotional'},
                'cello': {'range': (36, 72), 'character': 'deep_rich'},
                'flute': {'range': (60, 84), 'character': 'airy'}
            },
            'eastern': {
                'sitar': {'range': (48, 84), 'character': 'mystical_spiritual'},
                'tabla': {'range': (36, 48), 'character': 'rhythmic_complex'},
                'bansuri': {'range': (60, 84), 'character': 'natural_breathy'},
                'tanpura': {'range': (48, 72), 'character': 'drone_sustained'}
            },
            'meditative': {
                'singing_bowl': {'range': (48, 72), 'character': 'resonant_peaceful'},
                'chimes': {'range': (60, 84), 'character': 'ethereal_clear'},
                'drone': {'range': (36, 60), 'character': 'sustained_meditative'},
                'nature_sounds': {'range': (48, 72), 'character': 'organic_natural'}
            }
        }
    
    def generate_personalized_music(self, 
                                  voice_data: VoiceAnalysisData,
                                  biometric: BiometricData,
                                  cultural: CulturalData,
                                  social: SocialContext,
                                  user_intention: str) -> Dict[str, Any]:
        """개인화된 음악 생성"""
        
        try:
            # 1. 음악 스타일 결정
            music_style = self._determine_music_style(cultural, social, biometric)
            
            # 2. 음계 결정
            scale = self._determine_scale(biometric, voice_data)
            
            # 3. 템포 결정
            tempo = self._determine_tempo(biometric, voice_data)
            
            # 4. 악기 선택
            instruments = self._select_instruments(cultural, social, user_intention)
            
            # 5. 멜로디 생성
            melody = self._generate_melody(scale, voice_data, biometric)
            
            # 6. 하모니 생성
            harmony = self._generate_harmony(scale, voice_data, biometric)
            
            # 7. 리듬 생성
            rhythm = self._generate_rhythm(biometric, voice_data)
            
            # 8. AI 음악 생성 (Google AI API 사용)
            ai_music_data = self._generate_ai_music(
                music_style, scale, tempo, instruments, melody, harmony, rhythm,
                voice_data, biometric, cultural, social, user_intention
            )
            
            # 9. 음악 메타데이터 생성
            metadata = self._generate_music_metadata(
                voice_data, biometric, cultural, social, user_intention
            )
            
            return {
                'music_style': music_style,
                'scale': scale,
                'tempo': tempo,
                'instruments': instruments,
                'melody': melody,
                'harmony': harmony,
                'rhythm': rhythm,
                'ai_music_data': ai_music_data,
                'metadata': metadata,
                'generation_timestamp': datetime.now().isoformat(),
                'unique_signature': self._generate_unique_signature(
                    voice_data, biometric, cultural, social, user_intention
                )
            }
            
        except Exception as e:
            print(f"❌ 음악 생성 오류: {e}")
            return {
                'error': str(e),
                'fallback_music': self._generate_fallback_music(user_intention)
            }
    
    def _determine_music_style(self, cultural: CulturalData, 
                             social: SocialContext, 
                             biometric: BiometricData) -> str:
        """음악 스타일 결정"""
        style_scores = {
            'korean': 0,
            'western': 0,
            'eastern': 0,
            'meditative': 0
        }
        
        # 문화적 배경 기반
        if 'korean' in cultural.cultural_heritage:
            style_scores['korean'] += 3
        if 'western' in cultural.cultural_heritage:
            style_scores['western'] += 3
        if 'eastern' in cultural.cultural_heritage:
            style_scores['eastern'] += 3
        
        # 생체데이터 기반
        if biometric.stress_level > 0.7:
            style_scores['meditative'] += 2
        if biometric.energy_level > 0.8:
            style_scores['korean'] += 1
            style_scores['western'] += 1
        
        # 사회적 맥락 기반
        if social.age_group in ['20s', '30s']:
            style_scores['western'] += 1
        if social.life_stage == 'meditation_practitioner':
            style_scores['meditative'] += 2
        
        return max(style_scores, key=style_scores.get)
    
    def _determine_scale(self, biometric: BiometricData, 
                        voice_data: VoiceAnalysisData) -> List[str]:
        """음계 결정"""
        base_scale = self.musical_scales['western']['major']
        
        # 스트레스 레벨에 따른 조정
        if biometric.stress_level > 0.7:
            # 평온한 스케일 조정 (마이너)
            scale_adjustments = [0, 2, 3, 5, 7, 8, 10]
        elif biometric.energy_level > 0.8:
            # 활기찬 스케일 조정 (메이저)
            scale_adjustments = [0, 2, 4, 5, 7, 9, 11]
        else:
            # 균형잡힌 스케일
            scale_adjustments = [0, 2, 4, 5, 7, 9, 11]
        
        return [base_scale[i % len(base_scale)] for i in scale_adjustments]
    
    def _determine_tempo(self, biometric: BiometricData, 
                        voice_data: VoiceAnalysisData) -> int:
        """템포 결정"""
        heart_rate = biometric.heart_rate
        stress_level = biometric.stress_level
        energy_level = biometric.energy_level
        speech_rate = voice_data.speech_rate
        
        base_tempo = 120
        
        # 심박수에 따른 조정
        if heart_rate > 80:
            base_tempo += 20
        elif heart_rate < 60:
            base_tempo -= 20
        
        # 스트레스에 따른 조정
        if stress_level > 0.7:
            base_tempo -= 30
        elif stress_level < 0.3:
            base_tempo += 15
        
        # 에너지 레벨에 따른 조정
        if energy_level > 0.7:
            base_tempo += 15
        elif energy_level < 0.3:
            base_tempo -= 15
        
        # 말하기 속도에 따른 조정
        if speech_rate > 150:
            base_tempo += 10
        elif speech_rate < 100:
            base_tempo -= 10
        
        # 템포 범위 제한 (60-180 BPM)
        return max(60, min(180, base_tempo))
    
    def _select_instruments(self, cultural: CulturalData, 
                          social: SocialContext, 
                          user_intention: str) -> List[Dict[str, Any]]:
        """악기 선택"""
        intention = user_intention.lower()
        stress_level = 0.5  # 기본값
        
        # 문화적 배경에 따른 기본 악기 선택
        if 'korean' in cultural.cultural_heritage:
            available_instruments = self.instruments['korean']
        elif 'eastern' in cultural.cultural_heritage:
            available_instruments = self.instruments['eastern']
        else:
            available_instruments = self.instruments['western']
        
        selected_instruments = []
        
        # 기본 악기 2개 선택
        instrument_names = list(available_instruments.keys())[:2]
        
        for instrument_name in instrument_names:
            instrument_data = available_instruments[instrument_name].copy()
            instrument_data['name'] = instrument_name
            
            # 개인화된 악기 설정
            if stress_level > 0.7:
                # 스트레스가 높으면 부드러운 음색
                instrument_data['volume'] = 0.6
                instrument_data['reverb'] = 0.8
            else:
                # 스트레스가 낮으면 선명한 음색
                instrument_data['volume'] = 0.8
                instrument_data['reverb'] = 0.4
            
            selected_instruments.append(instrument_data)
        
        # 명상 의도가 있으면 명상 악기 추가
        if 'meditation' in intention or 'peace' in intention:
            meditative_instruments = self.instruments['meditative']
            singing_bowl = meditative_instruments['singing_bowl'].copy()
            singing_bowl['name'] = 'singing_bowl'
            singing_bowl['volume'] = 0.5
            singing_bowl['reverb'] = 1.0
            selected_instruments.append(singing_bowl)
        
        return selected_instruments
    
    def _generate_melody(self, scale: List[str], 
                        voice_data: VoiceAnalysisData, 
                        biometric: BiometricData) -> List[Dict[str, Any]]:
        """멜로디 생성"""
        emotional_tone = voice_data.emotional_tone
        energy_level = biometric.energy_level
        
        melody = []
        num_notes = 8  # 8음표
        
        for i in range(num_notes):
            if emotional_tone == 'joyful':
                # 기쁜 감정: 상승하는 패턴
                note_index = (i * 2) % len(scale)
            elif emotional_tone == 'calming':
                # 평온한 감정: 하강하는 패턴
                note_index = (len(scale) - 1 - (i * 3)) % len(scale)
            else:
                # 균형잡힌 감정: 자연스러운 패턴
                note_index = i % len(scale)
            
            # 음표 정보 생성
            note_data = {
                'note': scale[note_index],
                'duration': 0.5 if energy_level > 0.6 else 1.0,  # 에너지에 따른 지속시간
                'velocity': 80 if emotional_tone == 'joyful' else 60,  # 강도
                'octave': 4 + (i % 2),  # 옥타브 변화
                'position': i  # 위치 정보
            }
            
            melody.append(note_data)
        
        return melody
    
    def _generate_harmony(self, scale: List[str], 
                         voice_data: VoiceAnalysisData, 
                         biometric: BiometricData) -> List[Dict[str, Any]]:
        """하모니 생성"""
        stress_level = biometric.stress_level
        emotional_tone = voice_data.emotional_tone
        
        harmony = []
        
        # 감정에 따른 화음 선택
        if emotional_tone == 'joyful':
            # 기쁜 감정: 메이저 화음
            chord_progression = ['major', 'major', 'major', 'major']
        elif emotional_tone == 'calming':
            # 평온한 감정: 마이너 화음
            chord_progression = ['minor', 'minor', 'minor', 'minor']
        else:
            # 균형잡힌 감정: 혼합 화음
            chord_progression = ['major', 'minor', 'major', 'minor']
        
        for i, chord_type in enumerate(chord_progression):
            chord_data = {
                'type': chord_type,
                'root': scale[i % len(scale)],
                'duration': 2.0,  # 화음 지속시간
                'velocity': 50,   # 화음 강도
                'position': i * 2  # 위치 정보
            }
            harmony.append(chord_data)
        
        return harmony
    
    def _generate_rhythm(self, biometric: BiometricData, 
                        voice_data: VoiceAnalysisData) -> Dict[str, Any]:
        """리듬 생성"""
        heart_rate = biometric.heart_rate
        stress_level = biometric.stress_level
        energy_level = biometric.energy_level
        
        # 기본 리듬 패턴
        if stress_level > 0.7:
            # 스트레스 높음: 단순한 리듬
            pattern = [1, 0, 0, 0, 1, 0, 0, 0]  # 4/4 박자, 강박만
        elif energy_level > 0.7:
            # 에너지 높음: 복잡한 리듬
            pattern = [1, 0, 1, 0, 1, 0, 1, 0]  # 4/4 박자, 모든 박자
        else:
            # 균형잡힌 상태: 중간 복잡도
            pattern = [1, 0, 0, 1, 1, 0, 0, 1]  # 4/4 박자, 중간 패턴
        
        rhythm_data = {
            'pattern': pattern,
            'time_signature': '4/4',
            'subdivision': 8,  # 8분음표 단위
            'intensity': energy_level,
            'complexity': 1.0 - stress_level  # 스트레스가 낮을수록 복잡
        }
        
        return rhythm_data
    
    def _generate_ai_music(self, music_style: str, scale: List[str], 
                          tempo: int, instruments: List[Dict], 
                          melody: List[Dict], harmony: List[Dict], 
                          rhythm: Dict, voice_data: VoiceAnalysisData,
                          biometric: BiometricData, cultural: CulturalData,
                          social: SocialContext, user_intention: str) -> Dict[str, Any]:
        """AI 음악 생성 (Google AI API 사용)"""
        
        if not self.google_api_key:
            return {
                'error': 'Google AI API 키가 설정되지 않았습니다.',
                'simulation_mode': True
            }
        
        try:
            # AI 음악 생성 프롬프트 구성
            prompt = self._build_ai_music_prompt(
                music_style, scale, tempo, instruments, melody, harmony, rhythm,
                voice_data, biometric, cultural, social, user_intention
            )
            
            # Google AI API 호출
            response = requests.post(
                self.google_music_api_url,
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
                    'success': True,
                    'ai_response': result,
                    'prompt': prompt,
                    'generated_music': self._extract_music_from_ai_response(result)
                }
            else:
                return {
                    'error': f'Google AI API 오류: {response.status_code}',
                    'simulation_mode': True
                }
                
        except Exception as e:
            return {
                'error': f'AI 음악 생성 실패: {str(e)}',
                'simulation_mode': True
            }
    
    def _build_ai_music_prompt(self, music_style: str, scale: List[str], 
                              tempo: int, instruments: List[Dict], 
                              melody: List[Dict], harmony: List[Dict], 
                              rhythm: Dict, voice_data: VoiceAnalysisData,
                              biometric: BiometricData, cultural: CulturalData,
                              social: SocialContext, user_intention: str) -> str:
        """AI 음악 생성 프롬프트 구성"""
        
        prompt = f"""
다음 조건에 맞는 개인화된 음악을 생성해주세요:

**음악 스타일**: {music_style}
**음계**: {', '.join(scale)}
**템포**: {tempo} BPM
**악기**: {', '.join([inst['name'] for inst in instruments])}

**개인 정보**:
- 심박수: {biometric.heart_rate} BPM
- 스트레스 레벨: {biometric.stress_level}
- 에너지 레벨: {biometric.energy_level}
- 음성 감정: {voice_data.emotional_tone}
- 말하기 속도: {voice_data.speech_rate} 분당 단어
- 문화적 배경: {', '.join(cultural.cultural_heritage)}
- 사용자 의도: {user_intention}

**음악적 요소**:
- 멜로디: {len(melody)}개 음표
- 하모니: {len(harmony)}개 화음
- 리듬 패턴: {rhythm['pattern']}

위 조건을 바탕으로 30초 길이의 개인화된 음악을 MIDI 형식으로 생성해주세요.
음악은 사용자의 생체데이터와 음성 특성을 반영하여 평온하고 치유적인 느낌이어야 합니다.
"""
        
        return prompt
    
    def _extract_music_from_ai_response(self, ai_response: Dict[str, Any]) -> Dict[str, Any]:
        """AI 응답에서 음악 데이터 추출"""
        try:
            # AI 응답에서 음악 관련 정보 추출 (시뮬레이션)
            return {
                'midi_data': '시뮬레이션 MIDI 데이터',
                'duration': 30.0,
                'tracks': 4,
                'notes': 64,
                'ai_generated': True
            }
        except Exception as e:
            return {
                'error': f'음악 데이터 추출 실패: {str(e)}',
                'simulation_mode': True
            }
    
    def _generate_music_metadata(self, voice_data: VoiceAnalysisData,
                               biometric: BiometricData, cultural: CulturalData,
                               social: SocialContext, user_intention: str) -> Dict[str, Any]:
        """음악 메타데이터 생성"""
        return {
            'title': f'Personal Symphony for {user_intention}',
            'artist': f'AI Composer - {cultural.nationality} Heritage',
            'genre': f'Personalized {cultural.cultural_heritage[0] if cultural.cultural_heritage else "Global"} Music',
            'mood': voice_data.emotional_tone,
            'energy_level': biometric.energy_level,
            'stress_level': biometric.stress_level,
            'cultural_elements': cultural.cultural_heritage,
            'social_context': social.life_stage,
            'generation_parameters': {
                'heart_rate': biometric.heart_rate,
                'hrv': biometric.hrv,
                'happiness_level': 1.0 - biometric.stress_level,
                'voice_quality': voice_data.voice_quality,
                'user_intention': user_intention
            }
        }
    
    def _generate_unique_signature(self, voice_data: VoiceAnalysisData,
                                 biometric: BiometricData, cultural: CulturalData,
                                 social: SocialContext, user_intention: str) -> str:
        """고유 서명 생성"""
        signature_data = {
            'biometric_hash': hashlib.md5(str(biometric.__dict__).encode()).hexdigest(),
            'cultural_hash': hashlib.md5(str(cultural.__dict__).encode()).hexdigest(),
            'social_hash': hashlib.md5(str(social.__dict__).encode()).hexdigest(),
            'voice_hash': hashlib.md5(str(voice_data.__dict__).encode()).hexdigest(),
            'intention_hash': hashlib.md5(user_intention.encode()).hexdigest(),
            'timestamp': datetime.now().isoformat()
        }
        
        return hashlib.sha256(json.dumps(signature_data, sort_keys=True).encode()).hexdigest()
    
    def _generate_fallback_music(self, user_intention: str) -> Dict[str, Any]:
        """폴백 음악 생성"""
        return {
            'style': 'meditative',
            'tempo': 80,
            'scale': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            'instruments': ['piano', 'singing_bowl'],
            'duration': 30.0,
            'fallback': True
        } 