'use client'

import { useEffect, useState, useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  baseOpacity: number
  twinkleSpeed: number
  twinkleDelay: number
  color: 'white' | 'blue' | 'red'
}

export default function StarField() {
  const [mounted, setMounted] = useState(false)
  
  const stars = useMemo(() => {
    const starCount = 150
    const newStars: Star[] = []
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.pow(Math.random(), 2) * 3 + 0.5
      const random = Math.random()
      let color: 'white' | 'blue' | 'red' = 'white'
      
      // 10% red stars, 15% blue stars, 75% white stars
      if (random < 0.1) {
        color = 'red'
      } else if (random < 0.25) {
        color = 'blue'
      }
      
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        baseOpacity: size > 2 ? 0.8 : size > 1 ? 0.6 : 0.4,
        twinkleSpeed: Math.random() * 4 + 3, // 3-7 seconds
        twinkleDelay: Math.random() * 8, // 0-8 seconds
        color
      })
    }
    return newStars
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--base-opacity); transform: scale(1); }
          50% { opacity: 0.2; transform: scale(0.8); }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: var(--base-opacity); }
          25% { opacity: 0.3; }
          50% { opacity: var(--base-opacity); }
          75% { opacity: 0.2; }
        }
        
        .star {
          position: absolute;
          border-radius: 50%;
        }
        
        .star-white {
          background: radial-gradient(circle at 30% 30%, #ffffff, #ffffff);
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        }
        
        .star-white.star-large {
          background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0ff);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
        
        .star-blue {
          background: radial-gradient(circle at 30% 30%, #b0d0ff, #8090ff);
          box-shadow: 0 0 3px rgba(176, 208, 255, 0.6);
        }
        
        .star-blue.star-large {
          background: radial-gradient(circle at 30% 30%, #a0c0ff, #7080ff);
          box-shadow: 0 0 5px rgba(160, 192, 255, 0.8);
        }
        
        .star-red {
          background: radial-gradient(circle at 30% 30%, #ffb0b0, #ff8080);
          box-shadow: 0 0 3px rgba(255, 176, 176, 0.6);
        }
        
        .star-red.star-large {
          background: radial-gradient(circle at 30% 30%, #ffa0a0, #ff7070);
          box-shadow: 0 0 5px rgba(255, 160, 160, 0.8);
        }
      `}</style>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star star-${star.color}${star.size > 2 ? ' star-large' : ''}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--base-opacity': star.baseOpacity,
              animation: star.size > 1.5 
                ? `twinkle ${star.twinkleSpeed}s ease-in-out ${star.twinkleDelay}s infinite`
                : `shimmer ${star.twinkleSpeed * 2}s ease-in-out ${star.twinkleDelay}s infinite`,
            } as React.CSSProperties}
          />
        ))}
        
      </div>
    </>
  )
}