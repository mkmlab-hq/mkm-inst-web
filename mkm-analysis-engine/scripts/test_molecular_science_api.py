#!/usr/bin/env python3
"""
MKM Lab 분자과학 API 테스트
새로 추가된 분자과학 관련 엔드포인트들을 테스트
"""

import requests
import json
import time
from typing import Dict, Any

# API 서버 설정
API_BASE_URL = "http://localhost:8000"

def test_molecular_science_stats():
    """분자과학 데이터 통계 테스트"""
    print("📊 분자과학 데이터 통계 테스트...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/molecular-science/stats/", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ 분자과학 통계 조회 성공!")
            print(f"📈 총 레코드 수: {data.get('total_records', 0)}")
            print(f"🕒 마지막 업데이트: {data.get('last_updated', 'N/A')}")
            
            if 'molecular_science_stats' in data:
                print("\n📋 소스 타입별 통계:")
                for stat in data['molecular_science_stats']:
                    print(f"  - {stat['source_type']}: {stat['count']}건")
                    if stat.get('avg_molecular_weight'):
                        print(f"    평균 분자량: {stat['avg_molecular_weight']:.2f}")
                    if stat.get('avg_drug_likeness'):
                        print(f"    평균 약물 유사성: {stat['avg_drug_likeness']:.3f}")
                    if stat.get('avg_bioavailability'):
                        print(f"    평균 생체이용률: {stat['avg_bioavailability']:.3f}")
            
            return True
        else:
            print(f"❌ 통계 조회 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 통계 테스트 오류: {e}")
        return False

def test_molecular_science_search(compound_name: str = None, target_protein: str = None, 
                                 disease_area: str = None, research_area: str = None):
    """분자과학 데이터 검색 테스트"""
    print(f"\n🔍 분자과학 데이터 검색 테스트...")
    
    try:
        payload = {}
        if compound_name:
            payload['compound_name'] = compound_name
            print(f"  화합물: {compound_name}")
        if target_protein:
            payload['target_protein'] = target_protein
            print(f"  타겟 단백질: {target_protein}")
        if disease_area:
            payload['disease_area'] = disease_area
            print(f"  질병 영역: {disease_area}")
        if research_area:
            payload['research_area'] = research_area
            print(f"  연구 영역: {research_area}")
        
        response = requests.post(
            f"{API_BASE_URL}/molecular-science/",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ 분자과학 검색 성공!")
            
            insights = data.get('insights', {})
            print(f"\n📊 검색 결과 요약:")
            print(f"  - 화합물: {insights.get('total_compounds', 0)}개")
            print(f"  - 임상시험: {insights.get('total_trials', 0)}개")
            print(f"  - 연구논문: {insights.get('total_papers', 0)}개")
            
            if insights.get('top_targets'):
                print(f"\n🎯 주요 타겟 단백질:")
                for target in insights['top_targets'][:3]:
                    print(f"  - {target['name']}: {target['count']}회 언급")
            
            if insights.get('clinical_phases'):
                print(f"\n🏥 임상시험 단계:")
                for phase in insights['clinical_phases']:
                    if phase:
                        print(f"  - {phase}")
            
            # 상세 결과 출력
            if data.get('compounds'):
                print(f"\n💊 화합물 정보 (상위 3개):")
                for i, compound in enumerate(data['compounds'][:3], 1):
                    print(f"  {i}. {compound.get('title', '제목 없음')}")
                    if compound.get('molecular_weight'):
                        print(f"     분자량: {compound['molecular_weight']:.2f}")
                    if compound.get('drug_likeness'):
                        print(f"     약물 유사성: {compound['drug_likeness']:.3f}")
            
            if data.get('clinical_trials'):
                print(f"\n🏥 임상시험 정보 (상위 3개):")
                for i, trial in enumerate(data['clinical_trials'][:3], 1):
                    print(f"  {i}. {trial.get('title', '제목 없음')}")
                    if trial.get('clinical_phase'):
                        print(f"     단계: {trial['clinical_phase']}")
                    if trial.get('mechanism_of_action'):
                        print(f"     작용기전: {trial['mechanism_of_action']}")
            
            return True
        else:
            print(f"❌ 검색 실패: {response.status_code}")
            print(f"오류 내용: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 검색 테스트 오류: {e}")
        return False

def test_advisor_with_molecular_context():
    """분자과학 맥락의 어드바이저 테스트"""
    print(f"\n🤖 분자과학 맥락 어드바이저 테스트...")
    
    molecular_questions = [
        {
            "question": "EGFR 억제제의 임상적 효과와 부작용에 대해 알려주세요.",
            "persona_code": "P1"
        },
        {
            "question": "면역항암제 개발의 최신 동향은 무엇인가요?",
            "persona_code": "P2"
        },
        {
            "question": "정밀의학을 위한 바이오마커 개발 현황은 어떻나요?",
            "persona_code": "P3"
        },
        {
            "question": "신약 개발 과정에서 안전성 평가는 어떻게 이루어지나요?",
            "persona_code": "P4"
        }
    ]
    
    success_count = 0
    total_count = len(molecular_questions)
    
    for i, test_case in enumerate(molecular_questions, 1):
        print(f"\n{'='*20} 테스트 {i}/{total_count} {'='*20}")
        print(f"질문: {test_case['question']}")
        print(f"페르소나: {test_case['persona_code']}")
        
        try:
            payload = {
                "question": test_case["question"],
                "persona_code": test_case["persona_code"]
            }
            
            response = requests.post(
                f"{API_BASE_URL}/ask-advisor/",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ 어드바이저 응답 성공!")
                print(f"신뢰도: {data['confidence']:.2f}")
                print(f"관련 소스: {len(data['sources'])}개")
                
                if data.get('persona_insight'):
                    print(f"페르소나 인사이트: {data['persona_insight']}")
                
                # 분자과학 관련 소스 확인
                molecular_sources = [s for s in data['sources'] if s.get('molecular_data')]
                if molecular_sources:
                    print(f"분자과학 관련 소스: {len(molecular_sources)}개")
                    for source in molecular_sources[:2]:
                        mol_data = source['molecular_data']
                        print(f"  - {source['title']}")
                        if mol_data.get('molecular_weight'):
                            print(f"    분자량: {mol_data['molecular_weight']}")
                        if mol_data.get('target_proteins'):
                            print(f"    타겟: {', '.join(mol_data['target_proteins'])}")
                
                success_count += 1
            else:
                print(f"❌ 어드바이저 응답 실패: {response.status_code}")
                
        except Exception as e:
            print(f"❌ 어드바이저 테스트 오류: {e}")
        
        if i < total_count:
            time.sleep(2)
    
    print(f"\n📊 어드바이저 테스트 결과: {success_count}/{total_count} 성공")
    return success_count == total_count

def run_comprehensive_molecular_test():
    """종합 분자과학 테스트 실행"""
    print("🧬 MKM Lab 분자과학 API 종합 테스트 시작")
    print("=" * 60)
    
    # 1. API 상태 확인
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code != 200:
            print("❌ API 서버가 실행되지 않았습니다.")
            print("다음 명령어로 API 서버를 시작하세요:")
            print("cd api")
            print("python main.py")
            return False
    except:
        print("❌ API 서버에 연결할 수 없습니다.")
        return False
    
    # 2. 분자과학 통계 테스트
    stats_success = test_molecular_science_stats()
    
    # 3. 다양한 검색 테스트
    search_tests = [
        {"compound_name": "EGFR"},
        {"target_protein": "ALK"},
        {"disease_area": "cancer"},
        {"research_area": "immunotherapy"}
    ]
    
    search_success_count = 0
    for test in search_tests:
        if test_molecular_science_search(**test):
            search_success_count += 1
        time.sleep(1)
    
    # 4. 어드바이저 테스트
    advisor_success = test_advisor_with_molecular_context()
    
    # 5. 결과 요약
    print(f"\n{'='*60}")
    print("📊 분자과학 API 테스트 결과 요약")
    print(f"{'='*60}")
    print(f"📈 통계 조회: {'✅' if stats_success else '❌'}")
    print(f"🔍 검색 기능: {search_success_count}/{len(search_tests)} 성공")
    print(f"🤖 어드바이저: {'✅' if advisor_success else '❌'}")
    
    total_success = (1 if stats_success else 0) + search_success_count + (1 if advisor_success else 0)
    total_tests = 1 + len(search_tests) + 1
    
    print(f"\n📈 전체 성공률: {total_success}/{total_tests} ({(total_success/total_tests)*100:.1f}%)")
    
    if total_success == total_tests:
        print("\n🎉 모든 분자과학 API 테스트가 성공적으로 완료되었습니다!")
        print("MKM Lab 분자과학 시스템이 정상적으로 작동하고 있습니다.")
    else:
        print(f"\n⚠️ {total_tests - total_success}개의 테스트가 실패했습니다.")
        print("문제를 확인하고 수정해주세요.")
    
    return total_success == total_tests

def test_single_molecular_search():
    """단일 분자과학 검색 테스트"""
    print("🔍 분자과학 데이터 단일 검색 테스트")
    print("검색 조건을 입력하세요:")
    
    compound_name = input("화합물명 (엔터로 건너뛰기): ").strip()
    target_protein = input("타겟 단백질 (엔터로 건너뛰기): ").strip()
    disease_area = input("질병 영역 (엔터로 건너뛰기): ").strip()
    research_area = input("연구 영역 (엔터로 건너뛰기): ").strip()
    
    # 빈 값 제거
    params = {}
    if compound_name:
        params['compound_name'] = compound_name
    if target_protein:
        params['target_protein'] = target_protein
    if disease_area:
        params['disease_area'] = disease_area
    if research_area:
        params['research_area'] = research_area
    
    if not params:
        print("❌ 최소 하나의 검색 조건을 입력해주세요.")
        return
    
    test_molecular_science_search(**params)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        test_single_molecular_search()
    else:
        run_comprehensive_molecular_test() 