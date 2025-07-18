from google.cloud import bigquery
from google.cloud.exceptions import NotFound

# 설정
PROJECT_ID = "persona-diary-service"
DATASET_ID = "intelligence"
TABLE_ID = "vectorized_papers"

def check_table():
    """BigQuery 테이블 상태 확인"""
    client = bigquery.Client(project=PROJECT_ID)
    
    # 테이블 참조
    table_ref = client.dataset(DATASET_ID).table(TABLE_ID)
    
    try:
        # 테이블 정보 가져오기
        table = client.get_table(table_ref)
        
        print(f"✅ 테이블 존재: {table.full_table_id}")
        print(f"📊 테이블 크기: {table.num_rows} 행")
        print(f"🔧 스키마 필드 수: {len(table.schema)}")
        
        print("\n📋 스키마 정보:")
        for field in table.schema:
            print(f"  - {field.name}: {field.field_type} ({field.mode})")
        
        return True
        
    except NotFound:
        print(f"❌ 테이블을 찾을 수 없습니다: {PROJECT_ID}.{DATASET_ID}.{TABLE_ID}")
        return False
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False

def list_datasets():
    """데이터셋 목록 확인"""
    client = bigquery.Client(project=PROJECT_ID)
    
    try:
        datasets = list(client.list_datasets())
        print(f"\n📁 데이터셋 목록 ({PROJECT_ID}):")
        for dataset in datasets:
            print(f"  - {dataset.dataset_id}")
            
            # 데이터셋 내 테이블 목록
            tables = list(client.list_tables(dataset.dataset_id))
            for table in tables:
                print(f"    └─ {table.table_id}")
                
    except Exception as e:
        print(f"❌ 데이터셋 목록 조회 오류: {e}")

def main():
    print("🔍 BigQuery 테이블 상태 확인...")
    
    # 데이터셋 목록 확인
    list_datasets()
    
    print(f"\n🔍 테이블 상세 확인: {TABLE_ID}")
    check_table()

if __name__ == "__main__":
    main() 