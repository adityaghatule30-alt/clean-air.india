import React, { useState } from 'react';
import { X, Brain, HelpCircle, Thermometer, Wind, Droplets, ShieldCheck, CloudRain, Sparkles } from 'lucide-react';
import { weatherCommentary } from '../utils/weatherCommentaryEngine';

export default function WhyExplanationModal({ isOpen, onClose, initialMetric = 'temperature', weatherData, aqiData }) {
  const [selectedMetric, setSelectedMetric] = useState(initialMetric);

  if (!isOpen) return null;

  const METRIC_TABS = [
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'aqi', label: 'Air Quality (AQI)', icon: ShieldCheck },
    { id: 'humidity', label: 'Humidity', icon: Droplets },
    { id: 'wind', label: 'Wind Speed', icon: Wind },
    { id: 'rain', label: 'Rain & Clouds', icon: CloudRain }
  ];

  const explanation = weatherCommentary.getWhyExplanation(selectedMetric, weatherData, aqiData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-soft-xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-display font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>🧠 Why Is This Happening?</span>
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Factual, non-alarmist scientific explanations of current atmospheric conditions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons Strip */}
        <div className="flex items-center gap-1.5 px-5 pt-3 overflow-x-auto no-scrollbar border-b border-slate-100 bg-white">
          {METRIC_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = selectedMetric === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id)}
                className={`px-3 py-2 rounded-t-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                {explanation.metric}
              </span>
              <h4 className="text-lg font-display font-black text-slate-900 mt-0.5">
                {explanation.title}
              </h4>
            </div>
            <span className="text-sm font-display font-black text-indigo-900 bg-white px-3 py-1 rounded-xl shadow-soft-sm border border-indigo-200 shrink-0">
              {explanation.value}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p>{explanation.explanation}</p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>Principle: <strong>{explanation.scienceTag}</strong></span>
              <span className="text-indigo-600 font-black">Open-Meteo Telemetry</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>All atmospheric values reflect real-time physical measurements from meteorological sensor grids.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>CleanAir India • Atmosphere Explainer</span>
          <button
            onClick={onClose}
            className="text-slate-900 hover:text-indigo-600 font-black cursor-pointer"
          >
            Close ✖
          </button>
        </div>

      </div>
    </div>
  );
}
