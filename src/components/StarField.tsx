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
}

export default function StarField() {
  const [mounted, setMounted] = useState(false)
  
  const stars = useMemo(() => {
    const starCount = 150
    const newStars: Star[] = []
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.pow(Math.random(), 2) * 3 + 0.5
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        baseOpacity: size > 2 ? 0.8 : size > 1 ? 0.6 : 0.4,
        twinkleSpeed: Math.random() * 3 + 1,
        twinkleDelay: Math.random() * 5
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
          background: radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0);
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
        }
        
        .star-large {
          background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0ff);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
      `}</style>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className={star.size > 2 ? 'star star-large' : 'star'}
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
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)',
            transform: 'scale(1.5)',
          }}
        />
      </div>
    </>
  )
}