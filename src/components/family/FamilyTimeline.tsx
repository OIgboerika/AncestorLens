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
  const chartHeight = 300
  const chartWidth = 1000
  const leftPadding = 60
  const rightPadding = 40
  const topPadding = 40
  const bottomPadding = 50
  const plotWidth = chartWidth - leftPadding - rightPadding
  const plotHeight = chartHeight - topPadding - bottomPadding

  // Calculate max value for scaling (round up to nearest nice number)
  const rawMax = Math.max(
    ...events.map(e => Math.max(e.births, e.deaths)),
    1
  )
  const maxValue = Math.ceil(rawMax / 5) * 5 || 5 // Round to nearest 5

  // Generate Y-axis ticks (similar to sample: 0, 30, 60, 90, etc.)
  const yAxisTicks = 7 // Number of ticks
  const yTickInterval = maxValue / (yAxisTicks - 1)

  if (events.length === 0) {
    return (
      <Card hoverable={false} className="border border-gray-200">
        <div className="p-6">
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

  // Create data points for all years in range (including zeros)
  const allYearsData: TimelineEvent[] = []
  for (let year = minYear; year <= maxYear; year++) {
    const existingEvent = events.find(e => e.year === year)
    allYearsData.push(existingEvent || { year, births: 0, deaths: 0, members: [] })
  }

  return (
    <Card hoverable={false} className="border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-ancestor-primary" />
            <h3 className="text-lg font-semibold text-ancestor-dark">Family Timeline</h3>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full bg-white rounded-lg" style={{ height: `${chartHeight}px` }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
          >
            {/* Horizontal gridlines */}
            {Array.from({ length: yAxisTicks }).map((_, i) => {
              const y = topPadding + (i * (plotHeight / (yAxisTicks - 1)))
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={leftPadding}
                    y1={y}
                    x2={leftPadding + plotWidth}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                </g>
              )
            })}

            {/* Y-axis labels */}
            {Array.from({ length: yAxisTicks }).map((_, i) => {
              const value = Math.round(maxValue - (i * yTickInterval))
              const y = topPadding + (i * (plotHeight / (yAxisTicks - 1)))
              return (
                <g key={`y-label-${i}`}>
                  <text
                    x={leftPadding - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* X-axis line */}
            <line
              x1={leftPadding}
              y1={topPadding + plotHeight}
              x2={leftPadding + plotWidth}
              y2={topPadding + plotHeight}
              stroke="#6b7280"
              strokeWidth={1}
            />

            {/* Y-axis line */}
            <line
              x1={leftPadding}
              y1={topPadding}
              x2={leftPadding}
              y2={topPadding + plotHeight}
              stroke="#6b7280"
              strokeWidth={1}
            />

            {/* Year labels on x-axis */}
            {allYearsData.map((event, index) => {
              // Show every Nth year to avoid crowding
              const showEveryN = Math.max(1, Math.floor(allYearsData.length / 12))
              if (index % showEveryN !== 0 && index !== allYearsData.length - 1) return null
              
              const xPos = leftPadding + ((event.year - minYear) / yearRange) * plotWidth
              return (
                <g key={`year-${event.year}`}>
                  <line
                    x1={xPos}
                    y1={topPadding + plotHeight}
                    x2={xPos}
                    y2={topPadding + plotHeight + 5}
                    stroke="#6b7280"
                    strokeWidth={1}
                  />
                  <text
                    x={xPos}
                    y={topPadding + plotHeight + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                  >
                    {event.year}
                  </text>
                </g>
              )
            })}

            {/* Birth line */}
            <polyline
              points={allYearsData.map(event => {
                const x = leftPadding + ((event.year - minYear) / yearRange) * plotWidth
                const y = topPadding + plotHeight - (event.births / maxValue) * plotHeight
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth={2.5}
            />

            {/* Death line */}
            <polyline
              points={allYearsData.map(event => {
                const x = leftPadding + ((event.year - minYear) / yearRange) * plotWidth
                const y = topPadding + plotHeight - (event.deaths / maxValue) * plotHeight
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2.5}
            />

            {/* Data points for births */}
            {allYearsData.map((event) => {
              if (event.births === 0) return null
              const xPos = leftPadding + ((event.year - minYear) / yearRange) * plotWidth
              const yPos = topPadding + plotHeight - (event.births / maxValue) * plotHeight
              return (
                <circle
                  key={`birth-${event.year}`}
                  cx={xPos}
                  cy={yPos}
                  r={4}
                  fill="#10b981"
                  stroke="white"
                  strokeWidth={2}
                >
                  <title>{event.year}: {event.births} birth{event.births > 1 ? 's' : ''}</title>
                </circle>
              )
            })}

            {/* Data points for deaths */}
            {allYearsData.map((event) => {
              if (event.deaths === 0) return null
              const xPos = leftPadding + ((event.year - minYear) / yearRange) * plotWidth
              const yPos = topPadding + plotHeight - (event.deaths / maxValue) * plotHeight
              return (
                <circle
                  key={`death-${event.year}`}
                  cx={xPos}
                  cy={yPos}
                  r={4}
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth={2}
                >
                  <title>{event.year}: {event.deaths} death{event.deaths > 1 ? 's' : ''}</title>
                </circle>
              )
            })}

            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
              fontWeight="500"
            >
              Year
            </text>
            <text
              x={20}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
              fontWeight="500"
              transform={`rotate(-90, 20, ${chartHeight / 2})`}
            >
              Count
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-700 font-medium">Births</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-gray-700 font-medium">Deaths</span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
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
