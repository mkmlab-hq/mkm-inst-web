// 환경변수 자동 체크 스크립트
const required = [
  'TELEGRAM_BOT_TOKEN',
  'GOOGLE_AI_API_KEY',
  'GEMINI_API_KEY',
  'MKM_API_KEY',
  'MKM_ANALYSIS_ENGINE_URL'
];

const missing = required.filter((key) => !process.env[key] || process.env[key].includes('your_'));

if (missing.length > 0) {
  console.error('\u274C [환경변수 체크 실패] 필수 환경변수 누락 또는 예시값 사용 감지!');
  missing.forEach((key) => console.error(`- ${key}`));
  console.error('\u26a0\ufe0f .env 파일을 확인하고 실제 값을 입력하세요.');
  process.exit(1);
} else {
  console.log('\u2705 모든 필수 환경변수가 정상적으로 설정되었습니다.');
} 