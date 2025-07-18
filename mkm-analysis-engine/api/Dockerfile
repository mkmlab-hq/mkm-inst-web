# mkm-analysis-engine/api/Dockerfile

# 기본 이미지: Python 3.11 (Alpine Linux 기반, 경량화)
FROM python:3.11-slim-bookworm

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치 (librosa, opencv-python 등)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 파일 복사
COPY ./requirements.txt /app/requirements.txt

# Python 의존성 설치
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    python -c "import librosa; print('librosa import OK')"

# 애플리케이션 코드 복사
COPY . /app

# PORT 환경 변수 설정
ENV PORT 8080

# uvicorn 서버 실행 명령어
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
