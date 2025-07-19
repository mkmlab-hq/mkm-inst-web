import json
import time
from transformers import pipeline
from sentence_transformers import SentenceTransformer
from datetime import datetime
from google.cloud import storage
from google.cloud import bigquery

class IntegratedVectorizationPipeline:
    def __init__(self):
        print("🔧 AI 모델 로딩 중...")
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.vector_db = []
        print("✅ AI 모델 로딩 완료")
        
        # GCP 클라이언트 초기화
        self.gcp_bucket_name = "mkm-lab-intelligence"  # 실제 GCS 버킷명
        self.gcp_bq_dataset = "intelligence"           # 실제 BigQuery 데이터셋명
        self.gcp_bq_table = "vectorized_papers"        # 실제 BigQuery 테이블명
        self.storage_client = storage.Client()
        self.bigquery_client = bigquery.Client()

    def load_collected_data(self, filename="enhanced_collected_data.json"):
        """수집된 데이터 로드"""
        try:
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
            print(f"📂 데이터 로드 완료: {filename}")
            return data
        except FileNotFoundError:
            print(f"⚠️ 파일을 찾을 수 없습니다: {filename}")
            return {}
    
    def process_and_vectorize(self, data_items, data_type):
        """데이터 처리 및 벡터화"""
        if not data_items:
            print(f"[{data_type}] 처리할 데이터가 없습니다.")
            return
        
        total_items = len(data_items)
        processed_count = 0
        start_time = time.time()
        
        print(f"\n[{data_type}] 벡터화 시작 - 총 {total_items}건")
        
        for item in data_items:
            processed_count += 1
            
            # 텍스트 준비
            title = item.get('title', '')
            content = item.get('content', '')
            description = item.get('description', '')
            
            # 통합 텍스트 생성
            full_text = f"{title} {content} {description}".strip()
            if not full_text:
                continue
            
            # 요약 생성 (텍스트가 충분히 긴 경우에만)
            try:
                if len(full_text) > 100:
                    summary = self.summarizer(full_text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
                else:
                    summary = full_text
            except Exception as e:
                print(f"    ⚠️ 요약 생성 실패: {e}")
                summary = full_text[:200] + "..." if len(full_text) > 200 else full_text
            
            # 벡터 생성
            try:
                vector = self.model.encode(summary)
            except Exception as e:
                print(f"    ⚠️ 벡터 생성 실패: {e}")
                continue
            
            # 통합 데이터 구조 생성
            vector_item = {
                "source_type": item.get("source_type", data_type),
                "source_name": item.get("source_name", ""),
                "title": title,
                "summary": summary,
                "content": content,
                "url": item.get("url", ""),
                "published_date": item.get("published_date", ""),
                "entities": item.get("entities", []),
                "keywords": item.get("keywords", []),
                "vector": vector.tolist(),
                
                # 추가 메타데이터
                "nct_id": item.get("nct_id", ""),
                "phase": item.get("phase", ""),
                "status": item.get("status", ""),
                "sponsor": item.get("sponsor", ""),
                "funding_round": item.get("funding_round", ""),
                "funding_amount": item.get("funding_amount", ""),
                "company_name": item.get("company_name", ""),
                "stars": item.get("stars", 0),
                "forks": item.get("forks", 0),
                "language": item.get("language", ""),
                "owner": item.get("owner", ""),
                "arxiv_id": item.get("arxiv_id", ""),
                
                # 처리 메타데이터
                "processed_date": datetime.now().isoformat(),
                "vector_dimension": len(vector)
            }
            
            self.vector_db.append(vector_item)
            
            # 진행률 표시
            elapsed = time.time() - start_time
            avg_per_item = elapsed / processed_count
            est_total = avg_per_item * total_items
            
            print(f"  진행률: {processed_count/total_items*100:.1f}% | {processed_count}/{total_items}건 | 예상 소요: {est_total/60:.1f}분")
            print(f"    → {title[:50]}...")
        
        print(f"[{data_type}] 벡터화 완료 - {processed_count}건 처리됨")
    
    def run_integrated_vectorization(self):
        """통합 벡터화 파이프라인 실행"""
        print("🚀 통합 벡터화 파이프라인 시작")
        print("=" * 60)
        
        start_time = time.time()
        
        # 1. 수집된 데이터 로드
        print("\n📂 1단계: 수집된 데이터 로드")
        collected_data = self.load_collected_data()
        
        if not collected_data:
            print("❌ 수집된 데이터가 없습니다. 먼저 데이터 수집을 실행해주세요.")
            return
        
        # 2. 각 데이터 타입별 처리
        print("\n🔧 2단계: 데이터 타입별 벡터화")
        
        # GitHub 프로젝트 처리
        if "github_projects" in collected_data:
            self.process_and_vectorize(collected_data["github_projects"], "GitHub 프로젝트")
        
        # 연구 논문 처리
        if "research_papers" in collected_data:
            self.process_and_vectorize(collected_data["research_papers"], "연구 논문")
        
        # 뉴스 처리
        if "news" in collected_data:
            self.process_and_vectorize(collected_data["news"], "뉴스")
        
        # 임상시험 처리
        if "clinical_trials" in collected_data:
            self.process_and_vectorize(collected_data["clinical_trials"], "임상시험")
        
        # 3. 통계 생성
        print("\n📊 3단계: 통계 생성")
        stats = self.generate_statistics()
        
        # 4. 결과 저장
        print("\n💾 4단계: 결과 저장")
        self.save_results(stats)
        
        total_time = time.time() - start_time
        print(f"\n✅ 통합 벡터화 파이프라인 완료!")
        print(f"   총 소요시간: {total_time/60:.1f}분")
        print(f"   총 벡터화된 데이터: {len(self.vector_db)}건")
        print(f"   저장 파일: integrated_intelligence_database.json")
        
        return self.vector_db
    
    def generate_statistics(self):
        """벡터화된 데이터 통계 생성"""
        stats = {
            "total_items": len(self.vector_db),
            "source_type_distribution": {},
            "source_name_distribution": {},
            "processing_date": datetime.now().isoformat(),
            "vector_dimension": 0
        }
        
        for item in self.vector_db:
            # 소스 타입별 분포
            source_type = item.get("source_type", "unknown")
            stats["source_type_distribution"][source_type] = stats["source_type_distribution"].get(source_type, 0) + 1
            
            # 소스 이름별 분포
            source_name = item.get("source_name", "unknown")
            stats["source_name_distribution"][source_name] = stats["source_name_distribution"].get(source_name, 0) + 1
            
            # 벡터 차원 (첫 번째 항목에서 가져옴)
            if stats["vector_dimension"] == 0:
                stats["vector_dimension"] = item.get("vector_dimension", 0)
        
        print("📊 통계 정보:")
        print(f"   총 데이터: {stats['total_items']}건")
        print(f"   벡터 차원: {stats['vector_dimension']}차원")
        print("   소스 타입별 분포:")
        for source_type, count in stats["source_type_distribution"].items():
            print(f"     {source_type}: {count}건")
        
        return stats
    
    def save_results(self, stats):
        """결과 저장 및 GCP 업로드"""
        # 메인 데이터베이스 저장
        with open("integrated_intelligence_database.json", "w", encoding="utf-8") as f:
            json.dump(self.vector_db, f, ensure_ascii=False, indent=2)
        
        # 통계 정보 저장
        with open("intelligence_database_stats.json", "w", encoding="utf-8") as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        
        print("💾 저장 완료:")
        print("   - integrated_intelligence_database.json (메인 데이터)")
        print("   - intelligence_database_stats.json (통계 정보)")

        # GCP Cloud Storage 업로드
        try:
            self.upload_to_gcs("integrated_intelligence_database.json", "intelligence/integrated_intelligence_database.json")
            self.upload_to_gcs("intelligence_database_stats.json", "intelligence/intelligence_database_stats.json")
        except Exception as e:
            print(f"❌ GCS 업로드 오류: {e}")

        # BigQuery 적재
        try:
            self.upload_to_bigquery(self.vector_db)
        except Exception as e:
            print(f"❌ BigQuery 적재 오류: {e}")

    # GCP 연동 함수 추가
    def upload_to_gcs(self, local_path, gcs_path):
        from google.cloud import storage
        bucket = self.storage_client.bucket(self.gcp_bucket_name)
        blob = bucket.blob(gcs_path)
        blob.upload_from_filename(local_path)
        print(f"☁️ GCS 업로드 완료: gs://{self.gcp_bucket_name}/{gcs_path}")

    def upload_to_bigquery(self, data):
        from google.cloud import bigquery
        table_id = f"{self.bigquery_client.project}.{self.gcp_bq_dataset}.{self.gcp_bq_table}"
        errors = self.bigquery_client.insert_rows_json(table_id, data)
        if errors:
            print(f"❌ BigQuery 적재 오류: {errors}")
        else:
            print(f"✅ BigQuery 적재 완료: {table_id}")

if __name__ == "__main__":
    pipeline = IntegratedVectorizationPipeline()
    results = pipeline.run_integrated_vectorization()