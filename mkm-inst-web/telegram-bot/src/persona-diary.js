const fs = require('fs').promises;
const path = require('path');

class PersonaDiary {
  constructor() {
    this.diaryPath = path.join(__dirname, '../data/diaries');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.diaryPath, { recursive: true });
    } catch (error) {
      console.error('데이터 디렉토리 생성 실패:', error);
    }
  }

  async saveDiaryEntry(userId, entry) {
    try {
      const userDiaryPath = path.join(this.diaryPath, `${userId}.json`);
      const timestamp = new Date().toISOString();
      
      const diaryEntry = {
        id: Date.now().toString(),
        timestamp,
        content: entry.content,
        mood: entry.mood,
        activities: entry.activities || [],
        persona: entry.persona,
        weather: entry.weather,
        tags: entry.tags || []
      };

      let userDiary = [];
      try {
        const existingData = await fs.readFile(userDiaryPath, 'utf8');
        userDiary = JSON.parse(existingData);
      } catch (error) {
        // 파일이 없거나 읽기 실패 시 빈 배열 사용
      }

      userDiary.push(diaryEntry);
      await fs.writeFile(userDiaryPath, JSON.stringify(userDiary, null, 2));
      
      return diaryEntry;
    } catch (error) {
      console.error('다이어리 저장 실패:', error);
      throw error;
    }
  }

  async getDiaryEntries(userId, limit = 10) {
    try {
      const userDiaryPath = path.join(this.diaryPath, `${userId}.json`);
      const data = await fs.readFile(userDiaryPath, 'utf8');
      const entries = JSON.parse(data);
      
      return entries.slice(-limit).reverse(); // 최신 항목부터 반환
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []; // 파일이 없으면 빈 배열 반환
      }
      console.error('다이어리 읽기 실패:', error);
      throw error;
    }
  }

  async getDiaryStats(userId) {
    try {
      const entries = await this.getDiaryEntries(userId, 1000);
      
      const stats = {
        totalEntries: entries.length,
        averageMood: 0,
        moodDistribution: {},
        activityFrequency: {},
        personaDistribution: {},
        weeklyTrend: {}
      };

      if (entries.length === 0) {
        return stats;
      }

      // 기분 통계
      const moods = entries.map(entry => entry.mood).filter(Boolean);
      if (moods.length > 0) {
        const moodScores = {
          '매우 좋음': 5,
          '좋음': 4,
          '보통': 3,
          '나쁨': 2,
          '매우 나쁨': 1
        };
        
        const totalScore = moods.reduce((sum, mood) => sum + (moodScores[mood] || 3), 0);
        stats.averageMood = (totalScore / moods.length).toFixed(1);
        
        // 기분 분포
        moods.forEach(mood => {
          stats.moodDistribution[mood] = (stats.moodDistribution[mood] || 0) + 1;
        });
      }

      // 활동 빈도
      entries.forEach(entry => {
        if (entry.activities) {
          entry.activities.forEach(activity => {
            stats.activityFrequency[activity] = (stats.activityFrequency[activity] || 0) + 1;
          });
        }
      });

      // 페르소나 분포
      entries.forEach(entry => {
        if (entry.persona) {
          stats.personaDistribution[entry.persona] = (stats.personaDistribution[entry.persona] || 0) + 1;
        }
      });

      // 주간 트렌드 (최근 4주)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const recentEntries = entries.filter(entry => 
        new Date(entry.timestamp) > fourWeeksAgo
      );

      const weeklyData = {};
      recentEntries.forEach(entry => {
        const weekStart = this.getWeekStart(new Date(entry.timestamp));
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = [];
        }
        weeklyData[weekKey].push(entry);
      });

      stats.weeklyTrend = weeklyData;

      return stats;
    } catch (error) {
      console.error('다이어리 통계 계산 실패:', error);
      throw error;
    }
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  async searchDiaryEntries(userId, query) {
    try {
      const entries = await this.getDiaryEntries(userId, 1000);
      
      const searchTerm = query.toLowerCase();
      return entries.filter(entry => 
        entry.content.toLowerCase().includes(searchTerm) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        entry.activities.some(activity => activity.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('다이어리 검색 실패:', error);
      throw error;
    }
  }

  async deleteDiaryEntry(userId, entryId) {
    try {
      const userDiaryPath = path.join(this.diaryPath, `${userId}.json`);
      const data = await fs.readFile(userDiaryPath, 'utf8');
      const entries = JSON.parse(data);
      
      const filteredEntries = entries.filter(entry => entry.id !== entryId);
      await fs.writeFile(userDiaryPath, JSON.stringify(filteredEntries, null, 2));
      
      return true;
    } catch (error) {
      console.error('다이어리 항목 삭제 실패:', error);
      throw error;
    }
  }

  generateDiaryPrompt(persona, weather) {
    const prompts = {
      'The Visionary Leader': {
        sunny: '오늘 맑은 날씨에 창의적인 아이디어나 새로운 프로젝트에 대한 생각을 기록해보세요.',
        rainy: '비 오는 날 실내에서 창의적인 작업이나 새로운 기술 학습에 대한 경험을 적어보세요.',
        cloudy: '흐린 날 새로운 비전이나 목표에 대한 계획을 세워보고 기록해보세요.'
      },
      'The Balanced Builder': {
        sunny: '맑은 날 규칙적인 일과와 체계적인 활동에 대한 만족감을 기록해보세요.',
        rainy: '비 오는 날 실내에서 안정적이고 체계적인 작업에 대한 경험을 적어보세요.',
        cloudy: '흐린 날 균형 잡힌 생활과 계획적인 활동에 대한 생각을 기록해보세요.'
      },
      'The Dynamic Explorer': {
        sunny: '맑은 날 새로운 경험이나 모험에 대한 흥미로운 이야기를 기록해보세요.',
        rainy: '비 오는 날에도 활발하게 활동한 경험이나 새로운 발견에 대해 적어보세요.',
        cloudy: '흐린 날 다양한 활동과 사회적 상호작용에 대한 경험을 기록해보세요.'
      },
      'The Mindful Guardian': {
        sunny: '맑은 날 마음챙김과 평화로운 순간에 대한 깊은 생각을 기록해보세요.',
        rainy: '비 오는 날 명상이나 요가, 마음챙김 활동에 대한 경험을 적어보세요.',
        cloudy: '흐린 날 내면의 평화와 조용한 성찰에 대한 생각을 기록해보세요.'
      }
    };

    const weatherType = this.getWeatherType(weather);
    return prompts[persona]?.[weatherType] || '오늘 하루의 경험과 생각을 자유롭게 기록해보세요.';
  }

  getWeatherType(weather) {
    if (weather.includes('맑음') || weather.includes('맑은')) return 'sunny';
    if (weather.includes('비') || weather.includes('우천')) return 'rainy';
    return 'cloudy';
  }
}

module.exports = { PersonaDiary }; 