import React, { useCallback, useMemo, useEffect, useState } from 'react'
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
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Load saved layout from localStorage
  const loadSavedLayout = useCallback(() => {
    try {
      const savedLayout = localStorage.getItem('familyTreeLayout')
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout)
        
        // Handle the new ultra-simple format
        if (parsed.positions && parsed.connections) {
          console.log('Loaded saved layout:', parsed)
          return { 
            savedNodes: parsed.positions.map((pos: any) => ({
              id: pos.id,
              position: { x: pos.x, y: pos.y }
            })), 
            savedEdges: parsed.connections.map((conn: any) => ({
              id: `manual-${conn.from}-${conn.to}`,
              source: conn.from,
              target: conn.to,
              type: 'custom'
            }))
          }
        }
        
        // Handle old formats for backward compatibility
        if (parsed.nodes || parsed.savedNodes) {
          const nodes = parsed.nodes || parsed.savedNodes || []
          const edges = parsed.edges || parsed.savedEdges || []
          
          return { 
            savedNodes: nodes.map((node: any) => ({
              id: node.id,
              position: node.position || { x: node.x || 0, y: node.y || 0 }
            })), 
            savedEdges: edges 
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load saved layout:', error)
      // Clear corrupted data
      localStorage.removeItem('familyTreeLayout')
    }
    return null
  }, [])

  // Get all family members
  const allMembers = useMemo(() => [
    ...familyData.grandparents,
    ...familyData.parents,
    ...familyData.currentGeneration,
    ...familyData.children
  ], [familyData.grandparents, familyData.parents, familyData.currentGeneration, familyData.children])

  // Initialize nodes and edges only once
  useEffect(() => {
    const savedLayout = loadSavedLayout()
    
    if (savedLayout && savedLayout.savedNodes && savedLayout.savedEdges) {
      // Use saved layout
      const currentMemberIds = new Set(allMembers.map(m => m.id.toString()))
      
      // Reconstruct full nodes from compressed data
      const validSavedNodes = savedLayout.savedNodes
        .filter((node: any) => currentMemberIds.has(node.id))
        .map((node: any) => {
          const member = allMembers.find(m => m.id.toString() === node.id)
          return {
            id: node.id,
            type: 'familyMember',
            position: node.position,
            data: { member },
            draggable: false,
          }
        })
      
      // Add new members with default positions
      const savedNodeIds = new Set(validSavedNodes.map((n: any) => n.id))
      const newMembers = allMembers.filter(member => !savedNodeIds.has(member.id.toString()))
      
      const newNodes = newMembers.map((member, index) => ({
        id: member.id.toString(),
        type: 'familyMember',
        position: {
          x: (index % 4) * 250 + 50,
          y: Math.floor(index / 4) * 200 + 50,
        },
        data: { member },
        draggable: false,
      }))
      
      // Filter saved edges to only include current members
      const validSavedEdges = savedLayout.savedEdges.filter((edge: any) => 
        currentMemberIds.has(edge.source) && currentMemberIds.has(edge.target)
      )
      
      setNodes([...validSavedNodes, ...newNodes])
      setEdges(validSavedEdges)
    } else {
      // Create initial layout
      const initialNodes = allMembers.map((member, index) => ({
        id: member.id.toString(),
        type: 'familyMember',
        position: {
          x: (index % 4) * 250 + 50,
          y: Math.floor(index / 4) * 200 + 50,
        },
        data: { member },
        draggable: false,
      }))
      
      setNodes(initialNodes)
      setEdges([])
    }
  }, [allMembers, loadSavedLayout])

  // Handle new family members being added
  useEffect(() => {
    const currentMemberIds = new Set(nodes.map(n => n.id))
    const newMembers = allMembers.filter(member => !currentMemberIds.has(member.id.toString()))
    
    if (newMembers.length > 0) {
      console.log('New members detected:', newMembers)
      
      const newNodes = newMembers.map((member, index) => ({
        id: member.id.toString(),
        type: 'familyMember',
        position: {
          x: (nodes.length + index) % 4 * 250 + 50,
          y: Math.floor((nodes.length + index) / 4) * 200 + 50,
        },
        data: { member },
        draggable: isEditing, // Respect current editing state
      }))
      
      setNodes(prevNodes => [...prevNodes, ...newNodes])
    }
  }, [allMembers, nodes, isEditing])

  // Save layout to localStorage with ultra-simple format
  const saveLayout = useCallback(async (currentNodes: Node[], currentEdges: Edge[]) => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      // Ultra-simple format - only store what's absolutely necessary
      const simpleLayout = {
        // Store positions as simple arrays
        positions: currentNodes.map(node => ({
          id: node.id,
          x: Math.round(node.position.x),
          y: Math.round(node.position.y)
        })),
        // Store connections as simple pairs
        connections: currentEdges.map(edge => ({
          from: edge.source,
          to: edge.target
        })),
        // Timestamp for versioning
        t: Date.now()
      }
      
      // Convert to minimal JSON string
      const layoutString = JSON.stringify(simpleLayout)
      
      // This should be tiny - if it's still too big, something is very wrong
      if (layoutString.length > 50000) { // 50KB limit (very generous)
        throw new Error('Layout data is unexpectedly large. Please contact support.')
      }
      
      // Simple save - no complex fallbacks
      localStorage.setItem('familyTreeLayout', layoutString)
      
      console.log('Layout saved successfully')
      setSaveMessage('Layout saved successfully!')
      setTimeout(() => setSaveMessage(null), 3000)
      
      if (onLayoutChange) {
        onLayoutChange(currentNodes, currentEdges)
      }
    } catch (error) {
      console.warn('Failed to save layout:', error)
      setSaveMessage(`Failed to save layout: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }, [onLayoutChange])

  // Handle new connections (when user draws new edges)
  const onConnect = useCallback((params: Connection) => {
    if (!isEditing) return // Only allow connections in edit mode
    
    const newEdge = {
      ...params,
      id: `manual-${params.source}-${params.target}`,
      type: 'custom',
      style: { stroke: '#DC2626', strokeWidth: 2 },
      label: 'Manual',
      labelStyle: { fontSize: 12, fill: '#DC2626' },
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges, isEditing])

  // Enable editing mode
  const handleEdit = () => {
    setIsEditing(true)
    setNodes(prevNodes => prevNodes.map(node => ({ ...node, draggable: true })))
    setSaveMessage(null)
  }

  // Save and exit editing mode
  const handleSave = async () => {
    await saveLayout(nodes, edges)
    setIsEditing(false)
    setNodes(prevNodes => prevNodes.map(node => ({ ...node, draggable: false })))
  }

  // Cancel editing and revert changes
  const handleCancel = () => {
    const savedLayout = loadSavedLayout()
    
    if (savedLayout && savedLayout.savedNodes && savedLayout.savedEdges) {
      const currentMemberIds = new Set(allMembers.map(m => m.id.toString()))
      
      const validSavedNodes = savedLayout.savedNodes.filter((node: any) => 
        currentMemberIds.has(node.id)
      )
      
      const validSavedEdges = savedLayout.savedEdges.filter((edge: any) => 
        currentMemberIds.has(edge.source) && currentMemberIds.has(edge.target)
      )
      
      setNodes(validSavedNodes)
      setEdges(validSavedEdges)
    } else {
      // Reset to initial layout
      const initialNodes = allMembers.map((member, index) => ({
        id: member.id.toString(),
        type: 'familyMember',
        position: {
          x: (index % 4) * 250 + 50,
          y: Math.floor(index / 4) * 200 + 50,
        },
        data: { member },
        draggable: false,
      }))
      
      setNodes(initialNodes)
      setEdges([])
    }
    
    setIsEditing(false)
    setSaveMessage(null)
  }

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg">
      <div className="mb-2 p-2 bg-gray-50 rounded-t-lg border-b">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              <strong>Instructions:</strong> {isEditing 
                ? 'Drag family members to rearrange them. Use the green connection nodes to draw custom relationship lines. Click Save when done.'
                : 'Click Edit to start customizing your family tree layout.'
              }
            </p>
            {saveMessage && (
              <p className={`text-sm mt-1 ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Layout
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Layout'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
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
