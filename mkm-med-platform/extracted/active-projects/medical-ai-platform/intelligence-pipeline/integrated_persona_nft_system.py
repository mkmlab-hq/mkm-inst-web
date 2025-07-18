import json
import time
import hashlib
import os
from datetime import datetime
from dotenv import load_dotenv

# 로컬 모듈 import (실제 구현 시에는 별도 파일로 분리)
from nft_persona_generator import PersonaNFTGenerator
from nft_security_manager import NFTSecurityManager

load_dotenv()

class IntegratedPersonaNFTSystem:
    def __init__(self):
        print("🚀 통합 페르소나 NFT 시스템 초기화...")
        
        # 하위 시스템 초기화
        self.nft_generator = PersonaNFTGenerator()
        self.security_manager = NFTSecurityManager()
        
        # 시스템 설정
        self.system_config = {
            "nft_price": 99000,  # 99,000원 (PRO 플랜 가격)
            "royalty_percentage": 5,  # 5 로열티
            "ownership_split": [
                {"mkm_lab": 500},
                {"user": 50}
            ],
            "supported_personas": ["A1,A2,A3,C1,C2,C3,R1,R2,R3, V1", "V2", "V3"],
            "blockchain_network": "Polygon",  # 낮은 수수료, 빠른 처리
            "ipfs_gateway": "https://ipfs.io/ipfs/"
        }
        
        print(✅ 통합 페르소나 NFT 시스템 준비 완료")
    
    def create_persona_nft(self, user_id, persona_code, user_consent_details):
       페르소나 NFT 생성 메인 프로세스"        print(f🎨 페르소나 NFT 생성 시작)
        print(f"   사용자: {user_id})
        print(f   페르소나: {persona_code})
        print("=" * 60)
        
        try:
            # 1. 사용자 동의 생성/확인
            print(📋1의 처리")
            consent = self.security_manager.create_user_consent(user_id, user_consent_details)
            if not consent.get('nft_creation', False):
                raise ValueError("NFT 생성 동의가 필요합니다.")
            
            # 2. 웨어러블 데이터 수집
            print("📱 2단계: 웨어러블 데이터 수집")
            wearable_data = self.nft_generator.collect_wearable_data(user_id)
            
            # 3. 외부 요인 데이터 수집
            print(🌍3계: 외부 요인 데이터 수집")
            external_data = self.nft_generator.collect_external_factors()
            
            # 4. 보안 패키지 생성
            print(🔒4지 생성")
            secure_package = self.security_manager.create_secure_nft_package(
                user_id, persona_code, wearable_data, external_data, True
            )
            
            # 5. 시각화 이미지 생성
            print("🎨 5단계: 페르소나 시각화 생성")
            image = self.nft_generator.generate_persona_visualization(
                persona_code, wearable_data, external_data
            )
            
            # 이미지 저장
            image_filename = f"persona_nft_{persona_code}_{user_id}_{int(time.time())}.png"
            image_path = f"generated_nfts/{image_filename}"
            os.makedirs("generated_nfts", exist_ok=True)
            image.save(image_path)
            
            # 6. NFT 메타데이터 생성
            print(��6계: NFT 메타데이터 생성")
            image_hash = hashlib.sha256(image_path.encode()).hexdigest()
            metadata = self.nft_generator.create_nft_metadata(
                persona_code, wearable_data, external_data, image_hash
            )
            
            #7. 개인정보보호법 준수 메타데이터 생성
            print(⚖️ 7단계: 법적 준수 메타데이터 생성")
            compliant_metadata = self.security_manager.create_privacy_compliant_metadata(
                metadata, True
            )
            
            # 8. 메타데이터 유효성 검증
            print("✅8계: 메타데이터 유효성 검증")
            self.security_manager.validate_nft_metadata(compliant_metadata)
            
            # 9. NFT 민팅
            print(⛓️ 9단계: NFT 민팅)          nft_data = self.nft_generator.mint_nft(compliant_metadata, image_path)
            
            if nft_data:
                # 10로그
                print(💾 10단계: 결과 저장)              self._save_nft_result(user_id, nft_data, secure_package)
                
                # 11. 사용자 알림 생성
                print("📢 11)      notification = self._create_user_notification(user_id, nft_data)
                
                print(f"\n🎉 페르소나 NFT 생성 완료!)             print(f   Token ID: {nft_data['token_id']})             print(f"   이미지: {image_path})             print(f"   소유권: MKM Lab 50% + 사용자 50%)             print(f"   로열티: {self.system_config['royalty_percentage']}%)             print(f"   가격: {self.system_config['nft_price']:,}원")
                
                return {
                   "success": True,
                   "nft_data": nft_data,
                   "secure_package": secure_package,
                 "notification": notification
                }
            
        except Exception as e:
            print(f"❌ NFT 생성 실패:[object Object]e})
            # 실패 로그 생성
            self.security_manager.generate_audit_log(
             "nft_creation_failed", user_id, str(e), False
            )
            return {
                "success": False,
              "error": str(e)
            }
    
    def _save_nft_result(self, user_id, nft_data, secure_package):
      T 결과 저장       result_data = {
            "user_id": user_id,
         "nft_data": nft_data,
           "secure_package": secure_package,
       "created_at":datetime.now().isoformat(),
           "system_version": "v1.0"
        }
        
        # 사용자별 NFT 기록 저장
        filename = f"nft_results/user_{user_id}_nfts.json"
        os.makedirs("nft_results", exist_ok=True)
        
        try:
            with open(filename, "r", encoding="utf-8") as f:
                results = json.load(f)
        except FileNotFoundError:
            results = []
        
        results.append(result_data)
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
    
    def _create_user_notification(self, user_id, nft_data):
      자 알림 생성"""
        notification = {
            "user_id": user_id,
           "type": "created",
           "title": "🎨 페르소나 NFT 생성 완료!",
           "message": f"당신만의 고유한 페르소나 NFT가 성공적으로 생성되었습니다. Token ID: {nft_data['token_id']}",
       "created_at":datetime.now().isoformat(),
       "actions": [
                  {"type": "view_nft",
                  "label": "NFT 보기",
                   "url": f"https://mkmlab.com/nft/{nft_data['token_id']}"
                },
                {"type": "share_nft",
                   "label": "NFT 공유",
                   "url": f"https://mkmlab.com/share/{nft_data['token_id']}"
                }
            ]
        }
        
        # 알림 저장
        notification_file = f"notifications/user_{user_id}_notifications.json"
        os.makedirs("notifications", exist_ok=True)
        
        try:
            with open(notification_file, "r", encoding="utf-8") as f:
                notifications = json.load(f)
        except FileNotFoundError:
            notifications = []
        
        notifications.append(notification)
        
        with open(notification_file, "w", encoding="utf-8") as f:
            json.dump(notifications, f, ensure_ascii=False, indent=2)
        
        return notification
    
    def get_user_nfts(self, user_id):
       사용자의 NFT 목록 조회""        filename = f"nft_results/user_{user_id}_nfts.json"
        try:
            with open(filename, "r", encoding="utf-8") as f:
                results = json.load(f)
            return results
        except FileNotFoundError:
            return []
    
    def get_nft_statistics(self):
     계 정보 조회"        stats = {
      "total_nfts_created": 0,
       "persona_distribution": {},
            "revenue_generated": 0,
            "user_distribution": {},
            "creation_timeline": {}
        }
        
        # 모든 NFT 결과 파일 스캔
        nft_results_dir = "nft_results"
        if os.path.exists(nft_results_dir):
            for filename in os.listdir(nft_results_dir):
                if filename.endswith("_nfts.json"):
                    try:
                        with open(os.path.join(nft_results_dir, filename), "r", encoding="utf-8") as f:
                            user_nfts = json.load(f)
                        
                        for nft in user_nfts:
                            stats["total_nfts_created"] += 1                 
                            # 페르소나 분포
                            persona_code = nft.get("nft_data",{}).get("metadata", {}).get("attributes", [{"value": "Unknown"}])[0]["value"]
                            stats["persona_distribution"][persona_code] = stats["persona_distribution"].get(persona_code, 0) + 1                 
                            # 수익 계산
                            stats["revenue_generated"] += self.system_config["nft_price"]
                            
                            # 사용자 분포
                            user_id = nft.get("user_id", "Unknown")
                            stats["user_distribution"][user_id] = stats["user_distribution"].get(user_id, 0) + 1                 
                            # 생성 타임라인
                            creation_date = nft.get("created_at", "1000-01-01T00:00:00")[:10]
                            stats["creation_timeline"][creation_date] = stats["creation_timeline"].get(creation_date, 0) + 1
                    
                    except Exception as e:
                        print(f"⚠️ 통계 생성 중 오류 ({filename}): {e}")
        
        return stats
    
    def validate_persona_code(self, persona_code):
       페르소나 코드 유효성 검증    return persona_code in self.system_config["supported_personas"]
    
    def get_system_info(self):
      템 정보 조회
        return {
           "system_name": "MKM Lab 페르소나 NFT 시스템",
          "version": "v1.0",
          "supported_personas": self.system_config["supported_personas"],
           "nft_price": self.system_config["nft_price"],
      "royalty_percentage": self.system_config["royalty_percentage"],
            "ownership_split": self.system_config["ownership_split"],
      "blockchain_network": self.system_config["blockchain_network"],
          "compliance": {
                "privacy_law": "개인정보보호법 준수,",
                "medical_law": "의료법 준수,",
               "data_retention": "2555보관"
            }
        }

# 사용 예시
if __name__ == "__main__":
    # 시스템 초기화
    nft_system = IntegratedPersonaNFTSystem()
    
    # 시스템 정보 출력
    system_info = nft_system.get_system_info()
    print("🔧 시스템 정보:")
    print(f"   시스템: {system_info['system_name']}")
    print(f"   버전: {system_info['version']}")
    print(f"   NFT 가격: {system_info['nft_price']:,}원")
    print(f"   로열티: {system_info['royalty_percentage']}%")
    print(f"   블록체인: {system_info['blockchain_network']}")   
    # 테스트용 NFT 생성
    test_user_id = "user_12345"
    test_persona_code = "A3"  # 태음인
    
    # 사용자 동의 상세
    consent_details = {
     "nft_creation": True,
        "data_collection": True,
     "data_sharing": False,
      "marketing_use": False
    }
    
    print(f"\n🎨 테스트 NFT 생성 시작...")
    result = nft_system.create_persona_nft(test_user_id, test_persona_code, consent_details)
    
    if result["success"]:
        print("✅ 테스트 성공!")
        
        # 통계 정보 출력
        stats = nft_system.get_nft_statistics()
        print(f"\n📊 NFT 통계:")
        print(f"   총 생성된 NFT: {stats['total_nfts_created']}개")
        print(f"   총 수익: {stats['revenue_generated']:,}원")
        print(f"   페르소나 분포: {stats['persona_distribution']}")
    else:
        print(f❌ 테스트 실패: {result['error']}") 