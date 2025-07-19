'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

interface Persona {
  id: string;
  name: string;
  description: string;
  color: string;
  characteristics: string[];
  musicStyle: string;
  therapeuticFocus: string;
}

interface MeditationResult {
  persona: Persona;
  timestamp: string;
  duration: number;
  mood: string;
  insights: string[];
  musicPlayed: string;
}

interface SolutionMusic {
  id: string;
  name: string;
  description: string;
  category: string;
  audioUrl: string;
  benefits: string[];
}

const personas: Persona[] = [
  {
    id: 'DYNAMIC',
    name: 'The Dynamic',
    description: '활기찬 에너지와 창의성을 가진 페르소나',
    color: '#4A90E2',
    characteristics: ['활력', '창의성', '적응성', '열정'],
    musicStyle: '활기찬 리듬과 상승하는 멜로디',
    therapeuticFocus: '에너지 증진, 창의성 발현, 동기부여'
  },
  {
    id: 'CALM',
    name: 'The Calm',
    description: '평온한 마음과 깊은 지혜를 가진 페르소나',
    color: '#7ED321',
    characteristics: ['평온', '지혜', '집중', '균형'],
    musicStyle: '고요한 자연음과 부드러운 멜로디',
    therapeuticFocus: '스트레스 완화, 마음의 평화, 집중력 향상'
  },
  {
    id: 'BALANCED',
    name: 'The Balanced',
    description: '완벽한 균형과 조화를 추구하는 페르소나',
    color: '#F5A623',
    characteristics: ['균형', '조화', '안정', '통합'],
    musicStyle: '조화로운 하모니와 균형잡힌 리듬',
    therapeuticFocus: '내적 균형, 조화 회복, 안정감 증진'
  },
  {
    id: 'ADAPTIVE',
    name: 'The Adaptive',
    description: '변화에 유연하게 적응하는 페르소나',
    color: '#FF6B6B',
    characteristics: ['유연성', '적응', '혁신', '성장'],
    musicStyle: '변화하는 템포와 유연한 멜로디',
    therapeuticFocus: '적응력 향상, 변화 수용, 성장 동기'
  }
];

const solutionMusic: SolutionMusic[] = [
  {
    id: 'stress-relief',
    name: '스트레스 완화 음악',
    description: '긴장을 풀고 마음을 진정시키는 치료음악',
    category: '치료',
    audioUrl: '/music/stress-relief.mp3',
    benefits: ['긴장 완화', '심박수 감소', '혈압 안정화', '수면 개선']
  },
  {
    id: 'energy-boost',
    name: '에너지 증진 음악',
    description: '활력을 되찾고 동기를 부여하는 음악',
    category: '치료',
    audioUrl: '/music/energy-boost.mp3',
    benefits: ['에너지 증진', '집중력 향상', '동기부여', '창의성 발현']
  },
  {
    id: 'focus-enhancement',
    name: '집중력 향상 음악',
    description: '명확한 사고와 깊은 집중을 돕는 음악',
    category: '치료',
    audioUrl: '/music/focus-enhancement.mp3',
    benefits: ['집중력 향상', '기억력 증진', '사고 명확화', '학습 효율성']
  },
  {
    id: 'emotional-healing',
    name: '감정 치유 음악',
    description: '감정적 상처를 치유하고 마음을 위로하는 음악',
    category: '치료',
    audioUrl: '/music/emotional-healing.mp3',
    benefits: ['감정 안정화', '트라우마 치유', '자기 수용', '내면 평화']
  }
];

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationTime, setMeditationTime] = useState(15);
  const [meditationResults, setMeditationResults] = useState<MeditationResult[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'meditate' | 'result'>('select');
  const [nftGenerated, setNftGenerated] = useState(false);
  const [userMood, setUserMood] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<string>('');
  const [selectedSolution, setSelectedSolution] = useState<SolutionMusic | null>(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [musicError, setMusicError] = useState<string>('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 이전 결과 불러오기
    const savedResults = localStorage.getItem('meditationResults');
    if (savedResults) {
      try {
        setMeditationResults(JSON.parse(savedResults));
      } catch (error) {
        console.error('저장된 결과 로드 실패:', error);
        localStorage.removeItem('meditationResults');
      }
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playPersonaMusic = useCallback((persona: Persona) => {
    try {
      // 페르소나별 맞춤 음악 재생 (시뮬레이션)
      const musicMap = {
        'DYNAMIC': '/music/dynamic-persona.mp3',
        'CALM': '/music/calm-persona.mp3',
        'BALANCED': '/music/balanced-persona.mp3',
        'ADAPTIVE': '/music/adaptive-persona.mp3'
      };

      const musicUrl = musicMap[persona.id as keyof typeof musicMap] || '/music/default-meditation.mp3';
      
      if (audioRef.current) {
        // 기존 음악 중지
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        audioRef.current.src = musicUrl;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        
        // 음악 재생 시도
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMusicPlaying(true);
              setCurrentMusic(`${persona.name} 맞춤 음악`);
              setMusicError('');
            })
            .catch(err => {
              console.log('음악 재생 실패 (시뮬레이션 모드):', err);
              // 실제 음악 파일이 없으므로 시뮬레이션으로 처리
              setIsMusicPlaying(true);
              setCurrentMusic(`${persona.name} 맞춤 음악 (시뮬레이션)`);
              setMusicError('실제 음악 파일이 없어 시뮬레이션 모드로 실행 중입니다.');
            });
        }
      }
    } catch (error) {
      console.error('음악 재생 중 오류:', error);
      setMusicError('음악 재생 중 오류가 발생했습니다.');
    }
  }, []);

  const playSolutionMusic = useCallback((solution: SolutionMusic) => {
    try {
      if (audioRef.current) {
        // 기존 음악 중지
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        audioRef.current.src = solution.audioUrl;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMusicPlaying(true);
              setCurrentMusic(solution.name);
              setSelectedSolution(solution);
              setMusicError('');
            })
            .catch(err => {
              console.log('치료음악 재생 실패 (시뮬레이션 모드):', err);
              setIsMusicPlaying(true);
              setCurrentMusic(`${solution.name} (시뮬레이션)`);
              setSelectedSolution(solution);
              setMusicError('실제 음악 파일이 없어 시뮬레이션 모드로 실행 중입니다.');
            });
        }
      }
    } catch (error) {
      console.error('치료음악 재생 중 오류:', error);
      setMusicError('치료음악 재생 중 오류가 발생했습니다.');
    }
  }, []);

  const stopMusic = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
      }
      setIsMusicPlaying(false);
      setCurrentMusic('');
      setSelectedSolution(null);
      setMusicError('');
    } catch (error) {
      console.error('음악 중지 중 오류:', error);
    }
  }, []);

  const completeMeditation = useCallback(() => {
    setIsMeditating(false);
    stopMusic();
    
    // 명상 결과 생성
    const result: MeditationResult = {
      persona: selectedPersona!,
      timestamp: new Date().toISOString(),
      duration: 15,
      mood: userMood || '평온함',
      insights: insights.length > 0 ? insights : [
        '내면의 평화를 느꼈다',
        '새로운 깨달음을 얻었다',
        '자신에 대해 더 깊이 이해했다'
      ],
      musicPlayed: currentMusic
    };

    const newResults = [...meditationResults, result];
    setMeditationResults(newResults);
    
    try {
      localStorage.setItem('meditationResults', JSON.stringify(newResults));
    } catch (error) {
      console.error('결과 저장 실패:', error);
    }
    
    setCurrentStep('result');
  }, [selectedPersona, userMood, insights, currentMusic, meditationResults, stopMusic]);

  const startMeditation = useCallback(() => {
    if (!selectedPersona) return;
    
    setIsMeditating(true);
    setCurrentStep('meditate');
    setMusicError('');
    
    // 페르소나별 맞춤 음악 시작
    playPersonaMusic(selectedPersona);
    
    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          completeMeditation();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedPersona, playPersonaMusic, completeMeditation]);

  const generateNFT = useCallback(() => {
    // NFT 생성 시뮬레이션
    setNftGenerated(true);
    setTimeout(() => {
      alert('🎵 개인 맞춤 음악 NFT가 생성되었습니다!\n\n당신의 고유한 페르소나와 명상 데이터를 기반으로 한 독특한 음악이 블록체인에 기록되었습니다.');
    }, 1000);
  }, []);

  const resetSession = useCallback(() => {
    setSelectedPersona(null);
    setCurrentStep('select');
    setMeditationTime(15);
    setUserMood('');
    setInsights([]);
    setNftGenerated(false);
    setMusicError('');
    stopMusic();
  }, [stopMusic]);

  const addInsight = useCallback((insight: string) => {
    if (insight.trim() && !insights.includes(insight)) {
      setInsights([...insights, insight]);
    }
  }, [insights]);

  if (currentStep === 'meditate') {
    return (
      <div className={styles.meditationContainer}>
        <audio ref={audioRef} />
        <div className={styles.meditationContent}>
          <div className={styles.meditationTimer}>
            <div className={styles.timerCircle}>
              <span className={styles.timerText}>{meditationTime}</span>
            </div>
          </div>
          <div className={styles.meditationGuidance}>
            <h2>15초의 정성</h2>
            <p>당신의 {selectedPersona?.name} 페르소나와 함께</p>
            <p>깊은 호흡을 하며 내면의 평화를 찾아보세요</p>
            {isMusicPlaying && (
              <div className={styles.musicInfo}>
                <span className={styles.musicIcon}>🎵</span>
                <span>{currentMusic}</span>
              </div>
            )}
            {musicError && (
              <div className={styles.musicError}>
                <span>⚠️ {musicError}</span>
              </div>
            )}
          </div>
          <div className={styles.breathingGuide}>
            <div className={styles.breathIn}>들숨</div>
            <div className={styles.breathOut}>날숨</div>
          </div>
          <div className={styles.musicControls}>
            <button 
              className={styles.musicButton}
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            >
              🎵 음악 선택
            </button>
          </div>
          
          {showMusicPlayer && (
            <div className={styles.musicPlayer}>
              <h3>치료음악 선택</h3>
              <div className={styles.solutionMusicGrid}>
                {solutionMusic.map((solution) => (
                  <div
                    key={solution.id}
                    className={styles.solutionMusicCard}
                    onClick={() => playSolutionMusic(solution)}
                  >
                    <h4>{solution.name}</h4>
                    <p>{solution.description}</p>
                    <div className={styles.benefits}>
                      {solution.benefits.map((benefit, index) => (
                        <span key={index} className={styles.benefit}>
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className={styles.stopMusicButton}
                onClick={stopMusic}
              >
                음악 중지
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'result') {
    const latestResult = meditationResults[meditationResults.length - 1];
    
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>MKM Lab - 페르소나 다이어리</h1>
          <p>당신의 고유한 페르소나와 맞춤형 솔루션</p>
        </div>

        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <h2>🎯 명상 완료</h2>
            <div className={styles.personaResult}>
              <div 
                className={styles.personaBadge}
                style={{ backgroundColor: latestResult.persona.color }}
              >
                {latestResult.persona.id}
              </div>
              <h3>{latestResult.persona.name}</h3>
              <p>{latestResult.persona.description}</p>
              <div className={styles.musicInfo}>
                <strong>재생된 음악:</strong> {latestResult.musicPlayed}
              </div>
            </div>

            <div className={styles.resultDetails}>
              <div className={styles.resultItem}>
                <strong>명상 시간:</strong> {latestResult.duration}초
              </div>
              <div className={styles.resultItem}>
                <strong>기분:</strong> {latestResult.mood}
              </div>
              <div className={styles.resultItem}>
                <strong>깨달음:</strong>
                <ul>
                  {latestResult.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.resultItem}>
                <strong>치료 효과:</strong>
                <p>{latestResult.persona.therapeuticFocus}</p>
              </div>
            </div>

            {!nftGenerated && (
              <button 
                className={styles.nftButton}
                onClick={generateNFT}
              >
                🎵 개인 맞춤 음악 NFT 생성하기
              </button>
            )}

            {nftGenerated && (
              <div className={styles.nftSuccess}>
                <h3>🎵 NFT 생성 완료!</h3>
                <p>당신의 고유한 페르소나와 명상 데이터를 기반으로 한 독특한 음악이 블록체인에 기록되었습니다.</p>
              </div>
            )}

            <div className={styles.actionButtons}>
              <button 
                className={styles.secondaryButton}
                onClick={resetSession}
              >
                새로운 명상 시작하기
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setCurrentStep('select')}
              >
                페르소나 다시 선택하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <audio ref={audioRef} />
      <div className={styles.header}>
        <h1>MKM Lab - 페르소나 다이어리</h1>
        <p>당신의 고유한 페르소나와 맞춤형 솔루션</p>
      </div>

      <div className={styles.content}>
        <div className={styles.introSection}>
          <h2>🌟 페르소나 다이어리</h2>
          <p>
            AI 기반 초개인화 건강 동반자 시스템입니다.
            당신만의 고유한 페르소나를 발견하고, 15초의 정성으로 내면의 평화를 찾아보세요.
            페르소나별 맞춤 음악과 치료음악으로 더욱 깊은 명상 경험을 제공합니다.
          </p>
        </div>

        <div className={styles.personaSelection}>
          <h3>당신의 페르소나를 선택하세요</h3>
          <div className={styles.personaGrid}>
            {personas.map((persona) => (
              <div
                key={persona.id}
                className={`${styles.personaCard} ${
                  selectedPersona?.id === persona.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedPersona(persona)}
                style={{ borderColor: persona.color }}
              >
                <div 
                  className={styles.personaBadge}
                  style={{ backgroundColor: persona.color }}
                >
                  {persona.id}
                </div>
                <h4>{persona.name}</h4>
                <p>{persona.description}</p>
                <div className={styles.characteristics}>
                  {persona.characteristics.map((char, index) => (
                    <span key={index} className={styles.characteristic}>
                      {char}
                    </span>
                  ))}
                </div>
                <div className={styles.musicStyle}>
                  <strong>음악 스타일:</strong> {persona.musicStyle}
                </div>
                <div className={styles.therapeuticFocus}>
                  <strong>치료 초점:</strong> {persona.therapeuticFocus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPersona && (
          <div className={styles.meditationSection}>
            <div className={styles.selectedPersona}>
              <h3>선택된 페르소나: {selectedPersona.name}</h3>
              <p>{selectedPersona.description}</p>
              <div className={styles.personaDetails}>
                <p><strong>음악 스타일:</strong> {selectedPersona.musicStyle}</p>
                <p><strong>치료 초점:</strong> {selectedPersona.therapeuticFocus}</p>
              </div>
            </div>

            <div className={styles.moodInput}>
              <label>현재 기분을 알려주세요:</label>
              <input
                type="text"
                value={userMood}
                onChange={(e) => setUserMood(e.target.value)}
                placeholder="예: 평온함, 기쁨, 걱정, 희망..."
              />
            </div>

            <div className={styles.insightInput}>
              <label>명상 중 얻고 싶은 깨달음이 있다면:</label>
              <div className={styles.insightInputGroup}>
                <input
                  type="text"
                  placeholder="깨달음을 입력하세요..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      addInsight(target.value);
                      target.value = '';
                    }
                  }}
                />
                <button onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  addInsight(input.value);
                  input.value = '';
                }}>
                  추가
                </button>
              </div>
              {insights.length > 0 && (
                <div className={styles.insightsList}>
                  {insights.map((insight, index) => (
                    <span key={index} className={styles.insightTag}>
                      {insight}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button 
              className={styles.startButton}
              onClick={startMeditation}
            >
              🧘‍♀️ 15초의 정성 시작하기
            </button>
          </div>
        )}

        {meditationResults.length > 0 && (
          <div className={styles.historySection}>
            <h3>📚 명상 기록</h3>
            <div className={styles.historyList}>
              {meditationResults.slice(-3).reverse().map((result, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.historyHeader}>
                    <span className={styles.historyDate}>
                      {new Date(result.timestamp).toLocaleDateString()}
                    </span>
                    <span 
                      className={styles.historyPersona}
                      style={{ backgroundColor: result.persona.color }}
                    >
                      {result.persona.id}
                    </span>
                  </div>
                  <p>{result.persona.name}</p>
                  <p className={styles.historyMood}>기분: {result.mood}</p>
                  <p className={styles.historyMusic}>음악: {result.musicPlayed}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
