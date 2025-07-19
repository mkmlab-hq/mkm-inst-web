'use client';

import React, { useState, useEffect } from 'react';
import './SacredMeditation.css';

interface Persona {
  code: string;
  name: string;
  theme: string;
  messages: string[];
}

interface WearableData {
  stress_level: number;
  energy_level: number;
  sleep_quality: number;
  heart_rate: number;
  hrv: number;
}

interface SacredMeditationProps {
  userIntention: string;
  persona: Persona;
  wearableData: WearableData;
  onComplete: (sessionData: any) => void;
}

const SacredMeditation: React.FC<SacredMeditationProps> = ({
  userIntention,
  persona,
  wearableData,
  onComplete
}) => {
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [meditationSteps, setMeditationSteps] = useState<any[]>([]);

  // 명상 단계 생성
  const generateMeditationSteps = () => {
    const personaMessage = persona.messages[0] || "당신의 고유한 특성을 느끼며...";
    
    let biometricMessage = "균형잡힌 상태에서 더욱 깊은 평온을 찾는 과정을...";
    if (wearableData.stress_level > 0.7) {
      biometricMessage = "스트레스가 높은 상태에서 평온을 찾는 과정을...";
    } else if (wearableData.energy_level > 0.8) {
      biometricMessage = "활력이 넘치는 상태에서 그 에너지를 활용하는 방법을...";
    }

    let intentionMessage = "당신의 마음이 원하는 것을 생각하며...";
    if (userIntention) {
      if (userIntention.includes("건강")) {
        intentionMessage = "건강한 몸과 마음을 위한 염원을...";
      } else if (userIntention.includes("평화")) {
        intentionMessage = "내면의 평화를 찾는 과정에서...";
      } else if (userIntention.includes("성공")) {
        intentionMessage = "성공을 향한 의지를 확인하며...";
      } else {
        intentionMessage = `${userIntention}에 대한 염원을 담아...`;
      }
    }

    return [
      { time: 0, message: "오늘의 소원을 빌어보세요...", duration: 3 },
      { time: 3, message: personaMessage, duration: 3 },
      { time: 6, message: biometricMessage, duration: 3 },
      { time: 9, message: intentionMessage, duration: 3 },
      { time: 12, message: "고요히 자신에게 집중하세요...", duration: 3 }
    ];
  };

  // 정성 수준 계산
  const calculateSacredValue = () => {
    let sacredScore = 0.5
    
    if (userIntention) sacredScore +=0.2;
    if (wearableData.stress_level < 0.5) sacredScore +=0.1;
    if (wearableData.hrv > 50) sacredScore +=0.1;
    if (wearableData.sleep_quality > 0.7) sacredScore += 0.1  
    return Math.min(sacredScore, 1.0);
  };

  useEffect(() => {
    setMeditationSteps(generateMeditationSteps());
  }, [persona, wearableData, userIntention]);

  // 메인 타이머 (15초 카운트다운)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const sessionData = {
            duration: 15,
            sacredValue: calculateSacredValue(),
            persona: persona,
            userIntention: userIntention,
            wearableData: wearableData,
            timestamp: new Date().toISOString()
          };
          onComplete(sessionData);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete, persona, userIntention, wearableData]);

  // 단계 타이머 (3초마다 메시지 변경)
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= meditationSteps.length - 1) return prev;
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(stepTimer);
  }, [meditationSteps.length]);

  const progressPercentage = ((15- timeRemaining) / 15) * 100;
  const currentMessage = meditationSteps[currentStep]?.message || "";

  return (
    <div className={`sacred-meditation theme-${persona.code.toLowerCase()}`}>
      {/* 배경 효과 */}
      <div className="meditation-background">
        <div className="sacred-effects">
          <div className="light-rays"></div>
          <div className="energy-particles"></div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="meditation-content">
        {/* 명상 메시지 */}
        <div className="meditation-message" key={currentStep}>
          {currentMessage}
        </div>

        {/* 카운트다운 타이머 */}
        <div className="countdown-timer">
          {timeRemaining}
        </div>

        {/* 진행률 바 */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 사운드 컨트롤 */}
      <div className="sound-controls">
        <button 
          className="sound-toggle"
          onClick={() => setIsSoundOn(!isSoundOn)}
        >
          <i className={`icon-sound-${isSoundOn ? 'on' : 'off'}`}>
            {isSoundOn ? '��' : '🔇'}
          </i>
        </button>
      </div>

      {/* 페르소나 정보 */}
      <div className="persona-info">
        <div className="persona-name">{persona.name}</div>
        <div className="persona-theme">{persona.theme}</div>
      </div>
    </div>
  );
};

export default SacredMeditation; 