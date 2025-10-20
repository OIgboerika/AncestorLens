import React, { useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  ConnectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useAuth } from '../../contexts/AuthContext'

interface FamilyMember {
  id: number | string
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  location?: string
  relationship: string
  parentId?: string | number
  hasChildren?: boolean
  hasParents?: boolean
  image?: string
}

interface FamilyMemberNodeProps {
  data: {
    member: FamilyMember
  }
}

// Custom Family Member Node Component
const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({ data }) => {
  const { member } = data
  const initials = member.name.split(' ').map(n => n[0]).join('')
  const hasImage = Boolean(member.image)
  const ringColor = member.role === 'Living' ? 'ring-green-500' : 'ring-gray-400'
  const isCreator = member.relationship === 'Self'

  const subtitle = member.deathYear
    ? `${member.birthYear} – ${member.deathYear}`
    : member.birthYear
      ? `Born ${member.birthYear}`
      : member.role

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-[200px]">
      {/* Crown icon for tree creator */}
      {isCreator && (
        <div className="absolute -top-2 -right-1 z-10 bg-yellow-400 rounded-full p-1 shadow-lg">
          <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full ring-2 ${ringColor} ring-offset-2 overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0`}
          style={hasImage ? { backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!hasImage && <span className="text-gray-600 font-semibold text-sm">{initials}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
          <p className="text-xs text-ancestor-primary font-medium">{member.relationship}</p>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  familyMember: FamilyMemberNode,
}

interface DraggableFamilyTreeProps {
  familyData: {
    grandparents: FamilyMember[]
    parents: FamilyMember[]
    currentGeneration: FamilyMember[]
    children: FamilyMember[]
  }
  onLayoutChange?: (nodes: Node[], edges: Edge[]) => void
}

export default function DraggableFamilyTree({ familyData, onLayoutChange }: DraggableFamilyTreeProps) {
  useAuth()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Load saved layout from localStorage
  const loadSavedLayout = useCallback(() => {
    try {
      const savedLayout = localStorage.getItem('familyTreeLayout')
      if (savedLayout) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedLayout)
        if (savedNodes && savedEdges) {
          return { savedNodes, savedEdges }
        }
      }
    } catch (error) {
      console.warn('Failed to load saved layout:', error)
    }
    return null
  }, [])

  // Convert family members to React Flow nodes with saved positions
  const familyNodes = useMemo(() => {
    const allMembers = [
      ...familyData.grandparents,
      ...familyData.parents,
      ...familyData.currentGeneration,
      ...familyData.children
    ]

    // Try to load saved layout
    const savedLayout = loadSavedLayout()
    const savedNodePositions = savedLayout?.savedNodes?.reduce((acc: any, node: any) => {
      acc[node.id] = node.position
      return acc
    }, {}) || {}

    return allMembers.map((member, index) => {
      const memberId = member.id.toString()
      const savedPosition = savedNodePositions[memberId]
      
      return {
        id: memberId,
        type: 'familyMember',
        position: savedPosition || {
          x: (index % 4) * 250 + 50,
          y: Math.floor(index / 4) * 200 + 50,
        },
        data: { member },
        draggable: true,
      }
    })
  }, [familyData, loadSavedLayout])

  // Create edges based on family relationships and saved manual connections
  const familyEdges = useMemo(() => {
    const edges: Edge[] = []
    const allMembers = [
      ...familyData.grandparents,
      ...familyData.parents,
      ...familyData.currentGeneration,
      ...familyData.children
    ]

    // Load saved manual connections
    const savedLayout = loadSavedLayout()
    const savedManualEdges = savedLayout?.savedEdges?.filter((edge: any) => 
      edge.id?.startsWith('manual-')
    ) || []

    // Helper function to determine if two members are married
    const areMarried = (member1: FamilyMember, member2: FamilyMember) => {
      const marriagePairs = [
        ['Father', 'Mother'],
        ['Grandfather', 'Grandmother'],
        ['Paternal Grandfather', 'Paternal Grandmother'],
        ['Maternal Grandfather', 'Maternal Grandmother'],
        ['Husband', 'Wife'],
        ['Self', 'Spouse'],
        ['Self', 'Partner']
      ]
      
      return marriagePairs.some(pair => 
        (pair.includes(member1.relationship) && pair.includes(member2.relationship)) ||
        (member1.relationship === 'Self' && ['Husband', 'Wife', 'Spouse', 'Partner'].includes(member2.relationship)) ||
        (member2.relationship === 'Self' && ['Husband', 'Wife', 'Spouse', 'Partner'].includes(member1.relationship))
      )
    }

    // Helper function to determine if two members are siblings
    const areSiblings = (member1: FamilyMember, member2: FamilyMember) => {
      return member1.parentId === member2.parentId && 
             member1.parentId !== undefined && 
             member1.id !== member2.id
    }

    // Create edges for marriages
    allMembers.forEach((member1, index1) => {
      allMembers.forEach((member2, index2) => {
        if (index1 < index2) {
          if (areMarried(member1, member2)) {
            edges.push({
              id: `marriage-${member1.id}-${member2.id}`,
              source: member1.id.toString(),
              target: member2.id.toString(),
              type: 'smoothstep',
              style: { stroke: '#374151', strokeWidth: 2 },
              label: 'Married',
              labelStyle: { fontSize: 12, fill: '#374151' },
            })
          } else if (areSiblings(member1, member2)) {
            edges.push({
              id: `sibling-${member1.id}-${member2.id}`,
              source: member1.id.toString(),
              target: member2.id.toString(),
              type: 'smoothstep',
              style: { stroke: '#6B7280', strokeWidth: 1.5, strokeDasharray: '5,5' },
              label: 'Siblings',
              labelStyle: { fontSize: 12, fill: '#6B7280' },
            })
          }
        }
      })
    })

    // Create parent-child edges
    allMembers.forEach((child) => {
      if (child.parentId) {
        const parent = allMembers.find(p => p.id === child.parentId)
        if (parent) {
          edges.push({
            id: `parent-child-${parent.id}-${child.id}`,
            source: parent.id.toString(),
            target: child.id.toString(),
            type: 'smoothstep',
            style: { stroke: '#059669', strokeWidth: 2 },
            label: 'Child',
            labelStyle: { fontSize: 12, fill: '#059669' },
          })
        }
      }
    })

    // Add saved manual connections
    savedManualEdges.forEach((edge: any) => {
      // Check if both source and target nodes still exist
      const sourceExists = allMembers.some(m => m.id.toString() === edge.source)
      const targetExists = allMembers.some(m => m.id.toString() === edge.target)
      
      if (sourceExists && targetExists) {
        edges.push({
          ...edge,
          style: { stroke: '#DC2626', strokeWidth: 2 },
          label: 'Manual',
          labelStyle: { fontSize: 12, fill: '#DC2626' },
        })
      }
    })

    return edges
  }, [familyData, loadSavedLayout])

  // Initialize nodes and edges
  useEffect(() => {
    setNodes(familyNodes)
    setEdges(familyEdges)
  }, [familyNodes, familyEdges, setNodes, setEdges])

  // Save layout to localStorage immediately
  const saveLayout = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    try {
      const layoutData = { 
        nodes: currentNodes, 
        edges: currentEdges, 
        timestamp: Date.now() 
      }
      localStorage.setItem('familyTreeLayout', JSON.stringify(layoutData))
      
      if (onLayoutChange) {
        onLayoutChange(currentNodes, currentEdges)
      }
    } catch (error) {
      console.warn('Failed to save layout:', error)
    }
  }, [onLayoutChange])

  // Handle new connections (when user draws new edges)
  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      id: `manual-${params.source}-${params.target}`,
      type: 'smoothstep',
      style: { stroke: '#DC2626', strokeWidth: 2 },
      label: 'Manual',
      labelStyle: { fontSize: 12, fill: '#DC2626' },
    }
    setEdges((eds) => {
      const updatedEdges = addEdge(newEdge, eds)
      // Save immediately when new connection is made
      setTimeout(() => saveLayout(nodes, updatedEdges), 100)
      return updatedEdges
    })
  }, [setEdges, nodes, saveLayout])

  // Save layout when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const timeoutId = setTimeout(() => {
        saveLayout(nodes, edges)
      }, 500) // Debounce saves to avoid too frequent saves
      
      return () => clearTimeout(timeoutId)
    }
  }, [nodes, edges, saveLayout])

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg">
      <div className="mb-2 p-2 bg-gray-50 rounded-t-lg border-b">
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> Drag family members to rearrange them. 
          Click and drag from one member to another to draw custom connection lines.
        </p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
        snapToGrid={false}
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const member = node.data?.member as FamilyMember
            return member?.role === 'Living' ? '#10B981' : '#6B7280'
          }}
          nodeStrokeWidth={3}
          nodeBorderRadius={2}
        />
        <Background color="#f9fafb" gap={20} />
      </ReactFlow>
    </div>
  )
}
