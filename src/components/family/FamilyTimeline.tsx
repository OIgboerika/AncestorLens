import { useMemo } from 'react'
import { Calendar, TrendingUp } from 'lucide-react'
import Card from '../ui/Card/Card'

interface FamilyMember {
  id: number | string
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  birthDate?: string
  deathDate?: string
}

interface FamilyTimelineProps {
  familyMembers: FamilyMember[]
}

interface TimelineEvent {
  year: number
  births: number
  deaths: number
  members: { name: string; type: 'birth' | 'death' }[]
}

export default function FamilyTimeline({ familyMembers }: FamilyTimelineProps) {
  const timelineData = useMemo(() => {
    const events: Map<number, TimelineEvent> = new Map()

    familyMembers.forEach((member) => {
      // Extract year from birthYear or birthDate
      let birthYear: number | null = null
      if (member.birthYear) {
        const year = parseInt(member.birthYear)
        if (!isNaN(year) && year > 1800 && year <= new Date().getFullYear()) {
          birthYear = year
        }
      } else if (member.birthDate) {
        const date = new Date(member.birthDate)
        if (!isNaN(date.getTime())) {
          birthYear = date.getFullYear()
        }
      }

      // Extract year from deathYear or deathDate
      let deathYear: number | null = null
      if (member.deathYear) {
        const year = parseInt(member.deathYear)
        if (!isNaN(year) && year > 1800 && year <= new Date().getFullYear()) {
          deathYear = year
        }
      } else if (member.deathDate) {
        const date = new Date(member.deathDate)
        if (!isNaN(date.getTime())) {
          deathYear = date.getFullYear()
        }
      }

      // Add birth event
      if (birthYear) {
        if (!events.has(birthYear)) {
          events.set(birthYear, { year: birthYear, births: 0, deaths: 0, members: [] })
        }
        const event = events.get(birthYear)!
        event.births++
        event.members.push({ name: member.name, type: 'birth' })
      }

      // Add death event
      if (deathYear) {
        if (!events.has(deathYear)) {
          events.set(deathYear, { year: deathYear, births: 0, deaths: 0, members: [] })
        }
        const event = events.get(deathYear)!
        event.deaths++
        event.members.push({ name: member.name, type: 'death' })
      }
    })

    // Convert to array and sort by year
    const sortedEvents = Array.from(events.values()).sort((a, b) => a.year - b.year)

    // If no data, return empty array
    if (sortedEvents.length === 0) {
      return { events: [], minYear: new Date().getFullYear() - 50, maxYear: new Date().getFullYear() }
    }

    const minYear = Math.min(...sortedEvents.map(e => e.year))
    const maxYear = Math.max(...sortedEvents.map(e => e.year))
    const currentYear = new Date().getFullYear()

    // Expand range to show a bit more context
    const rangeStart = Math.max(minYear - 5, 1900)
    const rangeEnd = Math.min(maxYear + 5, currentYear)

    return {
      events: sortedEvents,
      minYear: rangeStart,
      maxYear: rangeEnd
    }
  }, [familyMembers])

  const { events, minYear, maxYear } = timelineData
  const yearRange = maxYear - minYear || 1
  const chartHeight = 200
  const padding = 40

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...events.map(e => Math.max(e.births, e.deaths)),
    1
  )

  if (events.length === 0) {
    return (
      <Card hoverable={false}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-ancestor-primary" />
            <h3 className="text-lg font-semibold text-ancestor-dark">Family Timeline</h3>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No birth or death dates available</p>
            <p className="text-xs mt-1">Add dates to family members to see the timeline</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card hoverable={false}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-ancestor-primary" />
          <h3 className="text-lg font-semibold text-ancestor-dark">Family Timeline</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Births</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Deaths</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full" style={{ height: `${chartHeight + padding * 2}px` }}>
          <svg
            viewBox={`0 0 1000 ${chartHeight + padding * 2}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
          >
            {/* Grid lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = padding + (chartHeight / 5) * i
              return (
                <line
                  key={`grid-${i}`}
                  x1={padding * 10}
                  y1={y}
                  x2={1000 - padding * 10}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
              )
            })}

            {/* Year labels on x-axis */}
            {Array.from({ length: Math.min(10, yearRange + 1) }).map((_, i) => {
              const year = minYear + Math.floor((yearRange / Math.max(1, Math.min(10, yearRange + 1) - 1)) * i)
              const xPos = padding * 10 + ((i / Math.max(1, Math.min(10, yearRange + 1) - 1)) * (1000 - padding * 20))
              return (
                <g key={`year-${year}`}>
                  <line
                    x1={xPos}
                    y1={chartHeight + padding}
                    x2={xPos}
                    y2={chartHeight + padding + 5}
                    stroke="#6b7280"
                    strokeWidth={1}
                  />
                  <text
                    x={xPos}
                    y={chartHeight + padding + 18}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {year}
                  </text>
                </g>
              )
            })}

            {/* Data points and lines */}
            {events.map((event, index) => {
              const xPos = padding * 10 + ((event.year - minYear) / yearRange) * (1000 - padding * 20)
              const birthY = chartHeight + padding - (event.births / maxValue) * chartHeight
              const deathY = chartHeight + padding - (event.deaths / maxValue) * chartHeight

              return (
                <g key={`event-${event.year}`}>
                  {/* Birth point */}
                  {event.births > 0 && (
                    <circle
                      cx={xPos}
                      cy={birthY}
                      r={5}
                      fill="#10b981"
                      stroke="white"
                      strokeWidth={2}
                    >
                      <title>{event.year}: {event.births} birth{event.births > 1 ? 's' : ''}</title>
                    </circle>
                  )}

                  {/* Death point */}
                  {event.deaths > 0 && (
                    <circle
                      cx={xPos}
                      cy={deathY}
                      r={5}
                      fill="#ef4444"
                      stroke="white"
                      strokeWidth={2}
                    >
                      <title>{event.year}: {event.deaths} death{event.deaths > 1 ? 's' : ''}</title>
                    </circle>
                  )}
                </g>
              )
            })}

            {/* Connect points with lines */}
            {events.map((event, index) => {
              if (index === 0) return null
              const prevEvent = events[index - 1]
              const x1 = padding * 10 + ((prevEvent.year - minYear) / yearRange) * (1000 - padding * 20)
              const x2 = padding * 10 + ((event.year - minYear) / yearRange) * (1000 - padding * 20)
              const y1 = chartHeight + padding - (prevEvent.births / maxValue) * chartHeight
              const y2 = chartHeight + padding - (event.births / maxValue) * chartHeight
              const deathY1 = chartHeight + padding - (prevEvent.deaths / maxValue) * chartHeight
              const deathY2 = chartHeight + padding - (event.deaths / maxValue) * chartHeight

              return (
                <g key={`lines-${event.year}`}>
                  {/* Birth line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#10b981"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                  {/* Death line */}
                  <line
                    x1={x1}
                    y1={deathY1}
                    x2={x2}
                    y2={deathY2}
                    stroke="#ef4444"
                    strokeWidth={2}
                    opacity={0.6}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Summary stats */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Births</p>
            <p className="text-lg font-semibold text-green-600">
              {events.reduce((sum, e) => sum + e.births, 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Deaths</p>
            <p className="text-lg font-semibold text-red-600">
              {events.reduce((sum, e) => sum + e.deaths, 0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

