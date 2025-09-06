export default function TopicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wider mb-2">
          TOPIC DATABASE
        </h1>
        <p className="text-sm opacity-60">
          ORGANIZED INTELLIGENCE • CATEGORIZED BY SUBJECT
        </p>
      </div>

      <div className="transmission-box p-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[var(--accent-nasa)] text-6xl mb-6">⚡</div>
          <h2 className="text-xl font-bold mb-4">SYSTEM UNDER CONSTRUCTION</h2>
          <p className="opacity-60 mb-8">
            The Topics Database is currently being assembled. Soon you'll be able to browse 
            organized intelligence on ships, weapons, locations, and more.
          </p>
          <div className="flex items-center justify-center gap-2 text-[var(--accent-cyber)] text-sm">
            <span className="animate-pulse">●</span>
            <span className="tracking-widest">ESTIMATED COMPLETION: SOON™</span>
            <span className="animate-pulse">●</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 opacity-30">
        {['SHIPS', 'WEAPONS', 'GEAR', 'LOCATIONS', 'ECONOMY', 'LORE', 'GAMEPLAY', 'ORGANIZATIONS'].map((topic) => (
          <div key={topic} className="transmission-box p-4 text-center cursor-not-allowed">
            <span className="text-xs tracking-widest">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  )
}