import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Event } from '../types';

interface Props {
  event: Event;
  onClick: () => void;
}

const CountdownCard: React.FC<Props> = ({ event, onClick }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, mins: number, secs: number}>({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(event.targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [event.targetDate]);

  const isUrgent = timeLeft.days < 3;

  return (
    <motion.div
      layoutId={event.id}
      whileHover={{ y: -4, boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
      onClick={onClick}
      className={`
        relative cursor-pointer 
        border-4 border-black 
        rounded-xl 
        shadow-neo 
        overflow-hidden
        flex flex-col
        h-full
        transition-shadow
        bg-white
        text-black
      `}
    >
      {/* Header color strip */}
      <div 
        className="h-4 border-b-2 border-black" 
        style={{ backgroundColor: event.themeColor }} 
      />
      
      <div className="p-5 flex-1 flex flex-col justify-between gap-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black uppercase tracking-widest border border-black px-2 py-0.5 rounded-full bg-gray-100 text-black">
              {event.category}
            </span>
            {isUrgent && (
              <span className="text-xs font-bold text-red-600 animate-pulse">
                SOON
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black leading-tight break-words text-black">{event.name}</h3>
          <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-2">{event.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 text-center">
            <div className="flex-1 bg-black text-white p-2 rounded border-2 border-transparent">
              <span className="block text-2xl font-bold font-mono leading-none">{timeLeft.days}</span>
              <span className="text-[10px] uppercase font-bold text-gray-300">Days</span>
            </div>
            <div className="flex-1 border-2 border-black p-2 rounded bg-white">
              <span className="block text-2xl font-bold font-mono leading-none text-black">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase font-bold text-gray-700">Hrs</span>
            </div>
            <div className="flex-1 border-2 border-black p-2 rounded bg-white">
              <span className="block text-2xl font-bold font-mono leading-none text-black">{timeLeft.mins}</span>
              <span className="text-[10px] uppercase font-bold text-gray-700">Min</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 border-t-2 border-black flex justify-between items-center group text-black">
        <span className="text-xs font-bold text-gray-700">
          {new Date(event.targetDate).toLocaleDateString()}
        </span>
        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform text-black" />
      </div>
    </motion.div>
  );
};

export default CountdownCard;