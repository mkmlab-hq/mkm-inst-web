<template>
  <div class="feedback">
    <h1>AI 제안 최종 확인</h1>
    <section>
      <h2>AI 제안 요약</h2>
      <ul>
        <li>어제 요통 발생, 아침에 허리 굳음</li>
        <li>혈압 155/89, 심근부하 지수 12.3</li>
        <li>신허요통 가능성, 보신강근 치료 권장</li>
        <li>독활기생탕, 신수·대장수·위중 침구</li>
      </ul>
    </section>
    <section>
      <p class="notice">※ 위 AI 분석 내용은 참고용이며, 진단이 아닙니다. 최종 판단은 한의사 본인에게 있습니다.</p>
      <input type="checkbox" v-model="confirmed" id="confirm" />
      <label for="confirm">내용을 모두 확인하고 동의합니다.</label>
    </section>
    <button :disabled="!confirmed" @click="onSubmit">제출</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const confirmed = ref(false)
function onSubmit() {
  alert('피드백이 제출되었습니다! (MVP 더미)')
}
</script>

<style scoped>
.feedback {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}
.notice {
  color: #888;
  font-size: 0.95em;
  margin: 1rem 0;
}
</style> 