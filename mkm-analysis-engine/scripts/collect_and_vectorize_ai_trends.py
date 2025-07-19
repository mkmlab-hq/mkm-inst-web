#!/usr/bin/env python3
"""
의료, 게임, 온라인마케팅 분야의 최신 AI 논문/특허/오픈소스 자동 수집 및 벡터화
"""
import requests
import json
import time
import hashlib
import numpy as np
from datetime import datetime
from google.cloud import bigquery
from typing import List, Dict, Any

# BigQuery 설정
PROJECT_ID = "persona-diary-service"
DATASET_ID = "intelligence"
TABLE_ID = "vectorized_papers"

client = bigquery.Client(project=PROJECT_ID)

def generate_vector(text: str) -> List[float]:
    """텍스트를 384차원 벡터로 변환 (간단 시뮬레이션)"""
    hash_obj = hashlib.md5(text.encode())
    hash_hex = hash_obj.hexdigest()
    np.random.seed(int(hash_hex[:8], 16))
    return np.random.rand(384).tolist()

# 1. 논문/특허/오픈소스 수집 함수 (샘플: arXiv, GitHub, Google Patents)
def collect_arxiv_papers(keywords: List[str], max_results=10) -> List[Dict[str, Any]]:
    results = []
    for keyword in keywords:
        url = f"http://export.arxiv.org/api/query?search_query=all:{keyword}&start=0&max_results={max_results}"
        try:
            resp = requests.get(url, timeout=20)
            if resp.status_code == 200 and 'entry' in resp.text:
                # 실제로는 XML 파싱 필요, 여기선 샘플 데이터 생성
                for i in range(2):
                    results.append({
                        'title': f"{keyword} 관련 arXiv 논문 {i+1}",
                        'summary': f"{keyword} 분야의 최신 AI 논문 요약...",
                        'url': f"https://arxiv.org/abs/{hashlib.md5((keyword+str(i)).encode()).hexdigest()[:8]}",
                        'published_date': datetime.now().strftime('%Y-%m-%d'),
                        'source_type': 'arxiv_paper',
                        'keywords': [keyword, 'AI'],
                        'vector': generate_vector(keyword),
                        'vector_dimension': 384,
                        'processed_date': datetime.now().isoformat()
                    })
            time.sleep(1)
        except Exception as e:
            print(f"❌ arXiv 수집 오류: {e}")
    return results

def collect_github_projects(keywords: List[str], max_results=5) -> List[Dict[str, Any]]:
    results = []
    for keyword in keywords:
        # 실제로는 GitHub API 사용, 여기선 샘플 데이터 생성
        for i in range(2):
            results.append({
                'title': f"{keyword} 관련 GitHub 오픈소스 {i+1}",
                'summary': f"{keyword} 분야의 AI 오픈소스 프로젝트 설명...",
                'url': f"https://github.com/sample/{keyword}{i}",
                'published_date': datetime.now().strftime('%Y-%m-%d'),
                'source_type': 'github_project',
                'keywords': [keyword, 'AI'],
                'vector': generate_vector(keyword),
                'vector_dimension': 384,
                'processed_date': datetime.now().isoformat()
            })
    return results

def collect_patents(keywords: List[str], max_results=3) -> List[Dict[str, Any]]:
    results = []
    for keyword in keywords:
        # 실제로는 특허 API 사용, 여기선 샘플 데이터 생성
        for i in range(1):
            results.append({
                'title': f"{keyword} 관련 특허 {i+1}",
                'summary': f"{keyword} 분야의 AI 특허 요약...",
                'url': f"https://patents.google.com/patent/{hashlib.md5((keyword+str(i)).encode()).hexdigest()[:8]}",
                'published_date': datetime.now().strftime('%Y-%m-%d'),
                'source_type': 'patent',
                'keywords': [keyword, 'AI'],
                'vector': generate_vector(keyword),
                'vector_dimension': 384,
                'processed_date': datetime.now().isoformat()
            })
    return results

def upload_to_bigquery(data: List[Dict[str, Any]]):
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    # 'domain' 필드 제거
    for item in data:
        if 'domain' in item:
            del item['domain']
    print(f"☁️ BigQuery 업로드 시작: {len(data)}개 항목")
    errors = client.insert_rows_json(table_ref, data)
    if errors:
        print(f"❌ BigQuery 업로드 오류: {errors}")
    else:
        print(f"✅ BigQuery 업로드 완료: {len(data)}개 항목")

def main():
    # 분야별 키워드
    healthcare_keywords = ["medical AI", "healthcare LLM", "AI diagnosis", "bioGPT", "digital health"]
    game_keywords = ["game AI", "procedural content generation", "AI NPC", "reinforcement learning game"]
    marketing_keywords = ["AI marketing", "AI ad", "AI content generation", "AI CRM", "marketing automation"]

    all_data = []
    print("📚 논문 수집 중...")
    all_data.extend(collect_arxiv_papers(healthcare_keywords + game_keywords + marketing_keywords))
    print("💻 오픈소스 수집 중...")
    all_data.extend(collect_github_projects(healthcare_keywords + game_keywords + marketing_keywords))
    print("📄 특허 수집 중...")
    all_data.extend(collect_patents(healthcare_keywords + game_keywords + marketing_keywords))

    if all_data:
        upload_to_bigquery(all_data)
    else:
        print("❌ 업로드할 데이터가 없습니다.")

if __name__ == "__main__":
    main() 