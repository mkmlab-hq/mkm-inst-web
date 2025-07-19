#!/usr/bin/env python3
"""
MKM Lab 음성 분석 및 AI 음악 생성 통합 테스트
"""

import requests
import json
import time
import base64
import numpy as np
from typing import Dict, Any

# API 서버 설정
API_BASE_URL = "http://localhost:8000"

def test_voice_analysis():
    """음성 분석 테스트"""
    print("🎤 음성 분석 테스트 시작...")
    
    try:
        # 시뮬레이션 음성 데이터 (실제로는 오디오 파일을 Base64로 인코딩)
        simulated_audio = base64.b64encode(b"simulated_audio_data").decode('utf-8')
        
        payload = {
            "audio_data": simulated_audio,
            "user_context": {
                "age": 30,
                "gender": "female",
                "occupation": "professional"
            }
        }
        
        response = requests.post(
            f"{API_BASE_URL}/analyze-voice/",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ 음성 분석 성공!")
            print(f"응답 전체 키: {list(data.keys())}")
            print(f"📊 분석 결과:")
            print(f"  - 피치 주파수: {data.get('pitch_frequency')} Hz")
            print(f"  - 말하기 속도: {data.get('speech_rate')} 분당 단어")
            print(f"  - 음성 품질: {data.get('voice_quality')}")
            print(f"  - 감정적 톤: {data.get('emotional_tone')}")
            print(f"  - 스트레스 지표: {data.get('stress_indicators')}")
            print(f"  - 지터: {data.get('jitter')} %")
            print(f"  - 쉼머: {data.get('shimmer')} dB")
            print(f"  - HNR: {data.get('hnr')} dB")
            print(f"  - 신뢰도: {data.get('confidence')}")
            
            print(f"\n🎵 음악 추천:")
            for category, recommendations in data['recommendations'].items():
                print(f"  - {category}:")
                for rec in recommendations[:2]:  # 상위 2개만 표시
                    print(f"    • {rec}")
            
            return data
        else:
            print(f"❌ 음성 분석 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ 음성 분석 테스트 오류: {e}")
        return None

def test_music_generation(voice_analysis_data: Dict[str, Any]):
    """AI 음악 생성 테스트"""
    print("\n🎵 AI 음악 생성 테스트 시작...")
    
    try:
        # 음성 분석 데이터를 VoiceAnalysisData로 변환
        voice_analysis = {
            "pitch_frequency": voice_analysis_data['pitch_frequency'],
            "speech_rate": voice_analysis_data['speech_rate'],
            "voice_quality": voice_analysis_data['voice_quality'],
            "emotional_tone": voice_analysis_data['emotional_tone'],
            "stress_indicators": voice_analysis_data['stress_indicators'],
            "vocal_range": {
                "min_frequency": voice_analysis_data['pitch_frequency'] * 0.8,
                "max_frequency": voice_analysis_data['pitch_frequency'] * 1.2,
                "average_frequency": voice_analysis_data['pitch_frequency'],
                "frequency_variance": 0.2
            },
            "speech_patterns": {
                "pauses_per_minute": 10.0,
                "word_duration_variance": 0.3,
                "volume_variance": 0.2,
                "articulation_clarity": 0.7
            }
        }
        
        # 생체 데이터
        biometric = {
            "heart_rate": 70.0,
            "hrv": 50.0,
            "stress_level": voice_analysis_data['stress_indicators'],
            "energy_level": 1.0 - voice_analysis_data['stress_indicators'],
            "sleep_quality": 0.7
        }
        
        # 문화적 배경
        cultural = {
            "nationality": "Korean",
            "cultural_heritage": ["korean"],
            "traditional_instruments": ["gayageum", "daegeum"],
            "spiritual_beliefs": ["meditation"]
        }
        
        # 사회적 맥락
        social = {
            "age_group": "30s",
            "occupation": "professional",
            "education_level": "university",
            "social_status": "middle",
            "life_stage": "career_focused"
        }
        
        payload = {
            "voice_analysis": voice_analysis,
            "biometric": biometric,
            "cultural": cultural,
            "social": social,
            "user_intention": "meditation"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/generate-music/",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI 음악 생성 성공!")
            print(f"🎼 생성된 음악 정보:")
            print(f"  - 음악 스타일: {data['music_style']}")
            print(f"  - 템포: {data['tempo']} BPM")
            print(f"  - 음계: {', '.join(data['scale'])}")
            print(f"  - 악기: {', '.join([inst['name'] for inst in data['instruments']])}")
            print(f"  - AI 생성: {data['ai_music_data'].get('success', False)}")
            print(f"  - 고유 서명: {data['unique_signature'][:16]}...")
            
            return data
        else:
            print(f"❌ AI 음악 생성 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ AI 음악 생성 테스트 오류: {e}")
        return None

def test_integrated_voice_to_music():
    """음성에서 음악까지 통합 테스트"""
    print("\n🔄 음성→음악 통합 테스트 시작...")
    
    try:
        # 시뮬레이션 오디오 파일 생성
        simulated_audio = b"simulated_audio_file_content"
        
        files = {
            'audio_file': ('test_voice.wav', simulated_audio, 'audio/wav')
        }
        
        data = {
            'user_intention': 'stress_relief'
        }
        
        response = requests.post(
            f"{API_BASE_URL}/voice-to-music/",
            files=files,
            data=data,
            timeout=90
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 통합 테스트 성공!")
            
            print(f"\n🎤 음성 분석 결과:")
            voice_analysis = result['voice_analysis']
            print(f"  - 피치: {voice_analysis['pitch_frequency']:.1f} Hz")
            print(f"  - 감정: {voice_analysis['emotional_tone']}")
            print(f"  - 스트레스: {voice_analysis['stress_indicators']:.2f}")
            
            print(f"\n🎵 음악 생성 결과:")
            music_gen = result['music_generation']
            print(f"  - 스타일: {music_gen['music_style']}")
            print(f"  - 템포: {music_gen['tempo']} BPM")
            print(f"  - 악기: {', '.join(music_gen['instruments'])}")
            print(f"  - AI 생성: {music_gen['ai_generated']}")
            
            print(f"\n💡 추천사항:")
            recommendations = result['recommendations']
            for category, items in recommendations.items():
                if items:
                    print(f"  - {category}: {items[0]}")
            
            return result
        else:
            print(f"❌ 통합 테스트 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ 통합 테스트 오류: {e}")
        return None

def run_comprehensive_test():
    """종합 테스트 실행"""
    print("🚀 MKM Lab 음성 분석 및 AI 음악 생성 종합 테스트")
    print("=" * 60)
    
    # 1. 음성 분석 테스트
    voice_result = test_voice_analysis()
    if not voice_result:
        print("\n❌ 음성 분석 테스트가 실패했습니다.")
        return False
    
    # 2. AI 음악 생성 테스트
    music_result = test_music_generation(voice_result)
    if not music_result:
        print("\n❌ AI 음악 생성 테스트가 실패했습니다.")
        return False
    
    # 3. 통합 테스트
    integrated_result = test_integrated_voice_to_music()
    if not integrated_result:
        print("\n❌ 통합 테스트가 실패했습니다.")
        return False
    
    # 4. 테스트 결과 요약
    print(f"\n{'='*60}")
    print("📊 테스트 결과 요약")
    print(f"{'='*60}")
    print("✅ 모든 테스트가 성공적으로 완료되었습니다!")
    print("\n🎯 구현된 기능:")
    print("  - 음성 분석: 피치, 말하기 속도, 감정적 톤, 스트레스 지표")
    print("  - AI 음악 생성: 개인화된 템포, 음계, 악기 선택")
    print("  - 통합 처리: 음성→분석→음악 생성 일관된 워크플로우")
    print("  - 추천 시스템: 음성 기반 맞춤 음악 및 건강 조언")
    
    print("\n🔧 기술적 특징:")
    print("  - Google AI API 연동 (음성 분석 및 음악 생성)")
    print("  - 생체데이터 기반 개인화 알고리즘")
    print("  - 문화적 배경 반영 (한국/서양/동양/명상 음악)")
    print("  - 실시간 파라미터 조정 (스트레스/에너지 레벨)")
    
    return True

if __name__ == "__main__":
    run_comprehensive_test() 