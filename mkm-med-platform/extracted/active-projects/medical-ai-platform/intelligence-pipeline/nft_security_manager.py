import hashlib
import hmac
import base64
import json
import os
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import jwt
from dotenv import load_dotenv

load_dotenv()

class NFTSecurityManager:
    def __init__(self):
        print(🔒 NFT 보안 관리자 초기화...")
        
        # 암호화 키 생성/로드
        self.encryption_key = self._load_or_generate_key()
        self.cipher_suite = Fernet(self.encryption_key)
        
        # JWT 시크릿 키
        self.jwt_secret = os.getenv(JWT_SECRET, mkm-lab-nft-secret-key')
        
        # 법적 준수 설정
        self.compliance_settings = {
           data_retention_days: 2555료법 준수)
         privacy_notice_version": "v10
           consent_required": True,
      data_anonymization": True,
          audit_logging: True       }
        
        print(✅ NFT 보안 관리자 준비 완료")
    
    def _load_or_generate_key(self):
       암호화 키 로드 또는 생성""        key_file = ".env.encryption_key       
        if os.path.exists(key_file):
            with open(key_file, "rb") as f:
                return f.read()
        else:
            # 새 키 생성
            key = Fernet.generate_key()
            with open(key_file, "wb") as f:
                f.write(key)
            return key
    
    def encrypt_sensitive_data(self, data):
        데이터 암호화"""
        if isinstance(data, dict):
            # 딕셔너리의 민감한 필드만 암호화
            sensitive_fields = ['heart_rate', sleep_quality,stress_level', 'user_id']
            encrypted_data = data.copy()
            
            for field in sensitive_fields:
                if field in encrypted_data:
                    value_str = str(encrypted_data[field])
                    encrypted_value = self.cipher_suite.encrypt(value_str.encode())
                    encrypted_data[field] = base64.b64de(encrypted_value).decode()
            
            return encrypted_data
        else:
            # 단일 값 암호화
            data_str = str(data)
            encrypted_value = self.cipher_suite.encrypt(data_str.encode())
            return base64.b64de(encrypted_value).decode()
    
    def decrypt_sensitive_data(self, encrypted_data):
     데이터 복호화"""
        if isinstance(encrypted_data, dict):
            # 딕셔너리의 암호화된 필드만 복호화
            sensitive_fields = ['heart_rate', sleep_quality,stress_level', 'user_id]         decrypted_data = encrypted_data.copy()
            
            for field in sensitive_fields:
                if field in decrypted_data and isinstance(decrypted_data[field], str):
                    try:
                        encrypted_value = base64.b64ode(decrypted_data[field])
                        decrypted_value = self.cipher_suite.decrypt(encrypted_value)
                        decrypted_data[field] = decrypted_value.decode()
                    except Exception as e:
                        print(f⚠️ 복호화 실패 ({field}): {e}")
            
            return decrypted_data
        else:
            # 단일 값 복호화
            try:
                encrypted_value = base64.b64ode(encrypted_data)
                decrypted_value = self.cipher_suite.decrypt(encrypted_value)
                return decrypted_value.decode()
            except Exception as e:
                print(f⚠️ 복호화 실패: {e})            return encrypted_data
    
    def anonymize_user_data(self, user_data):
        데이터 익명화        anonymized = user_data.copy()
        
        # 직접 식별 정보 제거
        direct_identifiers = ['user_id,email', phone, 'name', address']
        for identifier in direct_identifiers:
            if identifier in anonymized:
                # 해시로 익명화
                anonymized[identifier] = hashlib.sha256(
                    str(anonymized[identifier]).encode()
                ).hexdigest()[:16]
        
        # 생체 데이터 범위화 (개인정보보호법 준수)
        if 'heart_rate' in anonymized:
            hr = int(anonymized['heart_rate])
            if hr < 60            anonymized['heart_rate_range] = "낮음 (60           elif hr < 100            anonymized['heart_rate_range'] = "정상 (60-100            else:
                anonymized['heart_rate_range'] = "높음 (100       
        if sleep_quality' in anonymized:
            sq = float(anonymized[sleep_quality])
            if sq < 0.5            anonymized['sleep_quality_range'] = "낮음           elif sq < 0.8            anonymized['sleep_quality_range'] = "보통            else:
                anonymized['sleep_quality_range'] = "높음   
        return anonymized
    
    def create_privacy_compliant_metadata(self, original_metadata, user_consent):
       인정보보호법 준수 메타데이터 생성       if not user_consent:
            raise ValueError(사용자 동의가필요합니다.")
        
        compliant_metadata = original_metadata.copy()
        
        # 개인정보보호법 준수 문구 추가
        compliant_metadata['privacy_notice] = {
         version: self.compliance_settings['privacy_notice_version'],
         consent_date:datetime.now().isoformat(),
         data_retention_period": f"{self.compliance_settings['data_retention_days]}일",
            data_usage":페르소나 다이어리 NFT 생성 및 개인화 서비스 제공",
           user_rights
         데이터 접근권,
          데이터 수정권, 
         데이터 삭제권,
       처리 중단권"
            ],
           contact_info: privacy@mkmlab.com"
        }
        
        # 면책조항 추가 (의료법 준수)
        compliant_metadata[disclaimer] = {
           medical_notice: 본 서비스는 의학적 진단을 대체하지 않습니다. 전문의와 상담하시기 바랍니다.,          ai_notice: AI는 의사 보조 도구이며, 최종 판단은 전문의가 합니다.",
            data_accuracy: 생체 데이터는 참고용이며, 정확성을 보장하지 않습니다."
        }
        
        return compliant_metadata
    
    def generate_audit_log(self, action, user_id, data_hash, success=True):
     사 로그 생성"""
        audit_entry = {
      timestamp:datetime.now().isoformat(),
            actionction,
         user_id_hash": hashlib.sha256(str(user_id).encode()).hexdigest()[:16
           data_hash": data_hash,
            success": success,
            ip_address:127001,  # 실제 구현 시 클라이언트 IP
            user_agent": "MKM-Lab-NFT-System"
        }
        
        # 감사 로그 저장
        audit_file = "audit_logs/nft_audit.json       os.makedirs("audit_logs, exist_ok=True)
        
        try:
            with open(audit_file, r, encoding="utf-8") as f:
                audit_logs = json.load(f)
        except FileNotFoundError:
            audit_logs = []
        
        audit_logs.append(audit_entry)
        
        # 로그 보관 기간 관리 (7       cutoff_date = datetime.now() - timedelta(days=self.compliance_settings['data_retention_days'])
        audit_logs =           log for log in audit_logs 
            if datetime.fromisoformat(log['timestamp]) > cutoff_date
        ]
        
        with open(audit_file, w, encoding="utf-8") as f:
            json.dump(audit_logs, f, ensure_ascii=False, indent=2)
        
        return audit_entry
    
    def verify_user_consent(self, user_id):
      자 동의 확인"      consent_file = f"user_consents/{user_id}_consent.json      
        try:
            with open(consent_file, r, encoding="utf-8") as f:
                consent_data = json.load(f)
            
            # 동의 유효성 확인
            consent_date = datetime.fromisoformat(consent_data['consent_date'])
            consent_valid = consent_data.get('nft_creation', False)
            
            if consent_valid and (datetime.now() - consent_date).days < 365            return True
            else:
                return False
                
        except FileNotFoundError:
            return false   
    def create_user_consent(self, user_id, consent_details):
      자 동의 생성"      consent_data = {
            user_id": user_id,
         consent_date:datetime.now().isoformat(),
            consent_version": "v1.0,
         nft_creation: consent_details.get('nft_creation', False),
            data_collection: consent_details.get(data_collection', False),
         data_sharing: consent_details.get('data_sharing', False),
          marketing_use: consent_details.get('marketing_use', False),
            ip_address:127001,  # 실제 구현 시 클라이언트 IP
            user_agent": "MKM-Lab-NFT-System"
        }
        
        # 동의 저장
        os.makedirs("user_consents, exist_ok=True)
        consent_file = f"user_consents/{user_id}_consent.json     
        with open(consent_file, w, encoding="utf-8") as f:
            json.dump(consent_data, f, ensure_ascii=False, indent=2)
        
        # 감사 로그 생성
        self.generate_audit_log(consent_created", user_id, hashlib.sha256str(consent_data).encode()).hexdigest())
        
        return consent_data
    
    def validate_nft_metadata(self, metadata):
        T 메타데이터 유효성 검증""   required_fields = ['name', 'description', 'image', 'attributes']
        
        for field in required_fields:
            if field not in metadata:
                raise ValueError(f"필수 필드 누락: {field}")
        
        # 속성 검증
        if 'attributes' in metadata:
            for attr in metadata['attributes']:
                if 'trait_type not in attr or 'value' not in attr:
                    raise ValueError("속성 형식이 올바르지 않습니다.")
        
        # 개인정보보호법 준수 확인
        if 'privacy_notice' not in metadata:
            raise ValueError(개인정보보호법 준수 문구가 필요합니다.")
        
        if 'disclaimer' not in metadata:
            raise ValueError("면책조항이 필요합니다.")
        
        returntrue   
    def create_secure_nft_package(self, user_id, persona_code, wearable_data, external_data, user_consent):
        보안이 강화된 NFT 패키지 생성"        print(f"🔒 보안 NFT 패키지 생성 - 사용자: {user_id}")
        
        # 1. 사용자 동의 확인
        if not self.verify_user_consent(user_id):
            print("❌ 사용자 동의가 필요합니다.")
            return None
        
        # 2. 민감한 데이터 암호화
        encrypted_wearable_data = self.encrypt_sensitive_data(wearable_data)
        
        # 3익명화
        anonymized_data = self.anonymize_user_data(encrypted_wearable_data)
        
        # 4. 보안 해시 생성
        data_hash = hashlib.sha256(
            json.dumps(anonymized_data, sort_keys=True).encode()
        ).hexdigest()
        
        # 5. 감사 로그 생성
        self.generate_audit_log("nft_creation_started", user_id, data_hash)
        
        # 6. 보안 패키지 구성
        secure_package = {
         user_id_hash": hashlib.sha256(str(user_id).encode()).hexdigest()[:16        persona_code": persona_code,
           encrypted_data: anonymized_data,
          external_data: external_data,  # 외부 데이터는 암호화하지 않음
           data_hash": data_hash,
     creation_timestamp:datetime.now().isoformat(),
           security_version": "v10,
            compliance_status": verified"
        }
        
        print(✅ 보안 NFT 패키지 생성 완료")
        return secure_package

# 사용 예시
if __name__ == "__main__":
    security_manager = NFTSecurityManager()
    
    # 테스트용 사용자 동의 생성
    test_user_id = "user_12345   consent_details = {
     nft_creation: True,
        data_collection: True,
     data_sharing": False,
      marketing_use": False
    }
    
    consent = security_manager.create_user_consent(test_user_id, consent_details)
    print(f"사용자 동의 생성: {consent['consent_date]})   
    # 테스트용 데이터 암호화/복호화
    test_data = {
        heart_rate": 75    sleep_quality": 0.8     stress_level:0.3    
    encrypted = security_manager.encrypt_sensitive_data(test_data)
    decrypted = security_manager.decrypt_sensitive_data(encrypted)
    
    print(f"원본 데이터: {test_data})
    print(f"암호화된 데이터: {encrypted})
    print(f"복호화된 데이터: {decrypted}") 