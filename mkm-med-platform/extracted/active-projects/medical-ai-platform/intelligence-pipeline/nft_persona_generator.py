import json
import time
import hashlib
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import requests
import numpy as np
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

class PersonaNFTGenerator:
    def __init__(self):
        print(🎨 페르소나 NFT 생성기 초기화...)
        self.w3(Web3.HTTPProvider(os.getenv('BLOCKCHAIN_RPC_URL', https://polygon-rpc.com)))     self.contract_address = os.getenv('NFT_CONTRACT_ADDRESS')
        self.private_key = os.getenv('PRIVATE_KEY')
        
        # 12체질 색상 팔레트 (MKM Lab 브랜드 컬러)
        self.persona_colors =[object Object]
           A1:#2C350,  # 태음인 - 깊은 남색
           A2:#34495E,  # 태음인 - 차분한 회색
           A3:#5D6D7,  # 태음인 - 부드러운 회색
           C1:#E74C3C,  # 소음인 - 활기찬 빨강
           C2:#C0392B,  # 소음인 - 깊은 빨강
           C3:#E67E22,  # 소음인 - 따뜻한 주황
           R1:#27AE60,  # 소양인 - 신선한 초록
           R2:#229954,  # 소양인 - 깊은 초록
           R3:#58D68D,  # 소양인 - 밝은 초록
           V1:#8E44AD,  # 태양인 - 신비로운 보라
           V2:#7D398,  # 태양인 - 깊은 보라
           V3:#BB8FCE   # 태양인 - 부드러운 보라
        }
        
        print(✅ 페르소나 NFT 생성기 준비 완료")
    
    def collect_wearable_data(self, user_id):
       웨어러블 기기 데이터 수집 (시뮬레이션)"
        # 실제 구현 시에는 Apple Health, Samsung Health, Fitbit API 연동
        wearable_data = {
          heart_rate": np.random.randint(60,10          sleep_quality": np.random.uniform(0.5,10            steps np.random.randint(5000, 1500           stress_level": np.random.uniform(0.1,00.9           energy_level": np.random.uniform(0.3,10  timestamp:datetime.now().isoformat()
        }
        return wearable_data
    
    def collect_external_factors(self):
      데이터 수집"""
        try:
            # 날씨 데이터 (OpenWeatherMap API)
            weather_api_key = os.getenv('WEATHER_API_KEY')
            if weather_api_key:
                weather_response = requests.get(
                    f"http://api.openweathermap.org/data/2.5eather?q=Seoul&appid={weather_api_key}&units=metric"
                )
                weather_data = weather_response.json()
            else:
                weather_data = {"temp: 22humidity: 65, description": "맑음"}
            
            # 경제 지표 (시뮬레이션)
            economic_data =[object Object]
                kospi": np.random.uniform(2500, 3000),
              exchange_rate": np.random.uniform(1100, 1300),
        consumer_confidence": np.random.uniform(80, 120   }
            
            # 문화/사회 지표 (시뮬레이션)
            cultural_data =[object Object]
               trending_topic": "AI 헬스케어,
               social_sentiment": np.random.uniform(0.6, 0.9),
               cultural_event": "전통의학 주간"
            }
            
            return[object Object]
                weather": weather_data,
         economic: economic_data,
         cultural": cultural_data
            }
            
        except Exception as e:
            print(f"⚠️ 외부 데이터 수집 실패: {e}")
            return[object Object]
               weather": {"temp: 22humidity},
                economic: {"kospi: 2750,exchange_rate": 1200},
               cultural": {"trending_topic": "AI 헬스케어"}
            }
    
    def generate_persona_visualization(self, persona_code, wearable_data, external_data):
        르소나 시각화 이미지 생성"       # 이미지 크기 설정
        width, height = 800,80     image = Image.new('RGB', (width, height), color=#1a1a1a')  # 다크 모드 배경
        draw = ImageDraw.Draw(image)
        
        # 기본 색상 가져오기
        base_color = self.persona_colors.get(persona_code, '#2)
        
        # 웨어러블 데이터 기반 패턴 생성
        heart_rate_factor = wearable_data['heart_rate] / 10      sleep_factor = wearable_data['sleep_quality']
        stress_factor = wearable_data['stress_level']
        
        # 외부 데이터 기반 요소 추가
        weather_temp = external_data['weather'].get('temp', 22)
        economic_factor = external_dataeconomic]kospi/ 3000.0        
        # 동적 패턴 생성
        for i in range(0, width, 20):
            for j in range(0, height, 20):
                # 데이터 기반 색상 변화
                color_variation = (
                    int(int(base_color[160.8 + stress_factor * 0.4)),
                    int(int(base_color[316 (0.8 + heart_rate_factor * 0.4)),
                    int(int(base_color[51608 + sleep_factor * 0.4))
                )
                
                # 날씨 영향
                if weather_temp > 25:
                    color_variation = tuple(min(255 int(c * 1.2) for c in color_variation)
                elif weather_temp < 10:
                    color_variation = tuple(int(c * 00.8) for c in color_variation)
                
                # 경제 지표 영향
                if economic_factor > 0.9:
                    color_variation = tuple(min(255 int(c * 1.1) for c in color_variation)
                
                # 원형 패턴 그리기
                radius = int(10+ (wearable_dataenergy_level'] * 20))
                draw.ellipse([i, j, i + radius, j + radius], fill=color_variation)
        
        # 페르소나 코드 표시
        try:
            font = ImageFont.truetype("arial.ttf", 48)
        except:
            font = ImageFont.load_default()
        
        draw.text((width//210, height -100 f"Persona {persona_code}", 
                 fill='#FFFFFF', font=font)
        
        # MKM Lab 로고 표시
        draw.text((20), MKM Lab, fill='#E74nt=font)
        
        return image
    
    def create_nft_metadata(self, persona_code, wearable_data, external_data, image_hash):
     타데이터 생성""        metadata = {
           name: fPersona Diary NFT - {persona_code}",
            description: f당신만의 고유한 페르소나 다이어리 NFT입니다. 웨어러블 데이터, 날씨, 경제, 문화적 요소가 융합되어 생성된 하나뿐인 디지털 아트입니다.",
            image: fipfs://{image_hash}",
          attributes[object Object]                trait_type": "Persona Code",
                  value": persona_code,
                    description": 12체질 기반 페르소나 코드"
                },
[object Object]                trait_type": "Heart Rate",
                   value: wearable_data['heart_rate'],
                    description": "생성 시점의 심박수"
                },
[object Object]                trait_type":Sleep Quality                 value": round(wearable_datasleep_quality'], 2),
                    description": "수면 품질 지수"
                },
[object Object]                trait_type": "Stress Level",
                  value": round(wearable_datastress_level'], 2),
                    description": "스트레스 수준"
                },
[object Object]                trait_type": "Weather",
                   value: external_data['weather'].get(description', '맑음'),
                    description": "생성 시점의 날씨"
                },
[object Object]                trait_type:Economic Index                  value": round(external_dataeconomic']['kospi'], 0),
                    description: 생성 시점의 KOSPI 지수"
                },
[object Object]                 trait_type": "Rarity",
                  value": "Unique",
                    description": "하나뿐인 고유한 작품"
                }
            ],
           external_url: https://mkmlab.com/persona-diary",
           seller_fee_basis_points: 500,  #5 로열티
          fee_recipient": os.getenv(MKM_LAB_WALLET_ADDRESS'),
          properties[object Object]
         files   [object Object]                  uri: fipfs://{image_hash}",
                        type": "image/png"
                    }
                ],
                category": "image,
            creators   [object Object]                  address": os.getenv(MKM_LAB_WALLET_ADDRESS'),
                        share":50  # MKM Lab 50% 소유권
                    },
    [object Object]                   address":{{USER_WALLET_ADDRESS}}",  # 사용자 지갑 주소
                        share": 50                   }
                ]
            }
        }
        
        return metadata
    
    def mint_nft(self, metadata, image_path):
      NFT 민팅 (블록체인에 기록)"""
        try:
            # 실제 구현 시에는 스마트 컨트랙트 호출
            # 현재는 시뮬레이션
            nft_data =[object Object]
               token_id": hashlib.sha256(f{metadata[name]}{time.time()}.encode()).hexdigest()[:16],
         metadata": metadata,
           image_path": image_path,
          mint_date:datetime.now().isoformat(),
             blockchain": "Polygon,
               contract_address": self.contract_address,
             ownership                   mkm_lab               user%"
                }
            }
            
            print(f"🎉 NFT 민팅 완료!")
            print(f   Token ID: {nft_data['token_id']}")
            print(f"   소유권: MKM Lab 50% + 사용자50
            print(f  로열티: 5% (2차 거래 시)")
            
            return nft_data
            
        except Exception as e:
            print(f"❌ NFT 민팅 실패: {e}")
            return None
    
    def generate_persona_nft(self, user_id, persona_code):
       페르소나 NFT 생성 메인 프로세스"        print(f🎨 페르소나 NFT 생성 시작 - {persona_code})
        print("=" * 60)
        
        # 1. 웨어러블 데이터 수집
        print("📱 1단계: 웨어러블 데이터 수집")
        wearable_data = self.collect_wearable_data(user_id)
        print(f   심박수: {wearable_data[heart_rate']} bpm)
        print(f"   수면품질: {wearable_data[sleep_quality']:.2f})
        print(f"   스트레스: {wearable_datastress_level']:.2f}")
        
        # 2. 외부 요인 데이터 수집
        print("\n🌍2계: 외부 요인 데이터 수집")
        external_data = self.collect_external_factors()
        print(f"   날씨: {external_data['weather'].get(description', '맑음')})
        print(f"   KOSPI: {external_dataeconomic]['kospi']:.0f})
        print(f   트렌드: {external_data[cultural]['trending_topic']}")
        
        # 3. 시각화 이미지 생성
        print(\n🎨 3단계: 페르소나 시각화 생성)      image = self.generate_persona_visualization(persona_code, wearable_data, external_data)
        
        # 이미지 저장
        image_filename = f"persona_nft_{persona_code}_{int(time.time())}.png"
        image_path = f"generated_nfts/{image_filename}       os.makedirs("generated_nfts, exist_ok=True)
        image.save(image_path)
        
        # IPFS 해시 생성 (시뮬레이션)
        image_hash = hashlib.sha256(image_path.encode()).hexdigest()
        
        # 4. NFT 메타데이터 생성
        print(undefinedn📋4계: NFT 메타데이터 생성")
        metadata = self.create_nft_metadata(persona_code, wearable_data, external_data, image_hash)
        
        #5T 민팅
        print("\n⛓️ 5단계: NFT 민팅")
        nft_data = self.mint_nft(metadata, image_path)
        
        if nft_data:
            # 6. 결과 저장
            print("\n💾 6단계: 결과 저장")
            self.save_nft_record(nft_data, user_id)
            
            print(f\n✅ 페르소나 NFT 생성 완료!")
            print(f"   파일: {image_path}")
            print(f   Token ID: {nft_data['token_id']}")
            print(f"   소유권: 50:50
            print(f"   로열티: 5      
            return nft_data
        
        return None
    
    def save_nft_record(self, nft_data, user_id):
      T 기록 저장       record = {
            user_id": user_id,
         nft_data": nft_data,
       created_at:datetime.now().isoformat(),
           status": "minted"
        }
        
        # JSON 파일에 저장
        filename = f"nft_records/user_{user_id}_nfts.json       os.makedirs("nft_records, exist_ok=True)
        
        try:
            with open(filename, r, encoding="utf-8") as f:
                records = json.load(f)
        except FileNotFoundError:
            records = []
        
        records.append(record)
        
        with open(filename, w, encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)
        
        print(f"   📁 NFT 기록 저장: {filename}")

# 사용 예시
if __name__ == "__main__:generator = PersonaNFTGenerator()
    
    # 테스트용 페르소나 NFT 생성
    test_user_id = "user_12345 test_persona_code =A3  # 태음인
    
    nft_result = generator.generate_persona_nft(test_user_id, test_persona_code)
    
    if nft_result:
        print(fundefinedn🎉 테스트 완료! NFT가 성공적으로 생성되었습니다.)
        print(f   Token ID: {nft_result['token_id']})
        print(f"   이미지: {nft_result['image_path']}")
    else:
        print("❌ NFT 생성에 실패했습니다.") 