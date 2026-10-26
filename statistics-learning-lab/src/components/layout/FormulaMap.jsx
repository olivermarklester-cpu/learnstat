import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { LINEAGE } from '../../data/formulaLineage'

// ─── Layout positions (hand-tuned for a clear top-to-bottom flow) ────────────

const NODE_POSITIONS = {
  'mean-median-mode':           { x: 420, y: 0   },
  'variance':                   { x: 310, y: 120 },
  'standard-deviation':         { x: 310, y: 240 },
  'z-score':                    { x: 60,  y: 380 },
  'standard-error':             { x: 510, y: 380 },
  'z-test':                     { x: 60,  y: 520 },
  'one-sample-t-test':          { x: 430, y: 520 },
  'confidence-intervals':       { x: 680, y: 520 },
  'paired-samples-t-test':      { x: 340, y: 660 },
  'independent-samples-t-test': { x: 590, y: 660 },
  'anova':                      { x: 310, y: 380 },
  'covariance':                 { x: 580, y: 120 },
  'correlation':                { x: 700, y: 240 },
  'simple-linear-regression':   { x: 700, y: 380 },
}

// ─── Group → visual style ────────────────────────────────────────────────────

const GROUP_STYLES = {
  descriptive: {
    background: '#eff6ff',
    border: '2px solid #3b82f6',
    color: '#1e40af',
  },
  sampling: {
    background: '#f0fdfa',
    border: '2px solid #14b8a6',
    color: '#0f766e',
  },
  inferential: {
    background: '#faf5ff',
    border: '2px solid #a855f7',
    color: '#6b21a8',
  },
  relationships: {
    background: '#fff7ed',
    border: '2px solid #f97316',
    color: '#9a3412',
  },
}

const GROUP_LABELS = {
  descriptive: 'Descriptive',
  sampling: 'Sampling',
  inferential: 'Inferential',
  relationships: 'Relationships',
}

// ─── Custom node label ────────────────────────────────────────────────────────

function NodeLabel({ title, formula, group }) {
  const groupStyle = GROUP_STYLES[group] || GROUP_STYLES.descriptive
  return (
    <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: groupStyle.color, marginBottom: '3px' }}>
        {title}
      </div>
      <div style={{
        fontSize: '10px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        color: '#374151',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '4px',
        padding: '2px 5px',
        display: 'inline-block',
      }}>
        {formula}
      </div>
    </div>
  )
}

// ─── Build nodes & edges from LINEAGE ────────────────────────────────────────

function buildGraph(navigate) {
  const nodes = LINEAGE.map((node) => {
    const pos = NODE_POSITIONS[node.id] || { x: 0, y: 0 }
    const groupStyle = GROUP_STYLES[node.group] || GROUP_STYLES.descriptive
    return {
      id: node.id,
      position: pos,
      data: {
        label: <NodeLabel title={node.title} formula={node.formula} group={node.group} />,
        slug: node.slug,
      },
      style: {
        ...groupStyle,
        borderRadius: '10px',
        padding: '10px 14px',
        width: 180,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      },
    }
  })

  const edges = []
  for (const node of LINEAGE) {
    for (const parentId of node.parents) {
      edges.push({
        id: `${parentId}->${node.id}`,
        source: parentId,
        target: node.id,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      })
    }
  }

  return { nodes, edges }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="absolute bottom-16 left-4 z-10 bg-white border border-gray-200 rounded-xl shadow-sm p-3 text-xs space-y-1.5">
      <p className="font-semibold text-gray-600 uppercase tracking-wide text-xs mb-2">Topic Group</p>
      {Object.entries(GROUP_STYLES).map(([key, style]) => (
        <div key={key} className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: 3,
              background: style.background,
              border: style.border,
            }}
          />
          <span style={{ color: style.color, fontWeight: 600 }}>{GROUP_LABELS[key]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FormulaMap() {
  const navigate = useNavigate()
  const { nodes: initialNodes, edges: initialEdges } = buildGraph(navigate)
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback(
    (_, node) => {
      if (node.data?.slug) {
        navigate(`/${node.data.slug}`)
      }
    },
    [navigate],
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-white flex-shrink-0">
        <div className="max-w-4xl">
          <h1 className="text-xl font-bold text-textDark mb-1">Formula Lineage Map</h1>
          <p className="text-sm text-textMuted leading-relaxed">
            See how statistical formulas build on each other. Every formula in the chain inherits
            from the ones above it.{' '}
            <span className="font-medium text-textDark">Click any node</span> to go to that topic.
            Pan and zoom to explore.
          </p>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: false }}
        >
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const lineageNode = LINEAGE.find((n) => n.id === node.id)
              const style = GROUP_STYLES[lineageNode?.group] || GROUP_STYLES.descriptive
              return style.background
            }}
            maskColor="rgba(241,245,249,0.7)"
            style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
          />
        </ReactFlow>
        <Legend />
      </div>
    </div>
  )
}
