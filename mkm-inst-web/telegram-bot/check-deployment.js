#!/usr/bin/env node

/**
 * MKM Lab 텔레그램 봇 배포 상태 확인 스크립트
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MKM Lab 텔레그램 봇 배포 상태 확인\n');

// 1. 필수 파일 확인
console.log('📁 필수 파일 확인:');
const requiredFiles = [
  'src/index.js',
  'src/message-handler.js',
  'src/persona-analyzer.js',
  'package.json',
  'Dockerfile',
  'cloudbuild.yaml',
  'LAUNCH_CHECKLIST.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// 2. 환경변수 확인
console.log('\n🔧 환경변수 확인:');
const envFile = '.env';
const envExists = fs.existsSync(envFile);
console.log(`   ${envExists ? '✅' : '❌'} .env 파일`);

if (envExists) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredVars = [
    'TELEGRAM_BOT_TOKEN',
    'GOOGLE_AI_API_KEY',
    'OPENWEATHERMAP_API_KEY'
  ];
  
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`   ${hasVar ? '✅' : '❌'} ${varName}`);
  });
} else {
  console.log('   ⚠️  .env 파일이 없습니다. ENV_SETUP_GUIDE.md를 참조하세요.');
}

// 3. 의존성 확인
console.log('\n📦 의존성 확인:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'node-telegram-bot-api',
  'axios',
  'dotenv'
];

requiredDeps.forEach(dep => {
  const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`   ${hasDep ? '✅' : '❌'} ${dep}`);
});

// 4. 스크립트 확인
console.log('\n🛠️  스크립트 확인:');
const requiredScripts = [
  'start',
  'dev',
  'test',
  'lint',
  'deploy'
];

requiredScripts.forEach(script => {
  const hasScript = packageJson.scripts && packageJson.scripts[script];
  console.log(`   ${hasScript ? '✅' : '❌'} npm run ${script}`);
});

// 5. 테스트 파일 확인
console.log('\n🧪 테스트 파일 확인:');
const testFiles = [
  'test-simulation.js',
  'test-image-generation.js',
  'test-dreamscape-features.js'
];

testFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 6. 문서 확인
console.log('\n📚 문서 확인:');
const docs = [
  'README.md',
  'LAUNCH_CHECKLIST.md',
  'ENV_SETUP_GUIDE.md',
  'DEPLOYMENT.md'
];

docs.forEach(doc => {
  const exists = fs.existsSync(doc);
  console.log(`   ${exists ? '✅' : '❌'} ${doc}`);
});

// 7. 배포 준비 상태
console.log('\n🚀 배포 준비 상태:');
const deploymentReady = allFilesExist && envExists;
console.log(`   ${deploymentReady ? '✅' : '❌'} 배포 준비 완료`);

if (deploymentReady) {
  console.log('\n🎉 모든 준비가 완료되었습니다!');
  console.log('다음 단계:');
  console.log('1. npm run deploy');
  console.log('2. Google Cloud Run에 배포');
  console.log('3. 베타 테스트 시작');
} else {
  console.log('\n⚠️  배포 준비가 완료되지 않았습니다.');
  console.log('다음 작업을 완료하세요:');
  console.log('1. .env 파일 설정 (ENV_SETUP_GUIDE.md 참조)');
  console.log('2. 누락된 파일 확인');
  console.log('3. 의존성 설치 (npm install)');
}

console.log('\n📊 요약:');
console.log(`   필수 파일: ${requiredFiles.filter(f => fs.existsSync(f)).length}/${requiredFiles.length}`);
console.log(`   환경변수: ${envExists ? '설정됨' : '설정 필요'}`);
console.log(`   의존성: ${requiredDeps.filter(d => packageJson.dependencies && packageJson.dependencies[d]).length}/${requiredDeps.length}`);
console.log(`   스크립트: ${requiredScripts.filter(s => packageJson.scripts && packageJson.scripts[s]).length}/${requiredScripts.length}`);
console.log(`   테스트: ${testFiles.filter(f => fs.existsSync(f)).length}/${testFiles.length}`);
console.log(`   문서: ${docs.filter(d => fs.existsSync(d)).length}/${docs.length}`); 