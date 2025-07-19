#!/usr/bin/env python3
Google Magenta를 활용한 AI 음악 생성 프로토타입
개인화된 음악 생성의 핵심 엔진
"""

import os
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import numpy as np

# Magenta 관련 import (실제 설치 시)
try:
    from magenta.models.music_vae import configs
    from magenta.models.music_vae.trained_model import TrainedModel
    from magenta.protobuf import music_pb2    from magenta.music import midi_io
    from magenta.music import constants
    MAGENTA_AVAILABLE = trueexcept ImportError:
    MAGENTA_AVAILABLE = False
    print("⚠️ Magenta가 설치되지 않았습니다. 시뮬레이션 모드로 실행됩니다.")

class PersonalizedMusicGenerator:
    화된 음악 생성기"   
    def __init__(self):
        self.musical_scales = {
            korean:[object Object]
                pyeongjo: ['C,D,E,F, 'G', 'A',B'],
                gyemyeonjo:C,D,E',F#, 'G', 'A',B]    },
            western:[object Object]             major: ['C,D,E,F, 'G', 'A',B'],
                minor: ['C,D,E,F, A',B]    },
            eastern:[object Object]                raga:C,D,E',F#, 'G', 'A',B'],
                pentatonic: ['C',D',E',G', 'A]    },
            meditative:[object Object]           natural: ['C,D,E,F, 'G', 'A',B'],
                drone: ['C,D,E,F, A',B']
            }
        }
        
        self.instruments = {
            korean:[object Object]               gayageum:[object Object]range': (4884character':deep_natural},
                daegeum:[object Object]range': (6084haracter':bright_clear},
                janggu:[object Object]range': (3648, 'character': 'rhythmic'},
                piri:[object Object]range': (6084ter: onal}    },
            western:[object Object]             piano: {'range': (21, 108character': 'versatile'},
                violin:[object Object]range': (5584), character: warm_emotional'},
                cello:[object Object]range': (3672character': 'deep_rich'},
                flute:[object Object]range': (6084haracter: airy}    },
            eastern:[object Object]
                sitar:[object Object]range': (4884), character': 'mystical_spiritual'},
                tabla:[object Object]range': (3648, 'character':rhythmic_complex'},
                bansuri:[object Object]range': (6084aracter': 'natural_breathy'},
                tanpura:[object Object]range': (4872, 'character': 'drone_sustained}    },
            meditative:[object Object]           singing_bowl:[object Object]range': (4872character:resonant_peaceful'},
                chimes:[object Object]range': (6084, 'character: ethereal_clear'},
                drone:[object Object]range': (3660), character': 'sustained_meditative'},
                nature_sounds:[object Object]range': (4872aracter': 'organic_natural'}
            }
        }
        
        # Magenta 모델 초기화
        self.magenta_model = None
        if MAGENTA_AVAILABLE:
            self._initialize_magenta_model()
    
    def _initialize_magenta_model(self):
       Magenta 모델 초기화"""
        try:
            # MusicVAE 모델 로드
            model_config = configs.CONFIG_MAP['cat-mel_2bar_big']
            self.magenta_model = TrainedModel(model_config, batch_size=4, checkpoint_dir_or_path=None)
            print("✅ Magenta 모델이 성공적으로 로드되었습니다.")
        except Exception as e:
            print(f"⚠️ Magenta 모델 로드 실패: {e}")
            self.magenta_model = None
    
    def generate_personalized_music(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
       음악 생성""        
        # 1. 음악 스타일 결정
        style = self._determine_music_style(user_data)
        
        # 2. 음계 결정
        scale = self._determine_musical_scale(user_data, style)
        
        # 3. 템포 결정
        tempo = self._determine_tempo(user_data)
        
        # 4. 악기 선택
        instruments = self._select_instruments(user_data, style)
        
        #5 생성
        melody = self._generate_melody(scale, user_data)
        
        #6생성
        harmony = self._generate_harmony(scale, user_data)
        
        # 7. 리듬 생성
        rhythm = self._generate_rhythm(user_data)
        
        # 8. 음악 조합
        music_data = self._combine_music_elements(
            melody, harmony, rhythm, tempo, instruments, user_data
        )
        
        return music_data
    
    def _determine_music_style(self, user_data: Dict[str, Any]) -> str:
       스타일 결정""
        cultural_heritage = user_data.get(cultural_heritage',       stress_level = user_data.get(stress_level', 0.5)
        intention = user_data.get('intention', '').lower()
        
        # 스트레스가 높으면 명상 스타일
        if stress_level > 0.7:
            return 'meditative        
        # 의도에 따른 스타일 결정
        if 'meditation' in intention or 'peace' in intention:
            return 'meditative        
        # 문화적 배경에 따른 스타일
        if 'korean' in cultural_heritage:
            return 'korean'
        elif 'eastern' in cultural_heritage:
            returneastern'
        else:
            return western'
    
    def _determine_musical_scale(self, user_data: Dict[str, Any], style: str) -> Liststr]:
        stress_level = user_data.get(stress_level', 00.5      energy_level = user_data.get(energy_level', 0.5)
        emotional_tone = user_data.get('emotional_tone', 'balanced')
        
        # 스타일별 기본 음계
        if style == 'korean':
            base_scales = self.musical_scales['korean']
            if stress_level > 0.6            return base_scales[gyemyeonjo']  # 계면조 (어두운 느낌)
            else:
                return base_scales[pyeongjo']    # 평조 (밝은 느낌)
        
        elif style == 'western':
            base_scales = self.musical_scales['western']
            if stress_level > 0.6 or emotional_tone == 'calming:            return base_scales[minor]       # 마이너 (어두운 느낌)
            else:
                return base_scales[major]       # 메이저 (밝은 느낌)
        
        elif style == 'eastern':
            base_scales = self.musical_scales['eastern']
            if energy_level > 0.7            return base_scales[raga]        # 라가 (복잡한 느낌)
            else:
                return base_scalespentatonic']  # 5음계 (단순한 느낌)
        
        else:  # meditative
            base_scales = self.musical_scales['meditative']
            return base_scales[natural]         # 자연스러운 음계
    
    def _determine_tempo(self, user_data: Dict[str, Any]) -> int:
  정"""
        heart_rate = user_data.get(heart_rate', 70      stress_level = user_data.get(stress_level', 00.5      energy_level = user_data.get(energy_level', 00.5       speech_rate = user_data.get(speech_rate, 120)  # 분당 단어 수
        
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
        # 템포 범위 제한 (60PM)
        return max(60in(180base_tempo))
    
    def _select_instruments(self, user_data: Dict[str, Any], style: str) -> List[Dict[str, Any]]:
  
        intention = user_data.get('intention', ').lower()
        stress_level = user_data.get(stress_level', 00.5      energy_level = user_data.get(energy_level', 0.5)
        
        available_instruments = self.instruments[style]
        selected_instruments = []
        
        # 기본 악기 2개 선택
        instrument_names = list(available_instruments.keys())[:2]
        
        for instrument_name in instrument_names:
            instrument_data = available_instruments[instrument_name].copy()
            instrument_data['name'] = instrument_name
            
            # 개인화된 악기 설정
            if stress_level > 0.7
                # 스트레스가 높으면 부드러운 음색
                instrument_data['volume'] = 00.6        instrument_data['reverb'] = 0.8            else:
                # 스트레스가 낮으면 선명한 음색
                instrument_data['volume'] = 00.8        instrument_data['reverb'] =0.4      
            selected_instruments.append(instrument_data)
        
        # 명상 의도가 있으면 명상 악기 추가
        if 'meditation' in intention or 'peace' in intention:
            meditative_instruments = self.instruments['meditative']
            singing_bowl = meditative_instruments['singing_bowl'].copy()
            singing_bowl[name] = 'singing_bowl'
            singing_bowl['volume'] = 0.5
            singing_bowl['reverb'] = 1.0
            selected_instruments.append(singing_bowl)
        
        return selected_instruments
    
    def _generate_melody(self, scale: List[str], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
   멜로디 생성
        emotional_tone = user_data.get('emotional_tone', 'balanced')
        energy_level = user_data.get(energy_level', 0.5)
        
        melody = []
        num_notes = 8  #8디
        
        for i in range(num_notes):
            if emotional_tone == 'joyful:
                # 기쁜 감정: 상승하는 패턴
                note_index = (i * 2) % len(scale)
            elif emotional_tone == 'calming:
                # 평온한 감정: 하강하는 패턴
                note_index = (len(scale) - 1 - (i *3scale)
            else:
                # 균형잡힌 감정: 자연스러운 패턴
                note_index = i % len(scale)
            
            # 음표 정보 생성
            note_data =[object Object]
                note: scale[note_index],
                duration': 00.5 if energy_level > 0.6 else 10,  # 에너지에 따른 지속시간
               velocity:80 if emotional_tone == joyful' else60강도
                octave: 4 + (i % 2),  # 옥타브 변화
              position': i  # 위치 정보
            }
            
            melody.append(note_data)
        
        return melody
    
    def _generate_harmony(self, scale: List[str], user_data: Dict[str, Any]) -> List[Dict[str, Any]]:
   하모니 생성      stress_level = user_data.get(stress_level', 0.5)
        emotional_tone = user_data.get('emotional_tone', 'balanced')
        
        harmony = []
        
        # 감정에 따른 화음 선택
        if emotional_tone == 'joyful:
            # 기쁜 감정: 메이저 화음
            chord_progression = ['major,major,major, 'major']
        elif emotional_tone == 'calming:
            # 평온한 감정: 마이너 화음
            chord_progression = ['minor,minor,minor, 'minor']
        else:
            # 균형잡힌 감정: 혼합 화음
            chord_progression = ['major,minor,majorminor]
        
        for i, chord_type in enumerate(chord_progression):
            chord_data =[object Object]
                type': chord_type,
               root': scale[i % len(scale)],
               duration: 2.0,  # 화음 지속시간
               velocity': 50,   # 화음 강도
                position: i * 2  # 위치 정보
            }
            harmony.append(chord_data)
        
        return harmony
    
    def _generate_rhythm(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
  성"""
        heart_rate = user_data.get(heart_rate', 70      stress_level = user_data.get(stress_level', 00.5      energy_level = user_data.get(energy_level', 0.5)
        
        # 기본 리듬 패턴
        if stress_level > 07:
            # 스트레스 높음: 단순한 리듬
            pattern = 1, 0, 0 0, 1 0, 0, 0/4 박자, 강박만
        elif energy_level > 07:
            # 에너지 높음: 복잡한 리듬
            pattern = 1, 0, 1 0, 1 0, 1, 0]  # 4/4 박자, 모든 박자
        else:
            # 균형잡힌 상태: 중간 복잡도
            pattern = 1, 0, 0 1, 1 0, 0, 1]  # 4/4 박자, 중간 패턴
        
        rhythm_data = {
            pattern': pattern,
           time_signature': 4/4',
            subdivision': 8,  # 8분음표 단위
      intensity': energy_level,
           complexity': 10 - stress_level  # 스트레스가 낮을수록 복잡
        }
        
        return rhythm_data
    
    def _combine_music_elements(self, melody: List[Dict], harmony: List[Dict], 
                              rhythm: Dict, tempo: int, instruments: List[Dict], 
                              user_data: Dict[str, Any]) -> Dict[str, Any]:
     요소 조합""        
        # 개인화된 음악 데이터 생성
        music_data = {
         style: self._determine_music_style(user_data),
         scale: self._determine_musical_scale(user_data, self._determine_music_style(user_data)),
          tempotempo,
        instruments': instruments,
            melodyelody,
            harmony': harmony,
            rhythmhythm,
            duration: 30.0,  # 30초 음악
           key': 'C',  # 기본 조성
           time_signature': rhythm['time_signature'],
            personalization_factors':[object Object]
                heart_rate: user_data.get('heart_rate', 70),
             stress_level: user_data.get(stress_level', 0.5),
             energy_level: user_data.get(energy_level', 0.5),
               emotional_tone: user_data.get('emotional_tone', 'balanced'),
                cultural_heritage: user_data.get(cultural_heritage', []),
               intention:user_data.get('intention, )    },
       generation_timestamp:datetime.now().isoformat(),
       ai_model': PersonalizedMusicGenerator_v1.0'
        }
        
        return music_data
    
    def generate_midi_file(self, music_data: Dict[str, Any], output_path: str) -> bool:
       I 파일 생성"""
        try:
            if MAGENTA_AVAILABLE and self.magenta_model:
                # Magenta를 사용한 MIDI 생성
                return self._generate_midi_with_magenta(music_data, output_path)
            else:
                # 시뮬레이션 모드: MIDI 구조만 생성
                return self._generate_midi_simulation(music_data, output_path)
        except Exception as e:
            print(f"❌ MIDI 파일 생성 실패: {e}")
            return False
    
    def _generate_midi_with_magenta(self, music_data: Dict[str, Any], output_path: str) -> bool:
     Magenta를 사용한 MIDI 생성"""
        try:
            # Magenta 모델을 사용한 음악 생성
            # (실제 구현에서는 Magenta API를 사용)
            print(🎵 Magenta를 사용한 음악 생성 중...")
            
            # 시뮬레이션: 실제 Magenta 호출 대신 구조만 생성
            midi_structure =[object Object]
          tracks   [object Object]                   name               notes:music_data['melody'],
                   instrument': music_data['instruments'][0]['name']
                    },
    [object Object]                 name': 'Harmony',
                    notes': music_data['harmony'],
                   instrument': music_data['instruments'][1]['name'] if len(music_datainstruments']) > 1 else 'piano'
                    }
                ],
            tempo: music_data['tempo'],
               time_signature': music_data[time_signature']
            }
            
            # MIDI 파일로 저장 (시뮬레이션)
            with open(output_path, 'w') as f:
                json.dump(midi_structure, f, indent=2)
            
            print(f"✅ MIDI 파일이 생성되었습니다: {output_path}")
            return true          
        except Exception as e:
            print(f❌ Magenta MIDI 생성 실패: {e}")
            return False
    
    def _generate_midi_simulation(self, music_data: Dict[str, Any], output_path: str) -> bool:
      레이션 모드 MIDI 생성"""
        try:
            # 시뮬레이션 MIDI 구조 생성
            midi_structure =[object Object]
            format': 'simulation,
          tracks   [object Object]                   name               notes:music_data['melody'],
                   instrument': music_data['instruments'][0]['name']
                    },
    [object Object]                 name': 'Harmony',
                    notes': music_data['harmony'],
                   instrument': music_data['instruments'][1]['name'] if len(music_datainstruments']) > 1 else 'piano'
                    }
                ],
            tempo: music_data['tempo'],
               time_signature': music_data['time_signature'],
               duration': music_data['duration'],
                personalization': music_data[personalization_factors']
            }
            
            # JSON 파일로 저장 (실제 MIDI 대신)
            with open(output_path, 'w') as f:
                json.dump(midi_structure, f, indent=2)
            
            print(f"✅ 시뮬레이션 MIDI 파일이 생성되었습니다: {output_path}")
            return true          
        except Exception as e:
            print(f❌ 시뮬레이션 MIDI 생성 실패: {e}")
            returnfalse
def demo_personalized_music_generation():
  개인화된 음악 생성 데모    
    print(🎵 AI 음악 생성 프로토타입 데모)
    print(=*50)
    
    # 샘플 사용자 데이터
    user_data = {
        heart_rate: 72.0     stress_level': 0.3     energy_level': 0.7,
        cultural_heritage': [korean', 'eastern'],
       emotional_tone': calming',
    intention': 'Peaceful meditation for healthy body and mind',
       age_group': '30s',
     occupation': software_engineer,      speech_rate:130    }
    
    # 음악 생성기 초기화
    music_generator = PersonalizedMusicGenerator()
    
    # 개인화된 음악 생성
    print("🎼 개인화된 음악 생성 중...")
    music_data = music_generator.generate_personalized_music(user_data)
    
    # 결과 출력
    print("\n✅ 음악 생성 완료!")
    print(f"🎵 스타일: {music_data['style]})
    print(f⚡ 템포: {music_data['tempo']} BPM")
    print(f🎸 악기: {', .join([inst['name'] for inst in music_data['instruments']])}")
    print(f🎼 음계: {',.join(music_data['scale])}")
    print(f"⏱️ 지속시간: {music_data['duration']}초")
    
    print(f"\n🎼 멜로디 ({len(music_data['melody'])}개 음표):)    for i, note in enumerate(music_data['melody'][:4):
        print(f 음표 {i+1: {note['note]} (지속시간: [object Object]noteduration']}초, 강도:[object Object]note['velocity']})")
    
    print(f"\n🎶 하모니 ({len(music_data[harmony'])}개 화음):")
    for i, chord in enumerate(music_data['harmony'][:2):
        print(f"  화음 {i+1}: {chord[type']} on [object Object]chord['root']} (지속시간: [object Object]chord['duration']}초)")
    
    print(f"\n🥁 리듬 패턴: {music_data[rhythm']['pattern']})    
    # MIDI 파일 생성
    output_path = 'personalized_music_output.json'
    success = music_generator.generate_midi_file(music_data, output_path)
    
    if success:
        print(f"\n💾 음악 파일이 저장되었습니다: {output_path}) 
    return music_data

if __name__ == "__main__":
    demo_personalized_music_generation() 