// 날씨 서비스
const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // 위치 기반 날씨 정보 가져오기
  async getWeatherByLocation(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'kr'
        }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('날씨 API 호출 오류:', error);
      return this.getDefaultWeather();
    }
  }

  // 도시명 기반 날씨 정보 가져오기
  async getWeatherByCity(cityName) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: cityName,
          appid: this.apiKey,
          units: 'metric',
          lang: 'kr'
        }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('날씨 API 호출 오류:', error);
      return this.getDefaultWeather();
    }
  }

  // 날씨 데이터 포맷팅
  formatWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility,
      weatherId: data.weather[0].id
    };
  }

  // 기본 날씨 데이터 (API 오류 시)
  getDefaultWeather() {
    return {
      city: '서울',
      country: 'KR',
      temperature: 20,
      feelsLike: 18,
      humidity: 60,
      description: '맑음',
      icon: '01d',
      windSpeed: 3,
      pressure: 1013,
      visibility: 10000,
      weatherId: 800
    };
  }

  // 날씨 기반 활동 추천
  getWeatherBasedActivity(weather, personaCode) {
    const activities = {
      'P1': { // Visionary Leader
        sunny: ['창의적인 야외 프로젝트', '새로운 스포츠 시도', '아트 갤러리 방문'],
        rainy: ['실내 창작 활동', '새로운 기술 학습', '창의적 워크샵 참여'],
        cloudy: ['혁신적인 아이디어 브레인스토밍', '새로운 취미 탐색', '리더십 워크샵'],
        snowy: ['새로운 겨울 스포츠', '창의적 실내 프로젝트', '혁신적 아이디어 개발']
      },
      'P2': { // Balanced Builder
        sunny: ['규칙적인 산책', '정원 가꾸기', '체계적인 운동'],
        rainy: ['실내 요가', '독서', '정리정돈'],
        cloudy: ['가벼운 운동', '계획 세우기', '정돈된 활동'],
        snowy: ['실내 운동', '계획적인 휴식', '정리된 실내 활동']
      },
      'P3': { // Dynamic Explorer
        sunny: ['다양한 야외 활동', '새로운 장소 탐험', '그룹 스포츠'],
        rainy: ['실내 그룹 활동', '새로운 실내 취미', '소셜 게임'],
        cloudy: ['다양한 활동 시도', '새로운 경험 탐색', '소셜 네트워킹'],
        snowy: ['다양한 겨울 스포츠', '새로운 겨울 활동', '그룹 겨울 놀이']
      },
      'P4': { // Mindful Guardian
        sunny: ['조용한 공원 산책', '명상', '자연 관찰'],
        rainy: ['실내 명상', '요가', '조용한 독서'],
        cloudy: ['가벼운 명상', '마음챙김 운동', '평화로운 활동'],
        snowy: ['실내 명상', '마음챙김 운동', '조용한 겨울 활동']
      }
    };

    const weatherType = this.getWeatherType(weather);
    const personaActivities = activities[personaCode] || activities['P2'];
    
    return personaActivities[weatherType] || personaActivities.sunny;
  }

  // 날씨 타입 분류
  getWeatherType(weather) {
    const weatherId = weather.weatherId;
    
    if (weatherId >= 200 && weatherId < 600) return 'rainy';
    if (weatherId >= 600 && weatherId < 700) return 'snowy';
    if (weatherId >= 801 && weatherId <= 804) return 'cloudy';
    return 'sunny';
  }

  // 날씨 기반 건강 조언
  getWeatherBasedHealthAdvice(weather, personaCode) {
    const advice = {
      'P1': {
        sunny: '창의적인 야외 활동으로 에너지를 발산하세요! 자외선 차단제는 필수입니다.',
        rainy: '실내에서 창의적인 프로젝트에 집중해보세요. 창가에서 비를 보며 영감을 얻을 수 있어요.',
        cloudy: '새로운 아이디어를 탐색하기 좋은 날씨입니다. 창의적인 활동을 시도해보세요.',
        snowy: '새로운 겨울 스포츠를 시도해보세요! 창의적인 겨울 활동이 기다리고 있습니다.'
      },
      'P2': {
        sunny: '규칙적인 산책으로 건강을 관리하세요. 체계적인 운동 계획을 세워보세요.',
        rainy: '실내에서 규칙적인 운동을 하세요. 요가나 스트레칭이 좋습니다.',
        cloudy: '가벼운 운동으로 건강을 유지하세요. 계획적인 활동이 도움이 됩니다.',
        snowy: '실내에서 규칙적인 운동을 하세요. 체계적인 겨울 건강 관리가 중요합니다.'
      },
      'P3': {
        sunny: '다양한 야외 활동을 시도해보세요! 새로운 경험을 통해 활력을 얻을 수 있어요.',
        rainy: '실내 그룹 활동을 해보세요! 새로운 실내 취미를 탐색해보세요.',
        cloudy: '다양한 활동을 시도해보세요! 새로운 경험을 통해 적응력을 키워보세요.',
        snowy: '다양한 겨울 스포츠를 시도해보세요! 새로운 겨울 경험이 기다리고 있습니다.'
      },
      'P4': {
        sunny: '조용한 공원에서 명상을 해보세요. 자연과 함께 마음의 평화를 찾아보세요.',
        rainy: '실내에서 명상이나 요가를 해보세요. 비 소리를 들으며 마음챙김을 연습해보세요.',
        cloudy: '가벼운 명상이나 마음챙김 운동을 해보세요. 평화로운 활동이 도움이 됩니다.',
        snowy: '실내에서 명상이나 마음챙김 운동을 해보세요. 조용한 겨울 분위기를 즐겨보세요.'
      }
    };

    const weatherType = this.getWeatherType(weather);
    return advice[personaCode]?.[weatherType] || advice['P2'].sunny;
  }

  // 날씨 정보 포맷팅 (텔레그램용)
  formatWeatherMessage(weather) {
    const emoji = this.getWeatherEmoji(weather.weatherId);
    
    return `${emoji} *${weather.city} 날씨*

🌡️ 기온: ${weather.temperature}°C
🌡️ 체감온도: ${weather.feelsLike}°C
💧 습도: ${weather.humidity}%
💨 바람: ${weather.windSpeed}m/s
👁️ 가시거리: ${(weather.visibility / 1000).toFixed(1)}km

*${weather.description}*`;
  }

  // 날씨 아이콘에 따른 이모지
  getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '⛈️';
    if (weatherId >= 300 && weatherId < 400) return '🌧️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId >= 801 && weatherId <= 804) return '☁️';
    return '🌤️';
  }
}

module.exports = { WeatherService }; 