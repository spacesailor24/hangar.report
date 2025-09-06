import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'

interface TransmissionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TransmissionDetailPage({ params }: TransmissionDetailPageProps) {
  const { id } = await params
  
  const transmission = await prisma.transmission.findUnique({
    where: { id },
  })

  if (!transmission) {
    notFound()
  }

  const typeColors = {
    OFFICIAL: 'text-orange-500',
    NEWS: 'text-blue-400',
    LEAK: 'text-red-400',
    RUMOR: 'text-yellow-500',
    ANALYSIS: 'text-purple-400',
  }

  const categoryColors = {
    SHIPS: 'bg-blue-900/20 text-blue-300 border-blue-500/30',
    GAMEPLAY: 'bg-green-900/20 text-green-300 border-green-500/30',
    LOCATIONS: 'bg-purple-900/20 text-purple-300 border-purple-500/30',
    ECONOMY: 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30',
    GEAR: 'bg-orange-900/20 text-orange-300 border-orange-500/30',
    MEDICAL: 'bg-red-900/20 text-red-300 border-red-500/30',
    WEAPONS: 'bg-gray-900/20 text-gray-300 border-gray-500/30',
    MOB: 'bg-pink-900/20 text-pink-300 border-pink-500/30',
  }

  const generateFileId = (title: string, date: Date) => {
    const shortTitle = title.replace(/\s+/g, '').slice(0, 8).toUpperCase()
    const timestamp = date.toISOString().slice(2, 10).replace(/-/g, '')
    return `${shortTitle}_${timestamp}`
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,135,0,0.03)_0%,transparent_70%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`text-xs px-3 py-1.5 rounded-sm font-bold border ${typeColors[transmission.type]} bg-black/50 border-current/20`}>
              {transmission.type}
            </span>
            <span className="text-xs font-mono opacity-40">|</span>
            <span className="text-xs font-mono opacity-60">
              {generateFileId(transmission.title, transmission.publishedAt)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 font-mono tracking-wider">
            {transmission.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {transmission.categories.map((category) => (
              <span
                key={category}
                className={`text-xs px-2 py-1 rounded border font-mono ${categoryColors[category] || 'bg-gray-900/20 text-gray-300 border-gray-500/30'}`}
              >
                {category}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm opacity-60">
            <span>{transmission.sourceAuthor || 'Unknown'}</span>
            <span>•</span>
            <span>{transmission.publishedAt.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-orange max-w-none">
          <div className="transmission-content">
            <ReactMarkdown>{transmission.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}