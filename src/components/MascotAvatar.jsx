import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function MascotAvatar({ mood = 'good', aqi = 45, onPoke }) {
  const [isPoked, setIsPoked] = useState(false);
  const [pokedText, setPokedText] = useState(null);

  const pokeQuotes = {
    good: ["Ouch! Don't poke the hero while he's breathing fresh air!", "100% Organic Lungs! ✨", "Ahhh, smells like fresh cilantro!"],
    moderate: ["Hey! I'm scanning for particulate mischief!", "Air is okay, but you're being intrusive!", "Checking for vehicle exhaust..."],
    sensitive: ["*Gasp* Don't make me breathe too fast!", "My allergy sensors are tingling!", "Quick, pass the anti-histamines!"],
    unhealthy: ["*Wheeze* Stop poking my respirator filter!", "I'm coughing in 4K resolution!", "Crunchy air is bad enough, now this?!"],
    very_unhealthy: ["MWAHAHA! I AM LORD DHUND, EMPEROR OF SMOG!", "Your pokes only make the smog thicker!", "BOW BEFORE THE BIOHAZARD CLOUD!"]
  };

  const handleMascotClick = (e) => {
    setIsPoked(true);
    const quotes = pokeQuotes[mood] || pokeQuotes.good;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setPokedText(randomQuote);

    if (mood === 'good') {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }

    if (onPoke) onPoke();

    setTimeout(() => {
      setIsPoked(false);
      setTimeout(() => setPokedText(null), 2500);
    }, 400);
  };

  return (
    <div className="relative flex flex-col items-center select-none group cursor-pointer" onClick={handleMascotClick} title="Click to poke the mascot!">
      {/* Dynamic comic burst poke bubble */}
      {pokedText && (
        <div className="absolute -top-12 z-30 bg-comic-yellow text-black font-comic tracking-wider text-xs md:text-sm px-3 py-1.5 border-[3px] border-black shadow-comic-sm animate-pop max-w-[220px] text-center rounded-lg">
          {pokedText}
        </div>
      )}

      {/* Mascot Graphic */}
      <div className={`w-36 h-36 md:w-44 md:h-44 transition-all duration-300 transform ${isPoked ? 'scale-90 rotate-6' : 'hover:scale-105 group-hover:rotate-[-2deg]'}`}>
        {/* Render different comic avatars based on mood */}
        {mood === 'good' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[5px_5px_0px_#000]">
            {/* Superhero Cape */}
            <path d="M40,110 Q20,170 50,195 Q85,160 70,120 Z" fill="#FF2E93" stroke="#000" strokeWidth="4" />
            <path d="M160,110 Q180,170 150,195 Q115,160 130,120 Z" fill="#FF2E93" stroke="#000" strokeWidth="4" />
            {/* Body / Cloud Body */}
            <path d="M50,100 C50,60 80,40 100,40 C120,40 150,60 150,100 C165,110 170,135 155,150 C140,165 110,165 100,165 C90,165 60,165 45,150 C30,135 35,110 50,100 Z" fill="#00E676" stroke="#000" strokeWidth="4" />
            {/* Superhero Goggles */}
            <rect x="58" y="75" width="38" height="28" rx="8" fill="#FFE600" stroke="#000" strokeWidth="4" />
            <rect x="104" y="75" width="38" height="28" rx="8" fill="#FFE600" stroke="#000" strokeWidth="4" />
            <line x1="96" y1="88" x2="104" y2="88" stroke="#000" strokeWidth="4" />
            {/* Goggle Lens Reflection */}
            <line x1="64" y1="80" x2="72" y2="98" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="110" y1="80" x2="118" y2="98" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            {/* Eyes behind or on glasses */}
            <circle cx="77" cy="89" r="5" fill="#000" />
            <circle cx="123" cy="89" r="5" fill="#000" />
            {/* Big Grinning Smile */}
            <path d="M78,122 Q100,145 122,122" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <path d="M86,126 Q100,140 114,126" fill="#FF3333" stroke="#000" strokeWidth="2" />
            {/* Rosy Cheeks */}
            <circle cx="62" cy="118" r="8" fill="#FF2E93" opacity="0.6" />
            <circle cx="138" cy="118" r="8" fill="#FF2E93" opacity="0.6" />
            {/* Fresh Flower on head */}
            <circle cx="100" cy="36" r="8" fill="#FFE600" stroke="#000" strokeWidth="3" />
            <circle cx="92" cy="30" r="6" fill="#FF2E93" stroke="#000" strokeWidth="2" />
            <circle cx="108" cy="30" r="6" fill="#FF2E93" stroke="#000" strokeWidth="2" />
            <circle cx="100" cy="22" r="6" fill="#FF2E93" stroke="#000" strokeWidth="2" />
            {/* Sparkles */}
            <path d="M30,50 L35,55 L30,60 L25,55 Z" fill="#FFE600" stroke="#000" strokeWidth="2" />
            <path d="M170,50 L175,55 L170,60 L165,55 Z" fill="#FFE600" stroke="#000" strokeWidth="2" />
          </svg>
        )}

        {mood === 'moderate' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[5px_5px_0px_#000]">
            {/* Detective Fedora Hat */}
            <path d="M40,55 Q100,40 160,55 Q140,25 100,25 Q60,25 40,55 Z" fill="#D97706" stroke="#000" strokeWidth="4" />
            <rect x="25" y="52" width="150" height="12" rx="4" fill="#B45309" stroke="#000" strokeWidth="4" />
            {/* Head / Cloud Body */}
            <path d="M50,95 C45,65 75,60 100,60 C125,60 155,65 150,95 C165,115 165,140 150,155 C135,168 110,168 100,168 C90,168 65,168 50,155 C35,140 35,115 50,95 Z" fill="#FFE600" stroke="#000" strokeWidth="4" />
            {/* Skeptical Eyes & Eyebrows */}
            <path d="M60,82 Q78,76 92,86" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <path d="M108,86 Q122,76 140,82" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            {/* Squinting Eyes */}
            <ellipse cx="76" cy="98" rx="8" ry="5" fill="#000" />
            <ellipse cx="124" cy="98" rx="8" ry="7" fill="#000" />
            <circle cx="126" cy="96" r="2.5" fill="#FFF" />
            {/* Smug / Skeptical Mouth */}
            <path d="M80,132 Q105,128 125,122" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            {/* Matchstick / Straw in mouth */}
            <line x1="120" y1="124" x2="155" y2="110" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="155" cy="110" r="3" fill="#EF4444" />
            {/* Magnifying Glass */}
            <circle cx="160" cy="140" r="18" fill="#00F0FF" fillOpacity="0.4" stroke="#000" strokeWidth="4" />
            <line x1="172" y1="152" x2="185" y2="175" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          </svg>
        )}

        {mood === 'sensitive' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[5px_5px_0px_#000]">
            {/* Orange Head */}
            <path d="M50,90 C45,55 75,50 100,50 C125,50 155,55 150,90 C168,110 168,145 150,160 C135,172 110,172 100,172 C90,172 65,172 50,160 C32,145 32,110 50,90 Z" fill="#FF8C00" stroke="#000" strokeWidth="4" />
            {/* Worried Eyebrows */}
            <path d="M60,78 Q75,88 90,82" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <path d="M110,82 Q125,88 140,78" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            {/* Spiral / Dizzy Eyes */}
            <circle cx="75" cy="98" r="10" fill="#FFF" stroke="#000" strokeWidth="3" />
            <circle cx="75" cy="98" r="4" fill="#000" />
            <circle cx="125" cy="98" r="10" fill="#FFF" stroke="#000" strokeWidth="3" />
            <circle cx="125" cy="98" r="4" fill="#000" />
            {/* Runny Nose / Red Nose */}
            <ellipse cx="100" cy="115" rx="10" ry="8" fill="#EF4444" stroke="#000" strokeWidth="3" />
            {/* Sneezy Wobbly Mouth */}
            <path d="M78,140 Q88,148 100,138 Q112,148 122,140" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            {/* Giant Sweat Drops */}
            <path d="M35,80 Q25,95 35,105 Q45,95 35,80 Z" fill="#00F0FF" stroke="#000" strokeWidth="3" />
            <path d="M165,75 Q155,90 165,100 Q175,90 165,75 Z" fill="#00F0FF" stroke="#000" strokeWidth="3" />
            {/* Tissue Paper in Hand */}
            <path d="M30,140 L50,135 L60,155 L40,165 Z" fill="#FFFFFF" stroke="#000" strokeWidth="3" />
          </svg>
        )}

        {mood === 'unhealthy' && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[5px_5px_0px_#000]">
            {/* Red Head */}
            <path d="M50,90 C45,55 75,50 100,50 C125,50 155,55 150,90 C168,110 168,145 150,160 C135,172 110,172 100,172 C90,172 65,172 50,160 C32,145 32,110 50,90 Z" fill="#FF3333" stroke="#000" strokeWidth="4" />
            {/* Angry/Pained Eyebrows */}
            <path d="M58,82 L90,92" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            <path d="M142,82 L110,92" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            {/* Red Tired Eyes */}
            <ellipse cx="75" cy="100" rx="11" ry="8" fill="#FFF" stroke="#000" strokeWidth="3" />
            <circle cx="75" cy="100" r="5" fill="#EF4444" />
            <ellipse cx="125" cy="100" rx="11" ry="8" fill="#FFF" stroke="#000" strokeWidth="3" />
            <circle cx="125" cy="100" r="5" fill="#EF4444" />
            {/* Gas Mask / Dual Respirator Mask */}
            <path d="M60,120 Q100,105 140,120 L135,160 Q100,175 65,160 Z" fill="#262626" stroke="#000" strokeWidth="4" />
            {/* Left Filter Canister */}
            <circle cx="72" cy="142" r="15" fill="#525252" stroke="#000" strokeWidth="3.5" />
            <circle cx="72" cy="142" r="8" fill="#FFE600" stroke="#000" strokeWidth="2.5" />
            {/* Right Filter Canister */}
            <circle cx="128" cy="142" r="15" fill="#525252" stroke="#000" strokeWidth="3.5" />
            <circle cx="128" cy="142" r="8" fill="#FFE600" stroke="#000" strokeWidth="2.5" />
            {/* Exhaust Valve */}
            <circle cx="100" cy="150" r="8" fill="#DC2626" stroke="#000" strokeWidth="2.5" />
            {/* Cough Puffs / Smoke */}
            <circle cx="25" cy="120" r="10" fill="#E5E7EB" stroke="#000" strokeWidth="2.5" />
            <circle cx="18" cy="105" r="7" fill="#E5E7EB" stroke="#000" strokeWidth="2" />
          </svg>
        )}

        {(mood === 'very_unhealthy' || mood === 'hazardous') && (
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[6px_6px_0px_#000] animate-wobble">
            {/* Villain Horns */}
            <path d="M60,50 Q40,10 20,25 Q45,38 55,65 Z" fill="#581C87" stroke="#000" strokeWidth="4" />
            <path d="M140,50 Q160,10 180,25 Q155,38 145,65 Z" fill="#581C87" stroke="#000" strokeWidth="4" />
            {/* Purple Toxic Cloud Body */}
            <path d="M45,90 C30,55 60,40 100,40 C140,40 170,55 155,90 C180,115 175,150 150,165 C130,180 110,175 100,178 C90,175 70,180 50,165 C25,150 20,115 45,90 Z" fill={mood === 'hazardous' ? '#581C87' : '#7C3AED'} stroke="#000" strokeWidth="4" />
            {/* Evil Yellow Glowing Slit Eyes */}
            <path d="M60,82 Q80,95 90,88 Q80,75 60,82 Z" fill="#FFE600" stroke="#000" strokeWidth="3" />
            <circle cx="75" cy="85" r="4" fill="#000" />
            <path d="M140,82 Q120,95 110,88 Q120,75 140,82 Z" fill="#FFE600" stroke="#000" strokeWidth="3" />
            <circle cx="125" cy="85" r="4" fill="#000" />
            {/* Menacing Jagged Teeth Grin */}
            <path d="M65,125 Q100,115 135,125 Q125,160 100,160 Q75,160 65,125 Z" fill="#000000" stroke="#000" strokeWidth="4" />
            {/* Sharp Teeth */}
            <polygon points="75,126 82,138 89,127" fill="#FFF" />
            <polygon points="90,127 97,140 104,127" fill="#FFF" />
            <polygon points="105,127 112,140 119,127" fill="#FFF" />
            <polygon points="120,127 127,138 132,126" fill="#FFF" />
            {/* Toxic Biohazard Liquid Drops */}
            <circle cx="45" cy="145" r="6" fill="#00FF66" stroke="#000" strokeWidth="2" />
            <circle cx="155" cy="145" r="6" fill="#00FF66" stroke="#000" strokeWidth="2" />
            <circle cx="100" cy="188" r="5" fill="#00FF66" stroke="#000" strokeWidth="2" />
          </svg>
        )}
      </div>

      <div className="mt-1 font-comic text-xs uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded shadow-comic-sm">
        {mood === 'good' && 'VAYU-MAN 🦸‍♂️'}
        {mood === 'moderate' && 'DETECTIVE SMUG 🕵️'}
        {mood === 'sensitive' && 'SNEEZY BOY 🤧'}
        {mood === 'unhealthy' && 'MASKED CRUSADER 😷'}
        {(mood === 'very_unhealthy' || mood === 'hazardous') && 'LORD DHUND 👹'}
      </div>
    </div>
  );
}
