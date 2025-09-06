import { PrismaClient, TransmissionType, Category } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

function readMarkdownFile(filename: string): string {
  const filePath = join(__dirname, 'content', filename)
  return readFileSync(filePath, 'utf-8')
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.topicTransmission.deleteMany()
  await prisma.transmission.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.topic.deleteMany()

  // Create sample transmissions
  const transmissions = await Promise.all([
    prisma.transmission.create({
      data: {
        title: 'Medical Gameplay Overhaul Announced',
        content: readMarkdownFile('medical-gameplay-overhaul.md'),
        summary: 'CIG reveals major changes to the medical system including new injuries, treatment options, and hospital gameplay loops.',
        type: TransmissionType.OFFICIAL,
        categories: [Category.MEDICAL, Category.GAMEPLAY],
        sourceUrl: 'https://robertsspaceindustries.com/comm-link/transmission/medical-gameplay',
        sourceAuthor: 'Cloud Imperium Games',
        isHighlight: true,
        publishedAt: new Date('2025-01-05T14:00:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'OMC Utility Armor Leaked',
        content: readMarkdownFile('omc-utility-armor-leaked.md'),
        summary: 'New heavy utility armor variant spotted in game files, featuring enhanced cargo capacity and environmental protection.',
        type: TransmissionType.LEAK,
        categories: [Category.GEAR],
        sourceAuthor: 'Anonymous Data Miner',
        isHighlight: true,
        publishedAt: new Date('2025-01-05T11:30:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'Yormandi - Jungle Valakaar Variant',
        content: readMarkdownFile('jungle-valakaar-variant.md'),
        summary: 'Data miners discover references to a new jungle-dwelling Valakaar creature variant planned for upcoming systems.',
        type: TransmissionType.LEAK,
        categories: [Category.MOB, Category.LOCATIONS],
        sourceAuthor: 'SC Leaks Community',
        isHighlight: true,
        publishedAt: new Date('2025-01-04T16:45:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'RSI Perseus Enters Production',
        content: readMarkdownFile('rsi-perseus-production.md'),
        summary: 'The long-awaited sub-capital gunship moves from concept to production phase with updated specifications.',
        type: TransmissionType.NEWS,
        categories: [Category.SHIPS],
        sourceUrl: 'https://robertsspaceindustries.com/comm-link/transmission/perseus-production',
        sourceAuthor: 'Roberts Space Industries',
        isHighlight: true,
        publishedAt: new Date('2025-01-04T10:00:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'Economy Balance Pass 4.0',
        content: readMarkdownFile('economy-balance-pass.md'),
        summary: 'Major economic rebalancing planned for cargo, mining, and salvage operations to create more meaningful progression.',
        type: TransmissionType.OFFICIAL,
        categories: [Category.ECONOMY, Category.GAMEPLAY],
        sourceUrl: 'https://robertsspaceindustries.com/spectrum/community/SC/forum/4/thread/economy-balance-pass',
        sourceAuthor: 'CIG Economy Team',
        isHighlight: false,
        publishedAt: new Date('2025-01-03T13:20:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'Pyro System Jump Points Unstable?',
        content: readMarkdownFile('pyro-jump-points-unstable.md'),
        summary: 'Reports suggest dynamic jump point behavior may be coming, with Pyro connections becoming periodically inaccessible.',
        type: TransmissionType.RUMOR,
        categories: [Category.LOCATIONS],
        sourceAuthor: 'Pilot Reports Network',
        isHighlight: false,
        publishedAt: new Date('2025-01-03T09:15:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'Drake Ironclad Assault Variant',
        content: readMarkdownFile('drake-ironclad-assault.md'),
        summary: 'Leaked images show a heavily armed variant of the Ironclad with additional weapon hardpoints and reinforced armor.',
        type: TransmissionType.LEAK,
        categories: [Category.SHIPS, Category.WEAPONS],
        sourceAuthor: 'Concept Art Leak',
        isHighlight: false,
        publishedAt: new Date('2025-01-02T20:30:00Z'),
      },
    }),

    prisma.transmission.create({
      data: {
        title: 'Quantum Travel Rework Phase 2',
        content: readMarkdownFile('quantum-travel-rework-phase2.md'),
        summary: 'Second phase of quantum travel improvements focuses on navigation UI and route planning capabilities.',
        type: TransmissionType.NEWS,
        categories: [Category.GAMEPLAY],
        sourceUrl: 'https://robertsspaceindustries.com/roadmap/progress-tracker/deliverables/quantum-travel-rework',
        sourceAuthor: 'CIG Vehicle Experience Team',
        isHighlight: false,
        publishedAt: new Date('2025-01-02T15:00:00Z'),
      },
    }),
  ])

  // Create some tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'medical' } }),
    prisma.tag.create({ data: { name: 'armor' } }),
    prisma.tag.create({ data: { name: 'creatures' } }),
    prisma.tag.create({ data: { name: 'ships' } }),
    prisma.tag.create({ data: { name: 'economy' } }),
    prisma.tag.create({ data: { name: 'jump-points' } }),
    prisma.tag.create({ data: { name: 'quantum-travel' } }),
  ])

  // Create some topics
  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        name: 'Ships',
        description: 'All spacecraft-related news and updates',
      },
    }),
    prisma.topic.create({
      data: {
        name: 'Gameplay Mechanics',
        description: 'Core gameplay systems and mechanics',
      },
    }),
    prisma.topic.create({
      data: {
        name: 'Economy',
        description: 'Economic systems and trade mechanics',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${transmissions.length} transmissions`)
  console.log(`Created ${tags.length} tags`)
  console.log(`Created ${topics.length} topics`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })