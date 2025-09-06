import TransmissionBox from '@/components/TransmissionBox'
import { prisma } from '@/lib/prisma'

async function getHighlightedTransmissions() {
  const transmissions = await prisma.transmission.findMany({
    where: {
      isHighlight: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })
  
  return transmissions
}

export default async function HighlightsPage() {
  const transmissions = await getHighlightedTransmissions()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wider mb-2">
          PRIORITY TRANSMISSIONS
        </h1>
        <p className="text-sm opacity-60">
          MONITORING VERSE-WIDE COMMUNICATIONS • SIGNAL STRENGTH: OPTIMAL
        </p>
      </div>

      <div className="space-y-3">
        {transmissions.map((transmission) => (
          <TransmissionBox
            key={transmission.id}
            transmission={{
              ...transmission,
              publishedAt: new Date(transmission.publishedAt)
            }}
          />
        ))}
      </div>
    </div>
  )
}