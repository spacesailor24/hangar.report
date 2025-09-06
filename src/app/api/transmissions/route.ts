import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const highlights = searchParams.get('highlights') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined
    const day = searchParams.get('day') ? parseInt(searchParams.get('day')!) : undefined

    let whereClause: any = {}

    // Filter for highlights
    if (highlights) {
      whereClause.isHighlight = true
    }

    // Filter by date
    if (year) {
      const startDate = new Date(year, month || 0, day || 1)
      const endDate = new Date(
        year,
        month !== undefined ? month + 1 : 12,
        day !== undefined ? day + 1 : 0
      )
      
      whereClause.publishedAt = {
        gte: startDate,
        lt: endDate,
      }
    }

    const transmissions = await prisma.transmission.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ transmissions })
  } catch (error) {
    console.error('Error fetching transmissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transmissions' },
      { status: 500 }
    )
  }
}