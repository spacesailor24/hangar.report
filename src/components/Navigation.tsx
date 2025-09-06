'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'HIGHLIGHTS' },
    { href: '/timeline', label: 'TIMELINE' },
    { href: '/topics', label: 'TOPICS' },
  ]

  return (
    <nav className="relative z-10 border-b border-[var(--transmission-border)] backdrop-blur-sm bg-[rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-wider hover:text-[var(--accent-nasa)] transition-colors"
            >
              HANGAR REPORT
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm tracking-wide transition-all ${
                    pathname === item.href
                      ? 'text-[var(--accent-nasa)] border-b-2 border-[var(--accent-nasa)]'
                      : 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:border-b-2 hover:border-[var(--accent-nasa)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-[var(--accent-nasa)] text-xs tracking-widest">
            TRANSMISSION FEED ACTIVE
          </div>
        </div>
      </div>
    </nav>
  )
}