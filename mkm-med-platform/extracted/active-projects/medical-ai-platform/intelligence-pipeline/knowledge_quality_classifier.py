import json
import numpy as np
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import re

class KnowledgeQualityClassifier:
    def __init__(self):
        print("🔍 지식 품질 분류기 초기화...")
        
        # 데이터 출처별 가중치 정의
        self.source_weights = {
            "pubmed": 1,
            "nature": 1,
            "science": 10,
            "lancet": 1,
            "nejm": 10,
            "jama": 10,
            "arxiv": 0.9,
            "ieee": 0.9,
            "acm": 0.9,
            "springer": 0.9,
            "elsevier": 0.9,
            "google_scholar": 0.7,
            "researchgate": 0.7,
            "academia": 0.7,
            "blog": 0.5,
            "community": 0.5,
            "forum": 0.5
        }
        
        # 근거 수준 분류
        self.evidence_levels = {
            "rct": "Level 1 - Randomized Controlled Trial",
            "cohort": "Level 2 - Cohort Study",
            "case_control": "Level 3 - Case-Control Study",
            "case_series": "Level 4 - Case-Series",
            "expert_opinion": "Level 5 - Expert Opinion",
            "preclinical": "Level 6 - Preclinical Study"
        }
        
        print(✅지식 품질 분류기 준비 완료")
    
    def classify_evidence_level(self, content, source_type):
        """근거 수준 분류"""
        content_lower = content.lower()
        
        # RCT 키워드 검색
        rct_keywords = [
            "randomized controlled trial", "rct", "ndomized", "randomised",
            "double-blind", "placebo-controlled,clinical trial"
        ]
        
        # 코호트 연구 키워드
        cohort_keywords = [
            "cohort study", "prospective study", "longitudinal study",
            "follow-up study", "observational study"
        ]
        
        # 케이스-컨트롤 연구 키워드
        case_control_keywords = [
            "case-control study", "case control", "retrospective study"
        ]
        
        # 케이스 시리즈 키워드
        case_series_keywords = [
            "case series", "case report", "case study"
        ]
        
        # 전문가 의견 키워드
        expert_keywords = [
            "expert opinion", "review", "commentary", "perspective"
        ]
        
        # 전임상 연구 키워드
        preclinical_keywords = [
            "in vitro", "in vivo", "animal study", "ical",
            "laboratory study", "l culture"
        ]
        
        # 키워드 매칭으로 근거 수준 결정
        if any(keyword in content_lower for keyword in rct_keywords):
            return self.evidence_levels["rct"]
        elif any(keyword in content_lower for keyword in cohort_keywords):
            return self.evidence_levels["cohort"]
        elif any(keyword in content_lower for keyword in case_control_keywords):
            return self.evidence_levels["case_control"]
        elif any(keyword in content_lower for keyword in case_series_keywords):
            return self.evidence_levels["case_series"]
        elif any(keyword in content_lower for keyword in preclinical_keywords):
            return self.evidence_levels["preclinical"]
        elif any(keyword in content_lower for keyword in expert_keywords):
            return self.evidence_levels["expert_opinion"]
        else:
            return self.evidence_levels["expert_opinion"]  # 기본값
    
    def calculate_quality_score(self, data_item):
        """종합 품질 점수 계산"""
        score = 0.0        
        # 1. 출처 가중치 (40)
        source = data_item.get('source_name', '').lower()
        source_weight = 0.5 # 기본값
        
        for key, weight in self.source_weights.items():
            if key in source:
                source_weight = weight
                break
        
        score += source_weight * 0.4        
        # 2. 근거 수준 가중치 (30%)
        evidence_level = data_item.get('evidence_level', 'expert_opinion')
        evidence_weights = {
            "rct": 10,
            "cohort": 0.8,
            "case_control": 0.6,
            "case_series": 0.4,
            "expert_opinion": 0.3,
            "preclinical": 0.5
        }
        evidence_weight = evidence_weights.get(evidence_level, 0.3)
        score += evidence_weight * 0.3        
        # 3. 인용 가중치 (20%)
        citations = data_item.get('citations', 0)
        citation_score = min(citations / 100.0, 1.0)  # 최대 100 정규화
        score += citation_score * 0.2        
        #4. 최신도 가중치 (10%)
        published_date = data_item.get('published_date', '')
        if published_date:
            try:
                year = int(published_date[:4])
                current_year = datetime.now().year
                recency_score = max(0, (year - (current_year - 10)) / 10.0)  # 최근 10년을 1.0으로 정규화
                score += recency_score * 0.1
            except:
                score += 0.5 * 0.1 # 기본값
        else:
            score += 0.5 * 0.1   
        return min(score, 10.0) # 최대 1.0으로 제한
    
    def classify_knowledge_data(self, knowledge_data):
        """지식 데이터 품질 분류 및 가중치 부여"""
        print("🔍 지식 데이터 품질 분류 시작...")
        
        classified_data = {
            'high_quality': [],  # 품질 점수 0.8 이상
            'medium_quality': [],  # 품질 점수 0.5 ~ 0.79
            'low_quality': [],     # 품질 점수 0.49 이하
            'statistics': {
                'total_items': 0,
                'high_quality_count': 0,
                'medium_quality_count': 0,
                'low_quality_count': 0,
                'average_quality_score': 0.0
            }
        }
        
        all_scores = []
        
        # 각 데이터 타입별로 분류
        for data_type, items in knowledge_data.items():
            if data_type in ['collection_date', 'total_items']:
                continue
                
            print(f"[{data_type}] 분류 중...")
            
            for item in items:
                # 근거 수준 분류
                content = f"{item.get('title', '')} {item.get('content', '')}"
                evidence_level = self.classify_evidence_level(content, item.get('source_name', ''))
                item['evidence_level'] = evidence_level
                
                # 품질 점수 계산
                quality_score = self.calculate_quality_score(item)
                item['quality_score'] = quality_score # 키 이름 변경
                all_scores.append(quality_score)
                
                # 품질별 분류
                if quality_score >= 0.8:
                    classified_data['high_quality'].append(item)
                    classified_data['statistics']['high_quality_count'] += 1
                elif quality_score >= 0.5:
                    classified_data['medium_quality'].append(item)
                    classified_data['statistics']['medium_quality_count'] += 1
                else:
                    classified_data['low_quality'].append(item)
                    classified_data['statistics']['low_quality_count'] += 1
                
                classified_data['statistics']['total_items'] += 1        
        # 통계 계산
        if all_scores:
            classified_data['statistics']['average_quality_score'] = np.mean(all_scores)
        
        print(f"✅ 품질 분류 완료!")
        print(f"   총 데이터: {classified_data['statistics']['total_items']}건")
        print(f"   고품질: {classified_data['statistics']['high_quality_count']}건")
        print(f"   중품질: {classified_data['statistics']['medium_quality_count']}건")
        print(f"   저품질: {classified_data['statistics']['low_quality_count']}건")
        print(f"   평균 품질 점수: {classified_data['statistics']['average_quality_score']:.3f}")
        
        return classified_data
    
    def generate_evidence_based_response(self, query, classified_data):
        """근거 기반 AI 응답 생성"""
        # 고품질 데이터 우선 사용
        high_quality_data = classified_data['high_quality']
        medium_quality_data = classified_data['medium_quality']
        
        # 쿼리와 관련된 데이터 검색 (간단한 키워드 매칭)
        relevant_data = []
        
        for item in high_quality_data + medium_quality_data:
            content = f"{item.get('title', '')} {item.get('content', '')}".lower()
            if any(keyword in content for keyword in query.lower().split()):
                relevant_data.append(item)
        
        if not relevant_data:
            return "죄송합니다. 관련된 신뢰할 수 있는 연구 데이터를 찾을 수 없습니다."        
        # 품질 점수순으로 정렬
        relevant_data.sort(key=lambda x: x.get('quality_score', 0), reverse=True)
        
        # 상위 3개 데이터 기반 응답 생성
        top_data = relevant_data[:3]
        
        response = f"최신 연구에 따르면, {query}와 관련하여 다음과 같은 발견이 있습니다:\n\n"
        for i, data in enumerate(top_data, 1):
            evidence_level = self.evidence_levels.get(data.get('evidence_level', 'expert_opinion'), 'Expert Opinion')
            source = data.get('source_name', 'Unknown')
            year = data.get('published_date', '')[:4] if data.get('published_date') else '자료 없음'
            
            response += f"{i}. {data.get('title', '제목 없음')}\n"
            response += f"   출처: {source} ({year})\n"
            response += f"   근거 수준: {evidence_level}\n"
            response += f"   품질 점수: {data.get('quality_score', 0):.2f}\n"
        return response

# 사용 예시
if __name__ == "__main__":
    classifier = KnowledgeQualityClassifier()
    
    # 샘플 데이터로 테스트
    sample_data = {
        "medical_research": [
            {
                "title": "Randomized Controlled Trial of rPPG for Stress Detection",
                "content": "This randomized controlled trial demonstrates...",
                "source_name": "pubmed",
                "published_date": "2023",
                "citations": 45
            },
            {
                "title": "Case Study: Facial Analysis in Traditional Medicine",
                "content": "A case study of facial analysis...",
                "source_name": "blog",
                "published_date": "2022",
                "citations": 2
            }
        ]
    }
    
    classified = classifier.classify_knowledge_data(sample_data)
    print("=" * 50)
    print("근거 기반 응답 테스트:")
    response = classifier.generate_evidence_based_response("stress detection", classified)
    print(response) 