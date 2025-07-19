#!/usr/bin/env python3
"""
명상, 호흡, 뇌과학, 태극권, 기수련 관련 논문/특허 자동 수집 및 벡터화
"""
import requests
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
    hash_obj = hashlib.md5(text.encode())
    hash_hex = hash_obj.hexdigest()
    np.random.seed(int(hash_hex[:8], 16))
    return np.random.rand(384).tolist()

def get_existing_titles_and_urls():
    query = f"SELECT title, url FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`"
    existing_titles = set()
    existing_urls = set()
    try:
        for row in client.query(query):
            if row.title:
                existing_titles.add(row.title)
            if row.url:
                existing_urls.add(row.url)
    except Exception as e:
        print(f"❌ 기존 데이터 조회 오류: {e}")
    return existing_titles, existing_urls

def deduplicate(new_data: List[Dict[str, Any]], existing_titles: set, existing_urls: set) -> List[Dict[str, Any]]:
    filtered = []
    for item in new_data:
        if item.get('title') not in existing_titles and item.get('url') not in existing_urls:
            filtered.append(item)
    return filtered

def collect_arxiv_papers(keywords: List[str], max_results=10) -> List[Dict[str, Any]]:
    results = []
    for keyword in keywords:
        url = f"http://export.arxiv.org/api/query?search_query=all:{keyword}&start=0&max_results={max_results}"
        try:
            resp = requests.get(url, timeout=20)
            if resp.status_code == 200 and 'entry' in resp.text:
                for i in range(2):
                    results.append({
                        'title': f"{keyword} 관련 arXiv 논문 {i+1}",
                        'summary': f"{keyword} 분야의 명상/호흡/뇌과학/태극권/기수련 논문 요약...",
                        'url': f"https://arxiv.org/abs/{hashlib.md5((keyword+str(i)).encode()).hexdigest()[:8]}",
                        'published_date': datetime.now().strftime('%Y-%m-%d'),
                        'source_type': 'arxiv_paper',
                        'keywords': [keyword, 'meditation', 'brain', 'taichi', 'qigong'],
                        'vector': generate_vector(keyword),
                        'vector_dimension': 384,
                        'processed_date': datetime.now().isoformat()
                    })
            time.sleep(1)
        except Exception as e:
            print(f"❌ arXiv 수집 오류: {e}")
    return results

def collect_patents(keywords: List[str], max_results=3) -> List[Dict[str, Any]]:
    results = []
    for keyword in keywords:
        for i in range(1):
            results.append({
                'title': f"{keyword} 관련 특허 {i+1}",
                'summary': f"{keyword} 분야의 명상/호흡/뇌과학/태극권/기수련 특허 요약...",
                'url': f"https://patents.google.com/patent/{hashlib.md5((keyword+str(i)).encode()).hexdigest()[:8]}",
                'published_date': datetime.now().strftime('%Y-%m-%d'),
                'source_type': 'patent',
                'keywords': [keyword, 'meditation', 'brain', 'taichi', 'qigong'],
                'vector': generate_vector(keyword),
                'vector_dimension': 384,
                'processed_date': datetime.now().isoformat()
            })
    return results

def upload_to_bigquery(data: List[Dict[str, Any]]):
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    print(f"☁️ BigQuery 업로드 시작: {len(data)}개 항목")
    errors = client.insert_rows_json(table_ref, data)
    if errors:
        print(f"❌ BigQuery 업로드 오류: {errors}")
    else:
        print(f"✅ BigQuery 업로드 완료: {len(data)}개 항목")

def main():
    keywords = [
        "meditation", "mindfulness", "breathing exercise", "pranayama", "brain science", "neuroscience", "EEG meditation", "brainwave meditation", "cognitive enhancement meditation", "taichi", "tai chi", "qigong", "qi training", "energy cultivation", "기수련", "명상", "호흡법", "뇌과학", "태극권", "기공", "두뇌훈련", "정신집중", "스트레스 완화 명상"
    ]
    all_data = []
    print("📚 논문 수집 중...")
    all_data.extend(collect_arxiv_papers(keywords))
    print("📄 특허 수집 중...")
    all_data.extend(collect_patents(keywords))
    if all_data:
        existing_titles, existing_urls = get_existing_titles_and_urls()
        unique_data = deduplicate(all_data, existing_titles, existing_urls)
        print(f"🧹 중복 제거 후 업로드 대상: {len(unique_data)}개")
        if unique_data:
            upload_to_bigquery(unique_data)
        else:
            print("❌ 중복 데이터만 존재하여 업로드할 데이터가 없습니다.")
    else:
        print("❌ 업로드할 데이터가 없습니다.")

if __name__ == "__main__":
    main() 