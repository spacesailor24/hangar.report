'use client'

import { useState, useRef, useEffect } from 'react'
import TransmissionBox from '@/components/TransmissionBox'
import { TransmissionType, Category } from '@prisma/client'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface Transmission {
  id: string
  title: string
  type: TransmissionType
  categories: Category[]
  publishedAt: string
  summary: string | null
}

async function fetchTransmissions(year?: number, month?: number, day?: number): Promise<Transmission[]> {
  try {
    const params = new URLSearchParams()
    if (year) params.append('year', year.toString())
    if (month !== undefined) params.append('month', month.toString())
    if (day !== undefined) params.append('day', day.toString())

    const response = await fetch(`/api/transmissions?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch')
    
    const data = await response.json()
    return data.transmissions || []
  } catch (error) {
    console.error('Error fetching transmissions:', error)
    return []
  }
}

export default function TimelinePage() {
  const [selectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [transmissions, setTransmissions] = useState<Transmission[]>([])
  const [loading, setLoading] = useState(true)
  const timelineRef = useRef<HTMLDivElement>(null)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()

  useEffect(() => {
    async function loadTransmissions() {
      setLoading(true)
      const data = await fetchTransmissions(
        selectedYear,
        selectedDay ? selectedMonth : undefined,
        selectedDay || undefined
      )
      setTransmissions(data)
      setLoading(false)
    }
    
    loadTransmissions()
  }, [selectedYear, selectedMonth, selectedDay])

  const filteredTransmissions = transmissions.filter(transmission => {
    const date = new Date(transmission.publishedAt)
    if (selectedDay) {
      return date.getMonth() === selectedMonth && 
             date.getDate() === selectedDay &&
             date.getFullYear() === selectedYear
    }
    return date.getMonth() === selectedMonth && 
           date.getFullYear() === selectedYear
  })

  const groupedByDay = filteredTransmissions.reduce((groups, transmission) => {
    const day = new Date(transmission.publishedAt).getDate()
    if (!groups[day]) groups[day] = []
    groups[day].push(transmission)
    return groups
  }, {} as Record<number, typeof filteredTransmissions>)

  const getTransmissionTypeColor = (type: TransmissionType) => {
    switch (type) {
      case TransmissionType.NEWS:
        return 'bg-[var(--accent-nasa)]'
      case TransmissionType.LEAK:
        return 'bg-[var(--accent-warning)]'
      case TransmissionType.OFFICIAL:
        return 'bg-blue-400'
      case TransmissionType.RUMOR:
        return 'bg-purple-400'
      default:
        return 'bg-[var(--accent-nasa)]'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-[rgba(0,0,0,0.9)] backdrop-blur-sm border-b border-[var(--transmission-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-2 text-xs">
            <span className="text-[var(--accent-nasa)]">YEAR: {selectedYear}</span>
            <span className="text-[var(--accent-nasa)]">CHRONOLOGICAL FEED</span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex border-t border-[var(--transmission-border)]">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(index)
                    setSelectedDay(null)
                  }}
                  className={`px-4 py-3 text-xs tracking-wider whitespace-nowrap transition-all ${
                    selectedMonth === index
                      ? 'text-[var(--accent-nasa)] border-b-2 border-[var(--accent-nasa)] bg-[rgba(255,85,0,0.1)]'
                      : 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:bg-[rgba(255,255,255,0.05)]'
                  } ${index === currentMonth ? 'font-bold' : ''}`}
                >
                  {month.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto border-t border-[var(--transmission-border)]">
            <div className="flex">
              <button
                onClick={() => setSelectedDay(null)}
                className={`px-4 py-2 text-xs tracking-wider transition-all ${
                  selectedDay === null
                    ? 'text-[var(--accent-nasa)] bg-[rgba(255,85,0,0.1)]'
                    : 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                ALL
              </button>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-2 text-xs tracking-wider transition-all ${
                    selectedDay === day
                      ? 'text-[var(--accent-nasa)] bg-[rgba(255,85,0,0.1)]'
                      : 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={timelineRef} className="max-w-7xl mx-auto px-4 py-8">
        {Object.entries(groupedByDay)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([day, transmissions]) => (
            <div key={day} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-[var(--accent-nasa)]">
                  {String(day).padStart(2, '0')}
                </div>
                <div className="flex-1 h-[1px] bg-[var(--transmission-border)]"></div>
                <div className="text-sm opacity-60">
                  {transmissions.length} TRANSMISSION{transmissions.length !== 1 ? 'S' : ''}
                </div>
              </div>
              
              <div className="space-y-4 pl-12">
                {transmissions.map(transmission => (
                  <div key={transmission.id} className="relative">
                    <div className={`absolute -left-12 top-6 w-4 h-4 rounded-full ${getTransmissionTypeColor(transmission.type)} animate-pulse`}></div>
                    <div className="absolute -left-[42px] top-10 bottom-0 w-[1px] bg-[var(--transmission-border)]"></div>
                    <TransmissionBox
                      id={transmission.id}
                      title={transmission.title}
                      type={transmission.type}
                      categories={transmission.categories}
                      date={new Date(transmission.publishedAt)}
                      summary={transmission.summary || undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
        {loading && (
          <div className="text-center py-20">
            <p className="text-[var(--accent-nasa)] mb-2">SCANNING TRANSMISSION LOGS...</p>
            <p className="text-sm opacity-60">
              Accessing archived communications
            </p>
          </div>
        )}
        
        {!loading && filteredTransmissions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--accent-nasa)] mb-2">NO TRANSMISSIONS DETECTED</p>
            <p className="text-sm opacity-60">
              No communications recorded for this time period
            </p>
          </div>
        )}
      </div>
    </div>
  )
}