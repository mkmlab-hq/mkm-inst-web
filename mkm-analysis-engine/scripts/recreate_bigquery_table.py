import json
from google.cloud import bigquery
from google.cloud.exceptions import NotFound

# 설정
PROJECT_ID = "persona-diary-service"
DATASET_ID = "intelligence"
TABLE_ID = "vectorized_papers"
SCHEMA_PATH = r"f:\WORK-SPACE\mkm-analysis-engine\scripts\bigquery_schema.json"

def load_schema():
    """스키마 파일에서 스키마 로드"""
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def recreate_table():
    """BigQuery 테이블 삭제 후 재생성"""
    client = bigquery.Client(project=PROJECT_ID)
    
    # 테이블 참조
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    
    try:
        # 기존 테이블 삭제
        print(f"🗑️ 기존 테이블 삭제 중: {TABLE_ID}")
        client.delete_table(table_ref, not_found_ok=True)
        print(f"✅ 테이블 삭제 완료: {TABLE_ID}")
    except Exception as e:
        print(f"⚠️ 테이블 삭제 중 오류 (무시): {e}")
    
    # 새 스키마 로드
    new_schema = load_schema()
    print(f"📋 새 스키마 로드: {len(new_schema)} 필드")
    
    # BigQuery 스키마 객체로 변환
    schema_fields = []
    for field in new_schema:
        schema_fields.append(bigquery.SchemaField(
            name=field["name"],
            field_type=field["type"],
            mode=field["mode"]
        ))
    
    # 새 테이블 생성
    print(f"📝 새 테이블 생성 중: {TABLE_ID}")
    table = bigquery.Table(table_ref, schema=schema_fields)
    table = client.create_table(table)
    
    print(f"✅ 테이블 생성 완료: {table.full_table_id}")
    print(f"🔧 필드 수: {len(table.schema)}")
    
    # 생성된 스키마 출력
    print("\n📊 생성된 스키마:")
    for field in table.schema:
        print(f"  - {field.name}: {field.field_type} ({field.mode})")
    
    return True

def main():
    print("🔄 BigQuery 테이블 재생성 시작...")
    
    # 스키마 파일 확인
    try:
        schema = load_schema()
        print(f"📋 스키마 파일 로드 완료: {len(schema)} 필드")
    except FileNotFoundError:
        print("❌ 스키마 파일을 찾을 수 없습니다. 먼저 extract_bigquery_schema.py를 실행하세요.")
        return
    
    # 테이블 재생성
    if recreate_table():
        print("🎉 BigQuery 테이블 재생성이 성공적으로 완료되었습니다!")
    else:
        print("❌ 테이블 재생성에 실패했습니다.")

if __name__ == "__main__":
    main() 