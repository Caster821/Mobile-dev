export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
  };
  daily: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
  }>;
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
    );
    
    const data = await response.json();
    
    return {
      current: {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
      },
      daily: data.daily.time.map((date: string, index: number) => ({
        date,
        temp: {
          min: data.daily.temperature_2m_min[index],
          max: data.daily.temperature_2m_max[index],
        },
      })),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}