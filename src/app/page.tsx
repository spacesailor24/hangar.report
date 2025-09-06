import TransmissionBox from '@/components/TransmissionBox'
import { TransmissionType, Category } from '@prisma/client'

const mockTransmissions = [
  {
    id: '1',
    title: 'Medical Gameplay Overhaul Announced',
    type: TransmissionType.OFFICIAL,
    categories: [Category.MEDICAL, Category.GAMEPLAY],
    date: new Date('2025-01-05'),
    summary: 'CIG reveals major changes to the medical system including new injuries, treatment options, and hospital gameplay loops.'
  },
  {
    id: '2',
    title: 'OMC Utility Armor Leaked',
    type: TransmissionType.LEAK,
    categories: [Category.GEAR],
    date: new Date('2025-01-05'),
    summary: 'New heavy utility armor variant spotted in game files, featuring enhanced cargo capacity and environmental protection.'
  },
  {
    id: '3',
    title: 'Yormandi - Jungle Valakaar Variant',
    type: TransmissionType.LEAK,
    categories: [Category.MOB, Category.LOCATIONS],
    date: new Date('2025-01-04'),
    summary: 'Data miners discover references to a new jungle-dwelling Valakaar creature variant planned for upcoming systems.'
  },
  {
    id: '4',
    title: 'RSI Perseus Enters Production',
    type: TransmissionType.NEWS,
    categories: [Category.SHIPS],
    date: new Date('2025-01-04'),
    summary: 'The long-awaited sub-capital gunship moves from concept to production phase with updated specifications.'
  },
  {
    id: '5',
    title: 'Economy Balance Pass 4.0',
    type: TransmissionType.OFFICIAL,
    categories: [Category.ECONOMY, Category.GAMEPLAY],
    date: new Date('2025-01-03'),
    summary: 'Major economic rebalancing planned for cargo, mining, and salvage operations to create more meaningful progression.'
  },
  {
    id: '6',
    title: 'Pyro System Jump Points Unstable?',
    type: TransmissionType.RUMOR,
    categories: [Category.LOCATIONS],
    date: new Date('2025-01-03'),
    summary: 'Reports suggest dynamic jump point behavior may be coming, with Pyro connections becoming periodically inaccessible.'
  }
]

export default function HighlightsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTransmissions.map((transmission) => (
          <TransmissionBox
            key={transmission.id}
            title={transmission.title}
            type={transmission.type}
            categories={transmission.categories}
            date={transmission.date}
            summary={transmission.summary}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-[var(--accent-nasa)] text-sm">
          <span className="animate-pulse">●</span>
          <span className="tracking-widest">LIVE FEED ACTIVE</span>
          <span className="animate-pulse">●</span>
        </div>
      </div>
    </div>
  )
}