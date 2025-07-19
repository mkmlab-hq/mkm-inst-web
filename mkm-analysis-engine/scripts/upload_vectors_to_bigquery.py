import json
from google.cloud import bigquery
import os

# 환경 변수로 인증 정보가 등록되어 있어야 합니다.
# GOOGLE_APPLICATION_CREDENTIALS 환경 변수에 서비스 계정 키 경로가 지정되어 있어야 함.

# 업로드할 JSON 파일 경로
JSON_PATH = r"f:\WORK-SPACE\mkm-med-platform\extracted\active-projects\medical-ai-platform\intelligence-pipeline\processors\integrated_intelligence_database.json"

# BigQuery 정보
PROJECT_ID = "persona-diary-service"  # 실제 프로젝트 ID
DATASET_ID = "intelligence"
TABLE_ID = "vectorized_papers"

# BigQuery 클라이언트 생성
client = bigquery.Client(project=PROJECT_ID)
table_ref = client.dataset(DATASET_ID).table(TABLE_ID)

# 데이터 로드
def load_json_data(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"✅ JSON 데이터 로드 완료: {json_path} | {len(data)}건")
    return data

def upload_to_bigquery(data):
    print(f"☁️ BigQuery 업로드 시작: {table_ref}")
    errors = client.insert_rows_json(table_ref, data)
    if errors:
        print(f"❌ BigQuery 적재 오류: {errors}")
    else:
        print(f"✅ BigQuery 적재 완료: {table_ref} | {len(data)}건")

if __name__ == "__main__":
    data = load_json_data(JSON_PATH)
    upload_to_bigquery(data)
