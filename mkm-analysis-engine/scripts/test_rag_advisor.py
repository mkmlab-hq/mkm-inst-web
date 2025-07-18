import requests
import json
import time
from typing import List, Dict

# API 서버 설정
API_BASE_URL = "http://localhost:8000"

def test_health_check():
    """API 상태 확인 테스트"""
    print("🔍 API 상태 확인 중...")
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API 상태: {data['status']}")
            print(f"📊 BigQuery 상태: {data['bigquery_status']}")
            print(f"📚 지식 데이터 수: {data['knowledge_count']}건")
            return True
        else:
            print(f"❌ API 상태 확인 실패: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.")
        return False
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False

def test_knowledge_stats():
    """지식 데이터 통계 테스트"""
    print("\n📊 지식 데이터 통계 확인 중...")
    try:
        response = requests.get(f"{API_BASE_URL}/knowledge-stats/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 총 지식 데이터: {data['total_count']}건")
            print("📋 소스 타입별 분포:")
            for source_type, count in data['source_types'].items():
                print(f"  - {source_type}: {count}건")
            return True
        else:
            print(f"❌ 통계 조회 실패: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 통계 조회 오류: {e}")
        return False

def test_advisor_question(question: str, persona_code: str | None = None):
    """AI 어드바이저 질문 테스트"""
    print(f"\n🤖 AI 어드바이저 테스트: {question}")
    if persona_code:
        print(f"👤 페르소나: {persona_code}")
    
    try:
        payload = {
            "question": question,
            "persona_code": persona_code
        }
        
        response = requests.post(
            f"{API_BASE_URL}/ask-advisor/",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"✅ 응답 생성 완료 (신뢰도: {data['confidence']:.2f})")
            print(f"📝 답변 길이: {len(data['answer'])}자")
            print(f"🔍 관련 소스 수: {len(data['sources'])}개")
            
            if data['persona_insight']:
                print(f"👤 페르소나 인사이트: {data['persona_insight']}")
            
            print("\n📚 답변 내용:")
            print("-" * 50)
            print(data['answer'])
            print("-" * 50)
            
            if data['sources']:
                print("\n🔍 관련 지식 소스:")
                for i, source in enumerate(data['sources'], 1):
                    print(f"{i}. {source['title']} ({source['source_type']})")
                    print(f"   요약: {source['summary']}")
            
            return True
        else:
            print(f"❌ 어드바이저 응답 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ 요청 시간 초과 (30초)")
        return False
    except Exception as e:
        print(f"❌ 어드바이저 테스트 오류: {e}")
        return False

def run_comprehensive_test():
    """종합 테스트 실행"""
    print("🚀 MKM Lab AI 어드바이저 종합 성능 테스트 시작")
    print("=" * 60)
    
    # 1. API 상태 확인
    if not test_health_check():
        print("\n❌ API 서버가 실행되지 않았습니다.")
        print("다음 명령어로 API 서버를 시작하세요:")
        print("cd mkm-analysis-engine/api")
        print("python main.py")
        return False
    
    # 2. 지식 데이터 통계 확인
    if not test_knowledge_stats():
        print("\n❌ 지식 데이터 통계 조회에 실패했습니다.")
        return False
    
    # 3. 다양한 질문으로 어드바이저 테스트
    test_questions = [
        {
            "question": "오늘 너무 피곤한데, 집중력을 높이려면 어떻게 해야 할까요?",
            "persona_code": "P1"
        },
        {
            "question": "스트레스 관리에 효과적인 방법이 있을까요?",
            "persona_code": "P2"
        },
        {
            "question": "건강한 식습관을 유지하는 방법을 알려주세요.",
            "persona_code": "P3"
        },
        {
            "question": "수면의 질을 개선하고 싶습니다. 어떤 방법이 있을까요?",
            "persona_code": "P4"
        },
        {
            "question": "면역력을 강화하는 자연적인 방법이 있을까요?",
            "persona_code": None
        }
    ]
    
    success_count = 0
    total_count = len(test_questions)
    
    for i, test_case in enumerate(test_questions, 1):
        print(f"\n{'='*20} 테스트 {i}/{total_count} {'='*20}")
        
        if test_advisor_question(test_case["question"], test_case["persona_code"]):
            success_count += 1
        
        # 테스트 간 간격
        if i < total_count:
            time.sleep(2)
    
    # 4. 테스트 결과 요약
    print(f"\n{'='*60}")
    print("📊 테스트 결과 요약")
    print(f"{'='*60}")
    print(f"✅ 성공: {success_count}/{total_count}")
    print(f"📈 성공률: {(success_count/total_count)*100:.1f}%")
    
    if success_count == total_count:
        print("\n🎉 모든 테스트가 성공적으로 완료되었습니다!")
        print("MKM Lab AI 어드바이저가 정상적으로 작동하고 있습니다.")
    else:
        print(f"\n⚠️ {total_count - success_count}개의 테스트가 실패했습니다.")
        print("문제를 확인하고 수정해주세요.")
    
    return success_count == total_count

def test_single_question():
    """단일 질문 테스트"""
    print("🤖 AI 어드바이저 단일 질문 테스트")
    print("질문을 입력하세요 (종료하려면 'quit' 입력):")
    
    while True:
        question = input("\n질문: ").strip()
        if question.lower() == 'quit':
            break
        
        persona_code = input("페르소나 코드 (P1/P2/P3/P4, 엔터로 건너뛰기): ").strip()
        if not persona_code:
            persona_code = None
        
        test_advisor_question(question, persona_code)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        test_single_question()
    else:
        run_comprehensive_test() 