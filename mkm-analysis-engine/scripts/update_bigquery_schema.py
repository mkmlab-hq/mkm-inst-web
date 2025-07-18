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

def update_table_schema():
    """BigQuery 테이블 스키마 업데이트"""
    client = bigquery.Client(project=PROJECT_ID)
    
    # 테이블 참조
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    
    try:
        # 기존 테이블 가져오기
        table = client.get_table(table_ref)
        print(f"📋 현재 테이블 스키마: {len(table.schema)} 필드")
        
        # 새 스키마 로드
        new_schema = load_schema()
        print(f"🆕 새 스키마: {len(new_schema)} 필드")
        
        # BigQuery 스키마 객체로 변환
        schema_fields = []
        for field in new_schema:
            schema_fields.append(bigquery.SchemaField(
                name=field["name"],
                field_type=field["type"],
                mode=field["mode"]
            ))
        
        # 테이블 스키마 업데이트
        table.schema = schema_fields
        
        # 테이블 업데이트
        updated_table = client.update_table(table, ["schema"])
        
        print(f"✅ BigQuery 테이블 스키마 업데이트 완료!")
        print(f"📊 테이블: {updated_table.full_table_id}")
        print(f"🔧 필드 수: {len(updated_table.schema)}")
        
        return True
        
    except NotFound:
        print(f"❌ 테이블을 찾을 수 없습니다: {PROJECT_ID}.{DATASET_ID}.{TABLE_ID}")
        return False
    except Exception as e:
        print(f"❌ 스키마 업데이트 오류: {e}")
        return False

def create_table_if_not_exists():
    """테이블이 없으면 생성"""
    client = bigquery.Client(project=PROJECT_ID)
    
    # 테이블 참조
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    
    try:
        # 테이블 존재 확인
        client.get_table(table_ref)
        print(f"✅ 테이블이 이미 존재합니다: {TABLE_ID}")
        return True
    except NotFound:
        print(f"📝 테이블을 생성합니다: {TABLE_ID}")
        
        # 새 스키마 로드
        new_schema = load_schema()
        
        # BigQuery 스키마 객체로 변환
        schema_fields = []
        for field in new_schema:
            schema_fields.append(bigquery.SchemaField(
                name=field["name"],
                field_type=field["type"],
                mode=field["mode"]
            ))
        
        # 테이블 생성
        table = bigquery.Table(table_ref, schema=schema_fields)
        table = client.create_table(table)
        
        print(f"✅ 테이블 생성 완료: {table.full_table_id}")
        return True

def main():
    print("🔄 BigQuery 테이블 스키마 업데이트 시작...")
    
    # 스키마 파일 확인
    try:
        schema = load_schema()
        print(f"📋 스키마 파일 로드 완료: {len(schema)} 필드")
    except FileNotFoundError:
        print("❌ 스키마 파일을 찾을 수 없습니다. 먼저 extract_bigquery_schema.py를 실행하세요.")
        return
    
    # 테이블 생성 또는 업데이트
    if create_table_if_not_exists():
        if update_table_schema():
            print("🎉 BigQuery 스키마 업데이트가 성공적으로 완료되었습니다!")
        else:
            print("⚠️ 스키마 업데이트에 실패했습니다.")
    else:
        print("❌ 테이블 생성에 실패했습니다.")

if __name__ == "__main__":
    main() 