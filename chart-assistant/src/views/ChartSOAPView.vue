<template>
  <div class="chart-soap">
    <h1>SOAP 차트</h1>
    <form @submit.prevent="onSave">
      <section>
        <h2>S (Subjective)</h2>
        <textarea v-model="sText" placeholder="주관적 증상 입력"></textarea>
        <div class="ai-suggestion">
          <span>AI 제안: 어제 요통 발생, 아침에 허리 굳음</span>
          <button type="button" @click="copyText('어제 요통 발생, 아침에 허리 굳음')">복사</button>
        </div>
      </section>
      <section>
        <h2>O (Objective)</h2>
        <textarea v-model="oText" placeholder="객관적 소견 입력"></textarea>
        <div class="ai-suggestion">
          <span>AI 제안: 혈압 155/89, 심근부하 지수 12.3</span>
          <button type="button" @click="copyText('혈압 155/89, 심근부하 지수 12.3')">복사</button>
        </div>
      </section>
      <section>
        <h2>A (Assessment)</h2>
        <textarea v-model="aText" placeholder="평가/변증 입력"></textarea>
        <div class="ai-suggestion">
          <span>AI 제안: 신허요통 가능성, 보신강근 치료 권장</span>
          <button type="button" @click="copyText('신허요통 가능성, 보신강근 치료 권장')">복사</button>
        </div>
      </section>
      <section>
        <h2>P (Plan)</h2>
        <textarea v-model="pText" placeholder="치료 계획 입력"></textarea>
        <div class="ai-suggestion">
          <span>AI 제안: 독활기생탕, 신수·대장수·위중 침구</span>
          <button type="button" @click="copyText('독활기생탕, 신수·대장수·위중 침구')">복사</button>
        </div>
      </section>
      <div class="final-confirm">
        <input type="checkbox" v-model="confirmed" id="confirm" />
        <label for="confirm">AI 제안은 참고용이며, 최종 판단은 한의사 본인에게 있음을 확인합니다.</label>
      </div>
      <button type="submit" :disabled="!confirmed">차트 저장</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sText = ref('')
const oText = ref('')
const aText = ref('')
const pText = ref('')
const confirmed = ref(false)

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}
function onSave() {
  alert('차트가 저장되었습니다! (MVP 더미)')
}
</script>

<style scoped>
.chart-soap {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}
section {
  margin-bottom: 1.5rem;
}
textarea {
  width: 100%;
  min-height: 60px;
  margin-bottom: 0.5rem;
}
.ai-suggestion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95em;
  color: #666;
}
.final-confirm {
  margin: 1.5rem 0;
}
</style> 