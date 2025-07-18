<template>
  <div class="patient-detail">
    <h1>환자 상세 정보</h1>
    <section>
      <h2>기본 정보</h2>
      <!-- 환자 기본 정보 컴포넌트 자리 -->
    </section>
    <section>
      <h2>최근 검사 결과</h2>
      <!-- AI 검사 요약 컴포넌트 자리 -->
    </section>
    <section>
      <router-link :to="`/chart/1`">SOAP 차트 보기</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
// 추후 상태관리/데이터 연동 예정
</script>

<style scoped>
.patient-detail {
  padding: 2rem;
}
</style> 