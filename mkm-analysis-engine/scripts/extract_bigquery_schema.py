import json
from collections import defaultdict

# 데이터 파일 경로
DATA_PATH = r"f:\WORK-SPACE\mkm-med-platform\extracted\active-projects\medical-ai-platform\intelligence-pipeline\processors\integrated_intelligence_database.json"
SCHEMA_PATH = r"f:\WORK-SPACE\mkm-analysis-engine\scripts\bigquery_schema.json"

# 샘플 개수 (전체 데이터가 많을 경우 일부만 분석)
SAMPLE_SIZE = 50

def infer_type(value):
    if isinstance(value, list):
        # 배열 내부 타입 추정
        if not value:
            return "STRING", "REPEATED"
        if all(isinstance(v, float) or isinstance(v, int) for v in value):
            return "FLOAT", "REPEATED"
        return "STRING", "REPEATED"
    if isinstance(value, int):
        return "INTEGER", "NULLABLE"
    if isinstance(value, float):
        return "FLOAT", "NULLABLE"
    return "STRING", "NULLABLE"

def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    # 샘플 추출
    sample = data[:SAMPLE_SIZE]
    field_types = defaultdict(list)
    for item in sample:
        for k, v in item.items():
            field_types[k].append(v)
    schema = []
    for field, values in field_types.items():
        # 가장 많이 등장하는 타입으로 결정
        types = [infer_type(v) for v in values if v is not None]
        if types:
            type_counts = defaultdict(int)
            for t in types:
                type_counts[t] += 1
            main_type, mode = max(type_counts, key=type_counts.get)
        else:
            main_type, mode = "STRING", "NULLABLE"
        schema.append({"name": field, "type": main_type, "mode": mode})
    with open(SCHEMA_PATH, "w", encoding="utf-8") as f:
        json.dump(schema, f, ensure_ascii=False, indent=2)
    print(f"✅ BigQuery 스키마 추출 완료: {SCHEMA_PATH}")
    print(json.dumps(schema, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
