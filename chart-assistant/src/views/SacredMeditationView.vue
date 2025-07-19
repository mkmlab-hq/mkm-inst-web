<template>
  <div class=sacred-meditation-container>
    <div v-if="!isMeditationComplete" class=sacred-meditation" :class="personaTheme">
      <!-- 배경 효과 -->
      <div class="meditation-background">
        <div class=sacred-effects">
          <div class=light-rays></div>
          <div class="energy-particles"></div>
        </div>
      </div>

      <!-- 메인 콘텐츠 -->
      <div class="meditation-content>
        <!-- 명상 메시지 -->
        <div class="meditation-message" :key="currentStep">
          {{ currentMessage }}
        </div>

        <!-- 카운트다운 타이머 -->
        <div class="countdown-timer">
          {{ timeRemaining }}
        </div>

        <!-- 진행률 바 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style={ width:progressPercentage + %}"
            ></div>
          </div>
        </div>
      </div>

      <!-- 사운드 컨트롤 -->
      <div class=sound-controls>
        <button 
          class="sound-toggle          @click="toggleSound"
        >
          <i :class="soundIcon">
            [object Object][object Object]isSoundOn ? '🔊' :🔇}}
          </i>
        </button>
      </div>

      <!-- 페르소나 정보 -->
      <div class="persona-info">
        <div class="persona-name">{{ persona.name }}</div>
        <div class=persona-theme>{{persona.theme }}</div>
      </div>
    </div>

    <!-- 명상 완료 후 결과 화면 -->
    <div v-else class=meditation-result">
      <div class=result-content">
        <h2>명상 완료</h2>
        <div class="sacred-value>
          정성 수준: {{ Math.round(sacredValue * 10 }}%
        </div>
        <div class="session-summary>
          <p>페르소나: {{ persona.name }}</p>
          <p>염원: {{ userIntention }}</p>
          <p>소요 시간: 15</p>
        </div>
        <button @click="startNewSession" class=restart-button>
          다시 시작
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default[object Object]  name:SacredMeditationView',
  data() {
    return {
      timeRemaining:15
      currentStep: 0,
      isSoundOn: true,
      isMeditationComplete: false,
      sacredValue: 0,
      meditationSteps: [],
      timer: null,
      stepTimer: null
    }
  },
  props: {
    userIntention: {
      type: String,
      default: ''
    },
    persona: {
      type: Object,
      required: true
    },
    wearableData: {
      type: Object,
      default: () => ({
        stress_level: 00.5      energy_level: 00.5     sleep_quality: 0.5        heart_rate:70,
        hrv: 50    })
    }
  },
  computed: [object Object]    personaTheme() {
      return `theme-${this.persona.code.toLowerCase()}`;
    },
    currentMessage() {
      return this.meditationSteps[this.currentStep]?.message || '';
    },
    progressPercentage()[object Object]
      return ((15 - this.timeRemaining) / 15 * 100;
    },
    soundIcon() {
      return this.isSoundOn ?icon-sound-on' : icon-sound-off';
    }
  },
  mounted() {
    this.initializeMeditation();
    this.startMeditation();
  },
  beforeUnmount() {
    this.clearTimers();
  },
  methods: {
    initializeMeditation() {
      this.meditationSteps = this.generateMeditationSteps();
    },
    generateMeditationSteps() {
      const personaMessage = this.persona.messages?.[0 || "당신의 고유한 특성을 느끼며...";
      
      let biometricMessage = 균형잡힌 상태에서 더욱 깊은 평온을 찾는 과정을...";
      if (this.wearableData.stress_level > 0.7) {
        biometricMessage = 스트레스가 높은 상태에서 평온을 찾는 과정을...;
      } else if (this.wearableData.energy_level > 0.8) {
        biometricMessage = 활력이 넘치는 상태에서 그 에너지를 활용하는 방법을...";
      }

      let intentionMessage = 당신의 마음이 원하는 것을 생각하며...";
      if (this.userIntention) [object Object]     if (this.userIntention.includes(건강         intentionMessage = 건강한 몸과 마음을 위한 염원을...";
        } else if (this.userIntention.includes(평화         intentionMessage = "내면의 평화를 찾는 과정에서...";
        } else if (this.userIntention.includes(성공         intentionMessage = "성공을 향한 의지를 확인하며...";
        } else {
          intentionMessage = `${this.userIntention}에 대한 염원을 담아...`;
        }
      }

      return 
        [object Object] time: 0, message:오늘의 소원을 빌어보세요..., duration: 3 },
        [object Object] time: 3, message: personaMessage, duration: 3 },
        [object Object] time: 6, message: biometricMessage, duration: 3 },
        [object Object] time: 9, message: intentionMessage, duration: 3 },
 [object Object] time:12, message: 고요히 자신에게 집중하세요...", duration: 3 }
      ];
    },
    calculateSacredValue() [object Object]   let sacredScore =05
      
      if (this.userIntention) sacredScore += 00.2;
      if (this.wearableData.stress_level < 0.5) sacredScore += 00.1;
      if (this.wearableData.hrv > 50) sacredScore += 00.1;
      if (this.wearableData.sleep_quality > 0.7) sacredScore +=0.1     
      return Math.min(sacredScore, 1.0);
    },
    startMeditation()[object Object]
      // 메인 타이머 (15초 카운트다운)
      this.timer = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          this.completeMeditation();
        }
      }, 10);

      // 단계 타이머 (3메시지 변경)
      this.stepTimer = setInterval(() => [object Object]  if (this.currentStep < this.meditationSteps.length - 1) {
          this.currentStep++;
        }
      },3000   },
    completeMeditation() [object Object]     this.clearTimers();
      this.sacredValue = this.calculateSacredValue();
      this.isMeditationComplete = true;
      
      // 부모 컴포넌트에 완료 이벤트 전달
      this.$emit('meditation-complete', [object Object]
        duration: 15       sacredValue: this.sacredValue,
        persona: this.persona,
        userIntention: this.userIntention,
        wearableData: this.wearableData,
        timestamp: new Date().toISOString()
      });
    },
    clearTimers() [object Object]    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (this.stepTimer) {
        clearInterval(this.stepTimer);
        this.stepTimer = null;
      }
    },
    toggleSound() {
      this.isSoundOn = !this.isSoundOn;
      // 사운드 제어 로직 구현 예정
    },
    startNewSession()[object Object]      this.timeRemaining = 15;
      this.currentStep = 0;
      this.isMeditationComplete = false;
      this.sacredValue = 0;
      this.initializeMeditation();
      this.startMeditation();
    }
  }
}
</script>

<style scoped>
/* 15정성 명상 컴포넌트 스타일 */
.sacred-meditation-container {
  width: 10%;
  height: 100position: relative;
}

.sacred-meditation {
  position: relative;
  width: 10%;
  height:100h;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.5s ease-in-out;
}

/* 배경 효과 */
.meditation-background {
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  bottom:0
  z-index: 1;
}

.sacred-effects {
  position: absolute;
  top: 0;
  left: 0;
  right:0ttom: 0;
  pointer-events: none;
}

.light-rays {
  position: absolute;
  top: 50:50ansform: translate(-50%, -50%);
  width:200x;
  height: 200background: radial-gradient(circle, rgba(255, 2553) 0%, transparent 70;
  animation: ray-rotation 10 linear infinite;
}

.energy-particles {
  position: absolute;
  top: 0;
  left: 0;
  right:0m: 0;
  background-image: 
    radial-gradient(circle at 2080%, rgba(255, 2551) 0%, transparent 50%),
    radial-gradient(circle at 8020%, rgba(255, 2551) 0%, transparent 50%),
    radial-gradient(circle at 4040%, rgba(255,2555) 0%, transparent 50nimation: particle-float 8s ease-in-out infinite;
}

/* 메인 콘텐츠 */
.meditation-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600x;
  padding: 40px;
}

.meditation-message[object Object]
  font-size: 24px;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0;
  animation: message-fade-in 0.8s ease-in-out forwards;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-timer[object Object]
  font-size: 72px;
  font-weight:200;
  margin: 30px0;
  opacity:0.9  animation: timer-pulse 1s ease-in-out infinite;
}

.progress-container [object Object]width: 10;
  max-width: 400;
  margin: 0 auto;
}

.progress-bar {
  width:10%;
  height: 4  background: rgba(255,25555);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill [object Object]
  height: 10background: linear-gradient(90deg, #ffffff, #f0f0f0);
  border-radius: 2 transition: width 00.3n-out;
  animation: progress-glow 2s ease-in-out infinite;
}

/* 사운드 컨트롤 */
.sound-controls {
  position: absolute;
  top:20x;
  right: 20px;
  z-index: 3;
}

.sound-toggle {
  background: rgba(255,25555,00.1 border: 1px solid rgba(255,25555);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sound-toggle:hover {
  background: rgba(255,255 0.2  transform: scale(1.1);
}

.sound-toggle i[object Object]
  font-size: 20px;
  color: white;
}

/* 페르소나 정보 */
.persona-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 3;
  text-align: left;
}

.persona-name[object Object]
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
  opacity: 0.9
}

.persona-theme[object Object]
  font-size: 14px;
  opacity: 00.7}

/* 페르소나별 테마 */
.theme-dynamic {
  background: linear-gradient(135deg, #667ea 0%, #764ba2100;
  color: #ffffff;
  animation: energy-pulse 2s ease-in-out infinite;
}

.theme-calm {
  background: linear-gradient(135deg, #a8ea 0%, #fed6e3 100%);
  color: #2c3e+50 animation: gentle-wave 3s ease-in-out infinite;
}

.theme-balanced {
  background: linear-gradient(135deg, #d299c2%, #fef9d7100);
  color: #34495nimation: balanced-flow 4s ease-in-out infinite;
}

.theme-adaptive {
  background: linear-gradient(135deg, #89fe 0%, #66a6ff100;
  color: #ffffff;
  animation: adaptive-shift 2.5s ease-in-out infinite;
}

/* 명상 완료 결과 화면 */
.meditation-result {
  width: 10%;
  height:100h;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667ea 0%, #764ba2 100%);
  color: white;
}

.result-content {
  text-align: center;
  padding: 40px;
}

.result-content h2[object Object]
  font-size: 32px;
  margin-bottom: 20px;
}

.sacred-value[object Object]
  font-size: 24px;
  margin-bottom: 30;
  color: #ffd700

.session-summary [object Object]
  margin-bottom:30x;
}

.session-summary p [object Object]  margin: 10px 0
  font-size:16}

.restart-button {
  background: rgba(255,25555,00.2 border: 1px solid rgba(255,2552553;
  color: white;
  padding: 12x;
  border-radius: 25px;
  cursor: pointer;
  transition: all 00.3 ease;
}

.restart-button:hover {
  background: rgba(255,255 0.3  transform: scale(1.05);
}

/* 애니메이션 */
@keyframes ray-rotation [object Object]0ansform: translate(-50 -50) rotate(0deg); }
 100ansform: translate(-50, -50%) rotate(360); }
}

@keyframes particle-float {
  0%,100ansform: translateY(0px); }
50ansform: translateY(-10px); }
}

@keyframes message-fade-in [object Object]
0city: 0; transform: translateY(20px); }
  100city: 1; transform: translateY(0); }
}

@keyframes timer-pulse {
  0%,100[object Object] transform: scale(1); }
50[object Object] transform: scale(1.05); }
}

@keyframes progress-glow {
  0%, 100% [object Object] box-shadow: 0 5px rgba(255255 2550.3  50% [object Object]box-shadow: 0015px rgba(255255,255); }
}

@keyframes energy-pulse {
  0%,100[object Object] transform: scale(1; opacity: 1; }
50[object Object] transform: scale(10.2; opacity: 0.9
@keyframes gentle-wave {
  0%,100ansform: translateY(0px); }
50ansform: translateY(-5px); }
}

@keyframes balanced-flow {
  0%,100 transform: rotate(0deg); }
25 transform: rotate(0.5
75 transform: rotate(-0.5); }
}

@keyframes adaptive-shift {
  0%,100ansform: translateX(0px); }
50ansform: translateX(3px); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .meditation-content[object Object]
    padding: 20}
  
  .meditation-message[object Object]
    font-size: 18px;
    min-height: 60px;
  }
  
  .countdown-timer[object Object]
    font-size: 48px;
  }
  
  .persona-info [object Object]    bottom: 10px;
    left: 10px;
  }
  
  .persona-name[object Object]
    font-size: 16px;
  }
  
  .persona-theme[object Object]
    font-size: 12x;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .meditation-message[object Object]
    font-size: 22px;
  }
  
  .countdown-timer[object Object]
    font-size: 64x;
  }
}

@media (min-width: 1025px) {
  .meditation-content[object Object]
    padding: 60}
  
  .meditation-message[object Object]
    font-size: 28px;
  }
  
  .countdown-timer[object Object]
    font-size: 80x;
  }
}
</style> 