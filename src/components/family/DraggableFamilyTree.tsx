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
  NodeTypes,
  ConnectionMode,
  Handle,
  Position,
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

// Custom Family Member Node Component with Connection Handles
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
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-[200px] relative">
      {/* Crown icon for tree creator */}
      {isCreator && (
        <div className="absolute -top-2 -right-1 z-10 bg-yellow-400 rounded-full p-1 shadow-lg">
          <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
      
      {/* Connection Handles on all four sides - Green source handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ 
          background: '#059669', 
          width: 14, 
          height: 14, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 20
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ 
          background: '#059669', 
          width: 14, 
          height: 14, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 20
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ 
          background: '#059669', 
          width: 14, 
          height: 14, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 20
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ 
          background: '#059669', 
          width: 14, 
          height: 14, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 20
        }}
        className="hover:scale-110 transition-transform"
      />
      
      {/* Target handles for incoming connections - Red target handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{ 
          background: '#DC2626', 
          width: 10, 
          height: 10, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{ 
          background: '#DC2626', 
          width: 10, 
          height: 10, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{ 
          background: '#DC2626', 
          width: 10, 
          height: 10, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
        className="hover:scale-110 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{ 
          background: '#DC2626', 
          width: 10, 
          height: 10, 
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 10
        }}
        className="hover:scale-110 transition-transform"
      />
      
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

// Custom Edge Component with Midpoint Connection Nodes
const CustomEdge: React.FC<any> = ({ id, sourceX, sourceY, targetX, targetY, style = {} }) => {
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#react-flow__arrowclosed)"
      />
      {/* Midpoint connection node */}
      <g>
        <circle
          cx={midX}
          cy={midY}
          r="8"
          fill="#8B5CF6"
          stroke="white"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
          className="hover:scale-110 transition-transform"
        />
        <Handle
          type="source"
          position={Position.Top}
          id={`${id}-mid-top`}
          style={{
            background: '#8B5CF6',
            width: 8,
            height: 8,
            border: '1px solid white',
            left: midX - 4,
            top: midY - 12,
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-mid-bottom`}
          style={{
            background: '#8B5CF6',
            width: 8,
            height: 8,
            border: '1px solid white',
            left: midX - 4,
            top: midY + 4,
          }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-mid-top-target`}
          style={{
            background: '#DC2626',
            width: 8,
            height: 8,
            border: '1px solid white',
            left: midX - 4,
            top: midY - 12,
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id={`${id}-mid-bottom-target`}
          style={{
            background: '#DC2626',
            width: 8,
            height: 8,
            border: '1px solid white',
            left: midX - 4,
            top: midY + 4,
          }}
        />
      </g>
    </>
  )
}

const nodeTypes: NodeTypes = {
  familyMember: FamilyMemberNode,
}

const edgeTypes = {
  custom: CustomEdge,
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
          console.log('Loaded saved layout:', { savedNodes, savedEdges }) // Debug log
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
  }, [familyData.grandparents.length, familyData.parents.length, familyData.currentGeneration.length, familyData.children.length, loadSavedLayout])

  // Create edges based only on saved manual connections
  const familyEdges = useMemo(() => {
    const edges: Edge[] = []
    const allMembers = [
      ...familyData.grandparents,
      ...familyData.parents,
      ...familyData.currentGeneration,
      ...familyData.children
    ]

    // Load saved manual connections only
    const savedLayout = loadSavedLayout()
    const savedManualEdges = savedLayout?.savedEdges?.filter((edge: any) => 
      edge.id?.startsWith('manual-')
    ) || []

    // Add only saved manual connections
    savedManualEdges.forEach((edge: any) => {
      // Check if both source and target nodes still exist
      const sourceExists = allMembers.some(m => m.id.toString() === edge.source)
      const targetExists = allMembers.some(m => m.id.toString() === edge.target)
      
      if (sourceExists && targetExists) {
        edges.push({
          ...edge,
          type: 'custom',
          style: { stroke: '#DC2626', strokeWidth: 2 },
          label: 'Manual',
          labelStyle: { fontSize: 12, fill: '#DC2626' },
        })
      }
    })

    return edges
  }, [familyData.grandparents.length, familyData.parents.length, familyData.currentGeneration.length, familyData.children.length, loadSavedLayout])

  // Initialize nodes and edges, preserving saved layout and handling new members
  useEffect(() => {
    const savedLayout = loadSavedLayout()
    
    if (savedLayout && savedLayout.savedNodes && savedLayout.savedEdges) {
      // Merge saved layout with current family data
      const currentMemberIds = new Set([
        ...familyData.grandparents,
        ...familyData.parents,
        ...familyData.currentGeneration,
        ...familyData.children
      ].map(m => m.id.toString()))
      
      // Filter saved nodes to only include current members
      const validSavedNodes = savedLayout.savedNodes.filter((node: any) => 
        currentMemberIds.has(node.id)
      )
      
      // Add new members with default positions
      const savedNodeIds = new Set(validSavedNodes.map((n: any) => n.id))
      const newNodes = familyNodes.filter(node => !savedNodeIds.has(node.id))
      
      // Combine saved and new nodes
      const mergedNodes = [...validSavedNodes, ...newNodes]
      
      // Filter saved edges to only include current members
      const validSavedEdges = savedLayout.savedEdges.filter((edge: any) => 
        currentMemberIds.has(edge.source) && currentMemberIds.has(edge.target)
      )
      
      setNodes(mergedNodes)
      setEdges(validSavedEdges)
    } else {
      // Use computed layout for first time
      setNodes(familyNodes)
      setEdges(familyEdges)
    }
  }, [familyData.grandparents.length, familyData.parents.length, familyData.currentGeneration.length, familyData.children.length]) // Re-run when member count changes

  // Save layout to localStorage immediately
  const saveLayout = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    try {
      const layoutData = { 
        nodes: currentNodes, 
        edges: currentEdges, 
        timestamp: Date.now() 
      }
      localStorage.setItem('familyTreeLayout', JSON.stringify(layoutData))
      console.log('Layout saved:', layoutData) // Debug log
      
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
      type: 'custom',
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

  // Save layout when component unmounts
  useEffect(() => {
    return () => {
      if (nodes.length > 0 || edges.length > 0) {
        saveLayout(nodes, edges)
      }
    }
  }, [nodes, edges, saveLayout])

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg">
      <div className="mb-2 p-2 bg-gray-50 rounded-t-lg border-b">
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> Drag family members to rearrange them. 
          Use the larger green connection nodes to draw custom relationship lines between members. 
          Purple nodes on existing lines allow branching connections.
        </p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
        snapToGrid={false}
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background color="#f9fafb" gap={20} />
      </ReactFlow>
    </div>
  )
}
