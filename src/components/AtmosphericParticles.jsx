import React from 'react';
import { interpretWeatherCode } from '../utils/aqiHelpers';

export default function AtmosphericParticles({ weatherCode = 0, aqi = 50 }) {
  const weatherInfo = interpretWeatherCode(weatherCode);

  if (weatherInfo.theme === 'rainy') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-6 bg-sky-500 rounded-full animate-rain"
            style={{
              left: `${(i * 4.2) % 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDuration: `${0.7 + Math.random() * 0.6}s`,
              animationDelay: `${Math.random() * 2}s`,
              animationIterationCount: 'infinite'
            }}
          />
        ))}
      </div>
    );
  }

  if (weatherInfo.theme === 'sunny') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-300 rounded-full animate-float blur-[1px]"
            style={{
              left: `${(i * 8.5) % 100}%`,
              top: `${(i * 12) % 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
