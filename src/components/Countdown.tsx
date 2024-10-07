'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Countdown() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [color, setColor] = useState('text-gray-200');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        // Change color every second
        setColor(getRandomColor(countdown - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      router.push('/onboarding');
    }
  }, [countdown]);

  const getRandomColor = (index: number) => {
    const colors = [
      'text-green-500',
      'text-yellow-500',
      'text-red-500',
      'text-blue-500',
      'text-orange-500',
    ];
    // return colors[Math.floor(Math.random() * colors.length)];
    return colors[index];
  };

  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference * ((5 - countdown) / 5);

  return (
    <div className='absolute bottom-3 right-3 justify-center bg-white'>
      <div className='relative size-24'>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          <circle
            className='text-gray-200'
            strokeWidth='10'
            stroke='currentColor'
            fill='transparent'
            r='45'
            cx='50'
            cy='50'
          />
          <circle
            className={`${color} transition-all duration-1000 ease-in-out`}
            strokeWidth='10'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            stroke='currentColor'
            fill='transparent'
            r='45'
            cx='50'
            cy='50'
          />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span
            className={`${color} text-6xl font-bold transition-all duration-1000 ease-in-out`}
            aria-live='polite'
          >
            {countdown || '🚀'}
          </span>
        </div>
      </div>
    </div>
  );
}
